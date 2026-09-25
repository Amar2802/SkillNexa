import { useState } from "react";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiAlertCircle,
  FiKey,
  FiShield,
  FiLogOut,
  FiMonitor
} from "react-icons/fi";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import api from "../../api/client";

export const SecuritySettingsSection = ({ user, logout }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const hasExistingPassword = user?.hasPassword !== false;

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (hasExistingPassword && !currentPassword) {
      setStatus({ type: "error", message: "Please provide your current password." });
      return;
    }

    if (newPassword.length < 6) {
      setStatus({ type: "error", message: "New password must contain at least 6 characters." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    try {
      setSaving(true);
      await api.put("/users/password", {
        currentPassword,
        newPassword
      });

      setStatus({ type: "success", message: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    } catch (err) {
      console.error("Password update error:", err);
      setStatus({
        type: "error",
        message: err?.response?.data?.message || "Failed to update password. Please check your credentials."
      });
    } finally {
      setSaving(false);
    }
  };

  // Detect user client environment for active session
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "Browser";
  let browserName = "Modern Web Browser";
  let osName = "Desktop Operating System";

  if (userAgent.includes("Chrome")) browserName = "Google Chrome";
  else if (userAgent.includes("Firefox")) browserName = "Mozilla Firefox";
  else if (userAgent.includes("Safari")) browserName = "Apple Safari";
  else if (userAgent.includes("Edge")) browserName = "Microsoft Edge";

  if (userAgent.includes("Windows")) osName = "Windows";
  else if (userAgent.includes("Mac")) osName = "macOS";
  else if (userAgent.includes("Linux")) osName = "Linux";
  else if (userAgent.includes("Android")) osName = "Android";
  else if (userAgent.includes("iPhone")) osName = "iOS";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Security & Authentication
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage credentials, active browser sessions, and access safeguards.
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

      {/* Change Password Card */}
      <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {hasExistingPassword ? "Change Password" : "Set Account Password"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {hasExistingPassword
              ? "Ensure your account is using a long, secure password."
              : "Set a password so you can sign in directly with your email in addition to Google OAuth."}
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-3.5 max-w-md">
          {hasExistingPassword && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] px-3 pr-10 text-xs font-medium text-slate-900 dark:text-white dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                >
                  {showCurrent ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] px-3 pr-10 text-xs font-medium text-slate-900 dark:text-white dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Minimum 6 characters with mixed letters and numbers recommended.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] px-3 text-xs font-medium text-slate-900 dark:text-white dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={saving}
              disabled={saving || !newPassword}
              icon={FiKey}
            >
              {hasExistingPassword ? "Update Password" : "Set Password"}
            </Button>
          </div>
        </form>
      </div>

      {/* Authentication Methods */}
      <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Enabled Authentication Methods
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FiLock className="h-4 w-4 text-slate-500" />
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Email & Password</span>
                <span className="text-[10px] text-slate-400">Direct credential authentication</span>
              </div>
            </div>
            <Badge variant={hasExistingPassword ? "success" : "neutral"} size="sm">
              {hasExistingPassword ? "Active" : "Not Set"}
            </Badge>
          </div>

          <div className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-800 font-bold text-[10px] shadow-2xs">
                G
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Google OAuth</span>
                <span className="text-[10px] text-slate-400">Single Sign-On</span>
              </div>
            </div>
            <Badge variant={user?.googleId ? "success" : "neutral"} size="sm">
              {user?.googleId ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Active Session & Device Card */}
      <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-5 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <FiMonitor className="h-5 w-5" />
          </div>

          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                {browserName} on {osName}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.2 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Now
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Current browser session authenticated via secure HTTP-only refresh tokens.
            </p>
          </div>
        </div>

        {logout && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={logout}
            icon={FiLogOut}
            className="shrink-0"
          >
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );
};

export default SecuritySettingsSection;
