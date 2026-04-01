import { Link, useNavigate } from "react-router-dom";

const createRoadmap = (profile) => {
  const weakTopics = profile?.progress?.weakTopics || [];
  const recommended = profile?.progress?.recommendedTopics || [];
  const focus = [...new Set([...weakTopics, ...recommended])].filter(Boolean);
  const topics = focus.length ? focus : ["Arrays", "DBMS", "Operating Systems", "HR"];

  return [
    { week: "Week 1", goal: `Revise ${topics[0]} and solve 15 focused questions` },
    { week: "Week 2", goal: `Practice ${topics[1] || topics[0]} and take one 30-question mock test` },
    { week: "Week 3", goal: `Strengthen ${topics[2] || topics[0]} and review all mistakes` },
    { week: "Week 4", goal: `Polish ${topics[3] || "HR answers"} and attempt a final mock plus AI round` }
  ];
};

const DashboardPage = ({ profile = {}, questions = [], recommendations = [], history = [], loading = false }) => {
  const navigate = useNavigate();
  const weakTopics = profile?.progress?.weakTopics || [];
  const recommendedTopics = profile?.progress?.recommendedTopics || [];
  const roadmap = createRoadmap(profile);
  const companyPrep = questions.filter((question) => ["Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture"].includes(question.company)).slice(0, 8);

  return (
    <div className="container py-4 dashboard-pro">
      <div className="hero-panel mb-4">
        <p className="eyebrow mb-2">Software Interview Dashboard</p>
        <h1 className="display-6 fw-bold mb-2">Welcome back, {profile?.name || "Learner"}</h1>
        <p className="text-secondary mb-0">Track your preparation, revise weak areas, and stay consistent across DSA, aptitude, HR, and core subjects.</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3"><button className="metric-card w-100 text-start metric-link-card" onClick={() => navigate("/history")}><span>Tests Taken</span><h3>{profile?.progress?.testsTaken || 0}</h3></button></div>
        <div className="col-md-3"><button className="metric-card w-100 text-start metric-link-card" onClick={() => navigate("/review-mistakes")}><span>Weak Areas</span><h3>{weakTopics.length}</h3></button></div>
        <div className="col-md-3"><button className="metric-card w-100 text-start metric-link-card" onClick={() => navigate("/questions")}><span>Question Bank</span><h3>{questions.length}</h3></button></div>
        <div className="col-md-3"><button className="metric-card w-100 text-start metric-link-card" onClick={() => navigate("/practice")}><span>Accuracy</span><h3>{profile?.progress?.accuracy || 0}%</h3></button></div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="glass-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <div>
                <p className="eyebrow mb-1">Recommended Topics</p>
                <h2 className="h4 mb-0">Your next best topics</h2>
              </div>
              <Link to="/questions" className="btn btn-outline-light">Open Question Bank</Link>
            </div>
            {loading && !recommendations.length ? <p className="text-secondary mb-0">Loading recommendations...</p> : (
              <div className="d-flex flex-wrap gap-2">
                {(recommendedTopics.length ? recommendedTopics : ["Arrays", "DBMS", "Operating Systems", "HR"]).slice(0, 8).map((topic) => (
                  <button key={topic} className="interest-chip" onClick={() => navigate(`/questions?topic=${encodeURIComponent(topic)}`)}>{topic}</button>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-4 mb-4">
            <p className="eyebrow mb-1">Personalized Roadmap</p>
            <h2 className="h4 mb-3">4-week software prep plan</h2>
            <div className="roadmap-list">
              {roadmap.map((item) => (
                <div className="roadmap-item" key={item.week}>
                  <div className="roadmap-week">{item.week}</div>
                  <div>{item.goal}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="glass-card p-4 mb-4">
            <p className="eyebrow mb-1">Company Preparation</p>
            <h2 className="h4 mb-3">Software company prep questions</h2>
            <div className="company-prep-track-row">
              {companyPrep.length ? companyPrep.map((question) => (
                <button key={question._id} className="company-prep-track-item text-start" onClick={() => navigate(`/questions?topic=${encodeURIComponent(question.topic)}&category=${encodeURIComponent(question.category)}`)}>
                  <span className="company-prep-track-badge">{question.company}</span>
                  <strong className="d-block mb-1">{question.title.replace(/\s+Practice Variant\s+\d+$/i, "")}</strong>
                  <p className="text-secondary mb-0">{question.topic} | {question.category}</p>
                </button>
              )) : <p className="text-secondary mb-0">Company preparation questions will appear here after questions load.</p>}
            </div>
          </div>

          <div className="glass-card p-4">
            <p className="eyebrow mb-1">Recent Activity</p>
            <h2 className="h4 mb-3">Latest test history</h2>
            {history.length ? (
              <div className="vstack gap-3">
                {history.slice(0, 4).map((item) => (
                  <button key={item._id} className="quick-action-card text-start" onClick={() => navigate("/history")}>
                    <strong>{item.test?.title || "Mock Test"}</strong>
                    <span>Score: {item.score || 0} | Accuracy: {item.accuracy || 0}%</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-secondary mb-0">No mock test history yet. Start with a 30-question test to build your baseline.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
