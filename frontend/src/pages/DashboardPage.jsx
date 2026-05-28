import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiActivity, FiArrowRight, FiBarChart2, FiClock, FiCompass, FiTrendingUp } from "react-icons/fi";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import SurfaceCard from "../components/ui/SurfaceCard";

const createRoadmap = (profile) => {
  const weakTopics = profile?.progress?.weakTopics || [];
  const recommended = profile?.progress?.recommendedTopics || [];
  const focus = [...new Set([...weakTopics, ...recommended])].filter(Boolean);
  const topics = focus.length ? focus : ["Arrays", "DBMS", "Operating Systems", "HR Communication"];

  return [
    { week: "Week 1", goal: `Sharpen ${topics[0]} fundamentals with guided revision and short practice loops.` },
    { week: "Week 2", goal: `Use timed exercises to improve confidence in ${topics[1] || topics[0]}.` },
    { week: "Week 3", goal: `Review mistakes from ${topics[2] || topics[0]} and refine how you explain solutions.` },
    { week: "Week 4", goal: `Run final mock rounds focused on ${topics[3] || "communication"} and delivery.` }
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
  const companyPrep = questions
    .filter((question) => ["Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture", "Adobe", "Meta"].includes(question.company))
    .slice(0, 6);

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

  const statCards = [
    { label: "Readiness", value: `${readiness}%`, meta: "Balance of accuracy and consistency", icon: FiActivity },
    { label: "Interviews Taken", value: analytics.testsTaken, meta: "Completed mock rounds", icon: FiBarChart2 },
    { label: "Average Score", value: analytics.avgScore, meta: "Recent mock average", icon: FiCompass },
    { label: "Momentum", value: analytics.momentum >= 0 ? `+${analytics.momentum}` : analytics.momentum, meta: "Recent progress trend", icon: FiTrendingUp }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="AI performance dashboard"
        title={`Welcome back, ${profile?.name || "Learner"}`}
        description="Track interview progress and keep your practice momentum visible."
        actions={(
          <>
            <Link to="/ai-interviewer" className="snx-btn-primary">Start Interview Loop</Link>
            <Link to="/practice" className="snx-btn-secondary">Continue Practice</Link>
          </>
        )}
        aside={(
          <div className="snx-grid-auto">
            {statCards.map(({ label, value, meta, icon: Icon }) => (
              <div key={label} className="snx-stat snx-card-elevated h-full">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="snx-label">{label}</span>
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="snx-stat-value">{value}</div>
                <p className="snx-stat-label mt-2">{meta}</p>
              </div>
            ))}
          </div>
        )}
      />

      <div className="snx-grid-auto">
        {[
          { label: "Overall Accuracy", value: `${analytics.accuracy}%`, meta: "Practice history" },
          { label: "Best Accuracy", value: `${analytics.bestAccuracy}%`, meta: "Best performance" },
          { label: "Consistency", value: `${analytics.consistency}%`, meta: "Score stability" },
          { label: "Weak Topics", value: weakTopics.length || 0, meta: "Focus areas" }
        ].map((card) => (
          <div key={card.label} className="snx-stat snx-card-elevated h-full">
            <div className="snx-label">{card.label}</div>
            <div className="snx-stat-value mt-3">{card.value}</div>
            <p className="snx-stat-label mt-2">{card.meta}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="snx-panel-muted">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <span className="snx-kicker">Performance trend</span>
              <h2 className="snx-heading-3 mt-2">Recent mock test accuracy</h2>
            </div>
            <button className="snx-btn-secondary snx-btn-sm" onClick={() => navigate("/history")}>
              History
            </button>
          </div>

          {loading && !analytics.recentHistory.length ? (
            <div className="h-64 animate-pulse rounded-lg bg-slate-custom-200" />
          ) : analytics.recentHistory.length ? (
            <div className="grid gap-4 md:grid-cols-6">
              {analytics.recentHistory.map((item, index) => {
                const accuracyValue = item.accuracy || 0;
                return (
                  <div key={item._id || index} className="snx-card-elevated flex flex-col items-center gap-3 rounded-lg border border-slate-custom-200 bg-white p-4 h-full">
                    <div className="relative flex h-48 w-10 items-end rounded-full bg-slate-custom-100">
                      <div
                        className="w-full rounded-full bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-500"
                        style={{ height: `${Math.max(18, Math.min(100, accuracyValue))}%` }}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-slate-custom-900">{accuracyValue}%</div>
                      <div className="snx-label mt-1">Test {index + 1}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <EmptyState
                title="No interviews yet"
                description="Generate a mock test to unlock trend charts and accuracy history."
                action={<button className="snx-btn-primary" onClick={() => navigate("/mock-tests")}>Generate Mock</button>}
              />
            </div>
          )}
        </div>

        <div className="snx-panel-muted">
          <div className="space-y-4">
            <div>
              <span className="snx-kicker">Topic readiness</span>
              <h2 className="snx-heading-3 mt-2">Section strength</h2>
            </div>
            <div className="space-y-4">
              {analytics.topicHealth.map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-custom-200 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <strong className="text-slate-custom-900 text-sm">{item.label}</strong>
                    <span className="snx-label">{item.score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-custom-100">
                    <div className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400" style={{ width: `${item.score}%` }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-custom-600">{item.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="snx-grid-3">
        <div className="snx-panel-muted">
          <div className="space-y-4">
            <div>
              <span className="snx-kicker">Recommended</span>
              <h2 className="snx-heading-3 mt-2">Topics to practice</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {(recommendedTopics.length ? recommendedTopics : ["Arrays", "DBMS", "OS", "HR"]).slice(0, 8).map((topic) => (
                <button
                  key={topic}
                  className="snx-badge-primary"
                  onClick={() => navigate(`/questions?topic=${encodeURIComponent(topic)}`)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="snx-panel-muted">
          <div className="space-y-4">
            <div>
              <span className="snx-kicker">4-week plan</span>
              <h2 className="snx-heading-3 mt-2">Your roadmap</h2>
            </div>
            <div className="space-y-3">
              {roadmap.map((item) => (
                <div key={item.week} className="flex gap-3 rounded-lg border border-slate-custom-200 bg-white p-3">
                  <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-semibold text-white">
                    {item.week.replace("Week ", "")}
                  </div>
                  <div>
                    <div className="snx-label">{item.week}</div>
                    <p className="mt-1 text-xs leading-5 text-slate-custom-600">{item.goal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="snx-panel-muted">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="snx-kicker">Company prep</span>
                <h2 className="snx-heading-3 mt-2">Questions</h2>
              </div>
              <button className="snx-btn-secondary snx-btn-sm" onClick={() => navigate("/questions")}>
                All
              </button>
            </div>
            <div className="space-y-2">
              {companyPrep.length ? companyPrep.map((question) => (
                <button
                  key={question._id}
                  className="w-full rounded-lg border border-slate-custom-200 bg-white p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md-soft snx-fade-in"
                  onClick={() => navigate(`/questions?topic=${encodeURIComponent(question.topic)}&category=${encodeURIComponent(question.category)}`)}
                >
                  <div className="mb-2 flex flex-wrap gap-1">
                    <span className="snx-badge-primary text-xs">{question.company}</span>
                    <span className="snx-badge text-xs">{question.category}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-custom-900 line-clamp-1">{question.title.replace(/\s+Practice Variant\s+\d+$/i, "")}</div>
                  <div className="mt-1 text-xs text-slate-custom-600">{question.topic}</div>
                </button>
              )) : (
                <EmptyState
                  title="Questions loading"
                  description="Company questions will appear here soon."
                  className="bg-transparent p-0 shadow-none"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
