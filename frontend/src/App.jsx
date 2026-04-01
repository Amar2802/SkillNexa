import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import api from "./api/client";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import softwareQuestionBank from "./data/softwareQuestionBank";

const AIInterviewerPage = lazy(() => import("./pages/AIInterviewerPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const BookmarksPage = lazy(() => import("./pages/BookmarksPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const MockTestsPage = lazy(() => import("./pages/MockTestsPage"));
const PracticePage = lazy(() => import("./pages/PracticePage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const QuestionBankPage = lazy(() => import("./pages/QuestionBankPage"));
const ReviewMistakesPage = lazy(() => import("./pages/ReviewMistakesPage"));

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LineElement, LinearScale, PointElement, Tooltip);

const PageLoader = () => (
  <div className="page-loader-shell">
    <div className="page-loader-card glass-card">
      <div className="page-loader-spinner" />
      <strong>Loading SkillNexa...</strong>
      <span>Preparing your workspace</span>
    </div>
  </div>
);

const normalizeQuestions = (questionList = [], fallbackField = "Software") => {
  return questionList.map((question, index) => ({
    ...question,
    _id: question._id || question.id || `${fallbackField}-${question.category || "General"}-${question.topic || "Topic"}-${index}`,
    field: question.field || fallbackField,
    starterCode: question.starterCode || {}
  }));
};
const filterLocalQuestions = (questionList, params = {}, fallbackField = "Software") => {
  return questionList.filter((question) => {
    if ((question.field || fallbackField) !== fallbackField) return false;
    if (params.category && question.category !== params.category) return false;
    if (params.difficulty && question.difficulty !== params.difficulty) return false;
    if (params.topic && !(new RegExp(params.topic, "i").test(question.topic || ""))) return false;
    if (params.company && !(new RegExp(params.company, "i").test(question.company || ""))) return false;
    if (params.type && question.type !== params.type) return false;
    return true;
  });
};

export default function App() {
  const { user, setUser, profile, setProfile, applyAuth, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [filters, setFilters] = useState({ category: "", difficulty: "", topic: "", company: "" });

  const activeField = useMemo(() => "Software", []);

  const refreshProfile = async () => {
    if (!localStorage.getItem("token")) return null;
    const { data } = await api.get("/users/profile");
    setProfile(data);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  const loadQuestions = async (params = {}) => {
    const mergedParams = { limit: 220, field: activeField, ...params };
    const localFallback = normalizeQuestions(filterLocalQuestions(softwareQuestionBank, mergedParams, activeField).slice(0, mergedParams.limit || 220), activeField);

    try {
      let { data } = await api.get("/questions", { params: mergedParams, timeout: 3000 });
      let normalized = normalizeQuestions(data, activeField);

      if (!normalized.length) {
        ({ data } = await api.get("/questions", { params: { field: activeField, limit: 220 }, timeout: 3000 }));
        normalized = normalizeQuestions(data, activeField);
      }

      if (!normalized.length) {
        normalized = localFallback;
      }

      setQuestions(normalized);
      return normalized;
    } catch {
      setQuestions(localFallback);
      return localFallback;
    }
  };

  const refreshBookmarks = async () => setBookmarks((await api.get("/users/bookmarks")).data);
  const refreshHistory = async () => setHistory((await api.get("/users/history")).data);
  const refreshTests = async () => setTests((await api.get("/tests", { params: { field: activeField } })).data);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (window.location.pathname === "/oauth-success" && token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, "", "/dashboard");
      refreshProfile();
    }
  }, []);

  useEffect(() => {
    if (user) {
      api.post("/setup/seed").catch(() => undefined);
    }
  }, [user]);

  useEffect(() => {
    const clearedFilters = { category: "", difficulty: "", topic: "", company: "" };
    setFilters(clearedFilters);
    loadQuestions(clearedFilters).catch(() => undefined);
    refreshTests().catch(() => undefined);
  }, [activeField]);

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      setHistory([]);
      setTests([]);
      setRecommendations([]);
      return;
    }

    refreshProfile()
      .then(async (currentProfile) => {
        const loadedQuestions = await loadQuestions(filters).catch(() => []);
        const recs = await api.post("/ai/recommendations", { weakTopics: currentProfile?.progress?.weakTopics || [] }).catch(() => ({ data: [] }));
        const normalizedRecs = normalizeQuestions(recs.data, activeField);
        setRecommendations(normalizedRecs.length ? normalizedRecs : loadedQuestions.slice(0, 6));
      })
      .catch(() => undefined);
    refreshBookmarks().catch(() => undefined);
    refreshHistory().catch(() => undefined);
    refreshTests().catch(() => undefined);
  }, [user?.email]);

  const content = (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" onAuth={applyAuth} />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="signup" onAuth={applyAuth} />} />
        <Route path="/oauth-success" element={<div className="container py-5">Signing you in...</div>} />
        <Route path="/dashboard" element={<ProtectedRoute user={user}><DashboardPage profile={profile || user || {}} recommendations={recommendations} questions={questions} /></ProtectedRoute>} />
        <Route path="/questions" element={<ProtectedRoute user={user}><QuestionBankPage questions={questions} filters={filters} setFilters={setFilters} loadQuestions={loadQuestions} defaultField={activeField} /></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute user={user}><PracticePage questions={questions} bookmarks={bookmarks} refreshBookmarks={refreshBookmarks} targetField={activeField} loadQuestions={loadQuestions} /></ProtectedRoute>} />
        <Route path="/mock-tests" element={<ProtectedRoute user={user}><MockTestsPage tests={tests} setTests={setTests} refreshProfile={refreshProfile} refreshHistory={refreshHistory} targetField={activeField} questions={questions} /></ProtectedRoute>} />
        <Route path="/review-mistakes" element={<ProtectedRoute user={user}><ReviewMistakesPage history={history} /></ProtectedRoute>} />
        <Route path="/ai-interviewer" element={<ProtectedRoute user={user}><AIInterviewerPage targetField={activeField} questions={questions} /></ProtectedRoute>} />
        <Route path="/bookmarks" element={<ProtectedRoute user={user}><BookmarksPage bookmarks={bookmarks} /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute user={user}><HistoryPage history={history} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user}><ProfilePage profile={profile || user || { progress: { recommendedTopics: [] } }} refreshProfile={refreshProfile} logout={logout} /></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );

  return (
    <div className="app-shell">
      {user && <Navbar user={user} profile={profile} logout={logout} theme={theme} setTheme={setTheme} />}
      {user ? <main className="app-content">{content}</main> : <main className="auth-content">{content}</main>}
    </div>
  );
}






