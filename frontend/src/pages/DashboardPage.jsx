import { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

const companyOptions = ["General", "Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture"];

const DashboardPage = ({ profile, recommendations }) => {
  const navigate = useNavigate();
  const recent = profile?.analytics?.recentResults || [];
  const weakTopics = profile?.progress?.weakTopics || [];
  const [selectedCompany, setSelectedCompany] = useState("General");
  const [roadmap, setRoadmap] = useState([]);
  const [companyQuestions, setCompanyQuestions] = useState([]);

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
    <div className="container py-4">
      <div className="hero-panel mb-4">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <p className="eyebrow mb-2">AI-powered readiness</p>
            <h1 className="display-5 fw-bold">Interview preparation with analytics, feedback, and coding practice.</h1>
            <p className="lead text-secondary">Use practice mode, timed mock tests, company-specific prep, and AI coaching to improve faster.</p>
          </div>
          <div className="company-prep-box">
            <label className="form-label">Company Prep Track</label>
            <select className="form-select question-select" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
              {companyOptions.map((company) => <option key={company} value={company}>{company}</option>)}
            </select>
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
      <div className="row g-4">
        <div className="col-lg-8"><div className="card glass-card h-100"><div className="card-body"><h2 className="h5 mb-4">Performance Trend</h2><Line data={{ labels: recent.map((_, i) => `Test ${i + 1}`), datasets: [{ label: "Accuracy", data: recent.map((r) => r.accuracy), borderColor: "#35c2ff", backgroundColor: "rgba(53,194,255,0.15)" }] }} /></div></div></div>
        <div className="col-lg-4"><div className="card glass-card h-100"><div className="card-body"><h2 className="h5 mb-4">Readiness Snapshot</h2><Doughnut data={{ labels: ["Correct", "Needs Work"], datasets: [{ data: [profile?.progress?.accuracy || 0, 100 - (profile?.progress?.accuracy || 0)], backgroundColor: ["#35c2ff", "#ff8e72"] }] }} /></div></div></div>
        <div className="col-lg-6"><div className="card glass-card h-100"><div className="card-body"><div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2"><h2 className="h5 mb-0">Weak Topics</h2>{weakTopics.length > 0 && <button type="button" className="btn btn-outline-light btn-sm" onClick={() => openWeakArea(weakTopics[0])}>Open Weak Area</button>}</div><Bar data={{ labels: weakTopics.length ? weakTopics : ["Arrays", "DBMS", "Probability"], datasets: [{ label: "Priority", data: weakTopics.length ? weakTopics.map((_, i) => 90 - i * 15) : [80, 70, 60], backgroundColor: ["#ff8e72", "#ffd166", "#35c2ff"] }] }} /><div className="d-flex gap-2 flex-wrap mt-3">{weakTopics.map((topic) => <button type="button" key={topic} className="badge text-bg-secondary weak-topic-chip" onClick={() => openWeakArea(topic)}>{topic}</button>)}</div></div></div></div>
        <div className="col-lg-6"><div className="card glass-card h-100"><div className="card-body"><h2 className="h5">Recommended Topics</h2><div className="list-group list-group-flush">{recommendations.map((q) => <button type="button" className="list-group-item bg-transparent px-0 recommendation-link" key={q._id} onClick={() => openRecommendedTopic(q)}><h3 className="h6 mb-1">{q.title}</h3><p className="mb-0 text-secondary">{q.topic} | {q.category} | {q.difficulty}</p></button>)}</div></div></div></div>
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
              <h2 className="h5 mb-3">Company Prep Questions</h2>
              <div className="list-group list-group-flush">
                {companyQuestions.map((q) => (
                  <div className="list-group-item bg-transparent px-0" key={q._id}>
                    <h3 className="h6 mb-1">{q.title}</h3>
                    <p className="mb-0 text-secondary">{q.company} | {q.category} | {q.topic}</p>
                  </div>
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


