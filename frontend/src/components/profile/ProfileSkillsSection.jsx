import { FiLayers, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

export const ProfileSkillsSection = ({
  skills = [],
  skillAccuracies = {},
  onOpenEditInterests
}) => {
  return (
    <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--snx-border-subtle)] dark:border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiLayers className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Target Skills & Technical Focus</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active concepts and programming languages selected for interview preparation.
          </p>
        </div>

        <Link
          to="/analytics"
          className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400 inline-flex items-center gap-1 shrink-0"
        >
          <span>View Full Analytics</span>
          <FiArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2.5 pt-1">
          {skills.map((skill, idx) => {
            const acc = skillAccuracies[skill];
            return (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-xs dark:border-slate-800"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {skill}
                </span>
                {acc !== undefined && (
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    {acc}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-6 text-center rounded-xl border border-dashed border-[var(--snx-border)] text-xs text-slate-400 dark:border-slate-800">
          No focus topics selected yet. Edit your profile to select target technologies.
        </div>
      )}
    </div>
  );
};

export default ProfileSkillsSection;
