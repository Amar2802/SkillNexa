import { FiCompass, FiArrowRight, FiBookOpen } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Progress from "../ui/Progress";

export const CurrentLearningCard = ({
  activeRoadmap = null,
  completedTopicsCount = 0,
  overallCompletion = 0
}) => {
  return (
    <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--snx-border-subtle)] dark:border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiCompass className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Current Learning Progression</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Structured roadmap track currently in progress.
          </p>
        </div>

        <Link to="/roadmaps">
          <Button variant="secondary" size="sm" className="!h-8 !px-3 inline-flex items-center gap-1.5">
            <span>All Roadmaps</span>
            <FiArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {activeRoadmap ? (
        <div className="p-4 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Active Track
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {activeRoadmap.title}
              </h4>
            </div>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
              {activeRoadmap.completionPercentage || overallCompletion}%
            </span>
          </div>

          <Progress
            value={activeRoadmap.completionPercentage || overallCompletion}
            size="md"
            variant="emerald"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span>
              {completedTopicsCount} topics mastered in this curriculum
            </span>
            <Link to="/roadmaps">
              <span className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400 inline-flex items-center gap-1">
                <span>Continue Roadmap</span>
                <FiArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center rounded-xl border border-dashed border-[var(--snx-border)] space-y-2 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You haven't started a structured roadmap yet. Follow guided paths in DSA, Frontend, Backend, or System Design.
          </p>
          <Link to="/roadmaps">
            <Button variant="primary" size="sm" className="mt-1">
              Explore Roadmaps
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CurrentLearningCard;
