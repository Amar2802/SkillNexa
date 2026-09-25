import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../api/client";
import {
  ProfileHeader,
  ProfileStatsRow,
  ProfileSkillsSection,
  CurrentLearningCard,
  ProfileActivityHeatmap,
  AchievementsSection,
  EditProfileModal,
  ShareProfileModal
} from "../components/profile";

export const ProfilePage = ({
  profile = {},
  refreshProfile
}) => {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'achievements'
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Supplemental history & session data for verified counts
  const [history, setHistory] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [roadmapsData, setRoadmapsData] = useState({ roadmaps: [], completedRoadmapTopics: [], overallCompletion: 0 });

  const loadSupplementalData = useCallback(async () => {
    try {
      const results = await Promise.allSettled([
        api.get("/users/history", { timeout: 25000 }),
        api.get("/ai/sessions", { timeout: 25000 }),
        api.get("/roadmaps", { timeout: 25000 })
      ]);

      if (results[0].status === "fulfilled") setHistory(results[0].value.data || []);
      if (results[1].status === "fulfilled") setSessions(results[1].value.data || []);
      if (results[2].status === "fulfilled") setRoadmapsData(results[2].value.data || { roadmaps: [], completedRoadmapTopics: [], overallCompletion: 0 });
    } catch {
      // Graceful fallback to profile props
    }
  }, []);

  useEffect(() => {
    loadSupplementalData().catch(() => undefined);
  }, [loadSupplementalData]);

  // Derive counts from verified records
  const { problemsSolved, testsCompleted, interviewsCompleted, skillAccuracies } = useMemo(() => {
    let solved = 0;
    const accuracies = {};
    const topicStats = {};

    (history || []).forEach((h) => {
      (h.answers || []).forEach((a) => {
        if (a.isCorrect) solved += 1;
        const topic = a.question?.topic || "General";
        if (!topicStats[topic]) topicStats[topic] = { total: 0, correct: 0 };
        topicStats[topic].total += 1;
        if (a.isCorrect) topicStats[topic].correct += 1;
      });
    });

    Object.entries(topicStats).forEach(([topic, s]) => {
      accuracies[topic] = s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
    });

    return {
      problemsSolved: solved || profile?.analytics?.totalQuestionsAttempted || 0,
      testsCompleted: history.length || profile?.progress?.testsTaken || 0,
      interviewsCompleted: sessions.length || profile?.progress?.evaluationsCount || 0,
      skillAccuracies: accuracies
    };
  }, [history, sessions, profile]);

  const activeRoadmap = useMemo(() => {
    if (!roadmapsData.roadmaps?.length) return null;
    return roadmapsData.roadmaps[0];
  }, [roadmapsData]);

  return (
    <div className="space-y-6">
      {/* 1. Profile Header with Avatar & Details */}
      <ProfileHeader
        profile={profile}
        refreshProfile={refreshProfile}
        onOpenEdit={() => setEditModalOpen(true)}
        onOpenShare={() => setShareModalOpen(true)}
      />

      {/* 2. Top-Level Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--snx-border)] pb-2 dark:border-slate-800 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-2 px-1 border-b-2 transition cursor-pointer ${
            activeTab === "overview"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          Profile Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("achievements")}
          className={`pb-2 px-1 border-b-2 transition cursor-pointer ${
            activeTab === "achievements"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
        >
          Badges & Achievements
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* 3. Verified Statistics Row */}
          <ProfileStatsRow
            problemsSolved={problemsSolved}
            testsCompleted={testsCompleted}
            interviewsCompleted={interviewsCompleted}
            topicsCompleted={roadmapsData.completedRoadmapTopics?.length || 0}
            streakCount={profile?.streakCount || 0}
          />

          {/* 4. Current Learning Progress */}
          <CurrentLearningCard
            activeRoadmap={activeRoadmap}
            completedTopicsCount={roadmapsData.completedRoadmapTopics?.length || 0}
            overallCompletion={roadmapsData.overallCompletion || 0}
          />

          {/* 5. Target Skills & Focus Topics */}
          <ProfileSkillsSection
            skills={profile?.interests || []}
            skillAccuracies={skillAccuracies}
            onOpenEditInterests={() => setEditModalOpen(true)}
          />

          {/* 6. Activity Heatmap Grid */}
          <ProfileActivityHeatmap
            history={history}
            sessions={sessions}
          />
        </div>
      )}

      {/* Tab: Achievements */}
      {activeTab === "achievements" && (
        <AchievementsSection
          problemsSolved={problemsSolved}
          testsCompleted={testsCompleted}
          interviewsCompleted={interviewsCompleted}
          streakCount={profile?.streakCount || 0}
          topicsCompleted={roadmapsData.completedRoadmapTopics?.length || 0}
        />
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        profile={profile}
        refreshProfile={refreshProfile}
      />

      {/* Share Profile Modal */}
      <ShareProfileModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        profile={profile}
      />
    </div>
  );
};

export default ProfilePage;
