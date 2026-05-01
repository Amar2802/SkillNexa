import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardStatCard from "../components/dashboard/DashboardStatCard";
import TopicReadinessCard from "../components/dashboard/TopicReadinessCard";
import SectionLoader from "../components/ui/SectionLoader";

const createRoadmap = (profile) => {
  const weakTopics = profile?.progress?.weakTopics || [];
  const recommended = profile?.progress?.recommendedTopics || [];
  const focus = [...new Set([...weakTopics, ...recommended])].filter(Boolean);
  const topics = focus.length ? focus : ["Arrays", "DBMS", "Operating Systems", "HR Communication"];

  return [
    { week: "Week 1", goal: `Strengthen ${topics[0]} fundamentals and close quick gaps.` },
    { week: "Week 2", goal: `Practice ${topics[1] || topics[0]} with targeted timed questions.` },
    { week: "Week 3", goal: `Revise ${topics[2] || topics[0]} and review recent mistakes.` },
    { week: "Week 4", goal: `Polish ${topics[3] || "communication"} with mock interview runs.` }
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

  const readiness = Math.max(35, Math.round((analytics.accuracy + analytics.consistency) / 2));

  if (loading && !history.length && !questions.length) {
    return (
      <div className="px-4 py-8 md:px-6">
        <SectionLoader title="Preparing your dashboard" subtitle="Loading analytics, recommendations, and recent practice history." />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="px-4 py-6 md:px-6"
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="snx-panel-strong overflow-hidden p-6 md:p-8">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="snx-badge">Performance Dashboard</span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                Welcome back, {profile?.name || "Learner"}.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
                Track your software interview preparation across question practice, mock tests, and AI interview rounds with a portfolio-ready analytics workspace.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/ai-interviewer" className="snx-button-primary no-underline">Generate AI Interview</Link>
                <Link to="/practice" className="snx-button-secondary no-underline">Continue Practice</Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-5 text-white shadow-[0_22px_60px_rgba(99,102,241,0.28)]">
                <p className="text-xs uppercase tracking-[0.24em] text-white/70">Readiness</p>
                <p className="mt-3 text-4xl font-semibold">{readiness}%</p>
                <p className="mt-2 text-sm text-white/80">A blended score across accuracy and consistency.</p>
              </div>
              <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 text-white shadow-[0_22px_60px_rgba(34,197,94,0.24)]">
                <p className="text-xs uppercase tracking-[0.24em] text-white/70">Momentum</p>
                <p className="mt-3 text-4xl font-semibold">{analytics.momentum >= 0 ? `+${analytics.momentum}` : analytics.momentum}</p>
                <p className="mt-2 text-sm text-white/80">Recent accuracy shift across your latest attempts.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Focus Queue</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">{analytics.upcomingFocus.length || 4}</p>
                <p className="mt-2 text-sm text-slate-500">Recommended topics queued for your next revision block.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardStatCard label="Interviews Taken" value={analytics.testsTaken} caption="Completed mock rounds and test submissions." />
          <DashboardStatCard label="Average Score" value={analytics.avgScore} caption="Based on your most recent mock test results." accent="from-emerald-500 to-emerald-600" />
          <DashboardStatCard label="Overall Accuracy" value={`${analytics.accuracy}%`} caption="Current answer accuracy across your preparation data." accent="from-slate-800 to-slate-700" />
          <DashboardStatCard label="Consistency" value={`${analytics.consistency}%`} caption="A steadier score trend usually means better interview readiness." accent="from-brand-600 to-emerald-500" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="snx-panel-strong p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="snx-badge">Performance Trend</span>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Recent mock test accuracy</h2>
              </div>
              <button className="snx-button-secondary" onClick={() => navigate("/history")}>Open History</button>
            </div>

            {analytics.recentHistory.length ? (
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="grid min-h-[280px] grid-cols-3 gap-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-5 sm:grid-cols-6">
                  {analytics.recentHistory.map((item, index) => {
                    const accuracyValue = item.accuracy || 0;
                    return (
                      <div key={item._id || index} className="flex flex-col items-center justify-end gap-3">
                        <div className="flex h-44 w-full items-end rounded-2xl bg-white p-2">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(16, Math.min(100, accuracyValue))}%` }}
                            transition={{ delay: index * 0.05 }}
                            className="w-full rounded-2xl bg-gradient-to-t from-brand-500 to-emerald-400"
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-slate-900">{accuracyValue}%</p>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Test {index + 1}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Best Accuracy</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">{analytics.bestAccuracy}%</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Momentum</p>
                    <p className={`mt-2 text-3xl font-semibold ${analytics.momentum >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {analytics.momentum >= 0 ? `+${analytics.momentum}` : analytics.momentum} pts
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Weak Topics</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-950">{weakTopics.length}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-14 text-center">
                <p className="text-lg font-semibold text-slate-950">No interviews yet</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Start with a mock test or AI interview round to unlock trend analytics, readiness signals, and topic health.
                </p>
                <button className="snx-button-primary mt-6" onClick={() => navigate("/mock-tests")}>Generate Mock Test</button>
              </div>
            )}
          </div>

          <div className="snx-panel-strong p-6">
            <span className="snx-badge">Topic Readiness</span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Section-wise strength</h2>
            <div className="mt-6 space-y-4">
              {analytics.topicHealth.map((item) => (
                <TopicReadinessCard key={item.label} label={item.label} score={item.score} status={item.status} />
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr_0.9fr]">
          <div className="snx-panel-strong p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <span className="snx-badge">Recommended Topics</span>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Your next best moves</h2>
              </div>
              <button className="snx-button-secondary" onClick={() => navigate("/questions")}>Question Bank</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {(recommendedTopics.length ? recommendedTopics : ["Arrays", "DBMS", "Operating Systems", "HR"]).slice(0, 8).map((topic) => (
                <button key={topic} className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700 transition hover:-translate-y-0.5" onClick={() => navigate(`/questions?topic=${encodeURIComponent(topic)}`)}>
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="snx-panel-strong p-6">
            <span className="snx-badge">4-Week Plan</span>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Personalized roadmap</h2>
            <div className="mt-6 space-y-4">
              {roadmap.map((item, index) => (
                <motion.div key={item.week} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="flex gap-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">{item.week}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.goal}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="snx-panel-strong p-6">
              <span className="snx-badge">Company Prep</span>
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Targeted practice</h2>
              <div className="mt-5 space-y-3">
                {companyPrep.length ? companyPrep.map((question) => (
                  <button
                    key={question._id}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50"
                    onClick={() => navigate(`/questions?topic=${encodeURIComponent(question.topic)}&category=${encodeURIComponent(question.category)}`)}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">{question.company}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">{question.title.replace(/\s+Practice Variant\s+\d+$/i, "")}</p>
                    <p className="mt-1 text-xs text-slate-500">{question.topic} | {question.category}</p>
                  </button>
                )) : <p className="text-sm text-slate-500">Company-specific questions will appear here after the question bank loads.</p>}
              </div>
            </div>

            <div className="snx-panel-strong p-6">
              <span className="snx-badge">Recent Activity</span>
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Latest attempts</h2>
              <div className="mt-5 space-y-3">
                {history.length ? history.slice(0, 4).map((item) => (
                  <button key={item._id} className="w-full rounded-3xl border border-slate-200 bg-slate-50/80 p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-200" onClick={() => navigate("/history")}>
                    <p className="text-sm font-semibold text-slate-950">{item.test?.title || "Mock Test"}</p>
                    <p className="mt-1 text-xs text-slate-500">Score: {item.score || 0} | Accuracy: {item.accuracy || 0}%</p>
                  </button>
                )) : (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/60 p-4">
                    <p className="text-sm text-slate-500">No mock test history yet. Start your first round and your recent activity will show up here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
