import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import api from "./api/client";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

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

const SOFTWARE_FIELD = "Software";
const QUESTION_CACHE_KEY = "skillnexa-software-questions";
const DEFAULT_FILTERS = { category: "", difficulty: "", topic: "", company: "" };

const PageLoader = () => (
  <div className="page-loader-shell">
    <div className="page-loader-card glass-card">
      <div className="page-loader-spinner" />
      <strong>Loading SkillNexa...</strong>
      <span>Preparing your workspace</span>
    </div>
  </div>
);

const normalizeQuestions = (questionList = []) => (
  questionList
    .filter(Boolean)
    .map((question, index) => ({
      ...question,
      _id: question._id || question.id || `software-question-${index}`,
      field: question.field || SOFTWARE_FIELD,
      starterCode: question.starterCode || {}
    }))
);

const readCachedQuestions = () => {
  try {
    return normalizeQuestions(JSON.parse(localStorage.getItem(QUESTION_CACHE_KEY) || "[]"));
  } catch {
    return [];
  }
};

const writeCachedQuestions = (questions) => {
  try {
    localStorage.setItem(QUESTION_CACHE_KEY, JSON.stringify(questions));
  } catch {
    // ignore storage issues
  }
};

export default function App() {
  const { user, setUser, profile, setProfile, applyAuth, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [questions, setQuestions] = useState(() => readCachedQuestions());
  const [tests, setTests] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const activeField = useMemo(() => SOFTWARE_FIELD, []);

  const refreshProfile = useCallback(async () => {
    if (!localStorage.getItem("token")) return null;
    const { data } = await api.get("/users/profile");
    setProfile(data);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  }, [setProfile, setUser]);

  const loadQuestions = useCallback(async (params = {}) => {
    const nextParams = { field: activeField, limit: 60, ...params };

    try {
      const { data } = await api.get("/questions", { params: nextParams, timeout: 12000 });
      const normalized = normalizeQuestions(Array.isArray(data) ? data : data?.items || []);
      if (normalized.length) {
        setQuestions(normalized);
        writeCachedQuestions(normalized);
        return normalized;
      }
    } catch {
      // fall back to cache below
    }

    const cached = readCachedQuestions();
    if (!cached.length) {
      setQuestions([]);
      return [];
    }

    const filtered = cached.filter((question) => {
      if ((question.field || SOFTWARE_FIELD) !== activeField) return false;
      if (nextParams.category && question.category !== nextParams.category) return false;
      if (nextParams.difficulty && question.difficulty !== nextParams.difficulty) return false;
      if (nextParams.topic && !(new RegExp(nextParams.topic, "i").test(question.topic || ""))) return false;
      if (nextParams.company && !(new RegExp(nextParams.company, "i").test(question.company || ""))) return false;
      if (nextParams.type && question.type !== nextParams.type) return false;
      return true;
    });

    const fallback = (filtered.length ? filtered : cached).slice(0, nextParams.limit || 60);
    setQuestions(fallback);
    return fallback;
  }, [activeField]);

  const refreshBookmarks = useCallback(async () => {
    const { data } = await api.get("/users/bookmarks");
    setBookmarks(data);
    return data;
  }, []);

  const refreshHistory = useCallback(async () => {
    const { data } = await api.get("/users/history");
    setHistory(data);
    return data;
  }, []);

  const refreshTests = useCallback(async () => {
    const { data } = await api.get("/tests", { params: { field: activeField } });
    setTests(data);
    return data;
  }, [activeField]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!user) {
      setTests([]);
      setBookmarks([]);
      setHistory([]);
      setRecommendations([]);
      setFilters(DEFAULT_FILTERS);
      return;
    }

    api.post("/setup/seed").catch(() => undefined);

    Promise.allSettled([
      refreshProfile(),
      loadQuestions(DEFAULT_FILTERS),
      refreshBookmarks(),
      refreshHistory(),
      refreshTests()
    ]).then((results) => {
      const profileResult = results[0]?.status === "fulfilled" ? results[0].value : profile || user;
      const loadedQuestions = results[1]?.status === "fulfilled" ? results[1].value : readCachedQuestions();

      if (profileResult?.progress?.weakTopics?.length) {
        api.post("/ai/recommendations", { weakTopics: profileResult.progress.weakTopics })
          .then(({ data }) => {
            const normalized = normalizeQuestions(data);
            setRecommendations(normalized.length ? normalized : loadedQuestions.slice(0, 6));
          })
          .catch(() => setRecommendations(loadedQuestions.slice(0, 6)));
      } else {
        setRecommendations(loadedQuestions.slice(0, 6));
      }
    });
  }, [user?.email, activeField, loadQuestions, refreshBookmarks, refreshHistory, refreshProfile, refreshTests]);

  const content = (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" onAuth={applyAuth} />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="signup" onAuth={applyAuth} />} />
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
