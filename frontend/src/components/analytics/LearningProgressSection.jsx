import { FiCompass, FiCheckCircle, FiArrowRight, FiBookOpen } from "react-icons/fi";
import { Link } from "react-router-dom";
import Progress from "../ui/Progress";

export const LearningProgressSection = ({
  roadmaps = [],
  completedTopicsCount = 0,
  overallCompletion = 0
}) => {
  return (
    <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--snx-border-subtle)] dark:border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiCompass className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Curriculum & Roadmap Progression</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified mastery across structured computer science and development learning paths.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/roadmaps">
            <span className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400 inline-flex items-center gap-1">
              <span>View All Roadmaps</span>
              <FiArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {/* High-level status bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold">
              {overallCompletion}%
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Overall Roadmap Completion
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {completedTopicsCount} topics marked as completed
              </div>
            </div>
          </div>

          <div className="w-full sm:w-48">
            <Progress value={overallCompletion} size="md" variant="emerald" />
          </div>
        </div>

        {/* Roadmap Track Cards */}
        {roadmaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
            {roadmaps.map((track) => {
              const totalTopics = track.topics?.length || 0;
              const completedInTrack = track.completedCount || 0;
              const pct = track.completionPercentage !== undefined
                ? track.completionPercentage
                : totalTopics > 0 ? Math.round((completedInTrack / totalTopics) * 100) : 0;

              return (
                <div
                  key={track.id}
                  className="p-4 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80 space-y-3 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                        {track.title}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {pct}%
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {track.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[var(--snx-border-subtle)] dark:border-slate-850">
                    <Progress value={pct} size="sm" variant={pct === 100 ? "emerald" : "indigo"} />
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{completedInTrack} of {totalTopics} completed</span>
                      <Link
                        to="/roadmaps"
                        className="text-indigo-600 hover:underline dark:text-indigo-400 font-medium"
                      >
                        Continue
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl border border-dashed border-[var(--snx-border)] text-xs text-slate-400 dark:border-slate-800">
            Roadmap tracks are being initialized. Check the Roadmaps tab to start structured learning paths.
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningProgressSection;
