import { forwardRef } from "react";
import Badge from "./Badge";

export const Card = forwardRef(function Card(
  {
    children,
    variant = "default",
    className = "",
    onClick,
    ...props
  },
  ref
) {
  const isClickable = Boolean(onClick) || variant === "interactive";

  const baseStyles =
    "rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-card)] transition duration-150 overflow-hidden shadow-subtle dark:border-slate-800";

  const variantStyles = {
    default: "",
    interactive:
      "cursor-pointer hover:border-slate-300 hover:shadow-card-hover active:scale-[0.99] dark:hover:border-slate-700",
    statistics:
      "p-5 flex flex-col justify-between",
    problem:
      "p-4 sm:p-5 hover:border-indigo-500/40 hover:shadow-card-hover",
    test:
      "p-5 hover:border-slate-300 hover:shadow-card-hover dark:hover:border-slate-700",
    interview:
      "p-5 border-indigo-500/20 bg-gradient-to-b from-[var(--snx-surface-card)] to-indigo-50/20 dark:to-indigo-950/10",
    course:
      "p-5 hover:border-slate-300 hover:shadow-card-hover",
    progress:
      "p-5 space-y-3",
    profile:
      "p-6 border-[var(--snx-border)]"
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`${baseStyles} ${variantStyles[variant] || ""} ${
        isClickable && variant === "default" ? variantStyles.interactive : ""
      } ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
});

export const CardHeader = ({ children, className = "", action = null }) => (
  <div className={`p-4 sm:p-5 pb-0 flex items-start justify-between gap-3 ${className}`.trim()}>
    <div className="space-y-1">{children}</div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const CardTitle = ({ children, className = "", as: Component = "h3" }) => (
  <Component className={`text-base font-semibold text-slate-900 dark:text-white ${className}`.trim()}>
    {children}
  </Component>
);

export const CardDescription = ({ children, className = "" }) => (
  <p className={`text-xs text-slate-500 dark:text-slate-400 ${className}`.trim()}>
    {children}
  </p>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 sm:p-5 ${className}`.trim()}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = "" }) => (
  <div
    className={`p-4 sm:p-5 pt-0 border-t border-[var(--snx-border-subtle)] mt-2 flex items-center justify-between gap-3 dark:border-slate-800 ${className}`.trim()}
  >
    {children}
  </div>
);

export const StatCard = ({ label, value, delta, icon: Icon, description }) => (
  <Card variant="statistics">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </span>
      {Icon && (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--snx-surface-subtle)] text-slate-600 dark:text-slate-300">
          <Icon className="h-4 w-4" />
        </div>
      )}
    </div>
    <div className="mt-3 flex items-baseline gap-2">
      <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {value}
      </span>
      {delta && (
        <span
          className={`text-xs font-semibold ${
            delta.startsWith("+")
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          }`}
        >
          {delta}
        </span>
      )}
    </div>
    {description && (
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>
    )}
  </Card>
);

export const ProblemCard = ({ title, difficulty, topic, acceptance, onClick }) => (
  <Card variant="problem" onClick={onClick} className="cursor-pointer group">
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors dark:text-white dark:group-hover:text-indigo-400">
          {title}
        </h4>
        <div className="flex items-center gap-2">
          {difficulty && <Badge difficulty={difficulty} size="sm" />}
          {topic && (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {topic}
            </span>
          )}
        </div>
      </div>
      {acceptance && (
        <span className="text-xs text-slate-400 font-mono">{acceptance}</span>
      )}
    </div>
  </Card>
);

export default Card;
