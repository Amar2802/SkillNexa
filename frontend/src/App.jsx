import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import api from "./api/client";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import AIInterviewerPage from "./pages/AIInterviewerPage";
import AuthPage from "./pages/AuthPage";
import BookmarksPage from "./pages/BookmarksPage";
import DashboardPage from "./pages/DashboardPage";
import HistoryPage from "./pages/HistoryPage";
import MockTestsPage from "./pages/MockTestsPage";
import PracticePage from "./pages/PracticePage";
import ProfilePage from "./pages/ProfilePage";
import QuestionBankPage from "./pages/QuestionBankPage";
import ReviewMistakesPage from "./pages/ReviewMistakesPage";

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LineElement, LinearScale, PointElement, Tooltip);

export default function App() {
  const { user, setUser, profile, setProfile, applyAuth, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [filters, setFilters] = useState({ category: "", difficulty: "", topic: "", company: "" });

  const refreshProfile = async () => {
    if (!localStorage.getItem("token")) return null;
    const { data } = await api.get("/users/profile");
    setProfile(data);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  const loadQuestions = async (params = {}) => setQuestions((await api.get("/questions", { params })).data);
  const refreshBookmarks = async () => setBookmarks((await api.get("/users/bookmarks")).data);
  const refreshHistory = async () => setHistory((await api.get("/users/history")).data);
  const refreshTests = async () => setTests((await api.get("/tests")).data);

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
    api.post("/setup/seed").catch(() => undefined);
    loadQuestions();

    if (user) {
      refreshProfile().then(async (currentProfile) => {
        const recs = await api.post("/ai/recommendations", { weakTopics: currentProfile?.progress?.weakTopics || [] });
        setRecommendations(recs.data);
      }).catch(() => undefined);
      refreshBookmarks().catch(() => undefined);
      refreshHistory().catch(() => undefined);
      refreshTests().catch(() => undefined);
    }
  }, [user?.email]);

  const content = (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={<AuthPage mode="login" onAuth={applyAuth} />} />
      <Route path="/signup" element={<AuthPage mode="signup" onAuth={applyAuth} />} />
      <Route path="/oauth-success" element={<div className="container py-5">Signing you in...</div>} />
      <Route path="/dashboard" element={<ProtectedRoute user={user}><DashboardPage profile={profile || user || {}} recommendations={recommendations} /></ProtectedRoute>} />
      <Route path="/questions" element={<ProtectedRoute user={user}><QuestionBankPage questions={questions} filters={filters} setFilters={setFilters} loadQuestions={loadQuestions} /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute user={user}><PracticePage questions={questions} bookmarks={bookmarks} refreshBookmarks={refreshBookmarks} /></ProtectedRoute>} />
      <Route path="/mock-tests" element={<ProtectedRoute user={user}><MockTestsPage tests={tests} setTests={setTests} refreshProfile={refreshProfile} refreshHistory={refreshHistory} /></ProtectedRoute>} />
      <Route path="/review-mistakes" element={<ProtectedRoute user={user}><ReviewMistakesPage history={history} /></ProtectedRoute>} />
      <Route path="/ai-interviewer" element={<ProtectedRoute user={user}><AIInterviewerPage /></ProtectedRoute>} />
      <Route path="/bookmarks" element={<ProtectedRoute user={user}><BookmarksPage bookmarks={bookmarks} /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute user={user}><HistoryPage history={history} /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute user={user}><ProfilePage profile={profile || user || { progress: { recommendedTopics: [] } }} refreshProfile={refreshProfile} logout={logout} /></ProtectedRoute>} />
    </Routes>
  );

  return (
    <div className="app-shell">
      <Navbar user={user} profile={profile} logout={logout} theme={theme} setTheme={setTheme} />
      {user ? <main className="app-content">{content}</main> : content}
    </div>
  );
}
