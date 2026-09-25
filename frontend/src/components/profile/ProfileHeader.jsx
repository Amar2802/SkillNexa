import { useRef, useState } from "react";
import { FiCamera, FiEdit3, FiShare2, FiCalendar, FiTrendingUp, FiAward, FiCheckCircle } from "react-icons/fi";
import Button from "../ui/Button";
import { useToast } from "../ui/ToastProvider";
import api from "../../api/client";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

export const ProfileHeader = ({
  profile,
  refreshProfile,
  onOpenEdit,
  onOpenShare
}) => {
  const fileInputRef = useRef(null);
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const initials = (profile?.name || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric"
      })
    : "Recently";

  const handleAvatarChange = async (file) => {
    if (!file) return;
    if (file.size > MAX_AVATAR_BYTES) {
      showToast("Profile image must be smaller than 2MB.", "error");
      return;
    }
    setIsUploading(true);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Unable to read image file."));
        reader.readAsDataURL(file);
      });

      await api.put("/users/profile/avatar", { avatar: dataUrl });
      await refreshProfile?.();
      showToast("Profile photo updated.", "success");
    } catch (err) {
      showToast(err?.response?.data?.message || err?.message || "Failed to upload photo.", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-6 shadow-subtle dark:border-slate-800">
      {/* Decorative subtle background gradient */}
      <div className="absolute top-0 right-0 h-32 w-64 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent blur-2xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Avatar + Details */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
          {/* Avatar with Upload Hover */}
          <div className="relative group shrink-0">
            <div className="h-24 w-24 rounded-2xl border-2 border-[var(--snx-border)] bg-slate-100 overflow-hidden shadow-subtle dark:border-slate-700 dark:bg-slate-850">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-indigo-600 to-indigo-500 text-2xl font-bold text-white tracking-wider">
                  {initials}
                </div>
              )}
            </div>

            {/* Hover overlay button to change avatar */}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-slate-950/60 text-white opacity-0 group-hover:opacity-100 transition duration-150 cursor-pointer"
              title="Change profile photo"
            >
              <FiCamera className="h-5 w-5 mb-0.5" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                {isUploading ? "Uploading..." : "Change"}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleAvatarChange(f);
              }}
            />
          </div>

          {/* User Bio & Identity */}
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {profile?.name || "Developer"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-400">
                {profile?.targetField || "Software"} Track
              </span>
              {profile?.subscription?.plan === "premium" && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-400">
                  PRO
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              {profile?.bio || "Preparing for software engineering and technical interview rounds on SkillNexa."}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 flex-wrap pt-0.5">
              <span className="flex items-center gap-1.5">
                <FiCalendar className="h-3.5 w-3.5" />
                <span>Joined {memberSince}</span>
              </span>

              {profile?.streakCount > 0 && (
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                  <FiTrendingUp className="h-3.5 w-3.5" />
                  <span>{profile.streakCount} day streak</span>
                </span>
              )}

              {(profile?.progress?.aiReadinessScore > 0 || profile?.analytics?.evaluation?.aiReadinessScore > 0) && (
                <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold">
                  <FiAward className="h-3.5 w-3.5" />
                  <span>
                    Readiness: {profile?.progress?.aiReadinessScore || profile?.analytics?.evaluation?.aiReadinessScore}%
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-center sm:justify-end gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenShare}
            className="!h-9 !px-3.5 inline-flex items-center gap-1.5"
          >
            <FiShare2 className="h-3.5 w-3.5" />
            <span>Share Profile</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenEdit}
            className="!h-9 !px-4 inline-flex items-center gap-1.5"
          >
            <FiEdit3 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
