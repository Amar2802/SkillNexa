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
    return <img src={user.avatar} alt={user.name} className="h-11 w-11 rounded-2xl object-cover ring-2 ring-white/70" />;
  }

  return (
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 font-semibold text-white shadow-lg">
      {initials}
    </div>
  );
};

const SidebarNav = ({ closeMenu }) => (
  <nav className="flex flex-col gap-2">
    {navItems.map(({ label, path, icon: Icon }) => (
      <NavLink
        key={path}
        to={path}
        onClick={closeMenu}
        className={({ isActive }) => `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
          isActive
            ? "bg-slate-950 text-white shadow-[0_18px_34px_rgba(15,23,42,0.2)]"
            : "text-slate-600 hover:bg-white hover:text-slate-950"
        }`}
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-base shadow-sm transition group-hover:bg-brand-50">
          <Icon className="h-4 w-4" />
        </span>
        <span>{label}</span>
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
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition md:hidden ${
          mobileMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside
        className={`fixed inset-y-4 left-4 z-50 w-[292px] transform transition duration-300 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-[118%]"
        }`}
      >
        <div className="snx-panel flex h-full flex-col gap-6 overflow-hidden">
          <div className="flex items-center justify-between">
            <SkillNexaLogo showTagline linkTo="/dashboard" />
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-700 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="rounded-[24px] border border-white/70 bg-white/70 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3">
              <Avatar user={currentUser} />
              <div className="min-w-0">
                <div className="truncate font-semibold text-slate-950">{currentUser?.name || "SkillNexa User"}</div>
                <div className="truncate text-sm text-slate-500">{currentUser?.email || "AI workspace"}</div>
              </div>
            </div>
          </div>

          <div className="snx-scrollbar flex-1 overflow-y-auto pr-1">
            <SidebarNav closeMenu={() => setMobileMenuOpen(false)} />
          </div>

          <div className="space-y-3 border-t border-slate-200/80 pt-4">
            <ThemeToggle className="w-full justify-center" />
          </div>
        </div>
      </aside>

      <div className="fixed inset-x-0 top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-2xl md:left-[332px]">
        <div className="snx-container flex h-20 items-center gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-700 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <FiMenu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {activeMeta.label}
            </p>
            <h2 className="truncate font-['Poppins'] text-lg font-semibold tracking-[-0.03em] text-slate-950">
              Premium AI preparation workspace for focused interview practice
            </h2>
          </div>

          <form onSubmit={submitSearch} className="hidden min-w-[260px] flex-1 md:flex md:max-w-sm">
            <label className="relative w-full">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search questions, topics, companies..."
                className="snx-input pl-11"
              />
            </label>
          </form>

          <Link
            to="/profile"
            className="hidden items-center gap-3 rounded-[22px] border border-slate-200 bg-white/80 px-3 py-2 transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white md:flex"
          >
            <div className="text-right">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Profile</div>
              <div className="max-w-[160px] truncate text-sm font-semibold text-slate-950">{currentUser?.name || "Workspace"}</div>
            </div>
            <Avatar user={currentUser} />
          </Link>

          {logout ? (
            <button type="button" className="hidden snx-btn-secondary md:inline-flex" onClick={logout}>
              <FiLogOut className="h-4 w-4" />
              Logout
            </button>
          ) : null}
        </div>
      </div>

      <div className="h-20 md:hidden" />
    </>
  );
};

export default Navbar;
