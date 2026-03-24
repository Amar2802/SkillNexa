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

const Navbar = ({ user, profile, logout, theme, setTheme }) => {
  if (!user) {
    return (
      <header className="auth-topbar">
        <Link className="navbar-brand fw-bold" to="/login">SkillNexa</Link>
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
    ["AI Interviewer", "/ai-interviewer"],
    ["Bookmarks", "/bookmarks"],
    ["History", "/history"],
    ["Profile", "/profile"]
  ];

  return (
    <>
      <aside className="app-sidebar">
        <div>
          <Link className="sidebar-brand" to="/dashboard">SkillNexa</Link>
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
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button className="btn btn-info w-100 mt-3" onClick={logout}>Logout</button>
        </div>
      </aside>
      <header className="app-topbar">
        <div>
          <p className="eyebrow mb-1">Interview Command Center</p>
          <h2 className="topbar-title mb-0">Stay consistent and track your growth.</h2>
        </div>
        <Link className="profile-chip" to="/profile">
          <div className="profile-chip-text">
            <strong>{currentUser?.name || "Profile"}</strong>
            <span>{currentUser?.email || "Update your profile photo"}</span>
          </div>
          <AvatarChip user={currentUser} />
        </Link>
      </header>
    </>
  );
};

export default Navbar;
