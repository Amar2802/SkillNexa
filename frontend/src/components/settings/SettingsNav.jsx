import {
  FiUser,
  FiSliders,
  FiMoon,
  FiBell,
  FiLock,
  FiShield,
  FiLink,
  FiAlertTriangle
} from "react-icons/fi";

export const SETTINGS_TABS = [
  { id: "account", label: "Account", icon: FiUser, description: "Personal info and role" },
  { id: "preferences", label: "Preferences", icon: FiSliders, description: "Study track and language" },
  { id: "appearance", label: "Appearance", icon: FiMoon, description: "Light, dark, and system themes" },
  { id: "notifications", label: "Notifications", icon: FiBell, description: "Email & in-app alerts" },
  { id: "security", label: "Security & Auth", icon: FiLock, description: "Password and session" },
  { id: "privacy", label: "Privacy", icon: FiShield, description: "Profile and leaderboard visibility" },
  { id: "connected", label: "Connected Accounts", icon: FiLink, description: "OAuth integrations" },
  { id: "danger", label: "Danger Zone", icon: FiAlertTriangle, description: "Export or delete account" }
];

export const SettingsNav = ({ activeTab, onSelectTab }) => {
  return (
    <>
      {/* Desktop / Tablet Vertical Navigation */}
      <nav
        aria-label="Settings sections"
        className="hidden md:flex flex-col gap-1 w-64 shrink-0"
      >
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Settings
        </div>

        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDanger = tab.id === "danger";

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-medium transition duration-150 ${
                isActive
                  ? isDanger
                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 font-semibold shadow-2xs"
                    : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 font-semibold shadow-2xs"
                  : isDanger
                  ? "text-rose-600/80 hover:bg-rose-50/50 hover:text-rose-600 dark:text-rose-400/80 dark:hover:bg-rose-950/20"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  isActive
                    ? isDanger
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-indigo-600 dark:text-indigo-400"
                    : isDanger
                    ? "text-rose-500"
                    : "text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                }`}
              />
              <div className="min-w-0 flex-1">
                <span className="block truncate">{tab.label}</span>
                <span className="block text-[10px] text-slate-400 truncate font-normal">
                  {tab.description}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Mobile Horizontal Scrolling Tabs */}
      <div className="flex md:hidden overflow-x-auto pb-2 -mx-4 px-4 snx-scrollbar gap-1.5 border-b border-[var(--snx-border)] dark:border-slate-800 mb-4">
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDanger = tab.id === "danger";

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                isActive
                  ? isDanger
                    ? "bg-rose-600 text-white"
                    : "bg-indigo-600 text-white"
                  : "bg-[var(--snx-surface)] border border-[var(--snx-border)] text-slate-700 dark:text-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default SettingsNav;
