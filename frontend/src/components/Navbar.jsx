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
    return <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-lg object-cover ring-2 ring-white/50" />;
  }

  return (
    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 font-semibold text-white shadow-md">
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
        className={({ isActive }) => `group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md-soft"
            : "text-slate-custom-600 hover:bg-slate-custom-100 hover:text-slate-custom-900"
        }`}
      >
        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-all duration-300 ${
          isActive ? "bg-white/20" : "bg-slate-custom-200/50 group-hover:bg-white"
        }`}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="truncate">{label}</span>
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
        className={`fixed inset-0 z-40 bg-slate-custom-950/40 backdrop-blur-sm transition-all duration-300 md:hidden ${
          mobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[240px] transform bg-white/95 backdrop-blur-sm transition-transform duration-300 md:sticky md:translate-x-0 md:shadow-none ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } border-r border-slate-custom-200/50 shadow-lg-soft overflow-y-auto`}
      >
        <div className="snx-scrollbar flex h-screen flex-col gap-6 p-5">
          <div className="flex items-center justify-between">
            <SkillNexaLogo showTagline={false} linkTo="/dashboard" />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-custom-200 bg-white text-slate-custom-700 transition-all duration-300 hover:bg-slate-custom-100 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-lg border border-slate-custom-200/60 bg-gradient-to-br from-slate-custom-50 to-white p-4 shadow-sm-soft">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar user={currentUser} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-slate-custom-900 text-sm">{currentUser?.name || "User"}</div>
                <div className="truncate text-xs text-slate-custom-500">{currentUser?.email || "workspace"}</div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <SidebarNav closeMenu={() => setMobileMenuOpen(false)} />
          </div>

          <div className="space-y-3 border-t border-slate-custom-200/50 pt-4">
            <ThemeToggle className="w-full justify-center" />
            {logout ? (
              <button
                type="button"
                className="snx-btn-secondary w-full justify-center"
                onClick={logout}
              >
                <FiLogOut className="h-4 w-4" />
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </aside>

      <div className="fixed inset-x-0 top-0 z-30 border-b border-white/40 bg-white/80 backdrop-blur-md md:left-[240px]">
        <div className="snx-container flex h-16 items-center gap-4">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-custom-200 bg-white text-slate-custom-700 transition-all duration-300 hover:bg-slate-custom-100 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <FiMenu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-custom-500">
              {activeMeta.label}
            </p>
            <h2 className="truncate font-['Poppins'] text-sm font-semibold text-slate-custom-900">
              Premium AI preparation workspace
            </h2>
          </div>

          <form onSubmit={submitSearch} className="hidden md:flex lg:min-w-[420px] md:min-w-[320px] flex-1 md:max-w-xs lg:max-w-sm">
            <label className="relative w-full">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-custom-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search questions..."
                className="snx-input pl-10 text-xs"
                aria-label="Search questions"
              />
            </label>
          </form>

          <Link
            to="/profile"
            className="hidden items-center gap-2 rounded-lg border border-slate-custom-200 bg-white/80 px-3 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-custom-300 hover:bg-white md:flex"
          >
            <div className="text-right">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-custom-500">Profile</div>
              <div className="max-w-[120px] truncate text-xs font-semibold text-slate-custom-900">{currentUser?.name || "User"}</div>
            </div>
            <Avatar user={currentUser} />
          </Link>

          {logout ? (
            <button type="button" className="snx-btn-secondary hidden md:inline-flex" onClick={logout}>
              <FiLogOut className="h-4 w-4" />
              Logout
            </button>
          ) : null}
        </div>
      </div>

      <div className="h-16 md:hidden" />
    </>
  );
};

export default Navbar;
