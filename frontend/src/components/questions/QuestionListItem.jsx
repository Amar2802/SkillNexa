import { FiBookmark, FiCheckCircle, FiCode, FiFileText, FiCheckSquare, FiBookOpen, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export const QuestionListItem = ({
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
    <tr className="group hover:bg-slate-50/80 transition-colors duration-100 dark:hover:bg-slate-800/40">
      {/* Solved Status */}
      <td className="py-3.5 px-3.5 text-center">
        {isSolved ? (
          <span title="Solved & Completed" className="inline-flex">
            <FiCheckCircle className="h-4 w-4 text-emerald-500 mx-auto" />
          </span>
        ) : (
          <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto" title="Unsolved" />
        )}
      </td>

      {/* Title & Metadata (Mobile) */}
      <td className="py-3.5 px-3">
        <button
          type="button"
          onClick={() => onOpenDetail(question)}
          className="text-left font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors dark:text-white dark:group-hover:text-indigo-400 line-clamp-1 cursor-pointer"
        >
          {cleanTitle}
        </button>
        <div className="flex md:hidden items-center gap-1.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
          <span className="font-medium text-slate-600 dark:text-slate-300">{question.topic || "General"}</span>
          <span>•</span>
          <span className="text-slate-400">{question.category || "DSA"}</span>
          {question.company && (
            <>
              <span>•</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{question.company}</span>
            </>
          )}
        </div>
      </td>

      {/* Category & Topic */}
      <td className="py-3.5 px-3 hidden md:table-cell">
        <div className="flex flex-col">
          <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[170px]">
            {question.topic || "General"}
          </span>
          <span className="text-[10px] text-slate-400">
            {question.category || "DSA"}
          </span>
        </div>
      </td>

      {/* Company Tag */}
      <td className="py-3.5 px-3 hidden lg:table-cell">
        {question.company ? (
          <span className="inline-block font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
            {question.company}
          </span>
        ) : (
          <span className="text-slate-400 text-xs">—</span>
        )}
      </td>

      {/* Difficulty */}
      <td className="py-3.5 px-3">
        <Badge difficulty={question.difficulty || "Medium"} size="sm" />
      </td>

      {/* Question Type */}
      <td className="py-3.5 px-3 hidden sm:table-cell">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
          {isCoding && <FiCode className="h-3 w-3 text-sky-500" />}
          {isMCQ && <FiCheckSquare className="h-3 w-3 text-emerald-500" />}
          {!isCoding && !isMCQ && <FiFileText className="h-3 w-3 text-purple-500" />}
          <span>{question.type || "Descriptive"}</span>
        </span>
      </td>

      {/* Bookmark Button */}
      <td className="py-3.5 px-3 text-center">
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
      </td>

      {/* Action Buttons */}
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onOpenDetail(question)}
            className="!h-7 !text-xs !px-2.5 inline-flex items-center gap-1"
          >
            <FiBookOpen className="h-3 w-3" />
            <span className="hidden sm:inline">Study</span>
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
      </td>
    </tr>
  );
};

export default QuestionListItem;
