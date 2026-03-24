import { useEffect, useRef, useState } from "react";
import api from "../api/client";

const interestOptions = [
  "DSA",
  "Aptitude",
  "Probability",
  "HR Interviews",
  "Operating Systems",
  "DBMS",
  "Computer Networks",
  "OOP",
  "SQL",
  "Java",
  "Python",
  "Web Development"
];

const AvatarPreview = ({ profile }) => {
  const initials = (profile?.name || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return profile?.avatar ? (
    <img src={profile.avatar} alt={profile.name} className="profile-photo" />
  ) : (
    <div className="profile-photo profile-photo-fallback">{initials}</div>
  );
};

const ProfilePage = ({ profile, refreshProfile, logout }) => {
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [interests, setInterests] = useState(profile?.interests || []);

  useEffect(() => {
    setInterests(profile?.interests || []);
  }, [profile?.interests]);

  const uploadAvatar = async (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setSaving(true);
        setStatus("");
        await api.put("/users/profile/avatar", { avatar: reader.result });
        await refreshProfile();
        setStatus("Profile photo updated successfully.");
      } catch (error) {
        setStatus(error.response?.data?.message || "Unable to update profile photo.");
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    uploadAvatar(file);
    event.target.value = "";
  };

  const toggleInterest = (interest) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  };

  const saveInterests = async () => {
    try {
      setSaving(true);
      setStatus("");
      await api.put("/users/profile/interests", { interests });
      await refreshProfile();
      setStatus("Preparation interests updated successfully.");
    } catch (error) {
      setStatus(error.response?.data?.message || "Unable to update interests.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card glass-card profile-hero-card">
        <div className="card-body p-4 p-lg-5">
          <div className="profile-header-row">
            <div className="profile-identity-block">
              <AvatarPreview profile={profile} />
              <div>
                <p className="eyebrow mb-2">Personal Profile</p>
                <h1 className="h2 fw-bold mb-1">{profile?.name}</h1>
                <p className="text-secondary mb-0">{profile?.email}</p>
              </div>
            </div>
            <div className="d-flex flex-column align-items-end gap-2">
              <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
              <div className="photo-actions-panel">
                <input ref={galleryInputRef} type="file" accept="image/*" className="d-none" onChange={handleFileChange} />
                <input ref={cameraInputRef} type="file" accept="image/*" capture="user" className="d-none" onChange={handleFileChange} />
                <button className="btn btn-info" onClick={() => galleryInputRef.current?.click()} disabled={saving}>Upload From Gallery</button>
                <button className="btn btn-outline-light" onClick={() => cameraInputRef.current?.click()} disabled={saving}>Use Camera</button>
                {status && <p className="small mb-0 text-secondary">{status}</p>}
              </div>
            </div>
          </div>

          <div className="row g-3 mt-4">
            <div className="col-md-4"><div className="metric-card"><span>Accuracy</span><h3>{profile?.progress?.accuracy || 0}%</h3></div></div>
            <div className="col-md-4"><div className="metric-card"><span>Tests Taken</span><h3>{profile?.progress?.testsTaken || 0}</h3></div></div>
            <div className="col-md-4"><div className="metric-card"><span>Recommended</span><h3>{profile?.progress?.recommendedTopics?.length || 0}</h3></div></div>
          </div>

          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
              <div>
                <h2 className="h5 mb-1">Preparation Interests</h2>
                <p className="text-secondary mb-0">Choose the areas you want SkillNexa to help you focus on.</p>
              </div>
              <button className="btn btn-info" onClick={saveInterests} disabled={saving}>Save Interests</button>
            </div>
            <div className="interest-grid mb-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  className={`interest-chip ${interests.includes(interest) ? "active" : ""}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h2 className="h5">Recommended Topics</h2>
            <div className="d-flex gap-2 flex-wrap">
              {(profile?.progress?.recommendedTopics || []).map((topic) => (
                <span key={topic} className="badge text-bg-info">{topic}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
