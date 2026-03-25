import { NavLink, Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const AvatarChip = ({ user }) => {
  const initials = (user?.name || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return user?.avatar ? (
    <img src={user.avatar} alt={user.name} className="shell-avatar" />
  ) : (
    <div className="shell-avatar shell-avatar-fallback">{initials}</div>
  );
};

const Brand = () => (
  <span className="brand-lockup">
    <img src="/skillnexa-logo.svg" alt="SkillNexa logo" className="brand-logo" />
    <span className="brand-wordmark">SkillNexa</span>
  </span>
);

const Navbar = ({ user, profile, logout, theme, setTheme }) => {
  if (!user) {
    return (
      <header className="auth-topbar">
        <Link className="navbar-brand fw-bold" to="/login"><Brand /></Link>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </header>
    );
  }

  const currentUser = profile || user;
  const navItems = [
    ["Dashboard", "/dashboard"],
    ["Question Bank", "/questions"],
    ["Practice", "/practice"],
    ["Mock Tests", "/mock-tests"],
    ["Review Mistakes", "/review-mistakes"],
    ["AI Interviewer", "/ai-interviewer"],
    ["Bookmarks", "/bookmarks"],
    ["History", "/history"],
    ["Profile", "/profile"]
  ];

  return (
    <>
      <aside className="app-sidebar">
        <div>
          <Link className="sidebar-brand" to="/dashboard"><Brand /></Link>
          <p className="sidebar-subtitle">Prepare smarter with mock tests, coding rounds, and AI coaching.</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(([label, path]) => (
            <NavLink key={path} className="sidebar-link" to={path}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="btn btn-info w-100" onClick={logout}>Logout</button>
        </div>
      </aside>
      <header className="app-topbar">
        <div>
          <p className="eyebrow mb-1">Interview Command Center</p>
          <h2 className="topbar-title mb-0">Stay consistent and track your growth.</h2>
        </div>
        <div className="topbar-actions">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <Link className="profile-chip" to="/profile">
            <div className="profile-chip-text">
              <strong>{currentUser?.name || "Profile"}</strong>
              <span>Open profile dashboard</span>
            </div>
            <AvatarChip user={currentUser} />
          </Link>
        </div>
      </header>
    </>
  );
};

export default Navbar;
