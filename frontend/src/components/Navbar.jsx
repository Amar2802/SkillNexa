import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 13h6V4H4zm10 7h6v-9h-6zM4 20h6v-5H4zm10-9h6V4h-6z" />
    </svg>
  ),
  questions: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 7h8M8 12h8M8 17h5" />
      <path d="M5 4h14a2 2 0 0 1 2 2v12l-4-2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
    </svg>
  ),
  practice: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m14 4 6 6-9 9H5v-6z" />
      <path d="m13 5 6 6" />
    </svg>
  ),
  tests: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
    </svg>
  ),
  mistakes: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6m0-6-6 6" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.36 6.36-2.12-2.12M8.76 8.76 6.64 6.64m11.72 0-2.12 2.12M8.76 15.24l-2.12 2.12" />
      <circle cx="12" cy="12" r="4.5" />
    </svg>
  ),
  bookmarks: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 4h12v16l-6-4-6 4z" />
    </svg>
  ),
  history: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  )
};

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: icons.dashboard },
  { label: "Question Bank", path: "/questions", icon: icons.questions },
  { label: "Practice", path: "/practice", icon: icons.practice },
  { label: "Mock Tests", path: "/mock-tests", icon: icons.tests },
  { label: "Review Mistakes", path: "/review-mistakes", icon: icons.mistakes },
  { label: "AI Interviewer", path: "/ai-interviewer", icon: icons.ai },
  { label: "Bookmarks", path: "/bookmarks", icon: icons.bookmarks },
  { label: "History", path: "/history", icon: icons.history },
  { label: "Profile", path: "/profile", icon: icons.profile }
];

const Avatar = ({ user }) => {
  const initials = (user?.name || "SN")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (user?.avatar) {
    return <img src={user.avatar} alt={user.name} className="h-11 w-11 rounded-2xl object-cover" />;
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-500 text-sm font-bold text-white">
      {initials}
    </div>
  );
};

const Brand = () => (
  <div className="flex items-center gap-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-500 shadow-[0_18px_40px_rgba(99,102,241,0.35)]">
      <img src="/skillnexa-logo.svg" alt="SkillNexa logo" className="h-7 w-7" />
    </div>
    <div>
      <p className="text-base font-semibold tracking-tight text-slate-950">SkillNexa</p>
      <p className="text-xs font-medium text-slate-500">AI interview preparation</p>
    </div>
  </div>
);

const Navbar = ({ user, profile, theme, setTheme }) => {
  if (!user) return null;

  const currentUser = profile || user;

  return (
    <>
      <div className="sticky top-0 z-[950] border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="mb-3 flex items-center justify-between gap-3">
          <Link to="/dashboard" className="no-underline">
            <Brand />
          </Link>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className="no-underline">
              {({ isActive }) => (
                <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap ${
                  isActive ? "bg-brand-500 text-white" : "border border-slate-200 bg-white text-slate-600"
                }`}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <aside className="app-sidebar hidden border-r border-slate-200/80 bg-white/90 px-4 py-5 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="flex h-full flex-col gap-6 overflow-y-auto">
          <Link to="/dashboard" className="snx-panel flex items-center gap-3 px-4 py-4 no-underline">
            <Brand />
          </Link>

          <div className="snx-panel p-4">
            <div className="mb-4 flex items-center gap-3">
              <Avatar user={currentUser} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">{currentUser?.name || "Learner"}</p>
                <p className="truncate text-xs text-slate-500">{currentUser?.email || "AI career workspace"}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-r from-brand-500 to-emerald-500 p-4 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-white/80">AI Studio</p>
              <p className="mt-2 text-sm font-medium leading-6 text-white/95">
                Build confidence with guided practice, live feedback, and interview simulations.
              </p>
            </div>
          </div>

          <nav className="snx-panel flex flex-1 flex-col gap-2 p-3">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className="no-underline">
                {({ isActive }) => (
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-brand-500 text-white shadow-[0_18px_32px_rgba(99,102,241,0.28)]"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    <span className={`${isActive ? "text-white" : "text-slate-400"}`}>{item.icon}</span>
                    <span>{item.label}</span>
                  </motion.div>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="snx-panel p-3">
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </aside>

      <header className="app-topbar hidden border-b border-slate-200/80 bg-white/70 px-6 py-4 backdrop-blur-xl lg:flex">
        <div className="flex min-w-0 flex-col">
          <span className="snx-badge mb-2 w-fit">AI Interview Command Center</span>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">
            Practice smarter, measure progress faster, and show portfolio-ready polish.
          </h2>
        </div>
        <Link to="/profile" className="snx-panel flex min-w-[260px] items-center gap-4 px-4 py-3 no-underline">
          <div className="min-w-0 flex-1 text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Profile Workspace</p>
            <p className="truncate text-sm font-semibold text-slate-950">{currentUser?.name || "Profile"}</p>
            <p className="truncate text-xs text-slate-500">Manage goals and preferences</p>
          </div>
          <Avatar user={currentUser} />
        </Link>
      </header>
    </>
  );
};

export default Navbar;
