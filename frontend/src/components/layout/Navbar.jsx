import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiCheckCircle,
  FiMoon,
  FiSun,
  FiAward
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import SearchInput from "../ui/SearchInput";
import NotificationDropdown from "../notifications/NotificationDropdown";

const Avatar = ({ user }) => {
  const initials = (user?.name || "SN")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className="h-8 w-8 rounded-lg object-cover ring-1 ring-[var(--snx-border)]"
      />
    );
  }

  return (
    <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-subtle">
      {initials}
    </div>
  );
};

export const Navbar = ({
  user,
  profile,
  logout,
  onOpenMobileMenu,
  isCollapsed = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const currentUser = profile || user;

  const currentRouteName = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith("/dashboard")) return "Dashboard";
    if (path.startsWith("/leaderboard")) return "Leaderboard";
    if (path.startsWith("/questions")) return "Question Bank";
    if (path.startsWith("/practice")) return "Coding IDE";
    if (path.startsWith("/mock-tests")) return "Mock Tests";
    if (path.startsWith("/ai-interviewer")) return "AI Interviewer";
    if (path.startsWith("/ai-mentor")) return "AI Mentor";
    if (path.startsWith("/review-mistakes")) return "Review Mistakes";
    if (path.startsWith("/learn")) return "Learn";
    if (path.startsWith("/roadmaps")) return "Learning Roadmaps";
    if (path.startsWith("/revision")) return "Revision Cards";
    if (path.startsWith("/bookmarks")) return "Saved Questions";
    if (path.startsWith("/history")) return "History & Submissions";
    if (path.startsWith("/analytics")) return "Analytics";
    if (path.startsWith("/profile")) return "Developer Profile";
    if (path.startsWith("/settings")) return "Settings & Account";
    if (path.startsWith("/admin")) return "Admin Dashboard";
    return "Workspace";
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = search.trim();
    navigate(trimmed ? `/questions?search=${encodeURIComponent(trimmed)}` : "/questions");
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-30 h-16 border-b border-[var(--snx-border)] bg-[var(--snx-surface)]/90 backdrop-blur-md transition-all duration-200 dark:border-slate-800 ${
        isCollapsed ? "md:left-16" : "md:left-64"
      }`}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu Trigger + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--snx-border)] text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Open navigation menu"
          >
            <FiMenu className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <span className="hidden sm:inline text-xs font-medium text-slate-400">
              SkillNexa
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">/</span>
            <h1 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {currentRouteName}
            </h1>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:block w-full max-w-md"
        >
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            placeholder="Search problems, topics, tags (e.g. Trees, Google)..."
            size="md"
          />
        </form>

        {/* Right Section: Theme Toggle, Quick Actions & Profile */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Notification Center */}
          <NotificationDropdown />

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--snx-border)] text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface)] p-1.5 pr-2.5 hover:border-slate-300 transition dark:border-slate-700 dark:hover:border-slate-600"
              aria-expanded={profileDropdownOpen}
              aria-label="User account menu"
            >
              <Avatar user={currentUser} />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate leading-tight">
                  {currentUser?.name || "Developer"}
                </span>
                <span className="text-[10px] font-medium text-slate-400 leading-tight">
                  {currentUser?.subscription?.plan === "premium" ? "PRO MEMBER" : "FREE TIER"}
                </span>
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setProfileDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-elevated)] p-1.5 shadow-dropdown z-40 dark:border-slate-700">
                  <div className="px-3 py-2 border-b border-[var(--snx-border-subtle)] dark:border-slate-800 mb-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {currentUser?.name || "Developer"}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {currentUser?.email || "developer@skillnexa.me"}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <FiUser className="h-4 w-4" />
                    <span>Developer Profile</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <FiSettings className="h-4 w-4" />
                    <span>Settings & Account</span>
                  </Link>

                  <Link
                    to="/leaderboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <FiAward className="h-4 w-4" />
                    <span>Leaderboard</span>
                  </Link>

                  {logout && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                    >
                      <FiLogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
