import { FiCheckSquare, FiBarChart2, FiZap, FiCompass, FiTrendingUp } from "react-icons/fi";

export const ProfileStatsRow = ({
  problemsSolved = 0,
  testsCompleted = 0,
  interviewsCompleted = 0,
  topicsCompleted = 0,
  streakCount = 0
}) => {
  const stats = [
    {
      label: "Problems Solved",
      value: problemsSolved,
      icon: FiCheckSquare,
      color: "indigo"
    },
    {
      label: "Tests Completed",
      value: testsCompleted,
      icon: FiBarChart2,
      color: "sky"
    },
    {
      label: "Interviews Taken",
      value: interviewsCompleted,
      icon: FiZap,
      color: "purple"
    },
    {
      label: "Topics Mastered",
      value: topicsCompleted,
      icon: FiCompass,
      color: "emerald"
    },
    {
      label: "Active Streak",
      value: `${streakCount} ${streakCount === 1 ? "day" : "days"}`,
      icon: FiTrendingUp,
      color: "amber"
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-3 p-4 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] shadow-subtle dark:border-slate-800"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
              s.color === "indigo" ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400" :
              s.color === "sky" ? "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400" :
              s.color === "purple" ? "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400" :
              s.color === "emerald" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400" :
              "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
            }`}>
              <Icon className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate">
                {s.label}
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {s.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfileStatsRow;
