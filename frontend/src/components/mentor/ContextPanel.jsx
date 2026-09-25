import { FiCpu, FiX, FiCode, FiBookOpen } from "react-icons/fi";
import Badge from "../ui/Badge";

export const ContextPanel = ({ context, onRemoveContext }) => {
  if (!context) return null;

  const isProblem = context.type === "problem";
  const isCourse = context.type === "course";

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border border-indigo-200/80 bg-indigo-50/60 dark:border-indigo-900/60 dark:bg-indigo-950/30 text-xs">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
          {isProblem ? <FiCode className="h-3 w-3" /> : isCourse ? <FiBookOpen className="h-3 w-3" /> : <FiCpu className="h-3 w-3" />}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              Active Context:
            </span>
            <span className="font-bold text-slate-900 dark:text-white truncate">
              {context.title || "Custom Focus"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {context.topic && <span>{context.topic}</span>}
            {context.difficulty && (
              <>
                <span>•</span>
                <span className="font-medium">{context.difficulty}</span>
              </>
            )}
            {context.code && (
              <>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Code Attached</span>
              </>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onRemoveContext}
        className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition shrink-0 cursor-pointer"
        title="Remove context"
      >
        <FiX className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Remove</span>
      </button>
    </div>
  );
};

export default ContextPanel;
