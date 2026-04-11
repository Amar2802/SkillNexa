import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import api from "./api/client";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

const AuthPage = lazy(() => import("./pages/AuthPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const QuestionBankPage = lazy(() => import("./pages/QuestionBankPage"));
const PracticePage = lazy(() => import("./pages/PracticePage"));
const MockTestsPage = lazy(() => import("./pages/MockTestsPage"));
const ReviewMistakesPage = lazy(() => import("./pages/ReviewMistakesPage"));
const AIInterviewerPage = lazy(() => import("./pages/AIInterviewerPage"));
const BookmarksPage = lazy(() => import("./pages/BookmarksPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LineElement, LinearScale, PointElement, Tooltip);

const SOFTWARE_FIELD = "Software";

const PageLoader = () => (
  <div className="page-loader-shell">
    <div className="page-loader-card glass-card">
      <div className="page-loader-spinner" />
      <strong>Loading SkillNexa...</strong>
      <span>Preparing your software interview workspace</span>
    </div>
  </div>
);

const normalizeQuestions = (questionList = []) => questionList.map((question, index) => ({
  ...question,
  _id: question._id || `question-${index + 1}`,
  field: SOFTWARE_FIELD,
  starterCode: question.starterCode || {}
}));

export default function App() {
  const { user, setUser, profile, setProfile, applyAuth, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingApp, setLoadingApp] = useState(false);

  const refreshProfile = async () => {
    const { data } = await api.get("/users/profile", { timeout: 25000 });
    setProfile(data);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  const loadQuestions = async (params = {}) => {
    const requestParams = { field: SOFTWARE_FIELD, limit: 80, ...params };
    if (!requestParams.type || requestParams.type === "all") {
      delete requestParams.type;
    }
    const { data } = await api.get("/questions", {
      params: requestParams,
      timeout: 25000
    });

    const nextQuestions = normalizeQuestions(Array.isArray(data) ? data : data?.items || []);
    if (!params.page && !params.paginated) {
      setQuestions(nextQuestions);
    }
    return nextQuestions;
  };

  const refreshBookmarks = async () => {
    const { data } = await api.get("/users/bookmarks", { timeout: 25000 });
    setBookmarks(data || []);
    return data || [];
  };

  const refreshHistory = async () => {
    const { data } = await api.get("/users/history", { timeout: 25000 });
    setHistory(data || []);
    return data || [];
  };

  const refreshTests = async () => {
    const { data } = await api.get("/tests", { params: { field: SOFTWARE_FIELD }, timeout: 25000 });
    setTests(data || []);
    return data || [];
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!user) {
      setQuestions([]);
      setTests([]);
      setBookmarks([]);
      setHistory([]);
      setLoadingApp(false);
      return;
    }

    let active = true;
    const bootstrap = async () => {
      try {
        setLoadingApp(true);
        await refreshProfile();
      } finally {
        if (active) setLoadingApp(false);
      }
    };

    bootstrap().catch(() => {
      if (active) setLoadingApp(false);
    });

    return () => {
      active = false;
    };
  }, [user?.email]);

  const dashboardRecommendations = useMemo(() => {
    const recommendedTopics = profile?.progress?.recommendedTopics || [];
    if (!recommendedTopics.length) return questions.slice(0, 6);
    const matched = questions.filter((question) => recommendedTopics.includes(question.topic));
    return matched.length ? matched.slice(0, 6) : questions.slice(0, 6);
  }, [profile?.progress?.recommendedTopics, questions]);

  const shell = (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" onAuth={applyAuth} />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="signup" onAuth={applyAuth} />} />
        <Route path="/dashboard" element={<ProtectedRoute user={user}><DashboardPage profile={profile || user} questions={questions} recommendations={dashboardRecommendations} history={history} loading={loadingApp} /></ProtectedRoute>} />
        <Route path="/questions" element={<ProtectedRoute user={user}><QuestionBankPage questions={questions} loadQuestions={loadQuestions} defaultField={SOFTWARE_FIELD} /></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute user={user}><PracticePage questions={questions} bookmarks={bookmarks} refreshBookmarks={refreshBookmarks} targetField={SOFTWARE_FIELD} loadQuestions={loadQuestions} /></ProtectedRoute>} />
        <Route path="/mock-tests" element={<ProtectedRoute user={user}><MockTestsPage tests={tests} refreshTests={refreshTests} refreshProfile={refreshProfile} refreshHistory={refreshHistory} questions={questions} /></ProtectedRoute>} />
        <Route path="/review-mistakes" element={<ProtectedRoute user={user}><ReviewMistakesPage history={history} /></ProtectedRoute>} />
        <Route path="/ai-interviewer" element={<ProtectedRoute user={user}><AIInterviewerPage questions={questions} /></ProtectedRoute>} />
        <Route path="/bookmarks" element={<ProtectedRoute user={user}><BookmarksPage bookmarks={bookmarks} refreshBookmarks={refreshBookmarks} /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute user={user}><HistoryPage history={history} refreshHistory={refreshHistory} /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user}><ProfilePage profile={profile || user} refreshProfile={refreshProfile} logout={logout} /></ProtectedRoute>} />
      </Routes>
    </Suspense>
  );

  return (
    <div className={`app-shell ${user ? "app-shell-user" : "app-shell-auth"}`}>
      <div className="app-shell-backdrop">
        <div className="app-shell-orb orb-one" />
        <div className="app-shell-orb orb-two" />
        <div className="app-shell-grid" />
      </div>
      {user && <Navbar user={user} profile={profile} logout={logout} theme={theme} setTheme={setTheme} />}
      <main className={user ? "app-content" : "auth-content"}>{shell}</main>
    </div>
  );
}
