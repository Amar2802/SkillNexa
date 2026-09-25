import { FiCheckCircle, FiClock, FiAlertCircle, FiInfo, FiActivity } from "react-icons/fi";

const difficultyConfigs = {
  easy: {
    label: "Easy",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500"
  },
  medium: {
    label: "Medium",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500"
  },
  hard: {
    label: "Hard",
    className: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
    dot: "bg-rose-500"
  }
};

const progressConfigs = {
  not_started: {
    label: "Not Started",
    icon: FiClock,
    className: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-400"
  },
  in_progress: {
    label: "In Progress",
    icon: FiActivity,
    className: "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
  },
  completed: {
    label: "Completed",
    icon: FiCheckCircle,
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
  }
};

const statusConfigs = {
  success: {
    icon: FiCheckCircle,
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
  },
  warning: {
    icon: FiAlertCircle,
    className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
  },
  error: {
    icon: FiAlertCircle,
    className: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400"
  },
  info: {
    icon: FiInfo,
    className: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400"
  },
  neutral: {
    className: "border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-slate-700 dark:border-slate-700 dark:text-slate-300"
  }
};

export const Badge = ({
  children,
  variant,
  difficulty,
  progress,
  icon: CustomIcon,
  size = "md",
  className = ""
}) => {
  let label = children;
  let styleClasses = statusConfigs.neutral.className;
  let Icon = CustomIcon;
  let Dot = null;

  if (difficulty) {
    const key = String(difficulty).toLowerCase();
    const config = difficultyConfigs[key] || difficultyConfigs.medium;
    label = children || config.label;
    styleClasses = config.className;
    Dot = config.dot;
  } else if (progress) {
    const key = String(progress).toLowerCase().replace(/[\s-]/g, "_");
    const config = progressConfigs[key] || progressConfigs.not_started;
    label = children || config.label;
    styleClasses = config.className;
    Icon = Icon || config.icon;
  } else if (variant && statusConfigs[variant]) {
    const config = statusConfigs[variant];
    styleClasses = config.className;
    Icon = Icon || config.icon;
  }

  const sizeClass = size === "sm" ? "px-1.5 py-0.2 text-[10px] gap-1" : "px-2 py-0.5 text-xs gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border select-none ${sizeClass} ${styleClasses} ${className}`.trim()}
    >
      {Dot && <span className={`h-1.5 w-1.5 rounded-full ${Dot}`} aria-hidden="true" />}
      {Icon && <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />}
      <span>{label}</span>
    </span>
  );
};

export default Badge;
