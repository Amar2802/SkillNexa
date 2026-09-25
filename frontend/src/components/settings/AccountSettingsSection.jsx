import { useState, useEffect } from "react";
import { FiUser, FiMail, FiCheck, FiAlertCircle, FiSave, FiAward, FiShield } from "react-icons/fi";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import api from "../../api/client";

const FIELD_OPTIONS = [
  { value: "Software", label: "Software Engineering (General)" },
  { value: "Frontend", label: "Frontend Engineering" },
  { value: "Backend", label: "Backend Engineering" },
  { value: "Full Stack", label: "Full Stack Development" },
  { value: "Data Science", label: "Data Science & Machine Learning" },
  { value: "DevOps", label: "DevOps & Cloud Engineering" }
];

export const AccountSettingsSection = ({ user, refreshProfile }) => {
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [targetField, setTargetField] = useState(user?.targetField || "Software");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" }); // 'success' | 'error' | ''

  useEffect(() => {
    setName(user?.name || "");
    setBio(user?.bio || "");
    setTargetField(user?.targetField || "Software");
  }, [user]);

  const hasChanges =
    name !== (user?.name || "") ||
    bio !== (user?.bio || "") ||
    targetField !== (user?.targetField || "Software");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatus({ type: "error", message: "Name cannot be empty." });
      return;
    }

    try {
      setSaving(true);
      setStatus({ type: "", message: "" });
      const res = await api.put("/users/profile", {
        name: name.trim(),
        bio: bio.trim(),
        targetField
      });

      if (refreshProfile) {
        await refreshProfile();
      }

      setStatus({ type: "success", message: "Account profile updated successfully." });
      setTimeout(() => setStatus({ type: "", message: "" }), 4000);
    } catch (err) {
      console.error("Account update error:", err);
      setStatus({
        type: "error",
        message: err?.response?.data?.message || "Failed to update account information."
      });
    } finally {
      setSaving(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    : "Recently";

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Account Profile
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Update your personal details, target career track, and account metadata.
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

      {/* Account Info Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                maxLength={80}
                required
              />
            </div>

            {/* Email Address (Read-only) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full h-10 rounded-xl border border-[var(--snx-border)] bg-slate-50 px-3 text-xs font-medium text-slate-500 cursor-not-allowed dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400"
                />
                <span className="absolute right-2.5 top-2.5 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Primary identifier used for security alerts and password recovery.
              </p>
            </div>
          </div>

          {/* Target Track */}
          <div>
            <Select
              label="Primary Interview Target"
              value={targetField}
              onChange={(e) => setTargetField(e.target.value)}
              options={FIELD_OPTIONS}
              helperText="Tailors recommendations across coding questions, roadmaps, and mock tests."
            />
          </div>

          {/* Bio */}
          <div>
            <Textarea
              label="Professional Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Full stack software engineer passionate about scalable distributed systems and clean code..."
              rows={3}
              maxLength={300}
              helperText={`${bio.length}/300 characters. Displayed on your public developer card.`}
            />
          </div>

          {/* Save Bar */}
          <div className="pt-2 flex items-center justify-between border-t border-[var(--snx-border-subtle)] dark:border-slate-800">
            <span className="text-[11px] text-slate-400">
              {hasChanges ? "You have unsaved changes" : "All changes saved"}
            </span>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={saving}
              disabled={!hasChanges || saving}
              icon={FiSave}
            >
              Save Profile
            </Button>
          </div>
        </div>
      </form>

      {/* Account Overview Metadata Card */}
      <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-5 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Account Status & Membership
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800/80">
            <span className="text-[10px] font-medium text-slate-400 block">Membership Tier</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-slate-900 dark:text-white capitalize">
                {user?.subscription?.plan === "premium" ? "Pro Member" : "Free Plan"}
              </span>
              <Badge variant={user?.subscription?.plan === "premium" ? "primary" : "neutral"} size="sm">
                Active
              </Badge>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800/80">
            <span className="text-[10px] font-medium text-slate-400 block">Account Role</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-slate-900 dark:text-white capitalize">
                {user?.role || "Developer"}
              </span>
              <FiShield className="h-3.5 w-3.5 text-indigo-500" />
            </div>
          </div>

          <div className="p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800/80">
            <span className="text-[10px] font-medium text-slate-400 block">Member Since</span>
            <span className="font-bold text-slate-900 dark:text-white mt-1 block">
              {memberSince}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsSection;
