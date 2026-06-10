import { useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
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
  FiX
} from "react-icons/fi";
import SkillNexaLogo from "./SkillNexaLogo";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: FiGrid },
  { label: "Question Bank", path: "/questions", icon: FiSearch },
  { label: "Practice", path: "/practice", icon: FiCpu },
  { label: "Mock Tests", path: "/mock-tests", icon: FiBarChart2 },
  { label: "AI Interviewer", path: "/ai-interviewer", icon: FiCpu },
  { label: "Bookmarks", path: "/bookmarks", icon: FiBookmark },
  { label: "History", path: "/history", icon: FiClock },
  { label: "Profile", path: "/profile", icon: FiUser }
];

const Avatar = ({ user }) => {
  const initials = (user?.name || "SN")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (user?.avatar) {
    return <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-lg object-cover ring-2 ring-white/60" />;
  }

  return (
    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-semibold text-white shadow-sm">
      {initials}
    </div>
  );
};

const SidebarNav = ({ closeMenu }) => (
  <nav className="flex flex-col gap-1">
    {navItems.map(({ label, path, icon: Icon }) => (
      <NavLink
        key={path}
        to={path}
        onClick={closeMenu}
        className={({ isActive }) =>
          `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-200 ${
            isActive
              ? "bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-elevation-1"
              : "text-slate-custom-600 hover:bg-slate-custom-100 hover:text-slate-custom-900 dark:text-slate-custom-300 dark:hover:bg-slate-custom-800 dark:hover:text-white"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition duration-200 ${
                isActive ? "bg-white/20 text-white" : "bg-slate-custom-100 text-slate-custom-700 group-hover:bg-white group-hover:text-slate-custom-900 dark:bg-slate-custom-700 dark:text-slate-custom-100"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="truncate">{label}</span>
          </>
        )}
      </NavLink>
    ))}
  </nav>
);

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
      <div
        className={`snx-backdrop-blur md:hidden transition-opacity duration-200 ${
          mobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        role="presentation"
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] transform border-r border-slate-custom-200 bg-white transition-transform duration-200 dark:border-slate-custom-700 dark:bg-slate-custom-900 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-lg-soft" : "-translate-x-full md:shadow-none"
        }`}
      >
        <div className="snx-scrollbar flex h-screen flex-col gap-4 p-4">
          <div className="flex items-center justify-between">
            <SkillNexaLogo showTagline={false} linkTo="/dashboard" />
            <button
              type="button"
              className="snx-btn-secondary snx-btn-sm !h-9 !w-9 !p-0 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>

          <div className="rounded-xl border border-slate-custom-200 bg-slate-custom-50 p-3 dark:border-slate-custom-700 dark:bg-slate-custom-800">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar user={currentUser} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-custom-900 dark:text-white">
                  {currentUser?.name || "User"}
                </div>
                <div className="truncate text-xs text-slate-custom-500">{currentUser?.email || "workspace"}</div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <SidebarNav closeMenu={() => setMobileMenuOpen(false)} />
          </div>

          <div className="space-y-2 border-t border-slate-custom-200 pt-3 dark:border-slate-custom-700">
            <ThemeToggle className="w-full justify-center !rounded-xl" />
          </div>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-custom-200/80 bg-white/85 backdrop-blur-md dark:border-slate-custom-700 dark:bg-slate-custom-900/85 md:left-[280px]">
        <div className="snx-container flex h-[72px] items-center gap-4">
          <button
            type="button"
            className="snx-btn-secondary snx-btn-sm !h-9 !w-9 !p-0 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <FiMenu className="h-4 w-4" />
          </button>

          <div className="min-w-0 shrink-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
              {activeMeta.label}
            </p>
            <h2 className="truncate text-sm font-semibold text-slate-custom-900 dark:text-white">
              AI preparation workspace
            </h2>
          </div>

          <form onSubmit={submitSearch} className="hidden min-w-0 flex-1 md:block md:max-w-xl">
            <label className="relative block w-full">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-custom-400 dark:text-slate-custom-300" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search questions, topics, companies..."
                className="snx-input !h-10 pl-10 text-sm"
                aria-label="Search questions"
              />
            </label>
          </form>

          <Link
            to="/profile"
            className="hidden items-center gap-2 rounded-xl border border-slate-custom-200 bg-white px-3 py-2 transition duration-200 hover:border-slate-custom-300 hover:shadow-sm-soft dark:border-slate-custom-600 dark:bg-slate-custom-800 md:flex"
          >
            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-custom-500">Profile</div>
              <div className="max-w-[100px] truncate text-xs font-semibold text-slate-custom-900 dark:text-white">
                {currentUser?.name || "User"}
              </div>
            </div>
            <Avatar user={currentUser} />
          </Link>

          {logout ? (
            <button type="button" className="snx-btn-secondary snx-btn-sm hidden md:inline-flex [&_svg]:text-slate-custom-700 dark:[&_svg]:text-slate-custom-100" onClick={logout}>
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
