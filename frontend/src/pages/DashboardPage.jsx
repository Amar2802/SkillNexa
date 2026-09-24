import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiActivity, FiBarChart2, FiCompass, FiTrendingUp, FiCpu, FiBookOpen, FiArrowRight, FiZap } from "react-icons/fi";
import EvaluationAnalyticsPanel from "../components/evaluation/EvaluationAnalyticsPanel";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
};

const createRoadmap = (profile) => {
  const weakTopics = profile?.progress?.weakTopics || [];
  const recommended = profile?.progress?.recommendedTopics || [];
  const focus = [...new Set([...weakTopics, ...recommended])].filter(Boolean);
  const topics = focus.length ? focus : ["Arrays & Strings", "SQL & DBMS", "Operating Systems", "System Design"];

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
  { label: "Core Tech", topics: ["DBMS", "SQL", "Operating Systems", "Computer Networks", "OOP"] },
  { label: "System & HR", topics: ["HR", "Behavioral Interviews", "Communication", "Leadership"] }
];

const DashboardPage = ({ profile = {}, questions = [], history = [], loading = false }) => {
  const navigate = useNavigate();
  const weakTopics = profile?.progress?.weakTopics || [];
  const recommendedTopics = profile?.progress?.recommendedTopics || [];
  const roadmap = createRoadmap(profile);
  const companyPrep = questions
    .filter((q) => ["Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture", "Adobe", "Meta"].includes(q.company))
    .slice(0, 6);

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
    { label: "AI Readiness Score", value: `${evalAnalytics.aiReadinessScore || profile?.progress?.aiReadinessScore || readiness}%`, meta: "Evaluated by AI Engine", icon: FiActivity, color: "from-indigo-500 to-purple-600" },
    { label: "Avg Interview Score", value: `${evalAnalytics.averageScore || profile?.progress?.averageInterviewScore || 85}/100`, meta: "Across live rounds", icon: FiBarChart2, color: "from-emerald-500 to-teal-600" },
    { label: "Strongest Skill Area", value: evalAnalytics.bestTopic || "Data Structures", meta: "Top performance domain", icon: FiCompass, color: "from-amber-500 to-orange-600" },
    { label: "Improvement Trend", value: `${evalAnalytics.improvementRate >= 0 ? "+" : ""}${evalAnalytics.improvementRate || 14}%`, meta: "Compared to last week", icon: FiTrendingUp, color: "from-pink-500 to-rose-600" }
  ];

  const sideStats = [
    { label: "Accuracy Rate", value: `${analytics.accuracy}%` },
    { label: "Personal Best", value: `${analytics.bestAccuracy}%` },
    { label: "Consistency", value: `${analytics.consistency}%` },
    { label: "Weak Spots", value: weakTopics.length || 0 }
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageHeader
        kicker="Student Control Center"
        title={`Welcome back, ${profile?.name || "Learner"} 👋`}
        description="Track your performance metrics, practice live coding, and complete AI interviews."
        actions={(
          <div className="flex items-center gap-3">
            <Link to="/ai-interviewer" className="snx-btn-primary group">
              <FiZap className="h-4 w-4 transition-transform group-hover:scale-125" />
              <span>Start AI Interview</span>
            </Link>
            <Link to="/practice" className="snx-btn-secondary">
              <FiCpu className="h-4 w-4" />
              <span>Practice IDE</span>
            </Link>
          </div>
        )}
      />

      {/* Gamification: Streak Tracker & Preparation Calendar */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Streak Flame Card */}
        <motion.div variants={itemVariants} className="md:col-span-1 snx-glass bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white flex flex-col justify-between p-6 rounded-3xl border-0 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 -mr-6 -mt-6 h-36 w-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-indigo-400/20 blur-lg pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">Daily Streak</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md">
                Active Streak
              </span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-orange-400 backdrop-blur-md shadow-inner">
                <FiZap className="h-8 w-8 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-extrabold text-white tracking-tight">{profile?.streakCount || 5} Days</span>
                <span className="text-xs text-indigo-200">Keep up the daily practice!</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-indigo-100 leading-relaxed font-medium">
            Practicing daily builds key muscle memory for technical interview rounds.
          </p>
        </motion.div>

        {/* Weekly Activity Tracker */}
        <motion.div variants={itemVariants} className="md:col-span-2 snx-panel flex flex-col justify-between p-6 rounded-3xl">
          <div>
            <span className="snx-kicker">Activity Tracker</span>
            <h3 className="snx-heading-3 mt-1 text-slate-900 dark:text-white">7-Day Preparation Calendar</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Light up your streak rings by completing mock tests or coding practice.</p>
          </div>
          
          <div className="mt-6 flex justify-between gap-2 max-w-md mx-auto w-full">
            {weeklyDays.map((day) => (
              <div key={day.dateStr} className="flex flex-col items-center gap-2">
                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border-2 text-xs font-bold transition-all duration-300 ${
                  day.active
                    ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : day.isToday
                      ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 font-extrabold ring-4 ring-indigo-500/15"
                      : "border-slate-200 text-slate-400 dark:border-slate-800"
                }`}>
                  {day.active ? "✓" : day.name[0]}
                </div>
                <span className={`text-[10px] font-semibold ${day.isToday ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-400"}`}>
                  {day.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="snx-grid-auto">
        {statCards.map(({ label, value, meta, icon: Icon, color }) => (
          <motion.div key={label} variants={itemVariants} className="snx-panel hover:-translate-y-1 transition-transform duration-200">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="snx-label">{label}</span>
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-md shadow-indigo-500/10`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="snx-stat-value text-2xl font-extrabold">{value}</div>
            <p className="snx-stat-label mt-1 text-xs text-slate-400">{meta}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Dashboard Layout */}
      <div className="snx-dashboard-layout">
        <div className="space-y-6">
          <motion.div variants={itemVariants} className="snx-panel rounded-3xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <span className="snx-kicker">Trend Analytics</span>
                <h2 className="snx-heading-3 mt-1">Recent Mock Test Accuracy</h2>
              </div>
              <button type="button" className="snx-btn-secondary snx-btn-sm" onClick={() => navigate("/history")}>
                View History
              </button>
            </div>
            {loading && !analytics.recentHistory.length ? (
              <div className="h-40 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
            ) : analytics.recentHistory.length ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 pt-2">
                {analytics.recentHistory.map((item, index) => {
                  const accuracyValue = item.accuracy || 85;
                  return (
                    <div key={item._id || index} className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                      <div className="flex h-28 w-8 items-end rounded-full bg-slate-200/80 dark:bg-slate-700/80 p-0.5">
                        <div
                          className="w-full rounded-full bg-gradient-to-t from-indigo-600 via-purple-500 to-pink-500 shadow-sm"
                          style={{ height: `${Math.max(16, Math.min(100, accuracyValue))}%` }}
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{accuracyValue}%</div>
                        <div className="text-[10px] font-semibold text-slate-400">Round {index + 1}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No mock test records yet"
                description="Complete a timed mock test to view real-time accuracy charts."
                action={<button type="button" className="snx-btn-primary" onClick={() => navigate("/mock-tests")}>Start Mock Test</button>}
              />
            )}
          </motion.div>

          <div className="snx-grid-2">
            <motion.div variants={itemVariants} className="snx-panel rounded-3xl">
              <span className="snx-kicker">Recommended Practice</span>
              <h2 className="snx-heading-3 mt-1">Recommended Topics</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {(recommendedTopics.length ? recommendedTopics : ["Arrays", "DBMS", "OS", "System Design", "React", "Python"]).slice(0, 8).map((topic) => (
                  <button key={topic} type="button" className="snx-badge-primary hover:scale-105 transition-transform" onClick={() => navigate(`/questions?topic=${encodeURIComponent(topic)}`)}>
                    {topic}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="snx-panel rounded-3xl">
              <span className="snx-kicker">4-Week Mastery</span>
              <h2 className="snx-heading-3 mt-1">Custom Learning Roadmap</h2>
              <div className="mt-4 space-y-2.5">
                {roadmap.map((item) => (
                  <div key={item.week} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/60 p-3 dark:border-slate-800 dark:bg-slate-800/60">
                    <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-sm">
                      {item.week.replace("Week ", "")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="snx-label">{item.week}</div>
                      <p className="mt-0.5 truncate text-xs text-slate-600 dark:text-slate-300">{item.goal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="snx-panel rounded-3xl">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div>
                <span className="snx-kicker">Top Tech Companies</span>
                <h2 className="snx-heading-3 mt-1">Featured Questions</h2>
              </div>
              <button type="button" className="snx-btn-secondary snx-btn-sm" onClick={() => navigate("/questions")}>
                View All Questions
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {companyPrep.length ? companyPrep.map((question) => (
                <button
                  key={question._id}
                  type="button"
                  className="group rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/80"
                  onClick={() => navigate(`/practice/${question._id}`)}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="snx-badge-primary font-bold">{question.company}</span>
                    <span className="text-xs font-semibold text-slate-400">{question.topic}</span>
                  </div>
                  <div className="line-clamp-1 text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                    {question.title.replace(/\s+Practice Variant\s+\d+$/i, "")}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="capitalize">{question.difficulty || "Medium"}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                      Solve <FiArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </button>
              )) : (
                <EmptyState title="Loading questions" description="Company questions will appear shortly." className="col-span-full !border-0 !bg-transparent !py-8" />
              )}
            </div>
          </motion.div>
        </div>

        <aside className="space-y-6">
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
            {sideStats.map((card) => (
              <div key={card.label} className="snx-panel !p-4 rounded-2xl text-center">
                <div className="snx-label">{card.label}</div>
                <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">{card.value}</div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="snx-panel rounded-3xl">
            <span className="snx-kicker">Skill Mastery</span>
            <h2 className="snx-heading-3 mt-1">Section Strength</h2>
            <div className="mt-4 space-y-3.5">
              {analytics.topicHealth.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200/80 bg-white/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/80">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <strong className="text-slate-900 dark:text-white font-bold">{item.label}</strong>
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{item.score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    />
                  </div>
                  <p className="mt-1.5 text-xs font-semibold text-slate-400">{item.status}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </aside>
      </div>

      <EvaluationAnalyticsPanel analytics={evalAnalytics} />
    </motion.div>
  );
};

export default DashboardPage;

