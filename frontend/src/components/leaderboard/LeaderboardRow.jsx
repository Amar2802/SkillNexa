import { FiAward, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

export const LeaderboardRow = ({
  entry,
  isCurrentUser = false
}) => {
  const isTop1 = entry.rank === 1;
  const isTop2 = entry.rank === 2;
  const isTop3 = entry.rank === 3;

  const initials = (entry.name || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <tr
      className={`group transition-colors duration-150 ${
        isCurrentUser
          ? "bg-indigo-50/60 dark:bg-indigo-950/40 font-semibold"
          : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
      }`}
    >
      {/* Rank column with podium styling */}
      <td className="py-3 px-3.5 text-center">
        {isTop1 ? (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 font-bold text-xs shadow-xs">
            1
          </span>
        ) : isTop2 ? (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-bold text-xs shadow-xs">
            2
          </span>
        ) : isTop3 ? (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-800/20 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 font-bold text-xs shadow-xs">
            3
          </span>
        ) : (
          <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
            #{entry.rank}
          </span>
        )}
      </td>

      {/* User Info */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-8 w-8 rounded-xl border border-[var(--snx-border)] bg-slate-100 overflow-hidden shrink-0 dark:border-slate-700 dark:bg-slate-800 flex items-center justify-center">
            {entry.avatar ? (
              <img src={entry.avatar} alt={entry.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                {initials}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link
                to={`/p/${entry._id}`}
                className="font-semibold text-xs text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 truncate"
              >
                {entry.name}
              </Link>
              {isCurrentUser && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase bg-indigo-600 text-white">
                  You
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block sm:hidden">
              {entry.problemsSolved} solved • {entry.points} pts
            </span>
          </div>
        </div>
      </td>

      {/* Track */}
      <td className="py-3 px-3 hidden sm:table-cell">
        <span className="text-xs text-slate-600 dark:text-slate-300">
          {entry.targetField || "Software"}
        </span>
      </td>

      {/* Problems Solved */}
      <td className="py-3 px-3 text-right hidden sm:table-cell">
        <span className="font-mono text-xs font-semibold text-slate-900 dark:text-white">
          {entry.problemsSolved}
        </span>
      </td>

      {/* Tests Completed */}
      <td className="py-3 px-3 text-right hidden md:table-cell">
        <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
          {entry.testsCompleted}
        </span>
      </td>

      {/* Streak */}
      <td className="py-3 px-3 text-center hidden sm:table-cell">
        {entry.streakCount > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
            <FiTrendingUp className="h-3 w-3" />
            <span>{entry.streakCount}d</span>
          </span>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        )}
      </td>

      {/* Total Points */}
      <td className="py-3 px-4 text-right">
        <span className="font-mono text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400">
          {entry.points.toLocaleString()}
        </span>
      </td>
    </tr>
  );
};

export default LeaderboardRow;
