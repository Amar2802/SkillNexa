import { useState } from "react";

export const Tooltip = ({
  content,
  children,
  position = "top",
  delay = 200,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const show = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hide = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2"
  };

  if (!content) return children;

  return (
    <div
      className={`relative inline-flex ${className}`.trim()}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-[var(--snx-border)] bg-slate-900 px-2 py-1 text-[11px] font-medium text-white shadow-dropdown dark:border-slate-700 dark:bg-slate-800 ${
            positionStyles[position] || positionStyles.top
          }`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
