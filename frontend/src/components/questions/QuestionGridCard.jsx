import { FiBookmark, FiCheckCircle, FiCode, FiFileText, FiCheckSquare, FiBookOpen, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export const QuestionGridCard = ({
  question,
  isSolved = false,
  isBookmarked = false,
  onToggleBookmark,
  isBookmarkLoading = false,
  onOpenDetail
}) => {
  const isCoding = question.type === "Coding";
  const isMCQ = question.type === "MCQ";

  const cleanTitle = (question.title || "Untitled Question").replace(
    /\s+Practice Variant\s+\d+$/i,
    ""
  );

  return (
    <div className="flex flex-col justify-between rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-4 shadow-subtle hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 transition duration-150">
      <div className="space-y-3">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {question.category || "DSA"}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
              {question.topic || "General"}
            </span>
            {question.company && (
              <span className="font-semibold text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/50 dark:border-indigo-900 dark:text-indigo-300">
                {question.company}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {isSolved && (
              <span title="Solved" className="p-1">
                <FiCheckCircle className="h-4 w-4 text-emerald-500" />
              </span>
            )}
            <button
              type="button"
              disabled={isBookmarkLoading}
              onClick={() => onToggleBookmark?.(question._id)}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isBookmarked
                  ? "text-amber-500 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
              }`}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark question"}
            >
              <FiBookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <button
          type="button"
          onClick={() => onOpenDetail(question)}
          className="text-left font-semibold text-slate-900 hover:text-indigo-600 transition-colors dark:text-white dark:hover:text-indigo-400 line-clamp-2 leading-snug cursor-pointer"
        >
          {cleanTitle}
        </button>

        {/* Description snippet */}
        {question.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {question.description}
          </p>
        )}
      </div>

      {/* Footer Badges & Actions */}
      <div className="mt-4 pt-3 border-t border-[var(--snx-border-subtle)] dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge difficulty={question.difficulty || "Medium"} size="sm" />
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            {isCoding && <FiCode className="h-3 w-3 text-sky-500" />}
            {isMCQ && <FiCheckSquare className="h-3 w-3 text-emerald-500" />}
            {!isCoding && !isMCQ && <FiFileText className="h-3 w-3 text-purple-500" />}
            <span>{question.type || "Descriptive"}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onOpenDetail(question)}
            className="!h-7 !text-xs !px-2.5 inline-flex items-center gap-1"
          >
            <FiBookOpen className="h-3 w-3" />
            <span>Study</span>
          </Button>

          {isCoding && (
            <Link to={`/practice/${question._id}`}>
              <Button
                variant="primary"
                size="sm"
                className="!h-7 !text-xs !px-2.5 inline-flex items-center gap-1"
              >
                <span>Solve</span>
                <FiArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionGridCard;
