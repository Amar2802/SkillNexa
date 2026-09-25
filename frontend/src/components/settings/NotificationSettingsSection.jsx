import { useState, useEffect } from "react";
import {
  FiBell,
  FiMail,
  FiZap,
  FiAward,
  FiCheck,
  FiTrash2,
  FiAlertCircle,
  FiSave
} from "react-icons/fi";
import { Toggle } from "../ui/Checkbox";
import Button from "../ui/Button";
import api from "../../api/client";

export const NotificationSettingsSection = ({ user, refreshProfile }) => {
  const [preferences, setPreferences] = useState({
    emailReminders: user?.preferences?.notifications?.emailReminders ?? true,
    practiceStreakAlerts: user?.preferences?.notifications?.practiceStreakAlerts ?? true,
    mockInterviewFeedback: user?.preferences?.notifications?.mockInterviewFeedback ?? true,
    weeklyProgressReport: user?.preferences?.notifications?.weeklyProgressReport ?? false
  });

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [inAppNotifications, setInAppNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    if (user?.preferences?.notifications) {
      setPreferences({
        emailReminders: user.preferences.notifications.emailReminders ?? true,
        practiceStreakAlerts: user.preferences.notifications.practiceStreakAlerts ?? true,
        mockInterviewFeedback: user.preferences.notifications.mockInterviewFeedback ?? true,
        weeklyProgressReport: user.preferences.notifications.weeklyProgressReport ?? false
      });
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const res = await api.get("/notifications");
      setInAppNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch notifications in settings:", err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatus({ type: "", message: "" });

      await api.put("/users/preferences", {
        notifications: preferences
      });

      if (refreshProfile) {
        await refreshProfile();
      }

      setStatus({ type: "success", message: "Notification preferences updated successfully." });
      setTimeout(() => setStatus({ type: "", message: "" }), 4000);
    } catch (err) {
      console.error("Notification preference error:", err);
      setStatus({
        type: "error",
        message: err?.response?.data?.message || "Failed to update notification settings."
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setInAppNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Mark all as read error:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.delete("/notifications");
      setInAppNotifications([]);
    } catch (err) {
      console.error("Clear all error:", err);
    }
  };

  const handleDeleteOne = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setInAppNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Delete notification error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Notification Preferences & Alerts
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Choose which channels and alerts SkillNexa uses to keep you accountable.
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

      {/* Preferences Form */}
      <form onSubmit={handleSavePreferences}>
        <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-4">
          <div className="divide-y divide-[var(--snx-border-subtle)] dark:divide-slate-800">
            {/* Email Reminders */}
            <div className="py-3.5 first:pt-0">
              <Toggle
                label="Email Practice Reminders"
                description="Receive occasional reminders to practice your target topic and finish active roadmap steps."
                checked={preferences.emailReminders}
                onChange={() => handleToggle("emailReminders")}
              />
            </div>

            {/* Streak Alerts */}
            <div className="py-3.5">
              <Toggle
                label="Practice Streak Protection Alerts"
                description="Receive notifications if your streak is about to expire for the day so you never lose momentum."
                checked={preferences.practiceStreakAlerts}
                onChange={() => handleToggle("practiceStreakAlerts")}
              />
            </div>

            {/* Mock Interview Feedback */}
            <div className="py-3.5">
              <Toggle
                label="Mock Interview & Test Result Debriefs"
                description="Instant notifications whenever an AI assessment or timed mock test completes its automated evaluation."
                checked={preferences.mockInterviewFeedback}
                onChange={() => handleToggle("mockInterviewFeedback")}
              />
            </div>

            {/* Weekly Progress Digest */}
            <div className="py-3.5 last:pb-0">
              <Toggle
                label="Weekly Preparation Digest"
                description="Receive a concise weekly digest highlighting problems solved, accuracy trends, and top weak topics to review."
                checked={preferences.weeklyProgressReport}
                onChange={() => handleToggle("weeklyProgressReport")}
              />
            </div>
          </div>

          {/* Save Bar */}
          <div className="pt-3 flex items-center justify-end border-t border-[var(--snx-border-subtle)] dark:border-slate-800">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={saving}
              disabled={saving}
              icon={FiSave}
            >
              Save Notification Preferences
            </Button>
          </div>
        </div>
      </form>

      {/* In-App Notifications History */}
      <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              In-App Notification History
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Manage alerts stored in your account history.
            </p>
          </div>

          {inAppNotifications.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Mark all as read
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {inAppNotifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No notifications in your history. You are completely up to date!
          </div>
        ) : (
          <div className="divide-y divide-[var(--snx-border-subtle)] dark:divide-slate-800 max-h-64 overflow-y-auto snx-scrollbar">
            {inAppNotifications.slice(0, 10).map((n) => (
              <div
                key={n._id}
                className="py-3 flex items-start justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white truncate">
                      {n.title}
                    </span>
                    {!n.read && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px] line-clamp-1">
                    {n.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-400">
                    {new Date(n.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric"
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteOne(n._id)}
                    className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                    title="Dismiss notification"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSettingsSection;
