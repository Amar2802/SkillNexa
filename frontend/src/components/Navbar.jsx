import { Link, NavLink } from "react-router-dom";
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
    <span>
      <span className="brand-wordmark">SkillNexa</span>
      <span className="brand-caption">Software interview studio</span>
    </span>
  </span>
);

const Navbar = ({ user, profile, theme, setTheme }) => {
  if (!user) {
    return null;
  }

  const currentUser = profile || user;
  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Question Bank", path: "/questions" },
    { label: "Practice", path: "/practice" },
    { label: "Mock Tests", path: "/mock-tests" },
    { label: "Review Mistakes", path: "/review-mistakes" },
    { label: "AI Interviewer", path: "/ai-interviewer" },
    { label: "Bookmarks", path: "/bookmarks" },
    { label: "History", path: "/history" },
    { label: "Profile", path: "/profile" }
  ];

  return (
    <header className="app-topbar topbar-horizontal-shell">
      <div className="topbar-main-row">
        <div className="topbar-brand-row shell-panel">
          <Link className="sidebar-brand topbar-brand-link" to="/dashboard"><Brand /></Link>
          <div className="topbar-title-block">
            <p className="eyebrow mb-1">Interview Command Center</p>
            <h2 className="topbar-title mb-0">Build interview confidence with structured daily momentum.</h2>
          </div>
        </div>
        <div className="topbar-actions">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <Link className="profile-chip shell-panel" to="/profile">
            <div className="profile-chip-text">
              <span className="profile-chip-kicker">Profile workspace</span>
              <strong>{currentUser?.name || "Profile"}</strong>
              <span>Open profile dashboard</span>
            </div>
            <AvatarChip user={currentUser} />
          </Link>
        </div>
      </div>
      <nav className="topbar-nav-shell shell-panel">
        <div className="topbar-nav-scroll">
          {navItems.map((item) => (
            <NavLink key={item.path} className="topbar-nav-link" to={item.path}>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
