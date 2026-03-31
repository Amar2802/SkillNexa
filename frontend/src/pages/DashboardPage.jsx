import { useEffect, useMemo, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { DAILY_INTERVIEW_TRACKS, getDailyPrepKey, readDailyAttemptRecords } from "../utils/prepTracking";

const companyOptions = ["General", "Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture"];

const calculateStreak = (records) => {
  let streak = 0;
  let cursor = new Date();

  while (true) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    const entry = records[key] || {};
    const completed = DAILY_INTERVIEW_TRACKS.every((task) => entry?.[task.bucket]?.completed);
    if (!completed) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

const DashboardPage = ({ profile, recommendations, questions = [] }) => {
  const navigate = useNavigate();
  const recent = profile?.analytics?.recentResults || [];
  const weakTopics = profile?.progress?.weakTopics || [];
  const [selectedCompany, setSelectedCompany] = useState("General");
  const [roadmap, setRoadmap] = useState([]);
  const [companyQuestions, setCompanyQuestions] = useState([]);
  const [attemptRecords, setAttemptRecords] = useState(() => readDailyAttemptRecords());

  const todayKey = useMemo(() => getDailyPrepKey(), []);
  const todayAttempts = attemptRecords[todayKey] || {};

  useEffect(() => {
    const loadRoadmap = async () => {
      const roadmapResponse = await api.post("/users/roadmap", { company: selectedCompany });
      setRoadmap(roadmapResponse.data.roadmap || []);

      const questionResponse = await api.get("/questions", {
        params: selectedCompany === "General" ? {} : { company: selectedCompany }
      });
      setCompanyQuestions(questionResponse.data.slice(0, 6));
    };

    loadRoadmap().catch(() => undefined);
  }, [selectedCompany]);

  useEffect(() => {
    const syncAttempts = () => setAttemptRecords(readDailyAttemptRecords());
    window.addEventListener("focus", syncAttempts);
    window.addEventListener("storage", syncAttempts);
    return () => {
      window.removeEventListener("focus", syncAttempts);
      window.removeEventListener("storage", syncAttempts);
    };
  }, []);

  const openRecommendedTopic = (question) => {
    const params = new URLSearchParams();
    if (question?.topic) params.set("topic", question.topic);
    if (question?.category) params.set("category", question.category);
    navigate(`/questions?${params.toString()}`);
  };

  const openWeakArea = (topic) => {
    const params = new URLSearchParams();
    if (topic) params.set("topic", topic);
    navigate(`/questions?${params.toString()}`);
  };

  const focusTopic = weakTopics[0] || recommendations?.[0]?.topic || "Interview fundamentals";
  const streak = useMemo(() => calculateStreak(attemptRecords), [attemptRecords]);

  const dailyPrepTasks = useMemo(() => {
    const daySeed = Number(todayKey.replace(/-/g, "")) || 0;

    return DAILY_INTERVIEW_TRACKS.map((track, index) => {
      const pool = questions.filter((question) => question.category === track.category);
      const question = pool.length ? pool[(daySeed + index) % pool.length] : null;
      const attempt = todayAttempts[track.bucket];

      return {
        ...track,
        question,
        completed: !!attempt?.completed,
        completionLabel: attempt?.completed ? "Completed" : "Attempt question",
        completionMeta: attempt?.completed
          ? `Attempted from ${attempt.source || "practice"}`
          : "Not attempted yet today"
      };
    });
  }, [questions, todayAttempts, todayKey]);

  const completedTasks = dailyPrepTasks.filter((task) => task.completed).length;
  const dailyGoalProgress = Math.round((completedTasks / dailyPrepTasks.length) * 100);

  const quickActions = [
    { label: "Practice Questions", hint: "Sharpen concept recall", route: "/practice" },
    { label: "Mock Test", hint: "Simulate pressure and timing", route: "/mock-tests" },
    { label: "Review Mistakes", hint: "Turn errors into revision", route: "/review-mistakes" },
    { label: "AI Interviewer", hint: "Practice speaking and structure", route: "/ai-interviewer" }
  ];

  const metricCards = [
    {
      label: "Accuracy",
      value: `${profile?.progress?.accuracy || 0}%`,
      hint: "Across recent attempts",
      onClick: () => navigate("/history")
    },
    {
      label: "Tests Taken",
      value: profile?.progress?.testsTaken || 0,
      hint: "Completed mock exams",
      onClick: () => navigate("/history")
    },
    {
      label: "Avg Time",
      value: `${profile?.analytics?.avgTimePerQuestion || 0}s`,
      hint: "Per question",
      onClick: () => navigate("/mock-tests")
    },
    {
      label: "Weak Areas",
      value: weakTopics.length || 0,
      hint: weakTopics.length ? `Top focus: ${weakTopics[0]}` : "Topics needing revision",
      onClick: () => openWeakArea(weakTopics[0] || "")
    }
  ];

  return (
    <div className="container py-4 dashboard-pro">
      <div className="hero-panel dashboard-hero-pro mb-4">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-4">
          <div className="hero-copy-block">
            <p className="eyebrow mb-2">Personalized interview workspace</p>
            <h1 className="display-5 fw-bold mb-3">Welcome back, {profile?.name?.split(" ")[0] || "Candidate"}. Keep your preparation sharp and consistent.</h1>
            <p className="lead text-secondary mb-4">Track momentum, follow a guided daily plan, and switch between practice, mock tests, and AI coaching without losing focus.</p>
            <div className="hero-pill-row">
              <span className="hero-pill">Daily goal: {dailyGoalProgress}% complete</span>
              <span className="hero-pill">Current streak: {streak} day{streak === 1 ? "" : "s"}</span>
              <span className="hero-pill">Primary focus: {focusTopic}</span>
            </div>
          </div>
          <div className="dashboard-highlight-card">
            <p className="small text-uppercase text-muted mb-2">Company Prep Track</p>
            <select className="form-select question-select mb-3" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
              {companyOptions.map((company) => <option key={company} value={company}>{company}</option>)}
            </select>
            <div className="dashboard-highlight-metric">
              <span>Today's focus topic</span>
              <strong>{focusTopic}</strong>
            </div>
            <div className="dashboard-highlight-metric">
              <span>Recommended target</span>
              <strong>{selectedCompany}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {metricCards.map((card) => (
          <div className="col-md-3" key={card.label}>
            <button type="button" className="card glass-card h-100 metric-link-card" onClick={card.onClick}>
              <div className="card-body text-start">
                <p className="text-uppercase small text-muted mb-2">{card.label}</p>
                <h3 className="display-6 fw-bold mb-1">{card.value}</h3>
                <p className="text-secondary mb-0">{card.hint}</p>
              </div>
            </button>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="card glass-card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div>
                  <h2 className="h5 mb-1">Daily Preparation Plan</h2>
                  <p className="text-secondary mb-0">Each task is tied to a real interview round and completes automatically when you attempt a question today.</p>
                </div>
                <span className="badge text-bg-info">{completedTasks}/{dailyPrepTasks.length} completed today</span>
              </div>
              <div className="prep-plan-list">
                {dailyPrepTasks.map((task) => (
                  <div className={`prep-plan-item ${task.completed ? "completed" : ""}`} key={task.bucket}>
                    <div className={`prep-check ${task.completed ? "completed" : ""}`}>{task.completed ? "Done" : "Live"}</div>
                    <div className="prep-plan-copy">
                      <strong>{task.label}: {task.question?.title || "Question loading..."}</strong>
                      <span>{task.question ? `${task.question.topic} | ${task.question.difficulty} | ${task.guidance}` : task.guidance}</span>
                      <small className="text-secondary">{task.completionMeta}</small>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-light btn-sm"
                      onClick={() => task.question ? openRecommendedTopic(task.question) : navigate("/questions")}
                    >
                      {task.completionLabel}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card glass-card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div>
                  <h2 className="h5 mb-1">Quick Start Actions</h2>
                  <p className="text-secondary mb-0">Jump into the next high-value step without thinking about where to begin.</p>
                </div>
                <span className="badge text-bg-secondary">High impact</span>
              </div>
              <div className="quick-action-grid">
                {quickActions.map((action) => (
                  <button key={action.route} type="button" className="quick-action-card" onClick={() => navigate(action.route)}>
                    <strong>{action.label}</strong>
                    <span>{action.hint}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8"><div className="card glass-card h-100"><div className="card-body"><h2 className="h5 mb-4">Performance Trend</h2><Line data={{ labels: recent.map((_, i) => `Test ${i + 1}`), datasets: [{ label: "Accuracy", data: recent.map((r) => r.accuracy), borderColor: "#35c2ff", backgroundColor: "rgba(53,194,255,0.15)" }] }} /></div></div></div>
        <div className="col-lg-4"><div className="card glass-card h-100"><div className="card-body"><h2 className="h5 mb-4">Readiness Snapshot</h2><Doughnut data={{ labels: ["Correct", "Needs Work"], datasets: [{ data: [profile?.progress?.accuracy || 0, 100 - (profile?.progress?.accuracy || 0)], backgroundColor: ["#35c2ff", "#ff8e72"] }] }} /></div></div></div>
        <div className="col-lg-6"><div className="card glass-card h-100"><div className="card-body"><div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2"><h2 className="h5 mb-0">Weak Topics</h2>{weakTopics.length > 0 && <button type="button" className="btn btn-outline-light btn-sm" onClick={() => openWeakArea(weakTopics[0])}>Open Weak Area</button>}</div><Bar data={{ labels: weakTopics.length ? weakTopics : ["Arrays", "DBMS", "Probability"], datasets: [{ label: "Priority", data: weakTopics.length ? weakTopics.map((_, i) => 90 - i * 15) : [80, 70, 60], backgroundColor: ["#ff8e72", "#ffd166", "#35c2ff"] }] }} /><div className="d-flex gap-2 flex-wrap mt-3">{weakTopics.map((topic) => <button type="button" key={topic} className="badge text-bg-secondary weak-topic-chip" onClick={() => openWeakArea(topic)}>{topic}</button>)}</div></div></div></div>
        <div className="col-lg-6"><div className="card glass-card h-100"><div className="card-body"><h2 className="h5">Recommended Topics</h2><div className="list-group list-group-flush">{recommendations.map((q) => <button type="button" className="list-group-item bg-transparent px-0 recommendation-link" key={q._id} onClick={() => openRecommendedTopic(q)}><h3 className="h6 mb-1">{q.title}</h3><p className="mb-0 text-secondary">{q.topic} | {q.category} | {q.difficulty}</p></button>)}{!recommendations.length && <p className="text-secondary mb-0">Recommendations will appear here as you complete practice and mock tests.</p>}</div></div></div></div>
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-7">
          <div className="card glass-card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <h2 className="h5 mb-0">Personalized Roadmap</h2>
                <span className="badge text-bg-info">Target: {selectedCompany}</span>
              </div>
              <div className="roadmap-list">
                {roadmap.map((item) => (
                  <div key={item.week} className="roadmap-item">
                    <div className="roadmap-week">{item.week}</div>
                    <div>
                      <h3 className="h6 mb-2">{item.goal}</h3>
                      <ul className="mb-0 text-secondary roadmap-points">
                        {item.sessions.map((session) => <li key={session}>{session}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card glass-card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <h2 className="h5 mb-0">Company Prep Questions</h2>
                <span className="badge text-bg-secondary">Swipe or scroll</span>
              </div>
              <div className="company-prep-track-row">
                {companyQuestions.map((q) => (
                  <button type="button" className="company-prep-track-item recommendation-link text-start border-0" key={q._id} onClick={() => openRecommendedTopic(q)}>
                    <span className="company-prep-track-badge">{q.company || selectedCompany}</span>
                    <h3 className="h6 mb-2">{q.title}</h3>
                    <p className="mb-0 text-secondary">{q.category} | {q.topic}</p>
                  </button>
                ))}
                {!companyQuestions.length && <p className="text-secondary mb-0">No company-tagged questions found yet for this track.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
