import { useState, useEffect } from "react";
import { FiCode, FiClock, FiCheck, FiAlertCircle, FiSave, FiCompass } from "react-icons/fi";
import Select from "../ui/Select";
import Button from "../ui/Button";
import api from "../../api/client";

const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript (Node.js)" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python 3" },
  { value: "java", label: "Java 17" },
  { value: "cpp", label: "C++ (GCC 11)" },
  { value: "go", label: "Go (Golang)" }
];

const GOAL_OPTIONS = [
  { hours: 3, label: "Casual Prep (3 hrs/week)", description: "30 mins every other day. Ideal for light brush-up." },
  { hours: 5, label: "Steady Prep (5 hrs/week) — Recommended", description: "45-60 mins/day on weekdays. Balanced pace." },
  { hours: 10, label: "Accelerated (10 hrs/week)", description: "1.5 hours daily. Preparing for upcoming on-sites." },
  { hours: 15, label: "Sprint Mode (15+ hrs/week)", description: "Deep immersion across tests, code, and interviews." }
];

export const PreferencesSettingsSection = ({ user, refreshProfile }) => {
  const [preferredLanguage, setPreferredLanguage] = useState(
    user?.preferences?.preferredLanguage || "javascript"
  );
  const [learningGoalHoursPerWeek, setLearningGoalHoursPerWeek] = useState(
    user?.preferences?.learningGoalHoursPerWeek || 5
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (user?.preferences) {
      if (user.preferences.preferredLanguage) {
        setPreferredLanguage(user.preferences.preferredLanguage);
      }
      if (user.preferences.learningGoalHoursPerWeek) {
        setLearningGoalHoursPerWeek(user.preferences.learningGoalHoursPerWeek);
      }
    }
  }, [user]);

  const hasChanges =
    preferredLanguage !== (user?.preferences?.preferredLanguage || "javascript") ||
    learningGoalHoursPerWeek !== (user?.preferences?.learningGoalHoursPerWeek || 5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatus({ type: "", message: "" });

      await api.put("/users/preferences", {
        preferredLanguage,
        learningGoalHoursPerWeek
      });

      if (refreshProfile) {
        await refreshProfile();
      }

      setStatus({ type: "success", message: "Preferences updated successfully." });
      setTimeout(() => setStatus({ type: "", message: "" }), 4000);
    } catch (err) {
      console.error("Preferences error:", err);
      setStatus({
        type: "error",
        message: err?.response?.data?.message || "Failed to update preferences."
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Study & Coding Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure default language runtimes, target preparation hours, and practice environments.
        </p>
      </div>

      {status.message && (
        <div
          className={`flex items-center gap-2.5 rounded-xl p-3 text-xs font-medium border ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
              : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300"
          }`}
        >
          {status.type === "success" ? (
            <FiCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <FiAlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-5">
          {/* Preferred Language */}
          <div>
            <Select
              label="Default Coding Language"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              options={LANGUAGE_OPTIONS}
              helperText="Pre-selects starter code templates when launching the Monaco Coding IDE."
            />
          </div>

          {/* Weekly Learning Goal */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Weekly Practice Goal
            </label>
            <p className="text-[11px] text-slate-400">
              Set your target interview preparation investment. Used for pace calculations on your Dashboard.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {GOAL_OPTIONS.map((opt) => {
                const isSelected = learningGoalHoursPerWeek === opt.hours;
                return (
                  <button
                    key={opt.hours}
                    type="button"
                    onClick={() => setLearningGoalHoursPerWeek(opt.hours)}
                    className={`flex flex-col text-left p-3.5 rounded-xl border transition ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/40 ring-1 ring-indigo-600 dark:ring-indigo-500"
                        : "border-[var(--snx-border)] bg-[var(--snx-surface)] hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-bold ${isSelected ? "text-indigo-700 dark:text-indigo-400" : "text-slate-800 dark:text-slate-200"}`}>
                        {opt.label}
                      </span>
                      {isSelected && (
                        <FiCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Bar */}
          <div className="pt-3 flex items-center justify-between border-t border-[var(--snx-border-subtle)] dark:border-slate-800">
            <span className="text-[11px] text-slate-400">
              {hasChanges ? "Unsaved preference changes" : "All preferences up to date"}
            </span>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={saving}
              disabled={!hasChanges || saving}
              icon={FiSave}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PreferencesSettingsSection;
