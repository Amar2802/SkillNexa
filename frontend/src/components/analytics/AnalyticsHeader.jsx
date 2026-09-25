import { FiRefreshCw, FiCalendar } from "react-icons/fi";
import Button from "../ui/Button";

const TIME_RANGES = [
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
  { id: "90d", label: "90 Days" },
  { id: "all", label: "All Time" }
];

export const AnalyticsHeader = ({
  timeRange = "all",
  onTimeRangeChange,
  onRefresh,
  loading = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--snx-border)] dark:border-slate-800">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Intelligence Center
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
          Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Understand your preparation progress and focus on what will improve your performance.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        {/* Time Range Pills */}
        <div className="flex items-center rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-0.5 dark:border-slate-800">
          {TIME_RANGES.map((range) => {
            const active = timeRange === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => onTimeRangeChange(range.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  active
                    ? "bg-[var(--snx-surface)] text-indigo-600 shadow-subtle dark:text-indigo-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        {/* Refresh Action */}
        <Button
          variant="secondary"
          size="sm"
          disabled={loading}
          onClick={onRefresh}
          className="!h-8 !px-2.5"
          title="Refresh analytics data"
        >
          <FiRefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-indigo-600" : ""}`} />
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
