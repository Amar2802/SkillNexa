export const Progress = ({
  value = 0,
  max = 100,
  label = "",
  showPercentage = false,
  variant = "primary", // 'primary' | 'success' | 'warning' | 'danger'
  size = "md",
  className = ""
}) => {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  const variantStyles = {
    primary: "bg-indigo-600",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500"
  };

  const heightClasses = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3"
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`.trim()}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs">
          {label && (
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="font-mono text-slate-500 dark:text-slate-400">
              {percentage}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={`w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 ${
          heightClasses[size] || heightClasses.md
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            variantStyles[variant] || variantStyles.primary
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;
