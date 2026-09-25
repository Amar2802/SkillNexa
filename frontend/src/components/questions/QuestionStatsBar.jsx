import { FiDatabase, FiCode, FiCpu, FiAward, FiBookmark, FiCheckCircle } from "react-icons/fi";

export const QuestionStatsBar = ({
  total = 0,
  categoryCounts = {},
  solvedCount = 0,
  bookmarkedCount = 0
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* Total Library */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800 shadow-subtle">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
          <FiDatabase className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total Bank</div>
          <div className="text-base font-bold text-slate-900 dark:text-white leading-tight">{total}</div>
        </div>
      </div>

      {/* DSA */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800 shadow-subtle">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
          <FiCode className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">DSA & Algo</div>
          <div className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            {categoryCounts["DSA"] || 0}
          </div>
        </div>
      </div>

      {/* Core Subjects */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800 shadow-subtle">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
          <FiCpu className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Core Systems</div>
          <div className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            {categoryCounts["Core Subjects"] || 0}
          </div>
        </div>
      </div>

      {/* Aptitude */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800 shadow-subtle">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <FiAward className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Aptitude</div>
          <div className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            {categoryCounts["Aptitude"] || 0}
          </div>
        </div>
      </div>

      {/* Solved / Practiced */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800 shadow-subtle">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
          <FiCheckCircle className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Solved</div>
          <div className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            {solvedCount}
          </div>
        </div>
      </div>

      {/* Bookmarked */}
      <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800 shadow-subtle">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
          <FiBookmark className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Bookmarked</div>
          <div className="text-base font-bold text-slate-900 dark:text-white leading-tight">
            {bookmarkedCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionStatsBar;
