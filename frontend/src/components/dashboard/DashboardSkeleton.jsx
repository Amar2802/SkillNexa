export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-[var(--snx-border-subtle)] dark:border-slate-800">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-72 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-9 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-card)] p-4 dark:border-slate-800">
            <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800 mb-3" />
            <div className="h-6 w-16 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      {/* 2-column Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-56 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-card)] p-5 dark:border-slate-800" />
        <div className="h-56 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-card)] p-5 dark:border-slate-800" />
      </div>

      {/* Recommended Practice */}
      <div className="h-64 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-card)] p-5 dark:border-slate-800" />
    </div>
  );
};

export default DashboardSkeleton;
