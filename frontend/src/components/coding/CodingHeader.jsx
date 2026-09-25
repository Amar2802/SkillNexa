import { FiArrowLeft, FiChevronLeft, FiChevronRight, FiBookmark, FiClock } from "react-icons/fi";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const formatTimer = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

export const CodingHeader = ({
  question,
  onBack,
  isBookmarked,
  onToggleBookmark,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  timeElapsed = 0,
  currentIndex = 0,
  totalCount = 0
}) => {
  const cleanTitle = (question?.title || "Problem").replace(/\s+Practice Variant\s+\d+$/i, "");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--snx-border)] text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label="Back to problem explorer"
        >
          <FiArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate dark:text-white">
            {cleanTitle}
          </h2>
          {question?.difficulty && (
            <Badge difficulty={question.difficulty} size="sm" />
          )}
          {question?.topic && (
            <span className="hidden sm:inline-block text-[11px] font-mono text-slate-500 dark:text-slate-400">
              {question.topic}
            </span>
          )}
        </div>
      </div>

      {/* Right: Timer, Bookmark & Prev/Next */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Timer */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-xs font-mono text-slate-600 dark:border-slate-800 dark:text-slate-300">
          <FiClock className="h-3.5 w-3.5 text-slate-400" />
          <span>{formatTimer(timeElapsed)}</span>
        </div>

        {/* Bookmark */}
        <button
          type="button"
          onClick={onToggleBookmark}
          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
            isBookmarked
              ? "border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
              : "border-[var(--snx-border)] text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:hover:bg-slate-800"
          }`}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark problem"}
        >
          <FiBookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
        </button>

        {/* Prev & Next */}
        <div className="flex items-center rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800">
          <button
            type="button"
            onClick={onPrev}
            disabled={!hasPrev}
            className="flex h-8 w-8 items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Previous problem"
          >
            <FiChevronLeft className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-[var(--snx-border)] dark:bg-slate-800" />
          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className="flex h-8 w-8 items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Next problem"
          >
            <FiChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodingHeader;
