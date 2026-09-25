import { FiBookOpen, FiCode, FiBarChart2, FiUsers, FiAward } from "react-icons/fi";
import Progress from "../ui/Progress";

export const PreparationProgress = ({
  aiReadinessScore = 0,
  learningProgress = 0,
  practiceAccuracy = 0,
  testingScore = 0,
  interviewScore = 0
}) => {
  const pillars = [
    {
      label: "Learning Roadmaps",
      percentage: Math.min(100, Math.max(0, Math.round(learningProgress))),
      icon: FiBookOpen,
      color: "emerald",
      context: "Curriculum & topic progress"
    },
    {
      label: "Problem Practice",
      percentage: Math.min(100, Math.max(0, Math.round(practiceAccuracy))),
      icon: FiCode,
      color: "indigo",
      context: "Practice answer accuracy"
    },
    {
      label: "Mock Testing",
      percentage: Math.min(100, Math.max(0, Math.round(testingScore))),
      icon: FiBarChart2,
      color: "sky",
      context: "Assessment score average"
    },
    {
      label: "Technical Interviews",
      percentage: Math.min(100, Math.max(0, Math.round(interviewScore))),
      icon: FiUsers,
      color: "purple",
      context: "AI interview evaluations"
    }
  ];

  return (
    <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[var(--snx-border-subtle)] dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Preparation Progress Breakdown
            </h3>
            {aiReadinessScore > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                AI Readiness {aiReadinessScore}%
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Objective progress tracking across all preparation pillars.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${
                    pillar.color === "emerald" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400" :
                    pillar.color === "indigo" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-400" :
                    pillar.color === "sky" ? "bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-400" :
                    "bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-400"
                  }`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {pillar.label}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  {pillar.percentage}%
                </span>
              </div>

              <Progress value={pillar.percentage} size="sm" variant={pillar.color} />

              <div className="text-[11px] text-slate-400 truncate">
                {pillar.context}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PreparationProgress;
