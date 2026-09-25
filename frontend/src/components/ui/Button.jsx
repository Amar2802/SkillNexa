import { forwardRef } from "react";

const variantClasses = {
  primary:
    "bg-indigo-600 text-white shadow-subtle hover:bg-indigo-700 active:scale-[0.98] border border-transparent focus-visible:ring-indigo-500",
  secondary:
    "border border-[var(--snx-border)] bg-[var(--snx-surface)] text-slate-800 shadow-subtle hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:border-slate-600",
  outline:
    "border border-indigo-600/30 bg-transparent text-indigo-600 hover:bg-indigo-50 active:scale-[0.98] focus-visible:ring-indigo-500 dark:border-indigo-400/40 dark:text-indigo-400 dark:hover:bg-indigo-950/40",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98] focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
  danger:
    "bg-rose-600 text-white shadow-subtle hover:bg-rose-700 active:scale-[0.98] border border-transparent focus-visible:ring-rose-500",
  icon:
    "p-0 aspect-square text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
};

const sizeClasses = {
  sm: "h-8 px-3 text-xs rounded-md gap-1.5",
  md: "h-9 px-4 text-sm rounded-lg gap-2",
  lg: "h-11 px-5 text-base rounded-lg gap-2.5",
  icon: "h-9 w-9 rounded-lg"
};

export const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    loading = false,
    icon: Icon = null,
    iconRight: IconRight = null,
    type = "button",
    ...props
  },
  ref
) {
  const isIconOnly = variant === "icon" || (!children && Boolean(Icon));
  const appliedSize = isIconOnly ? "icon" : size;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading ? "true" : undefined}
      className={`inline-flex items-center justify-center font-medium transition duration-150 select-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60 ${
        variantClasses[variant] || variantClasses.primary
      } ${sizeClasses[appliedSize] || sizeClasses.md} ${className}`.trim()}
      {...props}
    >
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : Icon ? (
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      ) : null}

      {children ? <span>{children}</span> : null}

      {!loading && IconRight ? (
        <IconRight className="h-4 w-4 shrink-0" aria-hidden="true" />
      ) : null}
    </button>
  );
});

export default Button;
