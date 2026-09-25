import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCalendar, FiTrendingUp, FiAward, FiCheckSquare, FiArrowLeft, FiShare2, FiExternalLink } from "react-icons/fi";
import api from "../api/client";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import SkillNexaLogo from "../components/SkillNexaLogo";

export const PublicProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError("");

    api.get(`/users/public/${userId}`)
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || "Developer profile not found or private.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--snx-bg)] flex items-center justify-center p-4">
        <div className="text-xs text-slate-400 animate-pulse">Loading developer profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[var(--snx-bg)] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <EmptyState
            title="Profile Not Found"
            description="The requested developer profile does not exist or has been removed."
            action={
              <Link to="/">
                <Button variant="primary" size="sm">
                  Return to SkillNexa
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const memberSince = profile.memberSince
    ? new Date(profile.memberSince).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric"
      })
    : "Recently";

  const initials = (profile.name || "U")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[var(--snx-bg)] text-slate-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Navbar */}
        <div className="flex items-center justify-between py-2 border-b border-[var(--snx-border)] dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <SkillNexaLogo className="h-6 w-auto" />
          </Link>

          <Link to="/login">
            <Button variant="secondary" size="sm" className="!h-8">
              Sign In to Practice
            </Button>
          </Link>
        </div>

        {/* Public Card */}
        <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-6 shadow-subtle dark:border-slate-800 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="h-20 w-20 rounded-2xl border-2 border-[var(--snx-border)] bg-slate-100 overflow-hidden shrink-0 dark:border-slate-700 dark:bg-slate-800 flex items-center justify-center">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
              ) : (
                <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {initials}
                </div>
              )}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-xl font-bold">{profile.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-400">
                  {profile.targetField || "Software"} Track
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                {profile.bio || "Software engineering learner and technical interview candidate on SkillNexa."}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 flex-wrap pt-0.5">
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="h-3.5 w-3.5" />
                  <span>Joined {memberSince}</span>
                </span>
                {profile.streakCount > 0 && (
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                    <FiTrendingUp className="h-3.5 w-3.5" />
                    <span>{profile.streakCount} day streak</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Key Public Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Problems Solved
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {profile.problemsSolved}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Tests Completed
              </span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                {profile.testsCompleted}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Active Streak
              </span>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                {profile.streakCount} days
              </div>
            </div>
          </div>

          {/* Focus Skills */}
          {profile.interests?.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[var(--snx-border-subtle)] dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Focus Technologies & Topics
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {profile.interests.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-xs font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-400 py-4">
          Verified Developer Profile hosted on <span className="font-semibold text-slate-700 dark:text-slate-200">SkillNexa</span>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
