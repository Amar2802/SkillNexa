import { useState } from "react";
import { FiFilter, FiX, FiCheck } from "react-icons/fi";
import SearchInput from "../ui/SearchInput";
import Button from "../ui/Button";

export const ProblemFilters = ({
  filters = {},
  onFilterChange,
  onClearFilters,
  categories = [],
  difficulties = ["Easy", "Medium", "Hard"],
  types = [],
  companies = [],
  selectedType = "all",
  onTypeChange,
  totalCount = 0,
  activeFilterCount = 0
}) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <div className="space-y-3">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <SearchInput
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            onClear={() => onFilterChange("search", "")}
            placeholder="Search problems by title, topic, company..."
            size="md"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex sm:hidden items-center justify-center gap-1.5 h-9 px-3 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface)] text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
          >
            <FiFilter className="h-3.5 w-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="h-4.5 w-4.5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Quick Clear Button */}
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition dark:hover:text-white"
            >
              <FiX className="h-3.5 w-3.5" />
              <span>Clear filters ({activeFilterCount})</span>
            </button>
          )}

          <span className="text-xs font-mono text-slate-400 hidden sm:inline-block">
            {totalCount} problems
          </span>
        </div>
      </div>

      {/* Desktop Filter Row */}
      <div className="hidden sm:flex flex-wrap items-center gap-2 pt-1 border-t border-[var(--snx-border-subtle)] dark:border-slate-800">
        {/* Type / Format Pills */}
        <div className="flex items-center rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-0.5 dark:border-slate-800">
          {(types || []).map((t) => {
            const active = selectedType === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTypeChange(t.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition duration-150 ${
                  active
                    ? "bg-[var(--snx-surface)] text-slate-900 shadow-subtle dark:text-white font-semibold"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Difficulty Dropdown */}
        <select
          value={filters.difficulty || ""}
          onChange={(e) => onFilterChange("difficulty", e.target.value)}
          className="h-8 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface)] px-2.5 text-xs text-slate-700 outline-none hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          aria-label="Filter by difficulty"
        >
          <option value="">Difficulty: All</option>
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff}
            </option>
          ))}
        </select>

        {/* Category Dropdown */}
        <select
          value={filters.category || ""}
          onChange={(e) => onFilterChange("category", e.target.value)}
          className="h-8 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface)] px-2.5 text-xs text-slate-700 outline-none hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          aria-label="Filter by category"
        >
          <option value="">Category: All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Company Dropdown */}
        {companies.length > 0 && (
          <select
            value={filters.company || ""}
            onChange={(e) => onFilterChange("company", e.target.value)}
            className="h-8 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface)] px-2.5 text-xs text-slate-700 outline-none hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            aria-label="Filter by company"
          >
            <option value="">Company: All</option>
            {companies.slice(0, 15).map((comp) => (
              <option key={comp} value={comp}>
                {comp}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Mobile Filters Drawer / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-sm sm:hidden">
          <div className="max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-[var(--snx-border)] bg-[var(--snx-surface-elevated)] p-5 space-y-4 shadow-dropdown dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--snx-border-subtle)] dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Filter Problems</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Question Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(types || []).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => onTypeChange(t.id)}
                      className={`h-8 rounded-lg border text-xs font-medium transition ${
                        selectedType === t.id
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-semibold"
                          : "border-[var(--snx-border)] text-slate-600 dark:border-slate-700 dark:text-slate-400"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Difficulty
                </label>
                <select
                  value={filters.difficulty || ""}
                  onChange={(e) => onFilterChange("difficulty", e.target.value)}
                  className="snx-select text-xs !h-9"
                >
                  <option value="">All Difficulties</option>
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Category
                </label>
                <select
                  value={filters.category || ""}
                  onChange={(e) => onFilterChange("category", e.target.value)}
                  className="snx-select text-xs !h-9"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--snx-border-subtle)] dark:border-slate-800 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => {
                  onClearFilters();
                  setMobileFilterOpen(false);
                }}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => setMobileFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemFilters;
