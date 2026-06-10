import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={`snx-btn-secondary !h-10 w-full [&_svg]:text-slate-custom-700 dark:[&_svg]:text-slate-custom-100 ${className}`.trim()}
    >
      {isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
};

export default ThemeToggle;
