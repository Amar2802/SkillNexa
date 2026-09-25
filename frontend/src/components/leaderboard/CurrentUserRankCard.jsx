import { FiAward, FiCheckSquare, FiTrendingUp, FiTarget } from "react-icons/fi";

export const CurrentUserRankCard = ({
  currentUserRank
}) => {
  if (!currentUserRank) return null;

  return (
    <div className="rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-r from-indigo-50/80 to-purple-50/50 p-4 shadow-subtle dark:border-indigo-500/30 dark:from-indigo-950/40 dark:to-purple-950/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Rank & Identity */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white font-mono font-bold text-lg shadow-sm">
            #{currentUserRank.rank}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Your Current Standing
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                {currentUserRank.targetField || "Software"} Track
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {currentUserRank.name}
            </h3>
          </div>
        </div>

        {/* Right: Metrics */}
        <div className="flex items-center gap-6 sm:justify-end text-xs">
          <div>
            <span className="text-[10px] font-medium text-slate-400 block">Total Points</span>
            <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">
              {currentUserRank.points.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-medium text-slate-400 block">Solved</span>
            <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
              {currentUserRank.problemsSolved}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-medium text-slate-400 block">Streak</span>
            <span className="font-mono text-base font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <FiTrendingUp className="h-3.5 w-3.5" />
              <span>{currentUserRank.streakCount}d</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentUserRankCard;
