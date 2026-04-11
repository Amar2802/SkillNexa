import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";

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

const baseAnalyticsBuckets = [
  { label: "DSA", topics: ["Arrays", "Strings", "Linked List", "Trees", "Graphs", "Dynamic Programming", "Recursion", "Hashing"] },
  { label: "Aptitude", topics: ["Probability", "Time and Work", "Percentages", "Average", "Profit and Loss", "Reasoning"] },
  { label: "Core Subjects", topics: ["DBMS", "SQL", "Operating Systems", "Computer Networks", "OOP", "Java", "Python"] },
  { label: "HR", topics: ["HR", "Behavioral Interviews", "Communication", "Teamwork", "Leadership"] }
];

const DashboardPage = ({ profile = {}, questions = [], recommendations = [], history = [], loading = false }) => {
  const navigate = useNavigate();
  const weakTopics = profile?.progress?.weakTopics || [];
  const recommendedTopics = profile?.progress?.recommendedTopics || [];
  const roadmap = createRoadmap(profile);
  const companyPrep = questions.filter((question) => ["Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture"].includes(question.company)).slice(0, 8);

  const analytics = useMemo(() => {
    const recentHistory = [...history].slice(0, 6).reverse();
    const testsTaken = profile?.progress?.testsTaken || 0;
    const accuracy = profile?.progress?.accuracy || 0;
    const avgScore = recentHistory.length
      ? Math.round(recentHistory.reduce((sum, item) => sum + (item.score || 0), 0) / recentHistory.length)
      : 0;
    const bestAccuracy = recentHistory.length
      ? Math.max(...recentHistory.map((item) => item.accuracy || 0))
      : accuracy;
    const recentAccuracies = recentHistory.map((item) => item.accuracy || 0);
    const consistency = recentAccuracies.length > 1
      ? Math.max(0, 100 - Math.round((Math.max(...recentAccuracies) - Math.min(...recentAccuracies)) * 1.2))
      : accuracy;
    const momentum = recentHistory.length > 1
      ? (recentHistory[recentHistory.length - 1]?.accuracy || 0) - (recentHistory[0]?.accuracy || 0)
      : 0;

    const topicHealth = baseAnalyticsBuckets.map((bucket) => {
      const weaknessHits = weakTopics.filter((topic) => bucket.topics.some((entry) => topic.toLowerCase().includes(entry.toLowerCase()) || entry.toLowerCase().includes(topic.toLowerCase()))).length;
      const recommendationHits = recommendedTopics.filter((topic) => bucket.topics.some((entry) => topic.toLowerCase().includes(entry.toLowerCase()) || entry.toLowerCase().includes(topic.toLowerCase()))).length;
      const baseScore = 82 - weaknessHits * 16 + recommendationHits * 6;
      return {
        label: bucket.label,
        score: Math.max(28, Math.min(96, baseScore)),
        status: weaknessHits > 1 ? "Needs focus" : weaknessHits === 1 ? "Improving" : "Strong"
      };
    });

    const upcomingFocus = [...new Set([...weakTopics, ...recommendedTopics])].filter(Boolean).slice(0, 4);

    return {
      testsTaken,
      accuracy,
      avgScore,
      bestAccuracy,
      consistency,
      momentum,
      recentHistory,
      topicHealth,
      upcomingFocus
    };
  }, [history, profile?.progress?.accuracy, profile?.progress?.testsTaken, recommendedTopics, weakTopics]);

  return (
    <div className="container py-4 dashboard-pro dashboard-analytics-page">
      <div className="hero-panel analytics-hero-panel mb-4">
        <div className="analytics-hero-copy">
          <p className="eyebrow mb-2">Software Interview Dashboard</p>
          <h1 className="display-6 fw-bold mb-2">Welcome back, {profile?.name || "Learner"}</h1>
          <p className="text-secondary mb-0">Track your preparation, revise weak areas, and stay consistent across DSA, aptitude, HR, and core subjects.</p>
        </div>
        <div className="analytics-hero-badges">
          <div className="analytics-badge-card">
            <span>Readiness</span>
            <strong>{Math.max(35, Math.round((analytics.accuracy + analytics.consistency) / 2))}%</strong>
          </div>
          <div className="analytics-badge-card">
            <span>Momentum</span>
            <strong>{analytics.momentum >= 0 ? `+${analytics.momentum}` : analytics.momentum} pts</strong>
          </div>
        </div>
      </div>

      <div className="analytics-metric-grid mb-4">
        <button className="metric-card analytics-metric-card text-start metric-link-card" onClick={() => navigate("/history")}>
          <span>Tests Taken</span>
          <h3>{analytics.testsTaken}</h3>
          <small>Completed mock rounds</small>
        </button>
        <button className="metric-card analytics-metric-card text-start metric-link-card" onClick={() => navigate("/practice")}>
          <span>Overall Accuracy</span>
          <h3>{analytics.accuracy}%</h3>
          <small>Current answered-question accuracy</small>
        </button>
        <button className="metric-card analytics-metric-card text-start metric-link-card" onClick={() => navigate("/history")}>
          <span>Average Score</span>
          <h3>{analytics.avgScore}</h3>
          <small>Based on recent mock history</small>
        </button>
        <button className="metric-card analytics-metric-card text-start metric-link-card" onClick={() => navigate("/review-mistakes")}>
          <span>Consistency</span>
          <h3>{analytics.consistency}%</h3>
          <small>Lower score swing means better stability</small>
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-8">
          <div className="glass-card p-4 analytics-panel h-100">
            <div className="analytics-panel-head mb-3">
              <div>
                <p className="eyebrow mb-1">Performance Analytics</p>
                <h2 className="h4 mb-0">Recent mock test trend</h2>
              </div>
              <Link to="/history" className="btn btn-outline-light">Open History</Link>
            </div>
            {analytics.recentHistory.length ? (
              <div className="analytics-trend-card">
                <div className="analytics-bar-chart">
                  {analytics.recentHistory.map((item, index) => {
                    const accuracyValue = item.accuracy || 0;
                    const height = Math.max(18, Math.min(100, accuracyValue));
                    return (
                      <div key={item._id || index} className="analytics-bar-column">
                        <div className="analytics-bar-track">
                          <div className="analytics-bar-fill" style={{ height: `${height}%` }} />
                        </div>
                        <strong>{accuracyValue}%</strong>
                        <span>Test {index + 1}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="analytics-trend-summary">
                  <div>
                    <span>Best accuracy</span>
                    <strong>{analytics.bestAccuracy}%</strong>
                  </div>
                  <div>
                    <span>Momentum</span>
                    <strong className={analytics.momentum >= 0 ? "trend-positive" : "trend-negative"}>{analytics.momentum >= 0 ? `+${analytics.momentum}` : analytics.momentum} pts</strong>
                  </div>
                  <div>
                    <span>Weak topics</span>
                    <strong>{weakTopics.length}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-secondary mb-0">No mock test trend yet. Attempt a mock test to unlock accuracy and momentum insights.</p>
            )}
          </div>
        </div>

        <div className="col-xl-4">
          <div className="glass-card p-4 analytics-panel h-100">
            <p className="eyebrow mb-1">Topic Health</p>
            <h2 className="h4 mb-3">Section-wise readiness</h2>
            <div className="analytics-topic-list">
              {analytics.topicHealth.map((item) => (
                <div key={item.label} className="analytics-topic-item">
                  <div className="analytics-topic-head">
                    <strong>{item.label}</strong>
                    <span>{item.score}%</span>
                  </div>
                  <div className="analytics-topic-track">
                    <div className="analytics-topic-fill" style={{ width: `${item.score}%` }} />
                  </div>
                  <small>{item.status}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-7">
          <div className="glass-card p-4 mb-4 analytics-panel">
            <div className="analytics-panel-head mb-3">
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

          <div className="glass-card p-4 analytics-panel">
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

        <div className="col-xl-5">
          <div className="glass-card p-4 mb-4 analytics-panel">
            <p className="eyebrow mb-1">Focus Queue</p>
            <h2 className="h4 mb-3">What to do next</h2>
            <div className="analytics-focus-list">
              {(analytics.upcomingFocus.length ? analytics.upcomingFocus : ["Arrays", "DBMS", "Operating Systems", "HR communication"]).map((item, index) => (
                <button key={item} className="analytics-focus-item" onClick={() => navigate(`/questions?topic=${encodeURIComponent(item)}`)}>
                  <span className="analytics-focus-index">{index + 1}</span>
                  <span>
                    <strong>{item}</strong>
                    <small>Open targeted questions and revise this zone</small>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-4 mb-4 analytics-panel">
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

          <div className="glass-card p-4 analytics-panel">
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
