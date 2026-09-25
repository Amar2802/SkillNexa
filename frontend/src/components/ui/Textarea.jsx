import { forwardRef } from "react";
import { FiAlertCircle } from "react-icons/fi";

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    hint,
    className = "",
    containerClassName = "",
    id,
    disabled = false,
    rows = 4,
    ...props
  },
  ref
) {
  const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`.trim()}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : hint
              ? `${textareaId}-hint`
              : undefined
          }
          className={`w-full rounded-lg border bg-[var(--snx-surface)] px-3.5 py-2.5 text-sm text-[var(--snx-text-primary)] shadow-subtle outline-none transition duration-150 placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-75 dark:disabled:bg-slate-800/60 ${
            error
              ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900 dark:text-rose-200"
              : "border-[var(--snx-border)] focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700"
          } ${className}`.trim()}
          {...props}
        />
      </div>

      {error ? (
        <div id={`${textareaId}-error`} className="flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400" role="alert">
          <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : hint ? (
        <p id={`${textareaId}-hint`} className="text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Textarea;
