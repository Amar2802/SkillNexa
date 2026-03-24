import Question from "../models/Question.js";

export const getQuestions = async (req, res) => {
  const { category, difficulty, topic, company, type, search } = req.query;
  const query = {};

  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (topic) query.topic = new RegExp(topic, "i");
  if (company) query.company = new RegExp(company, "i");
  if (type) query.type = type;
  if (search) query.title = new RegExp(search, "i");

  res.json(await Question.find(query).sort({ createdAt: -1 }));
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
