import { useState } from "react";
import { 
  FiFilter, 
  FiX, 
  FiList, 
  FiGrid, 
  FiCode, 
  FiFileText, 
  FiCheckCircle, 
  FiCheckSquare,
  FiBookmark,
  FiChevronDown
} from "react-icons/fi";
import SearchInput from "../ui/SearchInput";
import Button from "../ui/Button";

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const TYPE_OPTIONS = [
  { id: "all", label: "All Formats", icon: FiList },
  { id: "Coding", label: "Coding IDE", icon: FiCode },
  { id: "Subjective", label: "Descriptive", icon: FiFileText },
  { id: "MCQ", label: "MCQ", icon: FiCheckSquare }
];
const STATUS_OPTIONS = [
  { id: "all", label: "All Status" },
  { id: "solved", label: "Solved" },
  { id: "unsolved", label: "Unsolved" },
  { id: "bookmarked", label: "Bookmarked" }
];

export const QuestionFilterToolbar = ({
  filters = {},
  onFilterChange,
  onClearFilters,
  topics = [],
  companies = [],
  selectedType = "all",
  onTypeChange,
  statusFilter = "all",
  onStatusChange,
  viewMode = "list", // 'list' | 'grid'
  onViewModeChange,
  totalCount = 0,
  activeFilterCount = 0
}) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-3.5 shadow-subtle dark:border-slate-800">
      {/* Top Search & High-Level Actions Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 max-w-lg">
          <SearchInput
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            onClear={() => onFilterChange("search", "")}
            placeholder="Search questions by title, concept, topic, or company..."
            size="md"
          />
        </div>

        {/* View Toggle, Count & Mobile Expand */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Active filter count clear */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/50 transition cursor-pointer"
            >
              <FiX className="h-3.5 w-3.5" />
              <span>Clear ({activeFilterCount})</span>
            </button>
          )}

          {/* View Mode Toggle: List vs Grid */}
          <div className="flex items-center rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-0.5 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              title="Table view"
              className={`p-1.5 rounded-md text-xs transition ${
                viewMode === "list"
                  ? "bg-[var(--snx-surface)] text-indigo-600 shadow-subtle dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <FiList className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              title="Grid card view"
              className={`p-1.5 rounded-md text-xs transition ${
                viewMode === "grid"
                  ? "bg-[var(--snx-surface)] text-indigo-600 shadow-subtle dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <FiGrid className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile filter toggle */}
          <button
            type="button"
            onClick={() => setMobileExpanded((prev) => !prev)}
            className="flex sm:hidden items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--snx-border)] text-xs font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300"
          >
            <FiFilter className="h-3.5 w-3.5" />
            <span>Filters</span>
            <FiChevronDown className={`h-3.5 w-3.5 transition-transform ${mobileExpanded ? "rotate-180" : ""}`} />
          </button>

          <span className="hidden sm:inline-block text-xs font-mono font-medium text-slate-400 pl-1">
            {totalCount} {totalCount === 1 ? "match" : "matches"}
          </span>
        </div>
      </div>

      {/* Filter Options Row */}
      <div className={`${mobileExpanded ? "flex" : "hidden"} sm:flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--snx-border-subtle)] dark:border-slate-800/80`}>
        {/* Type / Format Pills */}
        <div className="flex items-center rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-0.5 dark:border-slate-800 overflow-x-auto max-w-full">
          {TYPE_OPTIONS.map((t) => {
            const active = selectedType === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTypeChange(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition duration-150 whitespace-nowrap ${
                  active
                    ? "bg-[var(--snx-surface)] text-indigo-600 font-semibold shadow-subtle dark:text-indigo-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Difficulty Dropdown */}
        <select
          value={filters.difficulty || ""}
          onChange={(e) => onFilterChange("difficulty", e.target.value)}
          className="h-8 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface)] px-2.5 text-xs font-medium text-slate-700 outline-none hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
          aria-label="Filter by difficulty"
        >
          <option value="">All Difficulties</option>
          {DIFFICULTY_OPTIONS.map((diff) => (
            <option key={diff} value={diff}>
              {diff}
            </option>
          ))}
        </select>

        {/* Topic Dropdown */}
        {topics.length > 0 && (
          <select
            value={filters.topic || ""}
            onChange={(e) => onFilterChange("topic", e.target.value)}
            className="h-8 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface)] px-2.5 text-xs font-medium text-slate-700 outline-none hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 max-w-[160px] truncate cursor-pointer"
            aria-label="Filter by topic"
          >
            <option value="">All Topics</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}

        {/* Company Dropdown */}
        {companies.length > 0 && (
          <select
            value={filters.company || ""}
            onChange={(e) => onFilterChange("company", e.target.value)}
            className="h-8 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface)] px-2.5 text-xs font-medium text-slate-700 outline-none hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 max-w-[150px] truncate cursor-pointer"
            aria-label="Filter by company"
          >
            <option value="">All Companies</option>
            {companies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-8 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface)] px-2.5 text-xs font-medium text-slate-700 outline-none hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default QuestionFilterToolbar;
