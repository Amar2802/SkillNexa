import { FiCheckSquare, FiBarChart2, FiZap, FiCompass, FiTrendingUp } from "react-icons/fi";

export const PreparationSummary = ({
  problemsAttempted = 0,
  overallAccuracy = 0,
  testsCompleted = 0,
  averageTestScore = 0,
  interviewsCompleted = 0,
  averageInterviewScore = 0,
  roadmapCompletion = 0,
  completedTopicsCount = 0,
  streakCount = 0
}) => {
  const cards = [
    {
      label: "Problems Practiced",
      value: problemsAttempted,
      context: problemsAttempted > 0 ? `${overallAccuracy}% overall accuracy` : "No problems attempted",
      icon: FiCheckSquare,
      color: "indigo"
    },
    {
      label: "Tests Completed",
      value: testsCompleted,
      context: testsCompleted > 0 ? `${averageTestScore}% average score` : "No mock tests taken",
      icon: FiBarChart2,
      color: "sky"
    },
    {
      label: "Mock Interviews",
      value: interviewsCompleted,
      context: interviewsCompleted > 0 ? `${averageInterviewScore}% average score` : "No interviews taken",
      icon: FiZap,
      color: "purple"
    },
    {
      label: "Learning Progress",
      value: `${roadmapCompletion}%`,
      context: `${completedTopicsCount} topics mastered`,
      icon: FiCompass,
      color: "emerald"
    },
    {
      label: "Current Streak",
      value: `${streakCount} ${streakCount === 1 ? "day" : "days"}`,
      context: streakCount > 0 ? "Consecutive active days" : "Practice today to start",
      icon: FiTrendingUp,
      color: "amber"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className="flex flex-col justify-between p-4 rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] shadow-subtle dark:border-slate-800"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {c.label}
              </span>
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                c.color === "indigo" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400" :
                c.color === "sky" ? "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400" :
                c.color === "purple" ? "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400" :
                c.color === "emerald" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400" :
                "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
              }`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>

            <div>
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {c.value}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {c.context}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PreparationSummary;
