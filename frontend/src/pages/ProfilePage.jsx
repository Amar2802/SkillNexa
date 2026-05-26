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
  const initials = useMemo(() => (profile?.name || "U").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(), [profile?.name]);

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

  return (
    <div className="space-y-6">
      <PageHeader
        kicker={`Member since ${memberSince}`}
        title={profile?.name || "SkillNexa User"}
        description={profile?.email || "AI interview workspace"}
        aside={(
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {[
              { label: "Profile completion", value: `${profileCompletion}%` },
              { label: "Tests taken", value: profile?.progress?.testsTaken || 0 },
              { label: "Accuracy", value: `${profile?.progress?.accuracy || 0}%` }
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</div>
                <div className="mt-2 text-3xl font-semibold text-slate-950">{item.value}</div>
              </div>
            ))}
          </div>
        )}
      />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <SurfaceCard strong className="space-y-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <button
              type="button"
              className="group relative h-32 w-32 overflow-hidden rounded-[32px] border border-white/70 shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
              disabled={isUploading}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500 to-accent-500 text-4xl font-semibold text-white">
                  {initials}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition group-hover:opacity-100">
                <FiCamera className="h-6 w-6 text-white" />
              </div>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) updateAvatar(file); }} />
            <div>
              <h2 className="text-xl font-semibold text-slate-950">{profile?.name || "Learner"}</h2>
              <p className="mt-1 text-sm text-slate-500">{profile?.email}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">Joined {memberSince}</p>
            </div>
            <div className="w-full rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
              <div className="flex items-center justify-between text-sm font-medium text-slate-600">
                <span>Profile completion</span>
                <span>{profileCompletion}%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: `${profileCompletion}%` }} />
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard strong className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="snx-kicker">Interested topics</span>
              <h2 className="snx-heading mt-4">Choose what you want to focus on</h2>
            </div>
            <div className="flex items-center gap-3">
              {hasUnsavedInterests ? <span className="text-sm font-medium text-amber-700">Unsaved changes</span> : null}
              <button className="snx-btn-accent" onClick={saveInterests}>Save Interests</button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {INTEREST_OPTIONS.map((item) => {
              const active = selectedInterests.includes(item);
              return (
                <button
                  key={item}
                  className={`rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "border-brand-500 bg-brand-500 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50"
                  }`}
                  onClick={() => setSelectedInterests((current) => active ? current.filter((value) => value !== item) : [...current, item])}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
};

export default ProfilePage;
