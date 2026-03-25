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
  const [savedInterests, setSavedInterests] = useState(profile?.interests || []);

  useEffect(() => {
    const nextInterests = profile?.interests || [];
    setInterests(nextInterests);
    setSavedInterests(nextInterests);
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
    setStatus("");
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
      setSavedInterests(interests);
      setStatus("Preparation interests updated successfully.");
    } catch (error) {
      setStatus(error.response?.data?.message || "Unable to update interests.");
    } finally {
      setSaving(false);
    }
  };

  const resetInterests = () => {
    setInterests(savedInterests);
    setStatus("Changes reset to your last saved interests.");
  };

  const weakTopics = profile?.progress?.weakTopics || [];
  const recommendedTopics = profile?.progress?.recommendedTopics || [];
  const hasInterestChanges = JSON.stringify([...interests].sort()) !== JSON.stringify([...savedInterests].sort());

  return (
    <div className="container py-4">
      <div className="card glass-card profile-hero-card">
        <div className="card-body p-4 p-lg-5">
          <div className="profile-header-row">
            <div className="profile-identity-block">
              <AvatarPreview profile={profile} />
              <div>
                <p className="eyebrow mb-2">Personal Dashboard</p>
                <h1 className="h2 fw-bold mb-1">{profile?.name}</h1>
                <p className="text-secondary mb-0 profile-subtitle">Track your growth, update your preferences, and keep your interview prep focused.</p>
              </div>
            </div>
            <div className="profile-action-stack">
              <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
              <div className="photo-actions-panel profile-panel-box">
                <p className="small text-secondary mb-1">Profile Photo</p>
                <input ref={galleryInputRef} type="file" accept="image/*" className="d-none" onChange={handleFileChange} />
                <input ref={cameraInputRef} type="file" accept="image/*" capture="user" className="d-none" onChange={handleFileChange} />
                <button className="btn btn-info" onClick={() => galleryInputRef.current?.click()} disabled={saving}>Upload From Gallery</button>
                <button className="btn btn-outline-light" onClick={() => cameraInputRef.current?.click()} disabled={saving}>Use Camera</button>
                {status && <p className="small mb-0 text-secondary">{status}</p>}
              </div>
            </div>
          </div>

          <div className="row g-3 mt-4">
            <div className="col-md-3"><div className="metric-card profile-metric-card"><span>Accuracy</span><h3>{profile?.progress?.accuracy || 0}%</h3><small>Overall performance</small></div></div>
            <div className="col-md-3"><div className="metric-card profile-metric-card"><span>Tests Taken</span><h3>{profile?.progress?.testsTaken || 0}</h3><small>Completed assessments</small></div></div>
            <div className="col-md-3"><div className="metric-card profile-metric-card"><span>Weak Topics</span><h3>{weakTopics.length}</h3><small>Focus areas to revise</small></div></div>
            <div className="col-md-3"><div className="metric-card profile-metric-card"><span>Recommended</span><h3>{recommendedTopics.length}</h3><small>Topics suggested for you</small></div></div>
          </div>

          <div className="row g-4 mt-1">
            <div className="col-lg-7">
              <div className="profile-panel-box h-100">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                  <div>
                    <h2 className="h5 mb-1">Preparation Interests</h2>
                    <p className="text-secondary mb-0">Choose the areas you want SkillNexa to prioritize for your preparation.</p>
                  </div>
                  <div className="d-flex gap-2 flex-wrap align-items-center">
                    <span className="small text-secondary">Selected: {interests.length}</span>
                    <button className="btn btn-outline-light" onClick={resetInterests} disabled={saving || !hasInterestChanges}>Reset</button>
                    <button className="btn btn-info" onClick={saveInterests} disabled={saving || !hasInterestChanges}>Save Interests</button>
                  </div>
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
                {hasInterestChanges && <p className="small text-secondary mb-0">You have unsaved interest changes.</p>}
              </div>
            </div>

            <div className="col-lg-5">
              <div className="profile-panel-box h-100">
                <h2 className="h5 mb-3">Focus Summary</h2>
                <div className="mb-4">
                  <p className="fw-semibold mb-2">Weak Topics</p>
                  <div className="d-flex gap-2 flex-wrap">
                    {weakTopics.length ? weakTopics.map((topic) => (
                      <span key={topic} className="badge text-bg-secondary">{topic}</span>
                    )) : <span className="text-secondary">No weak topics recorded yet.</span>}
                  </div>
                </div>
                <div>
                  <p className="fw-semibold mb-2">Recommended Topics</p>
                  <div className="d-flex gap-2 flex-wrap">
                    {recommendedTopics.length ? recommendedTopics.map((topic) => (
                      <span key={topic} className="badge text-bg-info">{topic}</span>
                    )) : <span className="text-secondary">Recommendations will appear as you practice more.</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
