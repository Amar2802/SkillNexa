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
    <div className="space-y-6">
      <PageHeader
        kicker="AI performance dashboard"
        title={`Welcome back, ${profile?.name || "Learner"}`}
        description="Track interview progress, revisit company-focused questions, and keep your practice momentum visible from one premium AI workspace."
        actions={(
          <>
            <Link to="/ai-interviewer" className="snx-btn-accent">Start Interview Loop</Link>
            <Link to="/practice" className="snx-btn-secondary">Continue Practice</Link>
          </>
        )}
        aside={(
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {statCards.map(({ label, value, meta, icon: Icon }) => (
              <div key={label} className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 text-brand-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</div>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{value}</div>
                <div className="mt-2 text-sm text-slate-500">{meta}</div>
              </div>
            ))}
          </div>
        )}
      />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Overall Accuracy", value: `${analytics.accuracy}%`, meta: "Across your practice history" },
          { label: "Best Accuracy", value: `${analytics.bestAccuracy}%`, meta: "Strongest mock performance" },
          { label: "Consistency", value: `${analytics.consistency}%`, meta: "Lower score swings are healthier" },
          { label: "Weak Topics", value: weakTopics.length || 0, meta: "Focus areas currently identified" }
        ].map((card) => (
          <SurfaceCard key={card.label}>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{card.label}</div>
            <div className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{card.value}</div>
            <p className="mt-2 text-sm text-slate-500">{card.meta}</p>
          </SurfaceCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <SurfaceCard strong>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="snx-kicker">Performance trend</span>
              <h2 className="snx-heading mt-4">Recent mock test accuracy</h2>
            </div>
            <button className="snx-btn-secondary" onClick={() => navigate("/history")}>
              Open History
            </button>
          </div>

          {loading && !analytics.recentHistory.length ? (
            <div className="mt-6 h-64 animate-pulse rounded-[24px] bg-slate-100" />
          ) : analytics.recentHistory.length ? (
            <div className="mt-8 grid gap-4 md:grid-cols-6">
              {analytics.recentHistory.map((item, index) => {
                const accuracyValue = item.accuracy || 0;
                return (
                  <div key={item._id || index} className="flex flex-col items-center gap-3 rounded-[24px] border border-slate-200/70 bg-white/70 p-4">
                    <div className="relative flex h-48 w-10 items-end rounded-full bg-slate-100">
                      <div
                        className="w-full rounded-full bg-gradient-to-t from-brand-500 to-accent-500"
                        style={{ height: `${Math.max(18, Math.min(100, accuracyValue))}%` }}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-slate-950">{accuracyValue}%</div>
                      <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Test {index + 1}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                title="No interviews yet"
                description="Generate a mock test to unlock trend charts, readiness signals, and accuracy history."
                action={<button className="snx-btn-accent" onClick={() => navigate("/mock-tests")}>Generate Mock Test</button>}
              />
            </div>
          )}
        </SurfaceCard>

        <SurfaceCard strong>
          <div className="space-y-4">
            <div>
              <span className="snx-kicker">Topic readiness</span>
              <h2 className="snx-heading mt-4">Section-wise strength</h2>
            </div>
            <div className="space-y-4">
              {analytics.topicHealth.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <strong className="text-slate-950">{item.label}</strong>
                    <span className="text-sm font-semibold text-slate-500">{item.score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: `${item.score}%` }} />
                  </div>
                  <p className="mt-3 text-sm text-slate-500">{item.status}</p>
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SurfaceCard strong>
          <div className="space-y-5">
            <div>
              <span className="snx-kicker">Recommended topics</span>
              <h2 className="snx-heading mt-4">What to practice next</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {(recommendedTopics.length ? recommendedTopics : ["Arrays", "DBMS", "Operating Systems", "HR"]).slice(0, 8).map((topic) => (
                <button
                  key={topic}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-slate-950"
                  onClick={() => navigate(`/questions?topic=${encodeURIComponent(topic)}`)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard strong>
          <div className="space-y-5">
            <div>
              <span className="snx-kicker">4-week plan</span>
              <h2 className="snx-heading mt-4">Personalized roadmap</h2>
            </div>
            <div className="space-y-4">
              {roadmap.map((item) => (
                <div key={item.week} className="flex gap-4 rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                    {item.week.replace("Week ", "")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">{item.week}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.goal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard strong>
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="snx-kicker">Company prep</span>
                <h2 className="snx-heading mt-4">Targeted questions</h2>
              </div>
              <button className="snx-btn-secondary" onClick={() => navigate("/questions")}>
                Explore
              </button>
            </div>
            <div className="space-y-3">
              {companyPrep.length ? companyPrep.map((question) => (
                <button
                  key={question._id}
                  className="w-full rounded-[24px] border border-slate-200/70 bg-white/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[0_18px_36px_rgba(20,184,166,0.12)]"
                  onClick={() => navigate(`/questions?topic=${encodeURIComponent(question.topic)}&category=${encodeURIComponent(question.category)}`)}
                >
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="snx-badge">{question.company}</span>
                    <span className="snx-badge">{question.category}</span>
                  </div>
                  <div className="text-base font-semibold text-slate-950">{question.title.replace(/\s+Practice Variant\s+\d+$/i, "")}</div>
                  <div className="mt-2 text-sm text-slate-500">{question.topic}</div>
                </button>
              )) : (
                <EmptyState
                  title="Company-focused questions will appear here"
                  description="As soon as the question bank loads, this area will spotlight company-tagged interview questions for focused revision."
                  className="bg-transparent p-0 shadow-none"
                />
              )}
            </div>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
};

export default DashboardPage;
