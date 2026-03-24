const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 2.8V5.2M12 18.8V21.2M21.2 12H18.8M5.2 12H2.8M18.5 5.5L16.8 7.2M7.2 16.8L5.5 18.5M18.5 18.5L16.8 16.8M7.2 7.2L5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M20 14.2C19.1 14.6 18.1 14.8 17 14.8C13 14.8 9.8 11.6 9.8 7.6C9.8 6.5 10 5.5 10.4 4.6C6.8 5.3 4 8.5 4 12.3C4 16.7 7.6 20.3 12 20.3C15.8 20.3 19 17.5 20 14.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

const ThemeToggle = ({ theme, setTheme }) => (
  <button
    className="theme-toggle-btn"
    type="button"
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    title={theme === "dark" ? "Light mode" : "Dark mode"}
  >
    <span className="theme-toggle-icon">{theme === "dark" ? <SunIcon /> : <MoonIcon />}</span>
    <span className="theme-toggle-text">{theme === "dark" ? "Light" : "Dark"}</span>
  </button>
);

export default ThemeToggle;
