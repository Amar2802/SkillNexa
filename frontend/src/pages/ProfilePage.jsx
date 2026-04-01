import { useMemo, useRef, useState } from "react";
import api from "../api/client";

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

const ProfilePage = ({ profile = {}, refreshProfile, logout }) => {
  const fileInputRef = useRef(null);
  const [selectedInterests, setSelectedInterests] = useState(profile?.interests || []);
  const initials = useMemo(() => (profile?.name || "U").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(), [profile?.name]);

  const updateAvatar = async (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      await api.put("/users/profile/avatar", { avatar: reader.result });
      refreshProfile();
    };
    reader.readAsDataURL(file);
  };

  const saveInterests = async () => {
    await api.put("/users/profile/interests", { interests: selectedInterests });
    refreshProfile();
  };

  return (
    <div className="container py-4">
      <div className="profile-hero-surface mb-4">
        <div className="profile-hero-main">
          <div className="profile-identity-block profile-identity-block-pro">
            <button type="button" className="border-0 bg-transparent p-0" onClick={() => fileInputRef.current?.click()}>
              {profile?.avatar ? <img src={profile.avatar} alt={profile.name} className="profile-photo" /> : <div className="profile-photo profile-photo-fallback">{initials}</div>}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="d-none" onChange={(event) => { const file = event.target.files?.[0]; if (file) updateAvatar(file); }} />
            <div className="profile-identity-copy">
              <p className="eyebrow mb-2">Profile Dashboard</p>
              <h1 className="h2 fw-bold mb-2">{profile?.name || "SkillNexa User"}</h1>
              <p className="text-secondary mb-2">{profile?.email}</p>
              <p className="text-secondary mb-0">Click the profile photo to update it. Upload starts right after you select an image.</p>
            </div>
          </div>
          <div className="profile-hero-aside">
            <div className="profile-aside-card">
              <p className="eyebrow mb-1">Software Track</p>
              <h2 className="h5 mb-2">Focused for software interviews</h2>
              <p className="text-secondary mb-0">SkillNexa is currently configured for software interview preparation only.</p>
            </div>
            <div className="profile-aside-card">
              <button className="btn btn-info w-100" onClick={logout}>Logout</button>
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
          <button className="btn btn-info" onClick={saveInterests}>Save Interests</button>
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
