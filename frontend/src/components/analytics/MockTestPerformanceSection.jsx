import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { FiBarChart2, FiAward, FiClock, FiTarget, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { defaultChartOptions } from "./chartConfig";

export const MockTestPerformanceSection = ({
  history = []
}) => {
  const {
    testsCount,
    avgScore,
    bestScore,
    avgAccuracy,
    avgDurationMins,
    trendData
  } = useMemo(() => {
    if (!history.length) {
      return {
        testsCount: 0,
        avgScore: 0,
        bestScore: 0,
        avgAccuracy: 0,
        avgDurationMins: 0,
        trendData: null
      };
    }

    const count = history.length;
    const scores = history.map((h) => Number(h.score) || 0);
    const accuracies = history.map((h) => Number(h.accuracy) || 0);
    const times = history.map((h) => Number(h.totalTimeSpent) || 0);

    const sumScore = scores.reduce((a, b) => a + b, 0);
    const sumAccuracy = accuracies.reduce((a, b) => a + b, 0);
    const sumTimes = times.reduce((a, b) => a + b, 0);

    // Chronological order for trend line
    const chronological = [...history].sort(
      (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
    );

    const labels = chronological.map((h, i) => `Test ${i + 1}`);
    const trendScores = chronological.map((h) => Number(h.score) || 0);
    const trendAccuracies = chronological.map((h) => Number(h.accuracy) || 0);

    return {
      testsCount: count,
      avgScore: Math.round(sumScore / count),
      bestScore: Math.max(...scores),
      avgAccuracy: Math.round(sumAccuracy / count),
      avgDurationMins: Math.round(sumTimes / count / 60),
      trendData: {
        labels,
        datasets: [
          {
            label: "Score (%)",
            data: trendScores,
            borderColor: "#4F46E5",
            backgroundColor: "rgba(79, 70, 229, 0.15)",
            tension: 0.3,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: "Accuracy (%)",
            data: trendAccuracies,
            borderColor: "#10B981",
            backgroundColor: "transparent",
            borderDash: [4, 4],
            tension: 0.3,
            pointRadius: 3
          }
        ]
      }
    };
  }, [history]);

  const lineOptions = {
    ...defaultChartOptions,
    scales: {
      ...defaultChartOptions.scales,
      y: {
        ...defaultChartOptions.scales.y,
        min: 0,
        max: 100
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--snx-border-subtle)] dark:border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiBarChart2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Mock Test Performance & History</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Timed assessment results and score evolution.
          </p>
        </div>

        <Link to="/mock-tests">
          <Button variant="secondary" size="sm" className="!h-8 !px-3 inline-flex items-center gap-1.5">
            <span>New Mock Test</span>
            <FiArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {testsCount > 0 ? (
        <div className="space-y-4">
          {/* Key Test Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Tests Completed
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {testsCount}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Average Score
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {avgScore}%
              </div>
            </div>

            <div className="p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Highest Score
              </span>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {bestScore}%
              </div>
            </div>

            <div className="p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Avg Duration
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {avgDurationMins ? `${avgDurationMins}m` : "< 1m"}
              </div>
            </div>
          </div>

          {/* Test Score Progression Line Chart */}
          {trendData && trendData.labels.length > 1 ? (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Score Progression Over Attempts
              </span>
              <div className="h-56 w-full">
                <Line data={trendData} options={lineOptions} />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80 text-xs text-slate-500">
              Complete at least 2 mock tests to unlock your historical score progression curve.
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center rounded-xl border border-dashed border-[var(--snx-border)] text-xs text-slate-400 dark:border-slate-800">
          No mock tests taken yet. Launch your first mock test to evaluate your readiness.
        </div>
      )}
    </div>
  );
};

export default MockTestPerformanceSection;
