import Question from "../models/Question.js";
import seedQuestions from "../data/seedQuestions.js";
import { generateAnswerAnalysis } from "../utils/answerAnalysis.js";

const softwareSeedQuestions = seedQuestions.map((question, index) => ({
  ...question,
  _id: question._id || `seed-${index + 1}`
}));

const getSeedQuestionById = (id) => softwareSeedQuestions.find((question) => String(question._id) === String(id));

export const analyzeAnswer = async (req, res) => {
  const { questionId, userAnswer, correctAnswer, topic } = req.body || {};

  if (!String(userAnswer || "").trim()) {
    return res.status(400).json({ message: "userAnswer is required" });
  }

  let resolvedCorrectAnswer = String(correctAnswer || "").trim();
  let resolvedTopic = String(topic || "").trim();

  if (questionId) {
    let question = null;
    try {
      question = await Question.findById(questionId).lean();
    } catch {
      question = null;
    }
    if (!question) {
      question = getSeedQuestionById(questionId);
    }
    if (question) {
      if (!resolvedCorrectAnswer) resolvedCorrectAnswer = String(question.correctAnswer || "").trim();
      if (!resolvedTopic) resolvedTopic = String(question.topic || question.category || "General").trim();
    }
  }

  if (!resolvedCorrectAnswer) {
    return res.status(400).json({ message: "correctAnswer is required" });
  }

  try {
    const analysis = await generateAnswerAnalysis({
      userAnswer,
      correctAnswer: resolvedCorrectAnswer,
      topic: resolvedTopic || "General"
    });
    return res.json(analysis);
  } catch (error) {
    return res.status(500).json({ message: error?.message || "Unable to analyze answer right now." });
  }
};
