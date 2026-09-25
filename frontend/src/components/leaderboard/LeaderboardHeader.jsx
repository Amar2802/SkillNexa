import { FiAward, FiInfo } from "react-icons/fi";

export const LeaderboardHeader = ({
  totalParticipants = 0
}) => {
  return (
    <div className="space-y-4 pb-2 border-b border-[var(--snx-border)] dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Community Standings
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
            Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            See how your preparation compares with other SkillNexa learners.
          </p>
        </div>

        {totalParticipants > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-mono font-semibold px-3 py-1 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-slate-600 dark:border-slate-800 dark:text-slate-300">
              {totalParticipants} Active Learners
            </span>
          </div>
        )}
      </div>

      {/* Transparent Metric Explanation Banner */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 dark:border-indigo-900/40 dark:bg-indigo-950/20 flex items-start gap-2.5 text-xs text-indigo-900 dark:text-indigo-200">
        <FiInfo className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Transparent Scoring:</strong> Rank is computed strictly from verified actions:{" "}
          <span className="font-semibold">10 pts</span> per solved problem +{" "}
          <span className="font-semibold">25 pts</span> per completed mock assessment +{" "}
          <span className="font-semibold">5 pts</span> per active streak day.
        </p>
      </div>
    </div>
  );
};

export default LeaderboardHeader;
