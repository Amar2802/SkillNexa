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
  const accuracy = profile?.progress?.accuracy || 0;
  const testsTaken = profile?.progress?.testsTaken || 0;
  const hasInterestChanges = JSON.stringify([...interests].sort()) !== JSON.stringify([...savedInterests].sort());
  const profileStrengthLabel = accuracy >= 70 ? "Consistent performer" : accuracy >= 40 ? "Building momentum" : "Early progress";
  const priorityTopic = weakTopics[0] || recommendedTopics[0] || interests[0] || "Core interview topics";
  const profileEmail = profile?.email || "Email hidden";

  const metrics = [
    { label: "Accuracy", value: `${accuracy}%`, caption: "Overall interview performance" },
    { label: "Tests Taken", value: testsTaken, caption: "Completed assessments" },
    { label: "Weak Topics", value: weakTopics.length, caption: "Areas that need revision" },
    { label: "Recommendations", value: recommendedTopics.length, caption: "Topics suggested for growth" }
  ];

  return (
    <div className="container py-4 profile-page-pro">
      <div className="profile-hero-surface mb-4">
        <div className="profile-hero-main">
          <div className="profile-identity-block profile-identity-block-pro">
            <AvatarPreview profile={profile} />
            <div className="profile-identity-copy">
              <p className="eyebrow mb-2">Profile Dashboard</p>
              <h1 className="display-6 fw-bold mb-2">{profile?.name}</h1>
              <p className="text-secondary mb-3 profile-subtitle">A polished control center for your interview preparation, progress signals, and personalization settings.</p>
              <div className="profile-hero-pills">
                <span className="hero-pill">{profileStrengthLabel}</span>
                <span className="hero-pill">Priority: {priorityTopic}</span>
                <span className="hero-pill">{interests.length} interests selected</span>
              </div>
            </div>
          </div>

          <div className="profile-hero-aside">
            <div className="profile-aside-card profile-identity-card">
              <span className="feedback-label">Account Overview</span>
              <h2 className="h5 mb-1">{profile?.name}</h2>
              <p className="text-secondary mb-3">{profileEmail}</p>
              <div className="profile-account-meta">
                <div>
                  <span>Focus Topic</span>
                  <strong>{priorityTopic}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{profileStrengthLabel}</strong>
                </div>
              </div>
            </div>

            <div className="profile-aside-card profile-photo-card">
              <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <span className="feedback-label">Profile Photo</span>
                  <h2 className="h6 mb-1">Update your visual identity</h2>
                </div>
                <button className="btn btn-outline-danger btn-sm" onClick={logout}>Logout</button>
              </div>
              <div className="profile-photo-actions">
                <input ref={galleryInputRef} type="file" accept="image/*" className="d-none" onChange={handleFileChange} />
                <input ref={cameraInputRef} type="file" accept="image/*" capture="user" className="d-none" onChange={handleFileChange} />
                <button className="btn btn-info" onClick={() => galleryInputRef.current?.click()} disabled={saving}>Upload From Gallery</button>
                <button className="btn btn-outline-light" onClick={() => cameraInputRef.current?.click()} disabled={saving}>Use Camera</button>
              </div>
              {status && <p className="small mb-0 text-secondary mt-3">{status}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-metric-grid mb-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="metric-card profile-metric-card profile-metric-card-pro">
            <span>{metric.label}</span>
            <h3>{metric.value}</h3>
            <small>{metric.caption}</small>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-xl-8">
          <div className="profile-section-card h-100">
            <div className="profile-section-head mb-3">
              <div>
                <p className="eyebrow mb-2">Personalization</p>
                <h2 className="h4 mb-1">Preparation Interests</h2>
                <p className="text-secondary mb-0">Tune the product around the topics that matter most for your interview journey.</p>
              </div>
              <div className="profile-section-actions">
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

            <div className="profile-status-strip">
              <div>
                <span className="feedback-label">Interest Status</span>
                <p className="mb-0 text-secondary">
                  {hasInterestChanges
                    ? "You have unsaved interest changes ready to publish."
                    : "Your current interests are saved and actively shaping recommendations."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="profile-section-card h-100 profile-focus-card">
            <div className="profile-section-head mb-3">
              <div>
                <p className="eyebrow mb-2">Focus Summary</p>
                <h2 className="h4 mb-1">Next Best Step</h2>
                <p className="text-secondary mb-0">A clear direction for what to revise next and where your strongest opportunity lies.</p>
              </div>
            </div>

            <div className="profile-next-step-card mb-4">
              <span className="feedback-label">Focus Topic</span>
              <h3 className="h5 mb-2">{priorityTopic}</h3>
              <p className="text-secondary mb-0">Use this topic as your next high-value revision area before starting another mock test.</p>
            </div>

            <div className="profile-topic-stack">
              <div>
                <p className="fw-semibold mb-2">Weak Topics</p>
                <div className="d-flex gap-2 flex-wrap mb-4">
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
  );
};

export default ProfilePage;
