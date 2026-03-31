import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { FIELD_INTEREST_OPTIONS, FIELD_OPTIONS } from "../utils/fieldOptions";

const OnboardingPage = ({ profile, refreshProfile, needsSetup }) => {
  const navigate = useNavigate();
  const [targetField, setTargetField] = useState(profile?.targetField || "Software");
  const [interests, setInterests] = useState(profile?.interests || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const interestOptions = useMemo(
    () => FIELD_INTEREST_OPTIONS[targetField] || FIELD_INTEREST_OPTIONS.Software,
    [targetField]
  );

  useEffect(() => {
    if (!needsSetup && profile?.targetField && (profile?.interests || []).length) {
      navigate("/dashboard", { replace: true });
    }
  }, [needsSetup, navigate, profile?.interests, profile?.targetField]);

  const toggleInterest = (interest) => {
    setError("");
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest].slice(0, 8)
    );
  };

  const savePreferences = async () => {
    if (!interests.length) {
      setError("Select at least one interested topic to continue.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await api.put("/users/profile/field", { targetField });
      await api.put("/users/profile/interests", { interests });
      const updatedProfile = await refreshProfile();
      if (updatedProfile) {
        localStorage.setItem("user", JSON.stringify(updatedProfile));
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save your preparation setup.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="auth-page onboarding-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card glass-card">
              <div className="card-body p-4 p-lg-5">
                <span className="eyebrow">Preparation Setup</span>
                <h1 className="h2 fw-bold mt-3">Choose your field before entering the platform</h1>
                <p className="text-secondary mb-4">
                  Set your preparation field and interested topics once. SkillNexa will then tailor the whole website around that track until you change it from your profile.
                </p>

                <div className="mb-4">
                  <label className="form-label">Preparation Field</label>
                  <select
                    className="form-select"
                    value={targetField}
                    onChange={(e) => {
                      setTargetField(e.target.value);
                      setInterests([]);
                    }}
                  >
                    {FIELD_OPTIONS.map((field) => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Interested Topics</label>
                  <div className="interest-grid mb-2">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        className={`interest-chip ${interests.includes(interest) ? "active" : ""}`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  <div className="form-text">Pick the topics you want the platform to prioritize first.</div>
                </div>

                {error && <div className="alert alert-danger py-2 mt-3">{error}</div>}

                <div className="d-flex gap-2 flex-wrap mt-4">
                  <button className="btn btn-info" onClick={savePreferences} disabled={saving}>
                    {saving ? "Saving..." : "Save and Continue"}
                  </button>
                  <span className="text-secondary align-self-center small">
                    You can still change this later from the Profile section.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
