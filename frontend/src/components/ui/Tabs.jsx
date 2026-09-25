import { motion } from "framer-motion";

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  variant = "pill", // 'pill' | 'line'
  className = "",
  size = "md"
}) => {
  const sizeClasses = {
    sm: "text-xs py-1 px-2.5",
    md: "text-xs sm:text-sm py-1.5 px-3.5",
    lg: "text-sm py-2 px-4"
  };

  if (variant === "line") {
    return (
      <div className={`flex border-b border-[var(--snx-border)] gap-6 dark:border-slate-800 ${className}`.trim()}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative pb-3 flex items-center gap-2 font-medium transition duration-150 select-none ${
                sizeClasses[size]
              } ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Pill / Segmented variant
  return (
    <div
      role="tablist"
      className={`inline-flex items-center rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-1 dark:border-slate-800 ${className}`.trim()}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center justify-center gap-1.5 rounded-md font-medium transition duration-150 select-none z-10 ${
              sizeClasses[size]
            } ${
              isActive
                ? "text-slate-900 dark:text-white font-semibold"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="rounded-full bg-slate-200/60 dark:bg-slate-700/60 px-1.5 py-0.2 text-[10px]">
                {tab.count}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 rounded-md bg-[var(--snx-surface)] shadow-subtle -z-10 dark:bg-slate-800"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
