import Question from "../models/Question.js";

const parseSafeLimit = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, 500);
};

const filterSeedQuestions = (seedQuestions, queryParams = {}) => {
  const { field, category, difficulty, topic, company, type, search } = queryParams;

  return seedQuestions.filter((question) => {
    if (field && (question.field || "Software") !== field) return false;
    if (category && question.category !== category) return false;
    if (difficulty && question.difficulty !== difficulty) return false;
    if (topic && !new RegExp(topic, "i").test(question.topic || "")) return false;
    if (company && !new RegExp(company, "i").test(question.company || "")) return false;
    if (type && question.type !== type) return false;
    if (search && !new RegExp(search, "i").test(question.title || "")) return false;
    return true;
  });
};

export const getQuestions = async (req, res) => {
  const { field, category, difficulty, topic, company, type, search, limit } = req.query;
  const hasFocusedFilter = Boolean(category || difficulty || topic || company || type || search);
  const safeLimit = parseSafeLimit(limit, hasFocusedFilter ? 240 : 120);
  const query = {};

  if (field) query.field = field;
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (topic) query.topic = new RegExp(topic, "i");
  if (company) query.company = new RegExp(company, "i");
  if (type) query.type = type;
  if (search) query.title = new RegExp(search, "i");

  try {
    const results = await Question.find(query).sort({ createdAt: -1 }).limit(safeLimit);
    if (results.length) {
      return res.json(results);
    }

    const { default: seedQuestions } = await import("../data/seedQuestions.js");
    return res.json(filterSeedQuestions(seedQuestions, req.query).slice(0, safeLimit));
  } catch (error) {
    console.error("getQuestions error:", error);
    const { default: seedQuestions } = await import("../data/seedQuestions.js");
    return res.json(filterSeedQuestions(seedQuestions, req.query).slice(0, safeLimit));
  }
};

export const evaluateQuestion = async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  const { answer, timeSpent = 0 } = req.body;
  let isCorrect = false;
  let feedback = question.explanation;

  if (question.type === "MCQ") {
    isCorrect = String(answer).trim() === String(question.correctAnswer).trim();
  } else if (question.type === "Subjective") {
    const lower = String(answer || "").toLowerCase();
    const keywords = String(question.correctAnswer).toLowerCase().split(/[\s,]+/).filter(Boolean);
    const matches = keywords.filter((word) => lower.includes(word)).length;
    isCorrect = keywords.length ? matches / keywords.length >= 0.35 : false;
    feedback = isCorrect
      ? "Good structure. Add one more concrete example for stronger impact."
      : `Suggested direction: ${question.correctAnswer}`;
  } else {
    isCorrect = String(answer || "").trim().length > 20;
    feedback = `Reference approach: ${question.correctAnswer}`;
  }

  res.json({
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    feedback,
    timeSpent
  });
};
