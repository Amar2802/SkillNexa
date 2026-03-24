const ThemeToggle = ({ theme, setTheme }) => (
  <button className="btn btn-sm btn-outline-light" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
    {theme === "dark" ? "Light" : "Dark"} Mode
  </button>
);

export default ThemeToggle;
