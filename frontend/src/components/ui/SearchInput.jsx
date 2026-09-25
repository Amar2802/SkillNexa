import { forwardRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export const SearchInput = forwardRef(function SearchInput(
  {
    value = "",
    onChange,
    onClear,
    placeholder = "Search...",
    shortcutKey = "⌘K",
    className = "",
    size = "md",
    disabled = false,
    ...props
  },
  ref
) {
  const sizeClasses = {
    sm: "h-8 text-xs pl-8 pr-12",
    md: "h-9 text-sm pl-9 pr-14",
    lg: "h-11 text-sm pl-10 pr-16"
  };

  const iconSizes = {
    sm: "h-3.5 w-3.5 left-2.5",
    md: "h-4 w-4 left-3",
    lg: "h-4.5 w-4.5 left-3.5"
  };

  return (
    <div className={`relative flex items-center w-full ${className}`.trim()}>
      <div className={`pointer-events-none absolute text-slate-400 ${iconSizes[size] || iconSizes.md}`}>
        <FiSearch className="h-full w-full" aria-hidden="true" />
      </div>

      <input
        ref={ref}
        type="search"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface)] text-[var(--snx-text-primary)] shadow-subtle outline-none transition duration-150 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-75 dark:border-slate-700 dark:disabled:bg-slate-800/60 ${
          sizeClasses[size] || sizeClasses.md
        }`}
        {...props}
      />

      <div className="absolute right-2.5 flex items-center gap-1.5">
        {value && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            aria-label="Clear search"
          >
            <FiX className="h-3.5 w-3.5" />
          </button>
        ) : shortcutKey ? (
          <kbd className="hidden sm:inline-flex items-center justify-center rounded border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shadow-subtle dark:border-slate-700">
            {shortcutKey}
          </kbd>
        ) : null}
      </div>
    </div>
  );
});

export default SearchInput;
