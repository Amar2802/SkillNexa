import Test from "../models/Test.js";
import Result from "../models/Result.js";
import Question from "../models/Question.js";
import seedQuestions from "../data/seedQuestions.js";

const SOFTWARE_FIELD = "Software";
const DEFAULT_TOTAL_QUESTIONS = 30;
const DEFAULT_CATEGORIES = ["DSA", "Aptitude", "HR", "Core Subjects"];

const ensureSeededQuestions = async () => {
  const counts = await Question.aggregate([
    { $match: { field: SOFTWARE_FIELD } },
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]).catch(() => []);

  const countMap = new Map(counts.map((item) => [item._id, item.count]));
  const missingCategories = DEFAULT_CATEGORIES.filter((category) => !countMap.get(category));

  if (!missingCategories.length) return;

  await Question.insertMany(
    seedQuestions
      .filter((question) => missingCategories.includes(question.category))
      .map((question) => ({ ...question, field: SOFTWARE_FIELD })),
    { ordered: false }
  ).catch(() => undefined);
};

const sampleQuestionsForCategory = async (category, count) => {
  const sampled = await Question.aggregate([
    { $match: { field: SOFTWARE_FIELD, category } },
    { $sample: { size: count } }
  ]).catch(() => []);

  if (sampled.length >= count) {
    return sampled;
  }

  const existingIds = new Set(sampled.map((item) => String(item._id)));
  const remaining = count - sampled.length;
  const fallback = await Question.find({ field: SOFTWARE_FIELD, category, _id: { $nin: [...existingIds] } })
    .limit(remaining)
    .lean()
    .catch(() => []);

  return [...sampled, ...fallback];
};

const buildDistribution = (categories, totalQuestions) => {
  const safeCategories = categories.length ? categories : DEFAULT_CATEGORIES;
  const safeTotal = Math.max(Number(totalQuestions) || DEFAULT_TOTAL_QUESTIONS, safeCategories.length);
  const baseCount = Math.floor(safeTotal / safeCategories.length);
  const remainder = safeTotal % safeCategories.length;

  return safeCategories.map((category, index) => ({
    category,
    count: baseCount + (index < remainder ? 1 : 0)
  }));
};

const computeDurationMinutes = (questionCount) => {
  const safeCount = Math.max(1, Number(questionCount) || DEFAULT_TOTAL_QUESTIONS);
  return Math.max(15, Math.ceil(safeCount));
};

const evaluateSubmission = (question, submittedAnswer) => {
  if (question.type === "MCQ") {
    return String(submittedAnswer || "").trim() === String(question.correctAnswer || "").trim();
  }

  if (question.type === "Coding") {
    return String(submittedAnswer || "").trim().length >= 20;
  }

  const answerText = String(submittedAnswer || "").toLowerCase();
  const keywords = String(question.correctAnswer || "").toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3);
  if (!keywords.length) return false;
  const hits = keywords.filter((word) => answerText.includes(word)).length;
  return hits / keywords.length >= 0.35;
};

export const getTests = async (req, res) => {
  const tests = await Test.find({ targetField: SOFTWARE_FIELD }).populate("sections.questions").sort({ createdAt: -1 }).lean();
  res.json(tests);
};

export const createTest = async (req, res) => {
  await ensureSeededQuestions();

  const requestedTotal = Math.max(Number(req.body.totalQuestions) || DEFAULT_TOTAL_QUESTIONS, DEFAULT_CATEGORIES.length);
  const categories = Array.isArray(req.body.categories) && req.body.categories.length ? req.body.categories : DEFAULT_CATEGORIES;
  const distribution = buildDistribution(categories, requestedTotal);

  const sectionRecords = await Promise.all(distribution.map(async (item) => {
    const questions = await sampleQuestionsForCategory(item.category, item.count);

    return {
      name: `${item.category} Section`,
      category: item.category,
      questions: questions.map((question) => question._id)
    };
  }));

  const totalSelected = sectionRecords.reduce((sum, section) => sum + section.questions.length, 0);

  if (!totalSelected) {
    return res.status(503).json({ message: "Unable to generate a mock test because no practice questions are available right now." });
  }

  const duration = computeDurationMinutes(totalSelected);

  const test = await Test.create({
    title: "Software Interview Mock Test",
    description: "A balanced mock test covering DSA, aptitude, HR, and core subjects.",
    duration,
    targetField: SOFTWARE_FIELD,
    sections: sectionRecords,
    createdBy: req.user._id
  });

  const hydrated = await Test.findById(test._id).populate("sections.questions").lean();
  res.status(201).json(hydrated);
};

export const submitTest = async (req, res) => {
  const test = await Test.findById(req.params.id).populate("sections.questions");
  if (!test) {
    return res.status(404).json({ message: "Test not found" });
  }

  const submittedAnswers = Array.isArray(req.body.answers) ? req.body.answers : [];
  const flatQuestions = test.sections.flatMap((section) => section.questions);

  const answers = flatQuestions.map((question) => {
    const matched = submittedAnswers.find((item) => item.questionId === String(question._id)) || {};
    const isCorrect = evaluateSubmission(question, matched.submittedAnswer);

    return {
      question: question._id,
      submittedAnswer: matched.submittedAnswer || "",
      isCorrect,
      score: isCorrect ? 1 : 0,
      timeSpent: Number(matched.timeSpent) || 0,
      feedback: isCorrect ? "Correct answer." : question.explanation
    };
  });

  const score = answers.reduce((sum, answer) => sum + answer.score, 0);
  const accuracy = flatQuestions.length ? Math.round((score / flatQuestions.length) * 100) : 0;
  const topicStats = {};

  flatQuestions.forEach((question, index) => {
    const answer = answers[index];
    topicStats[question.topic] ||= { total: 0, correct: 0 };
    topicStats[question.topic].total += 1;
    if (answer.isCorrect) topicStats[question.topic].correct += 1;
  });

  const weakTopics = Object.entries(topicStats).filter(([, stat]) => stat.correct / stat.total < 0.5).map(([topic]) => topic);
  const strengths = Object.entries(topicStats).filter(([, stat]) => stat.correct / stat.total >= 0.75).map(([topic]) => topic);

  const result = await Result.create({
    user: req.user._id,
    test: test._id,
    answers,
    score,
    accuracy,
    weakTopics,
    strengths,
    totalTimeSpent: Number(req.body.totalTimeSpent) || 0
  });

  req.user.progress = {
    testsTaken: (req.user.progress?.testsTaken || 0) + 1,
    accuracy,
    weakTopics,
    recommendedTopics: weakTopics.length ? weakTopics.slice(0, 4) : strengths.slice(0, 4)
  };
  await req.user.save();

  const hydratedResult = await Result.findById(result._id)
    .populate("answers.question", "title topic category difficulty description correctAnswer explanation type")
    .populate("test", "title duration")
    .lean();

  res.status(201).json(hydratedResult);
};
