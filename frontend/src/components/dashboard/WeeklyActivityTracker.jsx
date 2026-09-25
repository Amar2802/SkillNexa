import { FiCalendar, FiCheck } from "react-icons/fi";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";

export const WeeklyActivityTracker = ({ days = [], activeDaysCount = 0 }) => {
  const activeCount = activeDaysCount || days.filter((d) => d.active).length;

  return (
    <Card className="p-0 flex flex-col justify-between">
      <div>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <FiCalendar className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>7-Day Activity & Consistency</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track your consecutive daily practice rounds
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {days.map((day) => (
              <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`h-9 w-9 sm:h-10 sm:w-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-150 select-none ${
                    day.active
                      ? "bg-indigo-600 text-white shadow-subtle"
                      : day.isToday
                      ? "border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50/50 dark:bg-indigo-950/30"
                      : "border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-slate-400 dark:border-slate-800"
                  }`}
                >
                  {day.active ? <FiCheck className="h-4 w-4 stroke-[3]" /> : day.name[0]}
                </div>
                <span
                  className={`text-[10px] font-semibold ${
                    day.isToday ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-400"
                  }`}
                >
                  {day.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-3 text-xs dark:border-slate-800 flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-300">
              Active <strong className="text-slate-900 dark:text-white font-bold">{activeCount} of 7 days</strong> this week
            </span>
            <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
              {activeCount >= 4 ? "Great momentum 🔥" : "Practice today to build momentum"}
            </span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default WeeklyActivityTracker;
