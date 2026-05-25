import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/client";
import { useToast } from "../components/ui/ToastProvider";

const INTEREST_OPTIONS = [
  "Arrays",
  "Strings",
  "Linked List",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Probability",
  "Time and Work",
  "DBMS",
  "SQL",
  "Operating Systems",
  "Computer Networks",
  "OOP",
  "Java",
  "Python",
  "HR"
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
    <div className="container-fluid py-4 snx-page-shell">
      <div className="profile-hero-surface mb-4">
        <div className="profile-hero-main">
          <div className="profile-identity-block profile-identity-block-pro">
            <div className="profile-photo-wrap">
              <button
                type="button"
                className="border-0 bg-transparent p-0 profile-photo-trigger"
                disabled={isUploading}
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                {profile?.avatar ? <img src={profile.avatar} alt={profile.name} className="profile-photo" /> : <div className="profile-photo profile-photo-fallback">{initials}</div>}
                <span className="profile-photo-overlay" aria-hidden="true">
                  {isUploading ? <span className="profile-photo-overlay-spinner" /> : <span className="profile-photo-overlay-icon">📷</span>}
                </span>
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="d-none" onChange={(event) => { const file = event.target.files?.[0]; if (file) updateAvatar(file); }} />
            <div className="profile-identity-copy">
              <p className="eyebrow mb-2">Member since {memberSince}</p>
              <h1 className="h2 fw-bold mb-2">{profile?.name || "SkillNexa User"}</h1>
              <p className="text-secondary mb-0">{profile?.email}</p>
            </div>
          </div>
          <div className="profile-hero-aside">
            <div className="profile-aside-card">
              <p className="eyebrow mb-1">Member Profile</p>
              <h2 className="h5 mb-2">Joined {memberSince}</h2>
              <p className="text-secondary mb-2">Profile completion</p>
              <div className="progress mb-2" role="progressbar" aria-valuenow={profileCompletion} aria-valuemin="0" aria-valuemax="100">
                <div className="progress-bar" style={{ width: `${profileCompletion}%` }} />
              </div>
              <p className="text-secondary mb-0">{profileCompletion}% complete</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4"><div className="metric-card profile-metric-card-pro"><span>Tests Taken</span><h3>{profile?.progress?.testsTaken || 0}</h3></div></div>
        <div className="col-md-4"><div className="metric-card profile-metric-card-pro"><span>Accuracy</span><h3>{profile?.progress?.accuracy || 0}%</h3></div></div>
        <div className="col-md-4"><div className="metric-card profile-metric-card-pro"><span>Weak Topics</span><h3>{(profile?.progress?.weakTopics || []).length}</h3></div></div>
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div>
            <p className="eyebrow mb-1">Interested Topics</p>
            <h2 className="h4 mb-0">Choose what you want to focus on</h2>
          </div>
          <div className="profile-section-actions">
            {hasUnsavedInterests ? <small className="text-warning">Unsaved changes</small> : null}
            <button className="btn btn-info" onClick={saveInterests}>Save Interests</button>
          </div>
        </div>
        <div className="interest-grid">
          {INTEREST_OPTIONS.map((item) => {
            const active = selectedInterests.includes(item);
            return (
              <button key={item} className={`interest-chip ${active ? "active" : ""}`} onClick={() => setSelectedInterests((current) => active ? current.filter((value) => value !== item) : [...current, item])}>{item}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
