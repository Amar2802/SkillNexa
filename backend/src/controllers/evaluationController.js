import AnswerEvaluation from "../models/AnswerEvaluation.js";
import { runAnswerEvaluation, buildEvaluationAnalytics } from "../utils/answerEvaluationEngine.js";

const parseLimit = (value, fallback = 20) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, 100);
};

const parsePage = (value) => {
  const parsed = Number(value);
  return !Number.isFinite(parsed) || parsed <= 0 ? 1 : parsed;
};

export const createEvaluation = async (req, res) => {
  const {
    questionId = "",
    question,
    userAnswer,
    topic = "General",
    role = "Software Engineer",
    difficulty = "Medium",
    interviewType = "practice",
    module = interviewType,
    codingExplanation = "",
    voiceTranscript = ""
  } = req.body;

  if (!question || !userAnswer) {
    return res.status(400).json({ message: "Question and user answer are required" });
  }

  const result = await runAnswerEvaluation({
    question,
    userAnswer,
    topic,
    role,
    difficulty,
    interviewType,
    codingExplanation,
    voiceTranscript
  });

  const saved = await AnswerEvaluation.create({
    user: req.user._id,
    questionId: String(questionId || ""),
    question,
    userAnswer: [userAnswer, codingExplanation, voiceTranscript].filter(Boolean).join("\n\n"),
    topic,
    role,
    difficulty,
    interviewType,
    module,
    ...result
  });

  res.status(201).json(saved);
};

export const getEvaluations = async (req, res) => {
  const limit = parseLimit(req.query.limit);
  const page = parsePage(req.query.page);
  const skip = (page - 1) * limit;
  const filter = { user: req.user._id };

  if (req.query.topic) filter.topic = new RegExp(String(req.query.topic).trim(), "i");
  if (req.query.module) filter.module = req.query.module;
  if (req.query.interviewType) filter.interviewType = req.query.interviewType;

  const [items, total] = await Promise.all([
    AnswerEvaluation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    AnswerEvaluation.countDocuments(filter)
  ]);

  res.json({
    items,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit))
  });
};

export const getEvaluationAnalytics = async (req, res) => {
  const evaluations = await AnswerEvaluation.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(500)
    .lean();

  res.json(buildEvaluationAnalytics(evaluations));
};

export const getEvaluationById = async (req, res) => {
  const evaluation = await AnswerEvaluation.findOne({
    _id: req.params.id,
    user: req.user._id
  }).lean();

  if (!evaluation) {
    return res.status(404).json({ message: "Evaluation not found" });
  }

  res.json(evaluation);
};
