import { FiCheckCircle, FiBarChart2, FiZap, FiTarget } from "react-icons/fi";
import Card from "../ui/Card";

export const StatsOverview = ({ profile = {}, history = [] }) => {
  const testsTaken =
    profile?.progress?.testsTaken ??
    history.filter((h) => h.type === "test" || h.title?.toLowerCase().includes("test")).length;

  const solvedCount =
    profile?.progress?.questionsSolved ??
    (Array.isArray(profile?.progress?.solvedQuestions) ? profile.progress.solvedQuestions.length : 0);

  const streak = profile?.streakCount || (history.length > 0 ? 1 : 0);
  const accuracy = profile?.progress?.accuracy || 0;

  const stats = [
    {
      label: "Problems Solved",
      value: solvedCount,
      delta: solvedCount > 0 ? "Active" : "Ready",
      icon: FiCheckCircle,
      description: "Across algorithms, data structures & system design"
    },
    {
      label: "Tests Completed",
      value: testsTaken,
      delta: testsTaken > 0 ? `${testsTaken} taken` : "0 taken",
      icon: FiBarChart2,
      description: "Timed full-length technical assessments"
    },
    {
      label: "Current Streak",
      value: `${streak} ${streak === 1 ? "day" : "days"}`,
      delta: streak >= 3 ? "Consistent" : "Keep going",
      icon: FiZap,
      description: "Consecutive daily interview prep rounds"
    },
    {
      label: "Average Accuracy",
      value: accuracy > 0 ? `${accuracy}%` : "Benchmark",
      delta: accuracy >= 75 ? "Strong" : accuracy > 0 ? "Developing" : "New",
      icon: FiTarget,
      description: "Calculated across your evaluated submissions"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map(({ label, value, delta, icon: Icon, description }) => (
        <Card key={label} variant="statistics" className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {label}
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--snx-surface-subtle)] text-slate-600 dark:text-slate-300">
              <Icon className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {value}
            </span>
            {delta && (
              <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {delta}
              </span>
            )}
          </div>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500 truncate">
            {description}
          </p>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
