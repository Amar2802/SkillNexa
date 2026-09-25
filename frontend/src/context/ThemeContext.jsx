import { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEME_KEY = "theme";
const ThemeContext = createContext(null);

const getSystemTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light" || stored === "system") {
    return stored;
  }
  return "light";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [effectiveTheme, setEffectiveTheme] = useState(() => (theme === "system" ? getSystemTheme() : theme));

  useEffect(() => {
    const applyEffective = (resolved) => {
      document.documentElement.setAttribute("data-theme", resolved);
      document.documentElement.classList.toggle("dark", resolved === "dark");
      document.documentElement.style.colorScheme = resolved;
      setEffectiveTheme(resolved);
    };

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyEffective(mediaQuery.matches ? "dark" : "light");

      const handler = (e) => applyEffective(e.matches ? "dark" : "light");
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      applyEffective(theme);
    }

    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    effectiveTheme,
    setTheme,
    toggleTheme: () => setTheme((current) => {
      const resolved = current === "system" ? effectiveTheme : current;
      return resolved === "dark" ? "light" : "dark";
    })
  }), [theme, effectiveTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
