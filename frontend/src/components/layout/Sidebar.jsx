import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiSearch,
  FiCpu,
  FiCompass,
  FiBookOpen,
  FiBarChart2,
  FiZap,
  FiBookmark,
  FiClock,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiLayers,
  FiAward
} from "react-icons/fi";
import SkillNexaLogo from "../SkillNexaLogo";
import Tooltip from "../ui/Tooltip";

export const navigationGroups = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: FiGrid },
      { label: "Leaderboard", path: "/leaderboard", icon: FiAward }
    ]
  },
  {
    title: "Practice",
    items: [
      { label: "Question Bank", path: "/questions", icon: FiSearch },
      { label: "Coding IDE", path: "/practice", icon: FiCpu }
    ]
  },
  {
    title: "Learn",
    items: [
      { label: "Learn", path: "/learn", icon: FiBookOpen },
      { label: "Roadmaps", path: "/roadmaps", icon: FiCompass },
      { label: "Revision Cards", path: "/revision", icon: FiLayers }
    ]
  },
  {
    title: "Assess & AI",
    items: [
      { label: "AI Mentor", path: "/ai-mentor", icon: FiCpu, badge: "Coach" },
      { label: "AI Interviewer", path: "/ai-interviewer", icon: FiZap, badge: "AI" },
      { label: "Mock Tests", path: "/mock-tests", icon: FiBarChart2 },
      { label: "Review Mistakes", path: "/review-mistakes", icon: FiLayers }
    ]
  },
  {
    title: "Analytics & Saves",
    items: [
      { label: "Analytics", path: "/analytics", icon: FiBarChart2 },
      { label: "Bookmarks", path: "/bookmarks", icon: FiBookmark },
      { label: "History", path: "/history", icon: FiClock }
    ]
  }
];

export const Sidebar = ({
  user,
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
  logout
}) => {
  const isAdmin = user && (user.role === "admin" || String(user.email).toLowerCase().includes("admin"));

  const renderNavItem = (item) => {
    const Icon = item.icon;
    const content = (
      <NavLink
        to={item.path}
        onClick={onClose}
        className={({ isActive }) =>
          `group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs sm:text-sm font-medium transition duration-150 select-none ${
            isActive
              ? "bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-semibold"
              : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
          } ${isCollapsed ? "justify-center px-2" : ""}`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className={`h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200"
              }`}
            />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
            {!isCollapsed && item.badge && (
              <span className="ml-auto rounded px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                {item.badge}
              </span>
            )}
            {isActive && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-600 dark:bg-indigo-400" />
            )}
          </>
        )}
      </NavLink>
    );

    if (isCollapsed) {
      return (
        <Tooltip key={item.path} content={item.label} position="right">
          {content}
        </Tooltip>
      );
    }

    return <div key={item.path}>{content}</div>;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar Shell */}
      <aside
        aria-label="Application sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--snx-border)] bg-[var(--snx-surface)] transition-all duration-200 dark:border-slate-800 ${
          isCollapsed ? "md:w-16" : "md:w-64"
        } ${isOpen ? "w-64 translate-x-0 shadow-dropdown" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-[var(--snx-border-subtle)] dark:border-slate-800/80">
          <div className="flex items-center gap-2 overflow-hidden">
            <SkillNexaLogo
              showTagline={false}
              linkTo="/dashboard"
              className={isCollapsed ? "!gap-0" : ""}
              imageClassName="h-7 w-7 rounded-lg object-contain"
            />
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 md:hidden dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Close sidebar"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Nav Groups */}
        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4 snx-scrollbar">
          {navigationGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isCollapsed ? (
                <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {group.title}
                </div>
              ) : (
                <div className="my-2 border-t border-[var(--snx-border-subtle)] dark:border-slate-800" />
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => renderNavItem(item))}
              </div>
            </div>
          ))}

          {isAdmin && (
            <div className="space-y-1 pt-2 border-t border-[var(--snx-border-subtle)] dark:border-slate-800">
              {!isCollapsed && (
                <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Administration
                </div>
              )}
              {renderNavItem({ label: "Admin Panel", path: "/admin", icon: FiSettings })}
            </div>
          )}
        </nav>

        {/* Sidebar Footer & Collapse Control */}
        <div className="shrink-0 p-3 border-t border-[var(--snx-border-subtle)] bg-[var(--snx-surface-subtle)] dark:border-slate-800 space-y-1">
          {renderNavItem({ label: "Profile", path: "/profile", icon: FiUser })}
          {renderNavItem({ label: "Settings", path: "/settings", icon: FiSettings })}

          {logout && (
            <button
              type="button"
              onClick={logout}
              className={`group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-xs sm:text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 ${
                isCollapsed ? "justify-center px-2" : ""
              }`}
            >
              <FiLogOut className="h-4 w-4 shrink-0 transition-transform group-hover:scale-105" />
              {!isCollapsed && <span className="truncate">Sign Out</span>}
            </button>
          )}

          {/* Desktop Collapse Toggle */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden md:flex w-full items-center justify-center rounded-lg py-1.5 text-slate-400 hover:bg-slate-200/50 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <FiChevronRight className="h-4 w-4" />
              ) : (
                <div className="flex items-center gap-2 text-xs font-medium">
                  <FiChevronLeft className="h-4 w-4" />
                  <span>Collapse sidebar</span>
                </div>
              )}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
