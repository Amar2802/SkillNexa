import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const createRoadmap = (profile) => {
  const weakTopics = profile?.progress?.weakTopics || [];
  const recommended = profile?.progress?.recommendedTopics || [];
  const focus = [...new Set([...weakTopics, ...recommended])].filter(Boolean);
  const topics = focus.length ? focus : ["Arrays", "DBMS", "Operating Systems", "HR Communication"];

  return [
    { week: "Week 1", goal: `Strengthen ${topics[0]} fundamentals and close quick gaps.` },
    { week: "Week 2", goal: `Practice ${topics[1] || topics[0]} with timed question sets.` },
    { week: "Week 3", goal: `Revise ${topics[2] || topics[0]} and review mistakes carefully.` },
    { week: "Week 4", goal: `Polish ${topics[3] || "communication"} with final mock rounds.` }
  ];
};

const baseAnalyticsBuckets = [
  { label: "DSA", topics: ["Arrays", "Strings", "Linked List", "Trees", "Graphs", "Dynamic Programming", "Recursion", "Hashing"] },
  { label: "Aptitude", topics: ["Probability", "Time and Work", "Percentages", "Average", "Profit and Loss", "Reasoning"] },
  { label: "Core Subjects", topics: ["DBMS", "SQL", "Operating Systems", "Computer Networks", "OOP", "Java", "Python"] },
  { label: "HR", topics: ["HR", "Behavioral Interviews", "Communication", "Teamwork", "Leadership"] }
];

const DashboardPage = ({ profile = {}, questions = [], history = [], loading = false }) => {
  const navigate = useNavigate();
  const weakTopics = profile?.progress?.weakTopics || [];
  const recommendedTopics = profile?.progress?.recommendedTopics || [];
  const roadmap = createRoadmap(profile);
  const companyPrep = questions.filter((question) => ["Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture"].includes(question.company)).slice(0, 6);

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

    return {
      testsTaken,
      accuracy,
      avgScore,
      bestAccuracy,
      consistency,
      momentum,
      recentHistory,
      topicHealth
    };
  }, [history, profile?.progress?.accuracy, profile?.progress?.testsTaken, recommendedTopics, weakTopics]);

  const readiness = Math.max(35, Math.round((analytics.accuracy + analytics.consistency) / 2));

  return (
    <div className="container-fluid py-4 snx-page-shell">
      <div className="snx-hero-card mb-4">
        <div className="row g-4 align-items-center">
          <div className="col-xl-8">
            <span className="snx-kicker">Performance Dashboard</span>
            <h1 className="snx-page-title mt-3">Welcome back, {profile?.name || "Learner"}</h1>
            <p className="snx-page-subtitle mb-0">
              Track your interview preparation across practice, mock tests, and AI interview rounds from one clean dashboard.
            </p>
            <div className="d-flex flex-wrap gap-2 mt-4">
              <Link to="/ai-interviewer" className="btn snx-btn-primary">Generate AI Interview</Link>
              <Link to="/practice" className="btn snx-btn-secondary">Continue Practice</Link>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="row g-3">
              <div className="col-sm-4 col-xl-12">
                <div className="snx-highlight-card primary">
                  <span>Readiness</span>
                  <strong>{readiness}%</strong>
                  <small>Blend of accuracy and consistency</small>
                </div>
              </div>
              <div className="col-sm-4 col-xl-12">
                <div className="snx-highlight-card success">
                  <span>Momentum</span>
                  <strong>{analytics.momentum >= 0 ? `+${analytics.momentum}` : analytics.momentum}</strong>
                  <small>Recent progress trend</small>
                </div>
              </div>
              <div className="col-sm-4 col-xl-12">
                <div className="snx-highlight-card neutral">
                  <span>Best Accuracy</span>
                  <strong>{analytics.bestAccuracy}%</strong>
                  <small>Top mock test result</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="snx-stat-card snx-stat-card-clean">
            <span className="snx-stat-label">Interviews Taken</span>
            <strong className="snx-stat-value">{analytics.testsTaken}</strong>
            <small className="snx-stat-meta">Completed mock rounds</small>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="snx-stat-card snx-stat-card-clean">
            <span className="snx-stat-label">Average Score</span>
            <strong className="snx-stat-value">{analytics.avgScore}</strong>
            <small className="snx-stat-meta">Recent mock average</small>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="snx-stat-card snx-stat-card-clean">
            <span className="snx-stat-label">Overall Accuracy</span>
            <strong className="snx-stat-value">{analytics.accuracy}%</strong>
            <small className="snx-stat-meta">Across your practice history</small>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="snx-stat-card snx-stat-card-clean">
            <span className="snx-stat-label">Consistency</span>
            <strong className="snx-stat-value">{analytics.consistency}%</strong>
            <small className="snx-stat-meta">Lower score swing is better</small>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-8">
          <div className="snx-surface-card h-100">
            <div className="snx-section-head">
              <div>
                <span className="snx-kicker">Performance Trend</span>
                <h2>Recent mock test accuracy</h2>
              </div>
              <button className="btn snx-btn-secondary" onClick={() => navigate("/history")}>Open History</button>
            </div>

            {loading && !analytics.recentHistory.length ? (
              <div className="snx-empty-state">
                <p className="mb-2">Loading your latest performance data...</p>
              </div>
            ) : analytics.recentHistory.length ? (
              <div className="snx-chart-grid">
                {analytics.recentHistory.map((item, index) => {
                  const accuracyValue = item.accuracy || 0;
                  return (
                    <div key={item._id || index} className="snx-bar-card">
                      <div className="snx-bar-track">
                        <div className="snx-bar-fill" style={{ height: `${Math.max(18, Math.min(100, accuracyValue))}%` }} />
                      </div>
                      <strong>{accuracyValue}%</strong>
                      <span>Test {index + 1}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="snx-empty-state">
                <h3>No interviews yet</h3>
                <p>Generate a mock test to start building your dashboard insights.</p>
                <button className="btn snx-btn-primary" onClick={() => navigate("/mock-tests")}>Generate Mock Test</button>
              </div>
            )}
          </div>
        </div>

        <div className="col-xl-4">
          <div className="snx-surface-card h-100">
            <div className="snx-section-head">
              <div>
                <span className="snx-kicker">Topic Readiness</span>
                <h2>Section-wise strength</h2>
              </div>
            </div>
            <div className="snx-topic-list">
              {analytics.topicHealth.map((item) => (
                <div key={item.label} className="snx-topic-card">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>{item.label}</strong>
                    <span>{item.score}%</span>
                  </div>
                  <div className="snx-topic-track">
                    <div className="snx-topic-fill" style={{ width: `${item.score}%` }} />
                  </div>
                  <small>{item.status}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-4">
          <div className="snx-surface-card h-100">
            <div className="snx-section-head">
              <div>
                <span className="snx-kicker">Recommended Topics</span>
                <h2>Your next best moves</h2>
              </div>
            </div>
            <div className="snx-chip-grid">
              {(recommendedTopics.length ? recommendedTopics : ["Arrays", "DBMS", "Operating Systems", "HR"]).slice(0, 8).map((topic) => (
                <button key={topic} className="snx-chip-button" onClick={() => navigate(`/questions?topic=${encodeURIComponent(topic)}`)}>
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="snx-surface-card h-100">
            <div className="snx-section-head">
              <div>
                <span className="snx-kicker">4-Week Plan</span>
                <h2>Personalized roadmap</h2>
              </div>
            </div>
            <div className="snx-roadmap-list">
              {roadmap.map((item) => (
                <div className="snx-roadmap-item" key={item.week}>
                  <div className="snx-roadmap-week">{item.week}</div>
                  <div>{item.goal}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="snx-surface-card h-100">
            <div className="snx-section-head">
              <div>
                <span className="snx-kicker">Company Prep</span>
                <h2>Targeted practice</h2>
              </div>
            </div>
            <div className="snx-company-list">
              {companyPrep.length ? companyPrep.map((question) => (
                <button
                  key={question._id}
                  className="snx-company-card snx-company-card-clean"
                  onClick={() => navigate(`/questions?topic=${encodeURIComponent(question.topic)}&category=${encodeURIComponent(question.category)}`)}
                >
                  <span className="snx-company-tag">{question.company}</span>
                  <strong className="snx-company-title">{question.title.replace(/\s+Practice Variant\s+\d+$/i, "")}</strong>
                  <small className="snx-company-meta">{question.topic} | {question.category}</small>
                </button>
              )) : (
                <div className="snx-empty-inline">
                  Company-focused questions will appear here after the question bank loads.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
