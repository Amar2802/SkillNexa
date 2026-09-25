import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  DashboardHeader,
  StatsOverview,
  InterviewReadinessCard,
  ContinueLearningCard,
  RecommendedPractice,
  SkillPerformance,
  WeeklyActivityTracker,
  RecentActivityTimeline,
  DashboardSkeleton
} from "../components/dashboard";
import EvaluationAnalyticsPanel from "../components/evaluation/EvaluationAnalyticsPanel";

const baseAnalyticsBuckets = [
  { label: "Data Structures & Algorithms", topics: ["Arrays", "Strings", "Linked List", "Trees", "Graphs", "Dynamic Programming"] },
  { label: "Core CS (DBMS, OS & SQL)", topics: ["DBMS", "SQL", "Operating Systems", "Computer Networks", "OOP"] },
  { label: "System Design & Architecture", topics: ["System Design", "Scalability", "Microservices", "Caching"] },
  { label: "Quantitative & Aptitude", topics: ["Probability", "Time and Work", "Percentages", "Reasoning"] }
];

export const DashboardPage = ({
  profile = {},
  questions = [],
  recommendations = [],
  history = [],
  loading = false
}) => {
  const weakTopics = profile?.progress?.weakTopics || [];
  const recommendedTopics = profile?.progress?.recommendedTopics || [];

  const analytics = useMemo(() => {
    const recentHistory = [...history].slice(0, 8).reverse();
    const testsTaken =
      profile?.progress?.testsTaken ??
      history.filter((h) => h.type === "test" || h.title?.toLowerCase().includes("test")).length;

    const accuracy = profile?.progress?.accuracy || 0;
    const recentAccuracies = recentHistory.map((item) => item.accuracy || item.score || 0).filter(Boolean);
    const avgScore = recentAccuracies.length
      ? Math.round(recentAccuracies.reduce((sum, v) => sum + v, 0) / recentAccuracies.length)
      : accuracy;

    const consistency = recentAccuracies.length > 1
      ? Math.max(0, 100 - Math.round((Math.max(...recentAccuracies) - Math.min(...recentAccuracies)) * 1.1))
      : accuracy || 70;

    const topicHealth = baseAnalyticsBuckets.map((bucket) => {
      const weaknessHits = weakTopics.filter((topic) =>
        bucket.topics.some(
          (entry) =>
            topic.toLowerCase().includes(entry.toLowerCase()) ||
            entry.toLowerCase().includes(topic.toLowerCase())
        )
      ).length;

      const recommendationHits = recommendedTopics.filter((topic) =>
        bucket.topics.some(
          (entry) =>
            topic.toLowerCase().includes(entry.toLowerCase()) ||
            entry.toLowerCase().includes(topic.toLowerCase())
        )
      ).length;

      const baseScore = 84 - weaknessHits * 18 + recommendationHits * 5;
      const score = Math.max(25, Math.min(95, baseScore));

      return {
        label: bucket.label,
        score,
        status: weaknessHits > 1 ? "Needs Focus" : weaknessHits === 1 ? "Improving" : "Strong"
      };
    });

    return { testsTaken, accuracy: avgScore || accuracy, consistency, topicHealth, recentHistory };
  }, [history, profile?.progress?.accuracy, profile?.progress?.testsTaken, recommendedTopics, weakTopics]);

  const evalAnalytics = profile?.analytics?.evaluation || {};
  const calculatedReadiness =
    evalAnalytics.aiReadinessScore ||
    profile?.progress?.aiReadinessScore ||
    Math.max(30, Math.round((analytics.accuracy * 0.6) + (analytics.consistency * 0.4)));

  const weeklyDays = useMemo(() => {
    const days = [];
    const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const isToday = i === 0;

      const hasActivity = history.some((h) => {
        if (!h.createdAt) return false;
        return new Date(h.createdAt).toISOString().split("T")[0] === dateStr;
      });

      const active = hasActivity || profile.lastActiveDate === dateStr;

      days.push({
        name: weekdayNames[d.getDay()],
        dateStr,
        isToday,
        active
      });
    }
    return days;
  }, [history, profile.lastActiveDate]);

  const solvedIds = useMemo(() => {
    const ids = new Set();
    if (Array.isArray(profile?.progress?.solvedQuestions)) {
      profile.progress.solvedQuestions.forEach((id) => ids.add(String(id)));
    }
    history.forEach((h) => {
      if (h.questionId) ids.add(String(h.questionId));
    });
    return ids;
  }, [profile?.progress?.solvedQuestions, history]);

  const displayQuestions = useMemo(() => {
    if (recommendations && recommendations.length > 0) return recommendations;
    return questions.slice(0, 4);
  }, [recommendations, questions]);

  // Show high-fidelity skeleton if initial data is still loading
  if (loading && !profile?.email && !questions.length) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* 1. Welcome & Primary Command Header */}
      <DashboardHeader profile={profile} streak={profile?.streakCount || 1} />

      {/* 2. Quick Progress Overview Metrics */}
      <StatsOverview profile={profile} history={history} />

      {/* 3. Primary Command Center: Next Action + Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ContinueLearningCard
          title="Full-Stack & Algorithms Mastery"
          topic={weakTopics[0] ? `${weakTopics[0]} Deep Dive` : "Binary Search & Tree Traversals"}
          progress={analytics.accuracy ? Math.min(100, Math.round(analytics.accuracy * 0.9)) : 40}
          estimatedTime="25 min"
          linkTo={weakTopics[0] ? `/questions?topic=${encodeURIComponent(weakTopics[0])}` : "/roadmaps"}
        />

        <InterviewReadinessCard
          score={calculatedReadiness}
          strongTopics={recommendedTopics.length ? recommendedTopics : ["Data Structures", "Algorithms"]}
          weakTopics={weakTopics}
          testsCount={analytics.testsTaken}
        />
      </div>

      {/* 4. Recommended Practice Problems */}
      <RecommendedPractice
        questions={displayQuestions}
        solvedIds={solvedIds}
      />

      {/* 5. Skill Performance & 7-Day Consistency Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <SkillPerformance
          topicHealth={analytics.topicHealth}
          weakTopics={weakTopics}
        />

        <WeeklyActivityTracker
          days={weeklyDays}
          activeDaysCount={weeklyDays.filter((d) => d.active).length}
        />
      </div>

      {/* 6. Recent Activity Timeline */}
      <RecentActivityTimeline history={history} />

      {/* 7. Deep AI Evaluation Analytics (Rendered if user has evaluated interview sessions) */}
      {evalAnalytics?.totalEvaluated ? (
        <div className="pt-2">
          <EvaluationAnalyticsPanel analytics={evalAnalytics} />
        </div>
      ) : null}
    </motion.div>
  );
};

export default DashboardPage;
