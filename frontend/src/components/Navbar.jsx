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
    { label: "Dashboard", description: "Overview and progress", path: "/dashboard" },
    { label: "Question Bank", description: "Browse by topic", path: "/questions" },
    { label: "Practice", description: "Solve one by one", path: "/practice" },
    { label: "Mock Tests", description: "Timed test rounds", path: "/mock-tests" },
    { label: "Review Mistakes", description: "Fix weak areas", path: "/review-mistakes" },
    { label: "AI Interviewer", description: "Practice interview answers", path: "/ai-interviewer" },
    { label: "Bookmarks", description: "Saved revision set", path: "/bookmarks" },
    { label: "History", description: "Past attempts", path: "/history" },
    { label: "Profile", description: "Account and targets", path: "/profile" }
  ];

  return (
    <>
      <aside className="app-sidebar">
        <div className="sidebar-scroll-area">
          <div className="sidebar-top-block">
            <Link className="sidebar-brand" to="/dashboard">
              <Brand />
            </Link>
            <p className="sidebar-subtitle mb-0">
              Move through your daily preparation from one focused workspace.
            </p>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink key={item.path} className="sidebar-link" to={item.path}>
                <span className="sidebar-link-copy">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </aside>

      <header className="app-topbar">
        <div className="topbar-left-group d-flex flex-column">
          <p className="eyebrow mb-1">Interview Command Center</p>
          <h2 className="topbar-title mb-0">Build interview confidence with structured daily momentum.</h2>
        </div>
        <Link className="profile-chip shell-panel" to="/profile">
          <div className="profile-chip-text">
            <span className="profile-chip-kicker">Profile workspace</span>
            <strong>{currentUser?.name || "Profile"}</strong>
            <span>Open profile dashboard</span>
          </div>
          <AvatarChip user={currentUser} />
        </Link>
      </header>
    </>
  );
};

export default Navbar;
