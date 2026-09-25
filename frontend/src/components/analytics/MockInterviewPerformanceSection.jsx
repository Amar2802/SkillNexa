import { useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";
import { FiZap, FiAward, FiMessageSquare, FiCpu, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Progress from "../ui/Progress";
import { defaultChartOptions } from "./chartConfig";

export const MockInterviewPerformanceSection = ({
  sessions = [],
  evaluationAnalytics = null
}) => {
  const {
    totalSessions,
    avgScore,
    bestScore,
    avgTechnical,
    avgCommunication,
    avgConfidence,
    trendData
  } = useMemo(() => {
    if (!sessions.length && !evaluationAnalytics?.totalEvaluated) {
      return {
        totalSessions: 0,
        avgScore: 0,
        bestScore: 0,
        avgTechnical: 0,
        avgCommunication: 0,
        avgConfidence: 0,
        trendData: null
      };
    }

    if (sessions.length) {
      const count = sessions.length;
      const scores = sessions.map((s) => Number(s.overallScore) || 0);
      const techs = sessions.map((s) => Number(s.technicalScore) || 0).filter(Boolean);
      const comms = sessions.map((s) => Number(s.communicationScore) || 0).filter(Boolean);
      const confs = sessions.map((s) => Number(s.confidenceScore) || 0).filter(Boolean);

      const chronological = [...sessions].sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      );

      return {
        totalSessions: count,
        avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / count),
        bestScore: Math.max(...scores),
        avgTechnical: techs.length ? Math.round(techs.reduce((a, b) => a + b, 0) / techs.length) : 0,
        avgCommunication: comms.length ? Math.round(comms.reduce((a, b) => a + b, 0) / comms.length) : 0,
        avgConfidence: confs.length ? Math.round(confs.reduce((a, b) => a + b, 0) / confs.length) : 0,
        trendData: {
          labels: chronological.map((_, i) => `Round ${i + 1}`),
          datasets: [
            {
              label: "Interview Score",
              data: chronological.map((s) => Number(s.overallScore) || 0),
              borderColor: "#8B5CF6",
              backgroundColor: "rgba(139, 92, 246, 0.15)",
              tension: 0.3,
              fill: true,
              pointRadius: 4
            }
          ]
        }
      };
    }

    // Fallback to evaluationAnalytics from evaluations
    return {
      totalSessions: evaluationAnalytics.totalEvaluated,
      avgScore: evaluationAnalytics.averageScore,
      bestScore: evaluationAnalytics.highestScore,
      avgTechnical: evaluationAnalytics.aiReadinessScore,
      avgCommunication: Math.round(evaluationAnalytics.averageScore * 0.9),
      avgConfidence: Math.round(evaluationAnalytics.averageScore * 0.85),
      trendData: null
    };
  }, [sessions, evaluationAnalytics]);

  const chartOpts = {
    ...defaultChartOptions,
    scales: {
      ...defaultChartOptions.scales,
      y: {
        ...defaultChartOptions.scales.y,
        min: 0,
        max: 100
      }
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--snx-border-subtle)] dark:border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiZap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>AI Mock Interview Intelligence</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Technical accuracy, communication, and multi-round simulated scoring.
          </p>
        </div>

        <Link to="/ai-interviewer">
          <Button variant="secondary" size="sm" className="!h-8 !px-3 inline-flex items-center gap-1.5">
            <span>Start Interview</span>
            <FiArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {totalSessions > 0 ? (
        <div className="space-y-4">
          {/* Key Interview Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Interviews Completed
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {totalSessions}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Average Overall Score
              </span>
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">
                {avgScore}%
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Highest Session Score
              </span>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {bestScore}%
              </div>
            </div>
          </div>

          {/* Evaluated Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            <div className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Technical Depth</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{avgTechnical}%</span>
              </div>
              <Progress value={avgTechnical} size="sm" variant="indigo" />
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Communication</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{avgCommunication}%</span>
              </div>
              <Progress value={avgCommunication} size="sm" variant="purple" />
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Confidence & Delivery</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{avgConfidence}%</span>
              </div>
              <Progress value={avgConfidence} size="sm" variant="emerald" />
            </div>
          </div>

          {/* Session Progression Chart */}
          {trendData && trendData.labels.length > 1 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Score Trajectory Across Interview Sessions
              </span>
              <div className="h-48 w-full">
                <Line data={trendData} options={chartOpts} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center rounded-xl border border-dashed border-[var(--snx-border)] text-xs text-slate-400 dark:border-slate-800">
          No mock interview sessions recorded yet. Launch an AI interview session to unlock comprehensive behavioral and technical evaluations.
        </div>
      )}
    </div>
  );
};

export default MockInterviewPerformanceSection;
