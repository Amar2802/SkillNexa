import Question from "../models/Question.js";
import Result from "../models/Result.js";
import User from "../models/User.js";
import { weakTopicsFromAnswers } from "../utils/analytics.js";

const syncSeedQuestions = async () => {
  const { default: seedQuestions } = await import("../data/seedQuestions.js");
  const existing = await Question.find({}, "title");
  const existingTitles = new Set(existing.map((question) => question.title));
  const missingQuestions = seedQuestions.filter((question) => !existingTitles.has(question.title));

  if (missingQuestions.length) {
    await Question.insertMany(missingQuestions);
  }

  return { inserted: missingQuestions.length, total: seedQuestions.length };
};

const buildRoadmap = ({ interests = [], weakTopics = [], company = "General" }) => {
  const focusPool = [...new Set([...weakTopics, ...interests])].filter(Boolean);
  const topics = focusPool.length ? focusPool : ["Arrays", "Probability", "DBMS", "HR Interviews"];

  return [
    {
      week: "Week 1",
      goal: "Build fundamentals and identify patterns",
      sessions: [
        `Revise ${topics[0] || "Arrays"} fundamentals and solve 8 focused questions`,
        `Practice one ${company} style aptitude or screening set`,
        "Write quick revision notes for mistakes and formulas"
      ]
    },
    {
      week: "Week 2",
      goal: "Strengthen weak areas with guided practice",
      sessions: [
        `Target weak topics: ${weakTopics.length ? weakTopics.join(", ") : topics.slice(0, 2).join(", ")}`,
        "Take one timed mock test and review every wrong answer",
        `Prepare 3 HR answers tailored for ${company}`
      ]
    },
    {
      week: "Week 3",
      goal: "Company-specific preparation and mixed revision",
      sessions: [
        `Solve company-tagged questions for ${company}`,
        `Mix ${topics.slice(0, 3).join(", ")} in one combined revision block`,
        "Practice one coding question and one subjective answer daily"
      ]
    },
    {
      week: "Week 4",
      goal: "Final mock rounds and communication polish",
      sessions: [
        `Attempt a full mock test for ${company}`,
        "Practice AI interviewer responses using STAR and structured explanations",
        "Review bookmarks, notes, and top 10 mistakes before interview day"
      ]
    }
  ];
};

export const getProfile = async (req, res) => {
  const results = await Result.find({ user: req.user._id })
    .populate("answers.question", "topic title category difficulty")
    .sort({ createdAt: -1 });

  const answers = results.flatMap((result) => result.answers);
  const correct = answers.filter((answer) => answer.isCorrect).length;
  const weakTopics = weakTopicsFromAnswers(answers);

  res.json({
    ...req.user.toObject(),
    interests: req.user.interests || [],
    progress: {
      testsTaken: results.length,
      accuracy: answers.length ? Math.round((correct / answers.length) * 100) : 0,
      weakTopics,
      recommendedTopics: weakTopics.length ? weakTopics : ["Arrays", "DBMS", "Probability"]
    },
    analytics: {
      totalQuestionsAttempted: answers.length,
      avgTimePerQuestion: answers.length
        ? Math.round(answers.reduce((sum, answer) => sum + (answer.timeSpent || 0), 0) / answers.length)
        : 0,
      recentResults: results.slice(0, 5)
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
  const roadmap = buildRoadmap({
    interests: req.user.interests || [],
    weakTopics,
    company
  });

  res.json({
    company,
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

  res.json({ message: "Profile photo updated", avatar: req.user.avatar, user: req.user });
};

export const updateInterests = async (req, res) => {
  const { interests } = req.body;

  if (!Array.isArray(interests)) {
    return res.status(400).json({ message: "Interests must be an array" });
  }

  req.user.interests = interests.map((item) => String(item).trim()).filter(Boolean).slice(0, 12);
  await req.user.save();

  res.json({ message: "Preparation interests updated", interests: req.user.interests, user: req.user });
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

export { syncSeedQuestions };

