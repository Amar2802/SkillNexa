import { Link } from "react-router-dom";
import { FiBookmark, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export const ProblemTable = ({
  questions = [],
  bookmarkedIds = new Set(),
  solvedIds = new Set(),
  onToggleBookmark,
  bookmarkLoadingId = ""
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] shadow-subtle dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <th className="py-3 px-3.5 w-10 text-center">Status</th>
              <th className="py-3 px-3">Title</th>
              <th className="py-3 px-3 hidden md:table-cell">Topic & Category</th>
              <th className="py-3 px-3 hidden lg:table-cell">Company</th>
              <th className="py-3 px-3 w-28">Difficulty</th>
              <th className="py-3 px-3 w-16 text-center">Save</th>
              <th className="py-3 px-4 w-24 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--snx-border-subtle)] dark:divide-slate-800/80">
            {questions.map((question, index) => {
              const isSolved = solvedIds.has(String(question._id));
              const isBookmarked = bookmarkedIds.has(String(question._id));
              const isBookmarkLoading = bookmarkLoadingId === question._id;

              const cleanTitle = (question.title || "Untitled Problem").replace(
                /\s+Practice Variant\s+\d+$/i,
                ""
              );

              return (
                <tr
                  key={question._id || index}
                  className="group hover:bg-slate-50/80 transition-colors duration-100 dark:hover:bg-slate-800/40"
                >
                  {/* Status Indicator */}
                  <td className="py-3.5 px-3.5 text-center">
                    {isSolved ? (
                      <span title="Solved">
                        <FiCheckCircle className="h-4 w-4 text-emerald-500 mx-auto" />
                      </span>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto" />
                    )}
                  </td>

                  {/* Title */}
                  <td className="py-3.5 px-3">
                    <Link
                      to={`/practice/${question._id}`}
                      className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors dark:text-white dark:group-hover:text-indigo-400 line-clamp-1"
                    >
                      {cleanTitle}
                    </Link>
                    <div className="flex md:hidden items-center gap-1.5 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{question.topic}</span>
                      {question.company && (
                        <>
                          <span>•</span>
                          <span className="font-semibold">{question.company}</span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Topic & Category */}
                  <td className="py-3.5 px-3 hidden md:table-cell">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                        {question.topic || "General"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {question.category || "DSA"}
                      </span>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="py-3.5 px-3 hidden lg:table-cell">
                    {question.company ? (
                      <span className="inline-block font-semibold text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {question.company}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">—</span>
                    )}
                  </td>

                  {/* Difficulty */}
                  <td className="py-3.5 px-3">
                    <Badge difficulty={question.difficulty || "Medium"} size="sm" />
                  </td>

                  {/* Bookmark Button */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      disabled={isBookmarkLoading}
                      onClick={() => onToggleBookmark?.(question._id)}
                      className={`p-1.5 rounded-lg transition ${
                        isBookmarked
                          ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400"
                          : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                      }`}
                      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark question"}
                    >
                      <FiBookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-current" : ""}`} />
                    </button>
                  </td>

                  {/* Action Button */}
                  <td className="py-3.5 px-4 text-right">
                    <Link to={`/practice/${question._id}`}>
                      <Button
                        variant={isSolved ? "secondary" : "primary"}
                        size="sm"
                        className="!h-7 !text-xs !px-2.5 inline-flex items-center gap-1"
                      >
                        <span>{isSolved ? "Review" : "Solve"}</span>
                        <FiArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemTable;
