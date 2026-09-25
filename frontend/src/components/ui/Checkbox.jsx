import { forwardRef } from "react";
import { FiCheck } from "react-icons/fi";

export const Checkbox = forwardRef(function Checkbox(
  {
    label,
    description,
    checked = false,
    onChange,
    id,
    disabled = false,
    className = "",
    error,
    ...props
  },
  ref
) {
  const checkboxId = id || (label ? `check-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <label
      htmlFor={checkboxId}
      className={`inline-flex items-start gap-2.5 cursor-pointer select-none ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`.trim()}
    >
      <div className="relative flex items-center pt-0.5">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          className={`h-4.5 w-4.5 rounded border transition duration-150 flex items-center justify-center ${
            checked
              ? "bg-indigo-600 border-indigo-600 text-white"
              : error
              ? "border-rose-500 bg-[var(--snx-surface)]"
              : "border-[var(--snx-border)] bg-[var(--snx-surface)] hover:border-slate-400 dark:border-slate-700"
          } peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2`}
        >
          {checked && <FiCheck className="h-3 w-3 stroke-[3]" />}
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </span>
          )}
          {error && (
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
              {error}
            </span>
          )}
        </div>
      )}
    </label>
  );
});

export const Radio = forwardRef(function Radio(
  {
    label,
    description,
    checked = false,
    onChange,
    id,
    name,
    value,
    disabled = false,
    className = "",
    ...props
  },
  ref
) {
  const radioId = id || (label ? `radio-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <label
      htmlFor={radioId}
      className={`inline-flex items-start gap-2.5 cursor-pointer select-none ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`.trim()}
    >
      <div className="relative flex items-center pt-0.5">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          className={`h-4.5 w-4.5 rounded-full border transition duration-150 flex items-center justify-center ${
            checked
              ? "border-indigo-600 bg-indigo-600"
              : "border-[var(--snx-border)] bg-[var(--snx-surface)] hover:border-slate-400 dark:border-slate-700"
          } peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2`}
        >
          {checked && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
});

export const Toggle = forwardRef(function Toggle(
  {
    label,
    description,
    checked = false,
    onChange,
    id,
    disabled = false,
    className = "",
    ...props
  },
  ref
) {
  const toggleId = id || (label ? `toggle-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  return (
    <label
      htmlFor={toggleId}
      className={`inline-flex items-center justify-between gap-4 cursor-pointer select-none ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      } ${className}`.trim()}
    >
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </span>
          )}
        </div>
      )}

      <div className="relative flex items-center shrink-0">
        <input
          ref={ref}
          type="checkbox"
          id={toggleId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          className={`h-6 w-11 rounded-full transition-colors duration-200 ${
            checked ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
          } peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2`}
        >
          <div
            className={`h-5 w-5 rounded-full bg-white shadow-subtle transition-transform duration-200 ${
              checked ? "translate-x-5.5" : "translate-x-0.5"
            } mt-0.5`}
          />
        </div>
      </div>
    </label>
  );
});

export default { Checkbox, Radio, Toggle };
