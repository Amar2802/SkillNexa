import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiShield,
  FiEye,
  FiExternalLink,
  FiCheck,
  FiAlertCircle,
  FiSave
} from "react-icons/fi";
import { Toggle } from "../ui/Checkbox";
import Button from "../ui/Button";
import api from "../../api/client";

export const PrivacySettingsSection = ({ user, refreshProfile }) => {
  const [privacy, setPrivacy] = useState({
    publicProfile: user?.preferences?.privacy?.publicProfile ?? true,
    showOnLeaderboard: user?.preferences?.privacy?.showOnLeaderboard ?? true,
    showActivityHeatmap: user?.preferences?.privacy?.showActivityHeatmap ?? true
  });

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (user?.preferences?.privacy) {
      setPrivacy({
        publicProfile: user.preferences.privacy.publicProfile ?? true,
        showOnLeaderboard: user.preferences.privacy.showOnLeaderboard ?? true,
        showActivityHeatmap: user.preferences.privacy.showActivityHeatmap ?? true
      });
    }
  }, [user]);

  const handleToggle = (key) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePrivacy = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatus({ type: "", message: "" });

      await api.put("/users/preferences", {
        privacy
      });

      if (refreshProfile) {
        await refreshProfile();
      }

      setStatus({ type: "success", message: "Privacy settings updated successfully." });
      setTimeout(() => setStatus({ type: "", message: "" }), 4000);
    } catch (err) {
      console.error("Privacy error:", err);
      setStatus({
        type: "error",
        message: err?.response?.data?.message || "Failed to update privacy controls."
      });
    } finally {
      setSaving(false);
    }
  };

  const publicProfileUrl = user?._id ? `/p/${user._id}` : "/profile";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Privacy & Visibility Controls
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Control which parts of your preparation data and profile are accessible to recruiters and peers.
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

      <form onSubmit={handleSavePrivacy}>
        <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-4">
          <div className="divide-y divide-[var(--snx-border-subtle)] dark:divide-slate-800">
            {/* Public Profile */}
            <div className="py-3.5 first:pt-0">
              <Toggle
                label="Public Developer Profile"
                description="Make your technical track, solved problem count, and bio viewable by recruiters via your unique shareable profile link."
                checked={privacy.publicProfile}
                onChange={() => handleToggle("publicProfile")}
              />

              {privacy.publicProfile && user?._id && (
                <div className="mt-2 pl-0.5">
                  <Link
                    to={publicProfileUrl}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <span>View your live public profile</span>
                    <FiExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* Leaderboard Standing */}
            <div className="py-3.5">
              <Toggle
                label="Leaderboard Visibility"
                description="Include your preparation standing, solved question points, and streak count on the platform-wide SkillNexa leaderboard."
                checked={privacy.showOnLeaderboard}
                onChange={() => handleToggle("showOnLeaderboard")}
              />
            </div>

            {/* Activity Matrix */}
            <div className="py-3.5 last:pb-0">
              <Toggle
                label="Activity Heatmap Display"
                description="Display your 12-week study cadence and problem submission activity matrix on your public profile."
                checked={privacy.showActivityHeatmap}
                onChange={() => handleToggle("showActivityHeatmap")}
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
              Save Privacy Settings
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PrivacySettingsSection;
