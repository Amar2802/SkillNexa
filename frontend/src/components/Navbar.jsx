import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const navIcons = {
  dashboard: (
    <svg viewBox="0 0 24 24" className="snx-nav-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 13h6V4H4zm10 7h6v-9h-6zM4 20h6v-5H4zm10-9h6V4h-6z" />
    </svg>
  ),
  questions: (
    <svg viewBox="0 0 24 24" className="snx-nav-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 7h8M8 12h8M8 17h5" />
      <path d="M5 4h14a2 2 0 0 1 2 2v12l-4-2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
    </svg>
  ),
  practice: (
    <svg viewBox="0 0 24 24" className="snx-nav-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m14 4 6 6-9 9H5v-6z" />
      <path d="m13 5 6 6" />
    </svg>
  ),
  tests: (
    <svg viewBox="0 0 24 24" className="snx-nav-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" className="snx-nav-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.36 6.36-2.12-2.12M8.76 8.76 6.64 6.64m11.72 0-2.12 2.12M8.76 15.24l-2.12 2.12" />
      <circle cx="12" cy="12" r="4.5" />
    </svg>
  ),
  bookmarks: (
    <svg viewBox="0 0 24 24" className="snx-nav-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 4h12v16l-6-4-6 4z" />
    </svg>
  ),
  history: (
    <svg viewBox="0 0 24 24" className="snx-nav-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" className="snx-nav-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  )
};

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: navIcons.dashboard },
  { label: "Question Bank", path: "/questions", icon: navIcons.questions },
  { label: "Practice", path: "/practice", icon: navIcons.practice },
  { label: "Mock Tests", path: "/mock-tests", icon: navIcons.tests },
  { label: "AI Interviewer", path: "/ai-interviewer", icon: navIcons.ai },
  { label: "Bookmarks", path: "/bookmarks", icon: navIcons.bookmarks },
  { label: "History", path: "/history", icon: navIcons.history },
  { label: "Profile", path: "/profile", icon: navIcons.profile }
];

const Avatar = ({ user }) => {
  const initials = (user?.name || "SN")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return user?.avatar ? (
    <img src={user.avatar} alt={user.name} className="snx-profile-avatar" />
  ) : (
    <div className="snx-profile-avatar snx-profile-avatar-fallback">{initials}</div>
  );
};

const Brand = () => (
  <div className="snx-brand-lockup">
    <div className="snx-brand-badge">
      <img src="/skillnexa-logo.svg" alt="SkillNexa logo" className="snx-brand-logo" />
    </div>
    <div>
      <div className="snx-brand-wordmark">SkillNexa</div>
      <div className="snx-brand-caption">AI Interview Preparation</div>
    </div>
  </div>
);

const Navbar = ({ user, profile, theme, setTheme }) => {
  if (!user) return null;

  const currentUser = profile || user;

  return (
    <>
      <aside className="app-sidebar snx-sidebar-shell">
        <div className="snx-sidebar-card">
          <Link to="/dashboard" className="text-decoration-none">
            <Brand />
          </Link>
        </div>

        <div className="snx-sidebar-card snx-profile-card">
          <div className="d-flex align-items-center gap-3">
            <Avatar user={currentUser} />
            <div className="flex-grow-1 min-w-0">
              <div className="snx-profile-name text-truncate">{currentUser?.name || "Learner"}</div>
              <div className="snx-profile-email text-truncate">{currentUser?.email || "AI workspace"}</div>
            </div>
          </div>
        </div>

        <nav className="snx-sidebar-card snx-nav-card">
          <div className="snx-nav-list">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => `snx-nav-link ${isActive ? "active" : ""}`}>
                <span className="snx-nav-link-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="snx-sidebar-card mt-auto">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </aside>

      <header className="app-topbar snx-topbar-shell">
        <div>
          <div className="snx-topbar-label">AI Interview Command Center</div>
          <h2 className="snx-topbar-title">Practice smarter with a cleaner, focused interview workspace.</h2>
        </div>
        <Link to="/profile" className="snx-topbar-profile text-decoration-none">
          <div className="text-end">
            <div className="snx-topbar-profile-label">Profile Workspace</div>
            <div className="snx-topbar-profile-name">{currentUser?.name || "Profile"}</div>
          </div>
          <Avatar user={currentUser} />
        </Link>
      </header>
    </>
  );
};

export default Navbar;
