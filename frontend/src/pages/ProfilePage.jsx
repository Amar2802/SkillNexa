import { useEffect, useMemo, useRef, useState } from "react";
import { FiCamera } from "react-icons/fi";
import api from "../api/client";
import PageHeader from "../components/ui/PageHeader";
import SurfaceCard from "../components/ui/SurfaceCard";
import { useToast } from "../components/ui/ToastProvider";

const INTEREST_OPTIONS = [
  "Arrays", "Strings", "Linked List", "Trees", "Graphs", "Dynamic Programming", "Probability", "Time and Work",
  "DBMS", "SQL", "Operating Systems", "Computer Networks", "OOP", "Java", "Python", "HR"
];

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

const formatMemberSince = (createdAt) => {
  if (!createdAt) return "recently";
  return new Date(createdAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
};

const interestsKey = (items = []) => [...items].sort().join("|");

const ProfilePage = ({ profile = {}, refreshProfile }) => {
  const fileInputRef = useRef(null);
  const { showToast } = useToast();
  const [selectedInterests, setSelectedInterests] = useState(profile?.interests || []);
  const [isUploading, setIsUploading] = useState(false);
  const initials = useMemo(
    () => (profile?.name || "U").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    [profile?.name]
  );

  useEffect(() => {
    setSelectedInterests(profile?.interests || []);
  }, [profile?.interests]);

  const memberSince = useMemo(() => formatMemberSince(profile?.createdAt), [profile?.createdAt]);
  const profileCompletion = useMemo(() => {
    let score = 0;
    if (profile?.avatar) score += 50;
    if ((profile?.interests || []).length > 0) score += 50;
    return score;
  }, [profile?.avatar, profile?.interests]);

  const hasUnsavedInterests = useMemo(
    () => interestsKey(selectedInterests) !== interestsKey(profile?.interests || []),
    [profile?.interests, selectedInterests]
  );

  const updateAvatar = async (file) => {
    if (!file) return;
    if (file.size > MAX_AVATAR_BYTES) {
      showToast("Profile photo must be 2MB or smaller.", "error");
      return;
    }
    setIsUploading(true);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Unable to read the selected image."));
        reader.readAsDataURL(file);
      });
      await api.put("/users/profile/avatar", { avatar: dataUrl });
      await refreshProfile?.();
      showToast("Profile photo updated.", "success");
    } catch (error) {
      showToast(error?.response?.data?.message || error?.message || "Unable to update profile photo.", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const saveInterests = async () => {
    try {
      await api.put("/users/profile/interests", { interests: selectedInterests });
      await refreshProfile?.();
      showToast("Interests saved.", "success");
    } catch (error) {
      showToast(error?.response?.data?.message || "Unable to save interests.", "error");
    }
  };

  const evalStats = profile?.analytics?.evaluation || {};
  const stats = [
    { label: "Evaluated answers", value: evalStats.totalEvaluated || profile?.progress?.evaluationsCount || 0 },
    { label: "Average score", value: evalStats.averageScore || profile?.progress?.averageInterviewScore || 0 },
    { label: "Highest score", value: evalStats.highestScore || 0 }
  ];

  return (
    <div className="space-y-6 snx-fade-in">
      <PageHeader
        kicker={`Member since ${memberSince}`}
        title={profile?.name || "SkillNexa User"}
        description={profile?.email || "AI interview workspace"}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]">
        <SurfaceCard strong className="space-y-5">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <button
              type="button"
              className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-card border border-slate-custom-200 shadow-md-soft"
              disabled={isUploading}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500 to-accent-500 text-2xl font-semibold text-white">
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-custom-900/40 opacity-0 transition group-hover:opacity-100">
                <FiCamera className="h-5 w-5 text-white" />
              </div>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) updateAvatar(f); }} />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-slate-custom-900 dark:text-white">{profile?.name || "Learner"}</h2>
              <p className="mt-0.5 text-sm text-slate-custom-500">{profile?.email}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-slate-custom-400">Joined {memberSince}</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-custom-200 bg-slate-custom-50 p-4 dark:border-slate-custom-600 dark:bg-slate-custom-800">
            <div className="flex justify-between text-sm font-medium text-slate-custom-600 dark:text-slate-custom-300">
              <span>Profile completion</span>
              <span>{profileCompletion}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-custom-200 dark:bg-slate-custom-700">
              <div className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: `${profileCompletion}%` }} />
            </div>
          </div>
        </SurfaceCard>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {stats.map((item) => (
            <div key={item.label} className="snx-stat !p-4">
              <div className="snx-label">{item.label}</div>
              <div className="snx-stat-value mt-1">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="snx-grid-2">
        <SurfaceCard className="space-y-3">
          <span className="snx-kicker">Strongest skills</span>
          <div className="flex flex-wrap gap-2">
            {(evalStats.strongestSkills || []).length
              ? evalStats.strongestSkills.map((skill) => <span key={skill} className="snx-badge-primary">{skill}</span>)
              : <span className="snx-body-sm">Complete AI evaluations to unlock skill insights.</span>}
          </div>
        </SurfaceCard>
        <SurfaceCard className="space-y-3">
          <span className="snx-kicker">Weakest skills</span>
          <div className="flex flex-wrap gap-2">
            {(evalStats.weakestSkills || []).length
              ? evalStats.weakestSkills.map((skill) => <span key={skill} className="snx-badge">{skill}</span>)
              : <span className="snx-body-sm">Weak areas appear after several evaluated answers.</span>}
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard strong className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="snx-kicker">Interests</span>
            <h2 className="snx-heading mt-2">Focus topics</h2>
          </div>
          <div className="flex items-center gap-3">
            {hasUnsavedInterests ? <span className="text-sm font-medium text-amber-600">Unsaved</span> : null}
            <button type="button" className="snx-btn-primary snx-btn-sm" onClick={saveInterests}>Save</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((item) => {
            const active = selectedInterests.includes(item);
            return (
              <button
                key={item}
                type="button"
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition duration-200 ${
                  active
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-slate-custom-200 bg-white text-slate-custom-700 hover:border-brand-300 hover:bg-indigo-50 dark:border-slate-custom-600 dark:bg-slate-custom-800 dark:text-slate-custom-200"
                }`}
                onClick={() => setSelectedInterests((c) => (active ? c.filter((v) => v !== item) : [...c, item]))}
              >
                {item}
              </button>
            );
          })}
        </div>
      </SurfaceCard>
    </div>
  );
};

export default ProfilePage;
