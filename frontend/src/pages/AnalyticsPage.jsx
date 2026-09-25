import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../api/client";
import {
  AnalyticsHeader,
  PreparationSummary,
  PreparationProgress,
  ActivityTrendChart,
  SkillPerformanceSection,
  StrengthsAndWeakAreas,
  CodingPerformanceSection,
  MockTestPerformanceSection,
  MockInterviewPerformanceSection,
  LearningProgressSection,
  RecommendedActionsSection
} from "../components/analytics";

export const AnalyticsPage = ({
  profile = null,
  history = [],
  refreshHistory,
  refreshProfile
}) => {
  const [timeRange, setTimeRange] = useState("all"); // '7d' | '30d' | '90d' | 'all'
  const [loading, setLoading] = useState(false);
  const [testHistory, setTestHistory] = useState(history || []);
  const [interviewSessions, setInterviewSessions] = useState([]);
  const [roadmapsData, setRoadmapsData] = useState({ roadmaps: [], completedRoadmapTopics: [], overallCompletion: 0 });
  const [evalAnalytics, setEvalAnalytics] = useState(profile?.analytics?.evaluation || null);

  // Load all analytics sources with independent fault tolerance
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        api.get("/users/history", { timeout: 25000 }),
        api.get("/ai/sessions", { timeout: 25000 }),
        api.get("/roadmaps", { timeout: 25000 }),
        api.get("/evaluations/analytics", { timeout: 25000 })
      ]);

      // 1. History
      if (results[0].status === "fulfilled") {
        setTestHistory(results[0].value.data || []);
      } else if (history?.length) {
        setTestHistory(history);
      }

      // 2. AI Interview Sessions
      if (results[1].status === "fulfilled") {
        setInterviewSessions(results[1].value.data || []);
      }

      // 3. Roadmaps
      if (results[2].status === "fulfilled") {
        setRoadmapsData(results[2].value.data || { roadmaps: [], completedRoadmapTopics: [], overallCompletion: 0 });
      }

      // 4. AI Evaluation Analytics
      if (results[3].status === "fulfilled") {
        setEvalAnalytics(results[3].value.data || null);
      } else if (profile?.analytics?.evaluation) {
        setEvalAnalytics(profile.analytics.evaluation);
      }
    } finally {
      setLoading(false);
    }
  }, [history, profile?.analytics?.evaluation]);

  useEffect(() => {
    loadData().catch(() => undefined);
  }, [loadData]);

  // Filter history and sessions by selected time range
  const { filteredHistory, filteredSessions } = useMemo(() => {
    if (timeRange === "all") {
      return { filteredHistory: testHistory, filteredSessions: interviewSessions };
    }

    const now = Date.now();
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const cutoff = now - days * 24 * 60 * 60 * 1000;

    const fh = (testHistory || []).filter((item) => {
      const t = new Date(item.createdAt || 0).getTime();
      return t >= cutoff;
    });

    const fs = (interviewSessions || []).filter((item) => {
      const t = new Date(item.createdAt || 0).getTime();
      return t >= cutoff;
    });

    return { filteredHistory: fh, filteredSessions: fs };
  }, [testHistory, interviewSessions, timeRange]);

  // Aggregate Problem / Coding metrics from test history answers
  const {
    totalAttempted,
    totalCorrect,
    overallAccuracy,
    difficultyBreakdown,
    formatBreakdown,
    topicStats,
    strengths,
    weakAreas,
    avgTimeSpent
  } = useMemo(() => {
    let attempted = 0;
    let correct = 0;
    let totalSecs = 0;

    const diffs = {
      Easy: { total: 0, solved: 0 },
      Medium: { total: 0, solved: 0 },
      Hard: { total: 0, solved: 0 }
    };

    const formats = {
      Coding: 0,
      MCQ: 0,
      Subjective: 0
    };

    const topicMap = {};

    (filteredHistory || []).forEach((testResult) => {
      const answers = testResult.answers || [];
      answers.forEach((ans) => {
        attempted += 1;
        const isRight = Boolean(ans.isCorrect);
        if (isRight) correct += 1;
        if (ans.timeSpent) totalSecs += Number(ans.timeSpent) || 0;

        const q = ans.question || {};
        const diff = q.difficulty || "Medium";
        if (diffs[diff]) {
          diffs[diff].total += 1;
          if (isRight) diffs[diff].solved += 1;
        }

        const fmt = q.type || "Coding";
        if (formats[fmt] !== undefined) {
          formats[fmt] += 1;
        } else {
          formats.Subjective += 1;
        }

        const t = q.topic || "General";
        if (!topicMap[t]) {
          topicMap[t] = { topic: t, total: 0, correct: 0 };
        }
        topicMap[t].total += 1;
        if (isRight) topicMap[t].correct += 1;
      });
    });

    // Also include evaluation topic mastery if available
    if (evalAnalytics?.topicMastery?.length) {
      evalAnalytics.topicMastery.forEach((tm) => {
        if (!topicMap[tm.topic]) {
          topicMap[tm.topic] = { topic: tm.topic, total: 0, correct: 0, score: tm.score };
        } else if (tm.score) {
          topicMap[tm.topic].score = tm.score;
        }
      });
    }

    // Convert topics map to list with accuracies
    const topicsList = Object.values(topicMap).map((item) => {
      const acc = item.total > 0 ? Math.round((item.correct / item.total) * 100) : item.score || 0;
      return {
        ...item,
        accuracy: acc
      };
    }).sort((a, b) => b.accuracy - a.accuracy);

    // Derived Strengths (>= 70%) & Weak Areas (< 70% or in user weakTopics)
    const strongList = topicsList.filter((t) => t.accuracy >= 70);
    const weakList = topicsList.filter((t) => t.accuracy < 70 && t.total > 0);

    // Merge with user profile weak topics if available
    const profileWeaks = profile?.progress?.weakTopics || [];
    profileWeaks.forEach((pw) => {
      if (!weakList.some((w) => w.topic.toLowerCase() === pw.toLowerCase())) {
        weakList.push({ topic: pw, accuracy: 50, total: 1, correct: 0 });
      }
    });

    const calculatedAccuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : profile?.progress?.accuracy || 0;
    const avgSpeed = attempted > 0 ? Math.round(totalSecs / attempted) : profile?.analytics?.avgTimePerQuestion || 0;

    return {
      totalAttempted: attempted || profile?.analytics?.totalQuestionsAttempted || 0,
      totalCorrect: correct,
      overallAccuracy: calculatedAccuracy,
      difficultyBreakdown: diffs,
      formatBreakdown: formats,
      topicStats: topicsList,
      strengths: strongList,
      weakAreas: weakList,
      avgTimeSpent: avgSpeed
    };
  }, [filteredHistory, evalAnalytics, profile]);

  // Aggregate Test Scores
  const { testsCount, avgTestScore } = useMemo(() => {
    const count = (filteredHistory || []).length;
    if (!count) return { testsCount: 0, avgTestScore: 0 };
    const totalScore = filteredHistory.reduce((sum, h) => sum + (Number(h.score) || 0), 0);
    return {
      testsCount: count,
      avgTestScore: Math.round(totalScore / count)
    };
  }, [filteredHistory]);

  // Aggregate Interview Scores
  const { interviewsCount, avgInterviewScore } = useMemo(() => {
    const count = (filteredSessions || []).length;
    if (!count) {
      return {
        interviewsCount: evalAnalytics?.totalEvaluated || 0,
        avgInterviewScore: evalAnalytics?.averageScore || 0
      };
    }
    const totalScore = filteredSessions.reduce((sum, s) => sum + (Number(s.overallScore) || 0), 0);
    return {
      interviewsCount: count,
      avgInterviewScore: Math.round(totalScore / count)
    };
  }, [filteredSessions, evalAnalytics]);

  return (
    <div className="space-y-6">
      {/* 1. Header with Time Range selector */}
      <AnalyticsHeader
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onRefresh={loadData}
        loading={loading}
      />

      {/* 2. Preparation Summary (5 Cards) */}
      <PreparationSummary
        problemsAttempted={totalAttempted}
        overallAccuracy={overallAccuracy}
        testsCompleted={testsCount}
        averageTestScore={avgTestScore}
        interviewsCompleted={interviewsCount}
        averageInterviewScore={avgInterviewScore}
        roadmapCompletion={roadmapsData.overallCompletion || 0}
        completedTopicsCount={roadmapsData.completedRoadmapTopics?.length || 0}
        streakCount={profile?.streakCount || 0}
      />

      {/* 3. Overall Preparation Progress Breakdown */}
      <PreparationProgress
        aiReadinessScore={evalAnalytics?.aiReadinessScore || profile?.progress?.aiReadinessScore || 0}
        learningProgress={roadmapsData.overallCompletion || 0}
        practiceAccuracy={overallAccuracy}
        testingScore={avgTestScore}
        interviewScore={avgInterviewScore}
      />

      {/* 4. Activity Trend & Factual Insights */}
      <ActivityTrendChart
        history={filteredHistory}
        sessions={filteredSessions}
        timeRange={timeRange}
      />

      {/* 5. Strengths & Weak Areas (Needs More Practice) */}
      <StrengthsAndWeakAreas
        strengths={strengths}
        weakAreas={weakAreas}
      />

      {/* 6. Skill & Topic Performance Table */}
      <SkillPerformanceSection
        topicStats={topicStats}
      />

      {/* 7. Problem Practice & Coding Performance */}
      <CodingPerformanceSection
        totalAttempted={totalAttempted}
        totalCorrect={totalCorrect}
        difficultyBreakdown={difficultyBreakdown}
        formatBreakdown={formatBreakdown}
        avgTimeSpent={avgTimeSpent}
      />

      {/* 8. Mock Test Performance & Progression Line */}
      <MockTestPerformanceSection
        history={filteredHistory}
      />

      {/* 9. Mock Interview Intelligence */}
      <MockInterviewPerformanceSection
        sessions={filteredSessions}
        evaluationAnalytics={evalAnalytics}
      />

      {/* 10. Curriculum & Roadmap Progression */}
      <LearningProgressSection
        roadmaps={roadmapsData.roadmaps || []}
        completedTopicsCount={roadmapsData.completedRoadmapTopics?.length || 0}
        overallCompletion={roadmapsData.overallCompletion || 0}
      />

      {/* 11. Recommended Next Actions */}
      <RecommendedActionsSection
        weakAreas={weakAreas}
        testsCount={testsCount}
        interviewsCount={interviewsCount}
        roadmapCompletion={roadmapsData.overallCompletion || 0}
      />
    </div>
  );
};

export default AnalyticsPage;
