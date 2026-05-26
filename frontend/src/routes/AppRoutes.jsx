import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import LoadingScreen from "../components/ui/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { useAuthSession } from "../hooks/useAuthSession";
import api from "../api/client";
import AuthPage from "../pages/AuthPage";

const OAuthSuccessPage = lazy(() => import("../pages/OAuthSuccessPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const QuestionBankPage = lazy(() => import("../pages/QuestionBankPage"));
const PracticePage = lazy(() => import("../pages/PracticePage"));
const MockTestsPage = lazy(() => import("../pages/MockTestsPage"));
const ReviewMistakesPage = lazy(() => import("../pages/ReviewMistakesPage"));
const AIInterviewerPage = lazy(() => import("../pages/AIInterviewerPage"));
const BookmarksPage = lazy(() => import("../pages/BookmarksPage"));
const HistoryPage = lazy(() => import("../pages/HistoryPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));

ChartJS.register(ArcElement, BarElement, CategoryScale, Legend, LineElement, LinearScale, PointElement, Tooltip);

const SOFTWARE_FIELD = "Software";

const normalizeQuestions = (questionList = []) => questionList.map((question, index) => ({
  ...question,
  _id: question._id || `question-${index + 1}`,
  field: SOFTWARE_FIELD,
  starterCode: question.starterCode || {}
}));

const RouteLoader = () => <LoadingScreen title="Loading SkillNexa..." subtitle="Preparing your interview workspace" />;

const AppRoutes = () => {
  const { user, profile, authReady, hydrateAuth, logout } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingApp, setLoadingApp] = useState(false);
  const [appError, setAppError] = useState("");

  useAuthSession({ setLoadingApp, setAppError });

  const refreshProfile = async () => {
    const { data } = await api.get("/users/profile", { timeout: 25000 });
    hydrateAuth(data);
    return data;
  };

  const loadQuestions = async (params = {}) => {
    const requestParams = { field: SOFTWARE_FIELD, limit: 80, ...params };
    if (!requestParams.type || requestParams.type === "all") {
      delete requestParams.type;
    }
    const { data } = await api.get("/questions", { params: requestParams, timeout: 25000 });
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
    if (!authReady || !user) {
      if (!user) {
        setQuestions([]);
        setTests([]);
        setBookmarks([]);
        setHistory([]);
      }
      return;
    }

    let active = true;
    const bootstrapData = async () => {
      try {
        setLoadingApp(true);
        setAppError("");
        await Promise.allSettled([
          refreshProfile(),
          refreshBookmarks(),
          refreshHistory(),
          refreshTests(),
          loadQuestions()
        ]);
      } catch (error) {
        if (active && error?.response?.status !== 401) {
          setAppError(error?.response?.data?.message || "We could not load your workspace completely.");
        }
      } finally {
        if (active) setLoadingApp(false);
      }
    };

    void bootstrapData();
    return () => {
      active = false;
    };
  }, [authReady, user?.email]);

  const dashboardRecommendations = useMemo(() => {
    const recommendedTopics = profile?.progress?.recommendedTopics || [];
    if (!recommendedTopics.length) return questions.slice(0, 6);
    const matched = questions.filter((question) => recommendedTopics.includes(question.topic));
    return matched.length ? matched.slice(0, 6) : questions.slice(0, 6);
  }, [profile?.progress?.recommendedTopics, questions]);

  if (!authReady) {
    return <LoadingScreen title="Verifying authentication..." subtitle="Blocking protected pages until your session is confirmed" />;
  }

  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route index element={<AuthPage mode="none" />} />
          <Route path="login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" />} />
          <Route path="signup" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="signup" />} />
          <Route path="forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="forgot" />} />
          <Route path="oauth-success" element={<OAuthSuccessPage />} />
        </Route>

        <Route
          element={(
            <ProtectedRoute user={user} authReady={authReady}>
              <AppLayout user={user} profile={profile} logout={logout} appError={appError} />
            </ProtectedRoute>
          )}
        >
          <Route path="/dashboard" element={<DashboardPage profile={profile || user} questions={questions} recommendations={dashboardRecommendations} history={history} loading={loadingApp} />} />
          <Route path="/questions" element={<QuestionBankPage questions={questions} loadQuestions={loadQuestions} defaultField={SOFTWARE_FIELD} bookmarks={bookmarks} refreshBookmarks={refreshBookmarks} />} />
          <Route path="/practice" element={<PracticePage questions={questions} bookmarks={bookmarks} refreshBookmarks={refreshBookmarks} targetField={SOFTWARE_FIELD} loadQuestions={loadQuestions} />} />
          <Route path="/practice/:questionId" element={<PracticePage questions={questions} bookmarks={bookmarks} refreshBookmarks={refreshBookmarks} targetField={SOFTWARE_FIELD} loadQuestions={loadQuestions} />} />
          <Route path="/mock-tests" element={<MockTestsPage tests={tests} refreshTests={refreshTests} refreshProfile={refreshProfile} refreshHistory={refreshHistory} questions={questions} />} />
          <Route path="/review-mistakes" element={<ReviewMistakesPage history={history} />} />
          <Route path="/ai-interviewer" element={<AIInterviewerPage questions={questions} />} />
          <Route path="/bookmarks" element={<BookmarksPage bookmarks={bookmarks} refreshBookmarks={refreshBookmarks} />} />
          <Route path="/history" element={<HistoryPage history={history} refreshHistory={refreshHistory} />} />
          <Route path="/profile" element={<ProfilePage profile={profile || user} refreshProfile={refreshProfile} />} />
        </Route>

        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
