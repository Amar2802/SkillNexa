export const PageContainer = ({
  children,
  className = "",
  header = null,
  title = "",
  description = "",
  actions = null,
  maxWidth = "max-w-7xl"
}) => {
  return (
    <div className={`mx-auto w-full ${maxWidth} px-4 sm:px-6 lg:px-8 py-6 space-y-6 ${className}`.trim()}>
      {(title || header || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--snx-border-subtle)] dark:border-slate-800/80">
          {header ? (
            header
          ) : (
            <div className="space-y-1">
              {title && (
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>
          )}
          {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
};

export default PageContainer;
