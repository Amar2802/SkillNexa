import { forwardRef } from "react";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

export const Input = forwardRef(function Input(
  {
    label,
    error,
    success,
    hint,
    startIcon: StartIcon,
    endIcon: EndIcon,
    className = "",
    containerClassName = "",
    id,
    disabled = false,
    ...props
  },
  ref
) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`.trim()}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {StartIcon && (
          <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
            <StartIcon className="h-4 w-4" aria-hidden="true" />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error
              ? `${inputId}-error`
              : hint
              ? `${inputId}-hint`
              : undefined
          }
          className={`h-10 w-full rounded-lg border bg-[var(--snx-surface)] text-sm text-[var(--snx-text-primary)] shadow-subtle outline-none transition duration-150 placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-75 dark:disabled:bg-slate-800/60 ${
            StartIcon ? "pl-9" : "pl-3.5"
          } ${
            EndIcon || error || success ? "pr-9" : "pr-3.5"
          } ${
            error
              ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900 dark:text-rose-200"
              : success
              ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20 text-emerald-900 dark:text-emerald-200"
              : "border-[var(--snx-border)] focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700"
          } ${className}`.trim()}
          {...props}
        />

        <div className="pointer-events-none absolute right-3 flex items-center">
          {error ? (
            <FiAlertCircle className="h-4 w-4 text-rose-500" aria-hidden="true" />
          ) : success ? (
            <FiCheckCircle className="h-4 w-4 text-emerald-500" aria-hidden="true" />
          ) : EndIcon ? (
            <EndIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
          ) : null}
        </div>
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="text-xs font-medium text-rose-600 dark:text-rose-400" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
