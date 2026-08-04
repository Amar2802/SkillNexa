import Question from "../models/Question.js";
import Result from "../models/Result.js";
import User from "../models/User.js";
import { toSafeUser } from "../utils/auth.js";
import AnswerEvaluation from "../models/AnswerEvaluation.js";
import { weakTopicsFromAnswers } from "../utils/analytics.js";
import { buildEvaluationAnalytics } from "../utils/answerEvaluationEngine.js";
import { FIELD_DEFAULT_TOPICS, FIELD_OPTIONS } from "../utils/prepFields.js";
import roadmaps from "../data/roadmapData.js";

const normalizeTargetField = (value) => (FIELD_OPTIONS.includes(value) ? value : "Software");

const syncSeedQuestions = async () => {
  const { default: seedQuestions } = await import("../data/seedQuestions.js");
  const existing = await Question.find({}, "title field");
  const existingKeys = new Set(existing.map((question) => `${question.field || "Software"}:${question.title}`));
  const missingQuestions = seedQuestions.filter((question) => !existingKeys.has(`${question.field || "Software"}:${question.title}`));

  if (missingQuestions.length) {
    await Question.insertMany(missingQuestions);
  }

  return { inserted: missingQuestions.length, total: seedQuestions.length };
};

const buildRoadmap = ({ interests = [], weakTopics = [], company = "General", targetField = "Software" }) => {
  const focusPool = [...new Set([...weakTopics, ...interests])].filter(Boolean);
  const topics = focusPool.length ? focusPool : FIELD_DEFAULT_TOPICS[targetField] || FIELD_DEFAULT_TOPICS.Software;
  const fieldLabel = targetField === "Software" ? company : targetField;

  return [
    {
      week: "Week 1",
      goal: "Build fundamentals and identify patterns",
      sessions: [
        `Revise ${topics[0] || "fundamentals"} fundamentals and solve 8 focused questions`,
        `Practice one ${fieldLabel} style screening set`,
        "Write quick revision notes for mistakes and formulas"
      ]
    },
    {
      week: "Week 2",
      goal: "Strengthen weak areas with guided practice",
      sessions: [
        `Target weak topics: ${weakTopics.length ? weakTopics.join(", ") : topics.slice(0, 2).join(", ")}`,
        "Take one timed mock test and review every wrong answer",
        `Prepare 3 high-quality interview answers tailored for ${fieldLabel}`
      ]
    },
    {
      week: "Week 3",
      goal: "Field-specific preparation and mixed revision",
      sessions: [
        `Solve ${targetField} tagged questions and revise the top priority topics`,
        `Mix ${topics.slice(0, 3).join(", ")} in one combined revision block`,
        targetField === "Software" ? "Practice one coding question and one subjective answer daily" : "Practice one objective set and one interview-style answer daily"
      ]
    },
    {
      week: "Week 4",
      goal: "Final mock rounds and communication polish",
      sessions: [
        `Attempt a full mock test for ${fieldLabel}`,
        "Practice AI interviewer responses using structured explanations and calm delivery",
        "Review bookmarks, notes, and top 10 mistakes before interview day"
      ]
    }
  ];
};

export const getProfile = async (req, res) => {
  // Streak calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const lastActive = req.user.lastActiveDate;
  let hasUpdatedStreak = false;

  if (!lastActive) {
    req.user.streakCount = 1;
    req.user.lastActiveDate = todayStr;
    hasUpdatedStreak = true;
  } else if (lastActive !== todayStr) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (lastActive === yesterdayStr) {
      req.user.streakCount += 1;
    } else {
      req.user.streakCount = 1;
    }
    req.user.lastActiveDate = todayStr;
    hasUpdatedStreak = true;
  }

  if (hasUpdatedStreak) {
    await req.user.save();
  }

  const [results, evaluations] = await Promise.all([
    Result.find({ user: req.user._id })
      .populate("answers.question", "topic title category difficulty")
      .sort({ createdAt: -1 }),
    AnswerEvaluation.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(500).lean()
  ]);

  const answers = results.flatMap((result) => result.answers);
  const correct = answers.filter((answer) => answer.isCorrect).length;
  const weakTopics = weakTopicsFromAnswers(answers);
  const evalWeakTopics = evaluations
    .filter((item) => (item.score || 0) < 70)
    .map((item) => item.topic)
    .filter(Boolean);
  const mergedWeak = [...new Set([...weakTopics, ...evalWeakTopics])].slice(0, 6);
  const targetField = normalizeTargetField(req.user.targetField);
  const evaluationAnalytics = buildEvaluationAnalytics(evaluations);

  res.json({
    ...toSafeUser(req.user),
    targetField,
    interests: req.user.interests || [],
    progress: {
      testsTaken: results.length,
      accuracy: answers.length ? Math.round((correct / answers.length) * 100) : 0,
      weakTopics: mergedWeak,
      recommendedTopics: mergedWeak.length ? mergedWeak : (FIELD_DEFAULT_TOPICS[targetField] || FIELD_DEFAULT_TOPICS.Software),
      evaluationsCount: evaluationAnalytics.totalEvaluated,
      averageInterviewScore: evaluationAnalytics.averageScore,
      aiReadinessScore: evaluationAnalytics.aiReadinessScore
    },
    analytics: {
      totalQuestionsAttempted: answers.length,
      avgTimePerQuestion: answers.length
        ? Math.round(answers.reduce((sum, answer) => sum + (answer.timeSpent || 0), 0) / answers.length)
        : 0,
      recentResults: results.slice(0, 5),
      evaluation: evaluationAnalytics
    }
  });
};

export const getRoadmap = async (req, res) => {
  const results = await Result.find({ user: req.user._id })
    .populate("answers.question", "topic")
    .sort({ createdAt: -1 })
    .limit(6);

  const weakTopics = weakTopicsFromAnswers(results.flatMap((result) => result.answers));
  const company = req.body.company || "General";
  const targetField = normalizeTargetField(req.body.targetField || req.user.targetField);
  const roadmap = buildRoadmap({
    interests: req.user.interests || [],
    weakTopics,
    company,
    targetField
  });

  res.json({
    company,
    targetField,
    interests: req.user.interests || [],
    weakTopics,
    roadmap
  });
};

export const updateAvatar = async (req, res) => {
  const { avatar } = req.body;

  if (!avatar || typeof avatar !== "string" || !avatar.startsWith("data:image/")) {
    return res.status(400).json({ message: "A valid image is required" });
  }

  req.user.avatar = avatar;
  await req.user.save();

  res.json({ message: "Profile photo updated", avatar: req.user.avatar, user: toSafeUser(req.user) });
};

export const updateInterests = async (req, res) => {
  const { interests } = req.body;

  if (!Array.isArray(interests)) {
    return res.status(400).json({ message: "Interests must be an array" });
  }

  req.user.interests = interests.map((item) => String(item).trim()).filter(Boolean).slice(0, 12);
  await req.user.save();

  res.json({ message: "Preparation interests updated", interests: req.user.interests, user: toSafeUser(req.user) });
};

export const updateTargetField = async (req, res) => {
  const safeField = normalizeTargetField(req.body.targetField);
  req.user.targetField = safeField;
  req.user.progress = {
    ...(req.user.progress || {}),
    recommendedTopics: FIELD_DEFAULT_TOPICS[safeField] || FIELD_DEFAULT_TOPICS.Software
  };
  await req.user.save();

  res.json({ message: "Target field updated", targetField: req.user.targetField, user: toSafeUser(req.user) });
};

export const getBookmarks = async (req, res) => {
  const user = await User.findById(req.user._id).populate("bookmarks");
  res.json(user.bookmarks);
};

export const toggleBookmark = async (req, res) => {
  const user = await User.findById(req.user._id);
  const questionId = req.params.questionId;
  const exists = user.bookmarks.some((id) => id.toString() === questionId);

  user.bookmarks = exists
    ? user.bookmarks.filter((id) => id.toString() !== questionId)
    : [...user.bookmarks, questionId];

  await user.save();
  res.json({ success: true });
};

export const getHistory = async (req, res) => {
  const history = await Result.find({ user: req.user._id })
    .populate("test", "title description")
    .populate("answers.question", "title topic category difficulty description correctAnswer explanation type")
    .sort({ createdAt: -1 });

  res.json(history);
};

export const seedQuestionsIfNeeded = async (_req, res) => {
  try {
    const stats = await syncSeedQuestions();
    res.json({ message: "Sample questions synced", ...stats });
  } catch (error) {
    console.error("seedQuestionsIfNeeded error:", error);
    const { default: seedQuestions } = await import("../data/seedQuestions.js");
    res.json({
      message: "Using built-in sample questions",
      inserted: 0,
      total: seedQuestions.length,
      warning: error.message
    });
  }
};

export const getRevisionData = async (req, res) => {
  try {
    // 1. Bookmarks and Recently Viewed populated
    const user = await User.findById(req.user._id)
      .populate("bookmarks")
      .populate("recentlyViewed");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Query wrong questions from Results & AnswerEvaluations
    const [results, evaluations] = await Promise.all([
      Result.find({ user: req.user._id }).populate("answers.question").lean(),
      AnswerEvaluation.find({ user: req.user._id, score: { $lt: 60 } }).lean()
    ]);

    const wrongQuestionIds = new Set();
    const wrongQuestionsMap = new Map();
    const topicFailureCounts = {};

    // Process failed questions in test results
    results.forEach((resItem) => {
      (resItem.answers || []).forEach((ans) => {
        if (!ans.isCorrect && ans.question) {
          const qId = String(ans.question._id);
          wrongQuestionIds.add(qId);
          wrongQuestionsMap.set(qId, ans.question);

          const topic = ans.question.topic || "General";
          topicFailureCounts[topic] = (topicFailureCounts[topic] || 0) + 1;
        }
      });
    });

    // Process failed evaluations
    evaluations.forEach((evalItem) => {
      if (evalItem.questionId) {
        wrongQuestionIds.add(String(evalItem.questionId));
      }
      const topic = evalItem.topic || "General";
      topicFailureCounts[topic] = (topicFailureCounts[topic] || 0) + 1;
    });

    // Fetch wrong questions details from DB if they were stored (for IDs we only have as keys)
    const fetchedWrong = await Question.find({ _id: { $in: Array.from(wrongQuestionIds) } }).lean();
    fetchedWrong.forEach((q) => {
      wrongQuestionsMap.set(String(q._id), q);
    });

    const wrongQuestionsList = Array.from(wrongQuestionsMap.values());

    // 3. Find frequently failed topics (failed >= 1 time)
    const frequentlyFailedTopics = Object.entries(topicFailureCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 4. Create Revision Sheet content from roadmapData
    const revisionSheet = [];
    const failedTopicNames = frequentlyFailedTopics.map((item) => item.topic.toLowerCase());

    roadmaps.forEach((roadmap) => {
      (roadmap.topics || []).forEach((topicNode) => {
        if (
          failedTopicNames.includes(topicNode.name.toLowerCase()) ||
          topicNode.name.toLowerCase().split(/\s+/).some((word) => failedTopicNames.some((tName) => tName.includes(word)))
        ) {
          revisionSheet.push({
            topic: topicNode.name,
            subject: roadmap.title,
            level: topicNode.level,
            cheatSheet: topicNode.cheatSheet,
            flashcards: topicNode.revision || []
          });
        }
      });
    });

    // If revision sheet is empty, seed it with recommended topics
    if (!revisionSheet.length) {
      const recs = user.progress?.recommendedTopics || ["Arrays & Sorting"];
      roadmaps.forEach((roadmap) => {
        (roadmap.topics || []).forEach((topicNode) => {
          if (recs.some((rec) => topicNode.name.toLowerCase().includes(rec.toLowerCase()))) {
            revisionSheet.push({
              topic: topicNode.name,
              subject: roadmap.title,
              level: topicNode.level,
              cheatSheet: topicNode.cheatSheet,
              flashcards: topicNode.revision || []
            });
          }
        });
      });
    }

    res.json({
      wrongQuestions: wrongQuestionsList,
      bookmarkedQuestions: user.bookmarks || [],
      recentlyViewed: user.recentlyViewed || [],
      frequentlyFailedTopics,
      revisionSheet: revisionSheet.slice(0, 6)
    });
  } catch (error) {
    console.error("getRevisionData error:", error.message || error);
    res.status(500).json({ message: "Error loading revision data" });
  }
};

export { syncSeedQuestions };
