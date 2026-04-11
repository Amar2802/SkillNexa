import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
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

const Navbar = ({ user, profile, logout, theme, setTheme }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (!user) {
    return null;
  }

  const currentUser = profile || user;
  const navItems = [
    { label: "Dashboard", path: "/dashboard", hint: "Overview and progress" },
    { label: "Question Bank", path: "/questions", hint: "Scroll through software questions" },
    { label: "Practice", path: "/practice", hint: "One-by-one focused training" },
    { label: "Mock Tests", path: "/mock-tests", hint: "Timed placement-style rounds" },
    { label: "Review Mistakes", path: "/review-mistakes", hint: "Turn errors into revision" },
    { label: "AI Interviewer", path: "/ai-interviewer", hint: "Round-based interview simulation" },
    { label: "Bookmarks", path: "/bookmarks", hint: "Saved questions to revisit" },
    { label: "History", path: "/history", hint: "Past attempts and results" },
    { label: "Profile", path: "/profile", hint: "Manage your preparation profile" }
  ];

  return (
    <>
      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />
      <aside className={`app-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="sidebar-scroll-area">
          <div className="sidebar-top-block shell-panel">
            <Link className="sidebar-brand" to="/dashboard"><Brand /></Link>
            <p className="sidebar-subtitle">Prepare smarter with coding rounds, mock tests, analytics, and AI-guided practice.</p>
            <div className="sidebar-status-pill">
              <span className="status-dot" />
              Software Prep Active
            </div>
          </div>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink key={item.path} className="sidebar-link" to={item.path} onClick={() => setSidebarOpen(false)}>
                <span className="sidebar-link-copy">
                  <strong>{item.label}</strong>
                  <small>{item.hint}</small>
                </span>
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-footer">
            <button className="btn btn-info w-100 shell-logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>
      </aside>
      <header className="app-topbar">
        <div className="topbar-left-group">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((current) => !current)}
            aria-label="Toggle navigation"
          >
            <span />
            <span />
            <span />
          </button>
          <div className="topbar-intro shell-panel">
            <p className="eyebrow mb-1">Interview Command Center</p>
            <h2 className="topbar-title mb-1">Build interview confidence with structured daily momentum.</h2>
            <div className="topbar-meta-row">
              <span className="topbar-meta-pill">Software placement prep</span>
              <span className="topbar-meta-pill">Responsive workspace</span>
            </div>
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
      </header>
    </>
  );
};

export default Navbar;
