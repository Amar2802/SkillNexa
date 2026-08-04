import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiActivity, FiBarChart2, FiCompass, FiTrendingUp } from "react-icons/fi";
import EvaluationAnalyticsPanel from "../components/evaluation/EvaluationAnalyticsPanel";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";

const createRoadmap = (profile) => {
  const weakTopics = profile?.progress?.weakTopics || [];
  const recommended = profile?.progress?.recommendedTopics || [];
  const focus = [...new Set([...weakTopics, ...recommended])].filter(Boolean);
  const topics = focus.length ? focus : ["Arrays", "DBMS", "Operating Systems", "HR Communication"];

  return [
    { week: "Week 1", goal: `Sharpen ${topics[0]} fundamentals with guided revision.` },
    { week: "Week 2", goal: `Timed exercises for ${topics[1] || topics[0]}.` },
    { week: "Week 3", goal: `Review mistakes from ${topics[2] || topics[0]}.` },
    { week: "Week 4", goal: `Mock rounds on ${topics[3] || "communication"}.` }
  ];
};

const baseAnalyticsBuckets = [
  { label: "DSA", topics: ["Arrays", "Strings", "Linked List", "Trees", "Graphs", "Dynamic Programming"] },
  { label: "Aptitude", topics: ["Probability", "Time and Work", "Percentages", "Reasoning"] },
  { label: "Core", topics: ["DBMS", "SQL", "Operating Systems", "Computer Networks", "OOP"] },
  { label: "HR", topics: ["HR", "Behavioral Interviews", "Communication", "Leadership"] }
];

const DashboardPage = ({ profile = {}, questions = [], history = [], loading = false }) => {
  const navigate = useNavigate();
  const weakTopics = profile?.progress?.weakTopics || [];
  const recommendedTopics = profile?.progress?.recommendedTopics || [];
  const roadmap = createRoadmap(profile);
  const companyPrep = questions
    .filter((q) => ["Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture", "Adobe", "Meta"].includes(q.company))
    .slice(0, 5);

  const analytics = useMemo(() => {
    const recentHistory = [...history].slice(0, 6).reverse();
    const testsTaken = profile?.progress?.testsTaken || 0;
    const accuracy = profile?.progress?.accuracy || 0;
    const avgScore = recentHistory.length
      ? Math.round(recentHistory.reduce((sum, item) => sum + (item.score || 0), 0) / recentHistory.length)
      : 0;
    const bestAccuracy = recentHistory.length ? Math.max(...recentHistory.map((item) => item.accuracy || 0)) : accuracy;
    const recentAccuracies = recentHistory.map((item) => item.accuracy || 0);
    const consistency = recentAccuracies.length > 1
      ? Math.max(0, 100 - Math.round((Math.max(...recentAccuracies) - Math.min(...recentAccuracies)) * 1.2))
      : accuracy;
    const momentum = recentHistory.length > 1
      ? (recentHistory[recentHistory.length - 1]?.accuracy || 0) - (recentHistory[0]?.accuracy || 0)
      : 0;

    const topicHealth = baseAnalyticsBuckets.map((bucket) => {
      const weaknessHits = weakTopics.filter((topic) =>
        bucket.topics.some((entry) => topic.toLowerCase().includes(entry.toLowerCase()) || entry.toLowerCase().includes(topic.toLowerCase()))
      ).length;
      const recommendationHits = recommendedTopics.filter((topic) =>
        bucket.topics.some((entry) => topic.toLowerCase().includes(entry.toLowerCase()) || entry.toLowerCase().includes(topic.toLowerCase()))
      ).length;
      const baseScore = 82 - weaknessHits * 16 + recommendationHits * 6;
      return {
        label: bucket.label,
        score: Math.max(28, Math.min(96, baseScore)),
        status: weaknessHits > 1 ? "Needs focus" : weaknessHits === 1 ? "Improving" : "Strong"
      };
    });

    return { testsTaken, accuracy, avgScore, bestAccuracy, consistency, momentum, recentHistory, topicHealth };
  }, [history, profile?.progress?.accuracy, profile?.progress?.testsTaken, recommendedTopics, weakTopics]);

  const readiness = Math.max(35, Math.round((analytics.accuracy + analytics.consistency) / 2));
  const evalAnalytics = profile?.analytics?.evaluation || {};

  const statCards = [
    { label: "AI readiness", value: evalAnalytics.aiReadinessScore || profile?.progress?.aiReadinessScore || readiness, meta: "From AI evaluations", icon: FiActivity },
    { label: "Avg interview score", value: evalAnalytics.averageScore || profile?.progress?.averageInterviewScore || 0, meta: "Across evaluated answers", icon: FiBarChart2 },
    { label: "Best topic", value: evalAnalytics.bestTopic || "—", meta: "Strongest area", icon: FiCompass },
    { label: "Improvement", value: `${evalAnalytics.improvementRate >= 0 ? "+" : ""}${evalAnalytics.improvementRate || 0}`, meta: "Score trend", icon: FiTrendingUp }
  ];

  const sideStats = [
    { label: "Accuracy", value: `${analytics.accuracy}%` },
    { label: "Best", value: `${analytics.bestAccuracy}%` },
    { label: "Consistency", value: `${analytics.consistency}%` },
    { label: "Weak topics", value: weakTopics.length || 0 }
  ];

  const weeklyDays = useMemo(() => {
    const days = [];
    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const isToday = i === 0;
      const hasTest = history.some(h => {
        if (!h.createdAt) return false;
        return new Date(h.createdAt).toISOString().split('T')[0] === dateStr;
      });
      const active = hasTest || profile.lastActiveDate === dateStr;

      days.push({
        name: weekdayNames[d.getDay()],
        dateStr,
        isToday,
        active
      });
    }
    return days;
  }, [history, profile.lastActiveDate]);

  return (
    <div className="space-y-6 snx-fade-in">
      <PageHeader
        kicker="Performance dashboard"
        title={`Welcome back, ${profile?.name || "Learner"}`}
        description="Track progress and jump into your next practice session."
        actions={(
          <>
            <Link to="/ai-interviewer" className="snx-btn-primary">Start Interview</Link>
            <Link to="/practice" className="snx-btn-secondary">Practice</Link>
          </>
        )}
      />

      {/* Gamification: Streak Tracker & Preparation Calendar */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Streak Flame Card */}
        <div className="md:col-span-1 snx-panel-muted bg-gradient-to-br from-brand-600 to-indigo-800 text-white flex flex-col justify-between p-6 rounded-card border-0 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 -mr-6 -mt-6 h-32 w-32 rounded-full bg-white/5" />
          <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-white/5" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-200">Activity Streak</div>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-5xl font-extrabold">{profile?.streakCount || 1}</span>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-orange-400 animate-bounce">🔥 Days</span>
                <span className="text-[10px] text-indigo-200">Consecutive prep streak</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-indigo-100 leading-relaxed font-medium">
            Keep practicing daily! A streak helps build muscle memory for coding & system design.
          </p>
        </div>

        {/* Weekly Activity Tracker */}
        <div className="md:col-span-2 snx-panel-muted flex flex-col justify-between p-6">
          <div>
            <span className="snx-kicker">Habit Builder</span>
            <h3 className="snx-heading-3 mt-1 text-slate-custom-900 dark:text-white">Preparation Calendar</h3>
            <p className="text-xs text-slate-custom-500 mt-1">Light up the rings by attempting coding questions or mock tests.</p>
          </div>
          
          <div className="mt-6 flex justify-between gap-2 max-w-md mx-auto w-full">
            {weeklyDays.map((day) => (
              <div key={day.dateStr} className="flex flex-col items-center gap-2">
                <div className={`h-11 w-11 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-all duration-300 ${
                  day.active
                    ? "border-green-500 bg-green-500 text-white shadow-sm-soft"
                    : day.isToday
                      ? "border-brand-500 text-brand-650 animate-pulse font-extrabold"
                      : "border-slate-custom-200 text-slate-custom-400 dark:border-slate-custom-700"
                }`}>
                  {day.active ? "✓" : day.name[0]}
                </div>
                <span className={`text-[10px] font-semibold ${day.isToday ? "text-brand-600 dark:text-brand-400 font-bold" : "text-slate-custom-500"}`}>
                  {day.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="snx-grid-auto">
        {statCards.map(({ label, value, meta, icon: Icon }) => (
          <div key={label} className="snx-stat snx-card-elevated">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="snx-label">{label}</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-brand-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <div className="snx-stat-value">{value}</div>
            <p className="snx-stat-label mt-1">{meta}</p>
          </div>
        ))}
      </div>

      <div className="snx-dashboard-layout">
        <div className="space-y-6">
          <div className="snx-panel-muted">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <span className="snx-kicker">Performance</span>
                <h2 className="snx-heading-3 mt-1">Recent mock accuracy</h2>
              </div>
              <button type="button" className="snx-btn-secondary snx-btn-sm" onClick={() => navigate("/history")}>
                History
              </button>
            </div>
            {loading && !analytics.recentHistory.length ? (
              <div className="h-40 animate-pulse rounded-xl bg-slate-custom-200 dark:bg-slate-custom-700" />
            ) : analytics.recentHistory.length ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {analytics.recentHistory.map((item, index) => {
                  const accuracyValue = item.accuracy || 0;
                  return (
                    <div key={item._id || index} className="flex flex-col items-center gap-2 rounded-xl border border-slate-custom-200 bg-white p-3 dark:border-slate-custom-600 dark:bg-slate-custom-800">
                      <div className="flex h-24 w-8 items-end rounded-full bg-slate-custom-100 dark:bg-slate-custom-700">
                        <div
                          className="w-full rounded-full bg-gradient-to-t from-brand-600 to-brand-400"
                          style={{ height: `${Math.max(12, Math.min(100, accuracyValue))}%` }}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-slate-custom-900 dark:text-white">{accuracyValue}%</div>
                        <div className="text-[10px] uppercase tracking-wide text-slate-custom-500">T{index + 1}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No interviews yet"
                description="Generate a mock test to unlock trend charts."
                action={<button type="button" className="snx-btn-primary" onClick={() => navigate("/mock-tests")}>Generate Mock</button>}
              />
            )}
          </div>

          <div className="snx-grid-2">
            <div className="snx-panel-muted">
              <span className="snx-kicker">Recommended</span>
              <h2 className="snx-heading-3 mt-1">Topics to practice</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {(recommendedTopics.length ? recommendedTopics : ["Arrays", "DBMS", "OS", "HR"]).slice(0, 8).map((topic) => (
                  <button key={topic} type="button" className="snx-badge-primary" onClick={() => navigate(`/questions?topic=${encodeURIComponent(topic)}`)}>
                    {topic}
                  </button>
                ))}
              </div>
            </div>
            <div className="snx-panel-muted">
              <span className="snx-kicker">4-week plan</span>
              <h2 className="snx-heading-3 mt-1">Roadmap</h2>
              <div className="mt-4 space-y-2">
                {roadmap.map((item) => (
                  <div key={item.week} className="flex gap-3 rounded-xl border border-slate-custom-200 bg-white p-3 dark:border-slate-custom-600 dark:bg-slate-custom-800">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-semibold text-white">
                      {item.week.replace("Week ", "")}
                    </div>
                    <div>
                      <div className="snx-label">{item.week}</div>
                      <p className="mt-0.5 text-xs text-slate-custom-600 dark:text-slate-custom-400">{item.goal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="snx-panel-muted">
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <span className="snx-kicker">Company prep</span>
                <h2 className="snx-heading-3 mt-1">Featured questions</h2>
              </div>
              <button type="button" className="snx-btn-secondary snx-btn-sm" onClick={() => navigate("/questions")}>All</button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {companyPrep.length ? companyPrep.map((question) => (
                <button
                  key={question._id}
                  type="button"
                  className="rounded-xl border border-slate-custom-200 bg-white p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md-soft dark:border-slate-custom-600 dark:bg-slate-custom-800"
                  onClick={() => navigate(`/questions?topic=${encodeURIComponent(question.topic)}&category=${encodeURIComponent(question.category)}`)}
                >
                  <div className="mb-1 flex flex-wrap gap-1">
                    <span className="snx-badge-primary">{question.company}</span>
                    <span className="snx-badge">{question.category}</span>
                  </div>
                  <div className="line-clamp-1 text-sm font-semibold text-slate-custom-900 dark:text-white">
                    {question.title.replace(/\s+Practice Variant\s+\d+$/i, "")}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-custom-500">{question.topic}</div>
                </button>
              )) : (
                <EmptyState title="Loading questions" description="Company questions appear shortly." className="col-span-full !border-0 !bg-transparent !py-8" />
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {sideStats.map((card) => (
              <div key={card.label} className="snx-stat !p-4">
                <div className="snx-label">{card.label}</div>
                <div className="snx-stat-value mt-1">{card.value}</div>
              </div>
            ))}
          </div>
          <div className="snx-panel-muted">
            <span className="snx-kicker">Readiness</span>
            <h2 className="snx-heading-3 mt-1">Section strength</h2>
            <div className="mt-4 space-y-3">
              {analytics.topicHealth.map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-custom-200 bg-white p-3 dark:border-slate-custom-600 dark:bg-slate-custom-800">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <strong className="text-slate-custom-900 dark:text-white">{item.label}</strong>
                    <span className="font-semibold text-brand-600">{item.score}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-custom-100 dark:bg-slate-custom-700">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: `${item.score}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-custom-500">{item.status}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <EvaluationAnalyticsPanel analytics={evalAnalytics} />
    </div>
  );
};

export default DashboardPage;
