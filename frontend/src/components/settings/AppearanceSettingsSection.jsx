import { useState } from "react";
import { FiSun, FiMoon, FiMonitor, FiCheck, FiSave } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import api from "../../api/client";

const THEME_OPTIONS = [
  {
    id: "light",
    label: "Light Mode",
    description: "Crisp, daylight-optimized theme with clean contrast.",
    icon: FiSun,
    previewBg: "bg-slate-100",
    previewCard: "bg-white border-slate-200 text-slate-800"
  },
  {
    id: "dark",
    label: "Dark Mode",
    description: "Focused, deep slate theme engineered for extended late-night sessions.",
    icon: FiMoon,
    previewBg: "bg-slate-900",
    previewCard: "bg-slate-800 border-slate-700 text-slate-100"
  },
  {
    id: "system",
    label: "System Preference",
    description: "Automatically matches your operating system display appearance.",
    icon: FiMonitor,
    previewBg: "bg-gradient-to-r from-slate-100 to-slate-900",
    previewCard: "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
  }
];

export const AppearanceSettingsSection = ({ user, refreshProfile }) => {
  const { theme, effectiveTheme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);

  const handleSelectTheme = async (selectedTheme) => {
    setTheme(selectedTheme);

    try {
      setSaving(true);
      await api.put("/users/preferences", { theme: selectedTheme });
      if (refreshProfile) refreshProfile();
      setSavedBadge(true);
      setTimeout(() => setSavedBadge(false), 2500);
    } catch (err) {
      console.error("Theme preference save error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Appearance & Interface Theme
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Customize how SkillNexa renders on your screen. Changes apply instantly across all pages.
          </p>
        </div>

        {savedBadge && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            <FiCheck className="h-3 w-3" />
            <span>Theme Saved</span>
          </span>
        )}
      </div>

      {/* Theme Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {THEME_OPTIONS.map((opt) => {
          const isSelected = theme === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelectTheme(opt.id)}
              className={`group flex flex-col text-left rounded-2xl border p-4 transition-all duration-150 overflow-hidden relative ${
                isSelected
                  ? "border-indigo-600 bg-indigo-50/40 dark:border-indigo-500 dark:bg-indigo-950/30 ring-2 ring-indigo-600/30 dark:ring-indigo-500/30 shadow-sm"
                  : "border-[var(--snx-border)] bg-[var(--snx-surface)] hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
              }`}
            >
              {/* Theme Mockup Visual */}
              <div
                className={`h-24 w-full rounded-xl ${opt.previewBg} p-2.5 flex flex-col justify-between mb-3 border border-black/5 dark:border-white/5 transition-transform duration-200 group-hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-rose-400" />
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>

                <div
                  className={`rounded-lg border p-2 text-[10px] font-mono shadow-2xs flex items-center justify-between ${opt.previewCard}`}
                >
                  <span>SkillNexa IDE</span>
                  <div className="h-2 w-6 rounded bg-indigo-500/40" />
                </div>
              </div>

              {/* Title & Icon */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Icon
                    className={`h-4 w-4 ${
                      isSelected
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {opt.label}
                  </span>
                </div>

                {isSelected && (
                  <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <FiCheck className="h-3 w-3 stroke-[3]" />
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Information Callout */}
      <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-4 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <p className="leading-relaxed">
          <strong className="text-slate-800 dark:text-slate-200">Current Active Theme: </strong>
          <span className="capitalize font-semibold text-indigo-600 dark:text-indigo-400">
            {theme} mode
          </span>
          {theme === "system" && (
            <span> (Resolving to {effectiveTheme} based on your operating system preferences)</span>
          )}.
        </p>
      </div>
    </div>
  );
};

export default AppearanceSettingsSection;
