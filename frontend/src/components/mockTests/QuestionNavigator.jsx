import { FiCheck, FiBookmark } from "react-icons/fi";

export const QuestionNavigator = ({
  questions = [],
  currentIndex = 0,
  onSelectQuestion,
  answers = {},
  flaggedIds = new Set()
}) => {
  return (
    <div className="flex flex-col h-full bg-[var(--snx-surface)] border-l border-[var(--snx-border)] p-4 space-y-4 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Question Navigator
        </h4>
        <span className="text-xs font-mono text-slate-500">
          {Object.keys(answers).length}/{questions.length} Answered
        </span>
      </div>

      {/* Grid of Numbered Tiles */}
      <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-[360px] snx-scrollbar pr-1">
        {questions.map((q, index) => {
          const isCurrent = currentIndex === index;
          const isAnswered = String(answers[q._id] || "").trim().length > 0;
          const isFlagged = flaggedIds.has(String(q._id));

          let tileStyle =
            "border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-slate-600 dark:border-slate-800 dark:text-slate-400";

          if (isCurrent) {
            tileStyle =
              "border-2 border-indigo-600 bg-indigo-50 text-indigo-700 font-bold dark:bg-indigo-950/60 dark:text-indigo-300 ring-2 ring-indigo-500/20";
          } else if (isFlagged) {
            tileStyle =
              "border border-amber-500 bg-amber-50 text-amber-700 font-semibold dark:bg-amber-950/50 dark:text-amber-300";
          } else if (isAnswered) {
            tileStyle =
              "border border-emerald-500/40 bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950/40 dark:text-emerald-400";
          }

          return (
            <button
              key={q._id || index}
              type="button"
              onClick={() => onSelectQuestion(index)}
              className={`relative h-9 w-full rounded-lg flex items-center justify-center text-xs transition duration-150 select-none ${tileStyle}`}
              aria-label={`Jump to question ${index + 1}`}
            >
              <span>{index + 1}</span>
              {isFlagged && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-500 text-white flex items-center justify-center text-[8px]">
                  ★
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Navigator Legend */}
      <div className="pt-3 border-t border-[var(--snx-border-subtle)] dark:border-slate-800 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-emerald-50 border border-emerald-500/40 dark:bg-emerald-950/40" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-amber-50 border border-amber-500 dark:bg-amber-950/50" />
          <span>Marked for Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-[var(--snx-surface-subtle)] border border-[var(--snx-border)] dark:border-slate-800" />
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigator;
