import { useMemo } from "react";
import { FiCalendar, FiActivity } from "react-icons/fi";

export const ProfileActivityHeatmap = ({
  history = [],
  sessions = []
}) => {
  const { weeks, totalActiveDays, totalEvents } = useMemo(() => {
    const activityMap = {};
    let eventsCount = 0;

    (history || []).forEach((h) => {
      if (!h.createdAt) return;
      const key = new Date(h.createdAt).toISOString().split("T")[0];
      activityMap[key] = (activityMap[key] || 0) + 1;
      eventsCount += 1;
    });

    (sessions || []).forEach((s) => {
      if (!s.createdAt) return;
      const key = new Date(s.createdAt).toISOString().split("T")[0];
      activityMap[key] = (activityMap[key] || 0) + 1;
      eventsCount += 1;
    });

    // Generate recent 16 weeks (112 days)
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 is Sunday
    const daysToGenerate = 16 * 7;
    const generatedDays = [];

    for (let i = daysToGenerate - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const count = activityMap[dateKey] || 0;
      generatedDays.push({
        date: dateKey,
        count,
        dayOfWeek: d.getDay()
      });
    }

    // Split into 16 column weeks
    const weekCols = [];
    for (let w = 0; w < 16; w++) {
      weekCols.push(generatedDays.slice(w * 7, (w + 1) * 7));
    }

    const activeDaysCount = Object.keys(activityMap).length;

    return {
      weeks: weekCols,
      totalActiveDays: activeDaysCount,
      totalEvents: eventsCount
    };
  }, [history, sessions]);

  const getColorClass = (count) => {
    if (count === 0) return "bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-750";
    if (count === 1) return "bg-emerald-300 dark:bg-emerald-800 border border-emerald-400 dark:border-emerald-700";
    if (count === 2) return "bg-emerald-500 dark:bg-emerald-600 border border-emerald-600 dark:border-emerald-500";
    return "bg-emerald-600 dark:bg-emerald-400 border border-emerald-700 dark:border-emerald-300";
  };

  return (
    <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-[var(--snx-border-subtle)] dark:border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiActivity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Preparation Activity Grid</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {totalActiveDays} active days logged across verified tests and interview sessions.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 self-end sm:self-auto">
          <span>Less</span>
          <div className="h-2.5 w-2.5 rounded-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
          <div className="h-2.5 w-2.5 rounded-xs bg-emerald-300 dark:bg-emerald-800" />
          <div className="h-2.5 w-2.5 rounded-xs bg-emerald-500 dark:bg-emerald-600" />
          <div className="h-2.5 w-2.5 rounded-xs bg-emerald-600 dark:bg-emerald-400" />
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-1 snx-scrollbar">
        <div className="inline-flex gap-1.5 min-w-full justify-between pt-1">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  title={`${day.date}: ${day.count} ${day.count === 1 ? "activity" : "activities"}`}
                  className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-xs transition-colors duration-150 cursor-pointer ${getColorClass(day.count)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="text-[11px] text-slate-400 text-center sm:text-left">
        Activity reflects completed tests and simulated interviews over the last 16 weeks.
      </div>
    </div>
  );
};

export default ProfileActivityHeatmap;
