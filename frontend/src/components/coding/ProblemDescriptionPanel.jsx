import { useState } from "react";
import { FiFileText, FiHelpCircle, FiChevronDown, FiChevronRight } from "react-icons/fi";
import Badge from "../ui/Badge";

export const ProblemDescriptionPanel = ({ question, solutionText = "" }) => {
  const [activeTab, setActiveTab] = useState("description"); // 'description' | 'solution'
  const [hintsExpanded, setHintsExpanded] = useState(false);

  if (!question) return null;

  const descText = String(question.description || "")
    .replace(/\s*Practice focus\s*\d*:\s*.+$/i, "")
    .trim();

  // Extract examples and constraints if present in the text
  const splitConstraints = descText.split(/Constraints?:/i);
  const mainDesc = splitConstraints[0] || descText;
  const constraintsText = splitConstraints[1] || "";

  return (
    <div className="flex flex-col h-full bg-[var(--snx-surface)]">
      {/* Panel Tabs */}
      <div className="flex items-center border-b border-[var(--snx-border)] px-4 bg-[var(--snx-surface-subtle)] dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("description")}
          className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold border-b-2 transition select-none ${
            activeTab === "description"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FiFileText className="h-3.5 w-3.5" />
          <span>Description</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("solution")}
          className={`flex items-center gap-1.5 py-2.5 px-3 text-xs font-semibold border-b-2 transition select-none ${
            activeTab === "solution"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FiHelpCircle className="h-3.5 w-3.5" />
          <span>Solution & Hints</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 snx-scrollbar text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        {activeTab === "description" ? (
          <>
            {/* Metadata Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge difficulty={question.difficulty || "Medium"} size="sm" />
              {question.topic && (
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[var(--snx-surface-subtle)] border border-[var(--snx-border)] text-slate-600 dark:border-slate-800 dark:text-slate-300">
                  {question.topic}
                </span>
              )}
              {question.company && (
                <span className="font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {question.company}
                </span>
              )}
              {question.category && (
                <span className="text-xs text-slate-400">{question.category}</span>
              )}
            </div>

            {/* Problem Statement */}
            <div className="leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200">
              {mainDesc}
            </div>

            {/* Constraints Block */}
            {constraintsText && (
              <div className="space-y-1.5 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Constraints
                </h4>
                <div className="rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-3 font-mono text-xs text-slate-700 dark:border-slate-800 dark:text-slate-300">
                  {constraintsText.trim()}
                </div>
              </div>
            )}

            {/* Collapsible Hint Block */}
            {question.explanation && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setHintsExpanded((prev) => !prev)}
                  className="flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  {hintsExpanded ? <FiChevronDown className="h-4 w-4" /> : <FiChevronRight className="h-4 w-4" />}
                  <span>{hintsExpanded ? "Hide Hint" : "Need a Hint?"}</span>
                </button>
                {hintsExpanded && (
                  <div className="mt-2 rounded-lg border border-indigo-200 bg-indigo-50/50 p-3 text-xs text-indigo-950 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-200">
                    {question.explanation}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Solution Tab */
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Official Solution & Walkthrough
            </h4>
            {solutionText || question.explanation ? (
              <div className="rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-4 text-xs leading-relaxed space-y-3 dark:border-slate-800">
                <p>{solutionText || question.explanation}</p>
                {question.correctAnswer && (
                  <div className="pt-2 border-t border-[var(--snx-border-subtle)] dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Target Answer:</span>
                    <pre className="mt-1 font-mono text-xs text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 p-2 rounded border border-[var(--snx-border)] dark:border-slate-800">
                      {String(question.correctAnswer)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Submit your solution or execute test cases to view complete solution breakdowns.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDescriptionPanel;
