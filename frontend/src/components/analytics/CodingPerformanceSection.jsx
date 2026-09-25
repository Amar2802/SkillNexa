import { FiCode, FiClock, FiCheckSquare, FiCheckCircle } from "react-icons/fi";
import Badge from "../ui/Badge";
import Progress from "../ui/Progress";

export const CodingPerformanceSection = ({
  totalAttempted = 0,
  totalCorrect = 0,
  difficultyBreakdown = {
    Easy: { total: 0, solved: 0 },
    Medium: { total: 0, solved: 0 },
    Hard: { total: 0, solved: 0 }
  },
  formatBreakdown = {
    Coding: 0,
    MCQ: 0,
    Subjective: 0
  },
  avgTimeSpent = 0
}) => {
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const formatSeconds = (sec) => {
    if (!sec || sec <= 0) return "—";
    if (sec < 60) return `${sec}s`;
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return remaining ? `${mins}m ${remaining}s` : `${mins}m`;
  };

  return (
    <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--snx-border-subtle)] dark:border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiCode className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Problem Practice & Coding Metrics</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Difficulty distribution, accuracy, and solving speed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--snx-surface-subtle)] border border-[var(--snx-border)] text-xs text-slate-600 dark:border-slate-850 dark:text-slate-300">
            <FiClock className="h-3.5 w-3.5 text-slate-400" />
            <span>Avg Speed:</span>
            <strong className="font-mono text-slate-900 dark:text-white">{formatSeconds(avgTimeSpent)}</strong>
          </div>
        </div>
      </div>

      {totalAttempted > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Difficulty Distribution (Easy / Medium / Hard) */}
          <div className="lg:col-span-2 space-y-3 p-4 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Difficulty Volume & Success Rate
            </span>

            <div className="space-y-3 pt-1">
              {["Easy", "Medium", "Hard"].map((diff) => {
                const data = difficultyBreakdown[diff] || { total: 0, solved: 0 };
                const pct = data.total > 0 ? Math.round((data.solved / data.total) * 100) : 0;
                const barVariant = diff === "Easy" ? "emerald" : diff === "Medium" ? "indigo" : "amber";

                return (
                  <div key={diff} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Badge difficulty={diff} size="sm" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {data.solved} of {data.total} solved
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {data.total > 0 ? `${pct}%` : "—"}
                      </span>
                    </div>
                    <Progress value={pct} size="sm" variant={barVariant} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Formats & Overall Stats */}
          <div className="space-y-3 p-4 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Attempted Formats
              </span>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Coding Problems</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{formatBreakdown.Coding || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Descriptive Concepts</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{formatBreakdown.Subjective || 0}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Technical MCQs</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{formatBreakdown.MCQ || 0}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--snx-border-subtle)] dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Overall Accuracy:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{accuracy}%</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center rounded-xl border border-dashed border-[var(--snx-border)] text-xs text-slate-400 dark:border-slate-800">
          No coding or problem practice activity logged yet.
        </div>
      )}
    </div>
  );
};

export default CodingPerformanceSection;
