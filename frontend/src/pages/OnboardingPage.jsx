import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCheckCircle, FiLayers, FiTarget } from "react-icons/fi";
import { motion } from "framer-motion";
import api from "../api/client";
import SkillNexaLogo from "../components/SkillNexaLogo";
import SurfaceCard from "../components/ui/SurfaceCard";
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
    setInterests((current) => (
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest].slice(0, 8)
    ));
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
    <div className="snx-app-shell">
      <div className="snx-container py-12 md:py-16">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-teal-600 shadow-sm shadow-slate-200/70 backdrop-blur">
              Welcome to SkillNexa
            </div>
            <div className="max-w-3xl space-y-4">
              <h1 className="snx-display max-w-4xl">
                Set your preparation lane once. We will shape the workspace around it.
              </h1>
              <p className="snx-subcopy max-w-2xl">
                Choose your target field and a focused set of interests so your dashboard, recommendations, mock tests, and practice sessions start from the right direction immediately.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { icon: FiTarget, title: "Field-first setup", copy: "Align the platform to your interview track before entering the dashboard." },
                { icon: FiLayers, title: "Topic prioritization", copy: "Select the areas you want SkillNexa to emphasize in early practice loops." },
                { icon: FiCheckCircle, title: "Editable anytime", copy: "You can refine this setup later from Profile as your focus changes." }
              ].map((item) => (
                <SurfaceCard key={item.title} className="space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                  <p className="text-sm leading-7 text-slate-600">{item.copy}</p>
                </SurfaceCard>
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
          >
            <div className="snx-glass rounded-[2rem] p-6 shadow-[0_35px_80px_-40px_rgba(15,23,42,0.35)] md:p-8">
              <div className="mb-8 flex items-center justify-between gap-4">
                <SkillNexaLogo showTagline />
                <span className="snx-badge">Step 1 of 1</span>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="snx-kicker">Preparation Setup</p>
                  <h2 className="text-3xl font-semibold text-slate-950">Choose your field before entering the platform</h2>
                  <p className="text-sm leading-7 text-slate-600">
                    SkillNexa will use this to organize recommended questions, progress insights, and the type of practice loops you see first.
                  </p>
                </div>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Preparation Field</span>
                  <select
                    className="snx-select"
                    value={targetField}
                    onChange={(event) => {
                      setTargetField(event.target.value);
                      setInterests([]);
                    }}
                  >
                    {FIELD_OPTIONS.map((field) => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </label>

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-sm font-medium text-slate-700">Interested Topics</span>
                      <p className="mt-1 text-xs leading-6 text-slate-500">Pick up to 8 topics you want the platform to prioritize first.</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      {interests.length}/8 selected
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {interestOptions.map((interest) => {
                      const selected = interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                            selected
                              ? "border-teal-400 bg-teal-500/10 text-teal-700 shadow-sm shadow-teal-100"
                              : "border-slate-200 bg-white/80 text-slate-600 hover:border-teal-200 hover:bg-teal-50/70"
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {error ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {error}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button className="snx-btn-primary" onClick={savePreferences} disabled={saving}>
                    {saving ? "Saving..." : "Save and Continue"}
                    <FiArrowRight className="h-4 w-4" />
                  </button>
                  <p className="text-xs leading-6 text-slate-500">
                    You can update these preferences later from your profile settings.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
