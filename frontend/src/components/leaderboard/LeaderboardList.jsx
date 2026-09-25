import { LeaderboardRow } from "./LeaderboardRow";
import EmptyState from "../ui/EmptyState";

export const LeaderboardList = ({
  entries = [],
  currentUserId = "",
  loading = false
}) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-12 text-center text-xs text-slate-500 animate-pulse dark:border-slate-800">
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded mx-auto mb-2" />
        <div className="h-3 w-32 bg-slate-100 dark:bg-slate-850 rounded mx-auto" />
      </div>
    );
  }

  if (!entries.length) {
    return (
      <EmptyState
        title="Leaderboard is initializing"
        description="Rankings will appear as learners solve problems and complete assessments."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] shadow-subtle dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <th className="py-3 px-3.5 w-12 text-center">Rank</th>
              <th className="py-3 px-3">Learner</th>
              <th className="py-3 px-3 hidden sm:table-cell">Track</th>
              <th className="py-3 px-3 text-right hidden sm:table-cell w-24">Solved</th>
              <th className="py-3 px-3 text-right hidden md:table-cell w-20">Tests</th>
              <th className="py-3 px-3 text-center hidden sm:table-cell w-20">Streak</th>
              <th className="py-3 px-4 text-right w-24">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--snx-border-subtle)] dark:divide-slate-800/80">
            {entries.map((entry) => (
              <LeaderboardRow
                key={entry._id}
                entry={entry}
                isCurrentUser={String(entry._id) === String(currentUserId)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardList;
