import { useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBarChart2,
  FiBookmark,
  FiClock,
  FiCpu,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiUser,
  FiX,
  FiCompass,
  FiBookOpen,
  FiSettings,
  FiZap
} from "react-icons/fi";
import SkillNexaLogo from "./SkillNexaLogo";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: FiGrid },
  { label: "Learning Roadmaps", path: "/roadmaps", icon: FiCompass },
  { label: "Question Bank", path: "/questions", icon: FiSearch },
  { label: "Practice IDE", path: "/practice", icon: FiCpu },
  { label: "Mock Tests", path: "/mock-tests", icon: FiBarChart2 },
  { label: "AI Interviewer", path: "/ai-interviewer", icon: FiZap },
  { label: "Revision Cards", path: "/revision", icon: FiBookOpen },
  { label: "Bookmarks", path: "/bookmarks", icon: FiBookmark },
  { label: "History", path: "/history", icon: FiClock },
  { label: "Profile", path: "/profile", icon: FiUser },
  { label: "Admin Panel", path: "/admin", icon: FiSettings }
];

const Avatar = ({ user }) => {
  const initials = (user?.name || "SN")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (user?.avatar) {
    return <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-xl object-cover ring-2 ring-indigo-500/40 shadow-sm" />;
  }

  return (
    <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-xs font-bold text-white shadow-sm ring-2 ring-indigo-500/20">
      {initials}
    </div>
  );
};

const SidebarNav = ({ closeMenu, user }) => {
  const visibleItems = navItems.filter((item) => {
    if (item.path === "/admin") {
      return user && (user.role === "admin" || String(user.email).toLowerCase().includes("admin"));
    }
    return true;
  });

  return (
    <nav className="flex flex-col gap-1.5 py-1">
      {visibleItems.map(({ label, path, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          onClick={closeMenu}
          className={({ isActive }) =>
            `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-slate-700 dark:group-hover:text-indigo-400"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="truncate">{label}</span>
              {isActive && (
                <motion.span
                  layoutId="activeNavPill"
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

const Navbar = ({ user, profile, logout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const currentUser = profile || user;

  const activeMeta = useMemo(() => {
    const found = navItems.find((item) => location.pathname.startsWith(item.path));
    return found || navItems[0];
  }, [location.pathname]);

  if (!user) return null;

  const submitSearch = (event) => {
    event.preventDefault();
    const trimmed = search.trim();
    navigate(trimmed ? `/questions?search=${encodeURIComponent(trimmed)}` : "/questions");
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop & Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] border-r border-slate-200 bg-white/95 backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/95 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:shadow-none"
        }`}
      >
        <div className="snx-scrollbar flex h-screen flex-col gap-3 p-4">
          <div className="flex items-center justify-between px-1">
            <SkillNexaLogo showTagline={false} linkTo="/dashboard" />
            <button
              type="button"
              className="snx-btn-secondary snx-btn-sm !h-8 !w-8 !p-0 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 shadow-inner dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar user={currentUser} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-slate-900 dark:text-white">
                  {currentUser?.name || "User"}
                </div>
                <div className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">
                  {currentUser?.email || "workspace"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            <SidebarNav closeMenu={() => setMobileMenuOpen(false)} user={currentUser} />
          </div>

          <div className="space-y-2 border-t border-slate-200 pt-3 dark:border-slate-800">
            <ThemeToggle className="w-full justify-center !rounded-xl" />
          </div>
        </div>
      </aside>

      {/* Top Floating Navbar */}
      <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 md:left-[280px]">
        <div className="snx-container flex h-[72px] items-center gap-4">
          <button
            type="button"
            className="snx-btn-secondary snx-btn-sm !h-10 !w-10 !p-0 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <FiMenu className="h-5 w-5" />
          </button>

          <div className="min-w-0 shrink-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              SkillNexa • {activeMeta.label}
            </p>
            <h2 className="truncate text-sm font-bold text-slate-900 dark:text-white">
              AI Preparation & Skill Studio
            </h2>
          </div>

          <form onSubmit={submitSearch} className="hidden min-w-0 flex-1 md:block md:max-w-xl">
            <label className="relative block w-full">
              <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search questions, topics, company tags (e.g. Google, DSA)..."
                className="snx-input !h-10 border-slate-200/80 pl-10 text-sm shadow-sm transition-all focus:border-indigo-500 dark:border-slate-700/80 dark:bg-slate-800/80"
                aria-label="Search questions"
              />
            </label>
          </form>

          <Link
            to="/profile"
            className="hidden items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-3.5 py-1.5 shadow-sm transition duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/90 md:flex"
          >
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account</div>
              <div className="max-w-[110px] truncate text-xs font-bold text-slate-900 dark:text-white">
                {currentUser?.name || "User"}
              </div>
            </div>
            <Avatar user={currentUser} />
          </Link>

          {logout ? (
            <button
              type="button"
              className="snx-btn-secondary snx-btn-sm hidden md:inline-flex"
              onClick={logout}
            >
              <FiLogOut className="h-4 w-4" />
              Logout
            </button>
          ) : null}
        </div>
      </header>

      <div className="h-[72px] md:hidden" />
    </>
  );
};

export default Navbar;

