import { forwardRef } from "react";
import { FiChevronDown, FiAlertCircle } from "react-icons/fi";

export const Select = forwardRef(function Select(
  {
    label,
    error,
    hint,
    options = [],
    children,
    className = "",
    containerClassName = "",
    id,
    disabled = false,
    placeholder = "Select an option",
    ...props
  },
  ref
) {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`.trim()}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error
              ? `${selectId}-error`
              : hint
              ? `${selectId}-hint`
              : undefined
          }
          className={`h-10 w-full appearance-none rounded-lg border bg-[var(--snx-surface)] pl-3.5 pr-10 text-sm text-[var(--snx-text-primary)] shadow-subtle outline-none transition duration-150 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-75 dark:disabled:bg-slate-800/60 ${
            error
              ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900 dark:text-rose-200"
              : "border-[var(--snx-border)] focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700"
          } ${className}`.trim()}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {children
            ? children
            : options.map((opt) => {
                const isObj = typeof opt === "object" && opt !== null;
                const value = isObj ? opt.value : opt;
                const optLabel = isObj ? opt.label || opt.value : opt;
                return (
                  <option key={String(value)} value={value}>
                    {optLabel}
                  </option>
                );
              })}
        </select>

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <FiChevronDown className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      {error ? (
        <div id={`${selectId}-error`} className="flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400" role="alert">
          <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : hint ? (
        <p id={`${selectId}-hint`} className="text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Select;
