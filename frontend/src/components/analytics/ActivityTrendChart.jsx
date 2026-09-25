import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { FiActivity, FiInfo } from "react-icons/fi";
import { defaultChartOptions } from "./chartConfig";

export const ActivityTrendChart = ({
  history = [],
  sessions = [],
  timeRange = "all"
}) => {
  // Aggregate activities by date
  const { chartData, insights, totalEvents } = useMemo(() => {
    const now = new Date();
    let daysToInclude = 30;
    if (timeRange === "7d") daysToInclude = 7;
    if (timeRange === "30d") daysToInclude = 30;
    if (timeRange === "90d") daysToInclude = 90;
    if (timeRange === "all") daysToInclude = 60; // Show recent 60-day window for readability

    const dateMap = {};
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekdayCounts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

    // Initialize buckets
    for (let i = daysToInclude - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const label = daysToInclude <= 14 
        ? `${dayNames[d.getDay()]} ${d.getMonth() + 1}/${d.getDate()}`
        : `${d.getMonth() + 1}/${d.getDate()}`;
      dateMap[dateKey] = { label, tests: 0, interviews: 0, practice: 0 };
    }

    let totalTests = 0;
    let totalInterviews = 0;
    let totalPractice = 0;

    // Process Test History
    (history || []).forEach((h) => {
      if (!h.createdAt) return;
      const dateKey = new Date(h.createdAt).toISOString().split("T")[0];
      if (dateMap[dateKey]) {
        dateMap[dateKey].tests += 1;
        totalTests += 1;
        const day = dayNames[new Date(h.createdAt).getDay()];
        weekdayCounts[day] += 1;
      }
    });

    // Process Interview Sessions
    (sessions || []).forEach((s) => {
      if (!s.createdAt) return;
      const dateKey = new Date(s.createdAt).toISOString().split("T")[0];
      if (dateMap[dateKey]) {
        dateMap[dateKey].interviews += 1;
        totalInterviews += 1;
        const day = dayNames[new Date(s.createdAt).getDay()];
        weekdayCounts[day] += 1;
      }
    });

    const dates = Object.keys(dateMap);
    const labels = dates.map((k) => dateMap[k].label);
    const testCounts = dates.map((k) => dateMap[k].tests);
    const interviewCounts = dates.map((k) => dateMap[k].interviews);

    const sumTotal = totalTests + totalInterviews;

    // Derive honest factual insights
    const derivedInsights = [];
    if (sumTotal > 0) {
      // Find peak weekday
      let maxDay = "Mon";
      let maxCount = -1;
      Object.entries(weekdayCounts).forEach(([day, count]) => {
        if (count > maxCount) {
          maxCount = count;
          maxDay = day;
        }
      });

      if (maxCount > 0) {
        const fullDayName = {
          Mon: "Mondays",
          Tue: "Tuesdays",
          Wed: "Wednesdays",
          Thu: "Thursdays",
          Fri: "Fridays",
          Sat: "Saturdays",
          Sun: "Sundays"
        }[maxDay];
        derivedInsights.push(`Highest activity logged on ${fullDayName} (${maxCount} completed sessions).`);
      }

      if (totalTests > 0) {
        derivedInsights.push(`Completed ${totalTests} mock test ${totalTests === 1 ? "round" : "rounds"} in this window.`);
      }
      if (totalInterviews > 0) {
        derivedInsights.push(`Completed ${totalInterviews} simulated interview ${totalInterviews === 1 ? "session" : "sessions"}.`);
      }
    }

    return {
      chartData: {
        labels,
        datasets: [
          {
            label: "Mock Tests",
            data: testCounts,
            backgroundColor: "rgba(79, 70, 229, 0.8)",
            borderRadius: 4
          },
          {
            label: "Interviews",
            data: interviewCounts,
            backgroundColor: "rgba(139, 92, 246, 0.8)",
            borderRadius: 4
          }
        ]
      },
      insights: derivedInsights,
      totalEvents: sumTotal
    };
  }, [history, sessions, timeRange]);

  const customOptions = {
    ...defaultChartOptions,
    scales: {
      ...defaultChartOptions.scales,
      x: {
        ...defaultChartOptions.scales.x,
        stacked: true
      },
      y: {
        ...defaultChartOptions.scales.y,
        stacked: true,
        ticks: {
          stepSize: 1,
          color: "#94A3B8"
        }
      }
    },
    plugins: {
      ...defaultChartOptions.plugins,
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          boxWidth: 10,
          font: { size: 11 },
          color: "#94A3B8"
        }
      }
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-[var(--snx-border-subtle)] dark:border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiActivity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Preparation Activity Timeline</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Frequency of test completions and interview sessions over time.
          </p>
        </div>
      </div>

      {totalEvents > 0 ? (
        <>
          <div className="h-56 w-full">
            <Bar data={chartData} options={customOptions} />
          </div>

          {insights.length > 0 && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 dark:border-indigo-900/30 dark:bg-indigo-950/20 text-xs text-indigo-900 dark:text-indigo-300 space-y-1">
              <div className="font-semibold flex items-center gap-1.5 text-indigo-800 dark:text-indigo-200">
                <FiInfo className="h-3.5 w-3.5" />
                <span>Observed Consistency</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400 pl-1">
                {insights.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="p-8 text-center rounded-xl border border-dashed border-[var(--snx-border)] text-xs text-slate-400 dark:border-slate-800">
          No activity recorded in this time range. Complete mock tests or interview sessions to see your daily trends.
        </div>
      )}
    </div>
  );
};

export default ActivityTrendChart;
