import Question from "../models/Question.js";
import seedQuestions from "../data/seedQuestions.js";

const SOFTWARE_FIELD = "Software";
const MAX_LIMIT = 100;

const softwareSeedQuestions = seedQuestions.map((question, index) => ({
  ...question,
  _id: `seed-${index + 1}`,
  field: SOFTWARE_FIELD,
  starterCode: question.starterCode || {}
}));

const toRegex = (value) => new RegExp(String(value).trim(), "i");
const parseLimit = (value, fallback = 20) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, MAX_LIMIT);
};
const parsePage = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 1;
  return parsed;
};

const filterSeedQuestions = (query = {}) => {
  return softwareSeedQuestions.filter((question) => {
    if (query.category && question.category !== query.category) return false;
    if (query.difficulty && question.difficulty !== query.difficulty) return false;
    if (query.topic && !toRegex(query.topic).test(question.topic || "")) return false;
    if (query.company && !toRegex(query.company).test(question.company || "")) return false;
    if (query.type && query.type !== "all" && question.type !== query.type) return false;
    if (query.search) {
      const haystack = `${question.title} ${question.description} ${question.topic}`;
      if (!toRegex(query.search).test(haystack)) return false;
    }
    return true;
  });
};

const buildDbQuery = (query = {}) => {
  const dbQuery = { field: SOFTWARE_FIELD };
  if (query.category) dbQuery.category = query.category;
  if (query.difficulty) dbQuery.difficulty = query.difficulty;
  if (query.topic) dbQuery.topic = toRegex(query.topic);
  if (query.company) dbQuery.company = toRegex(query.company);
  if (query.type && query.type !== "all") dbQuery.type = query.type;
  if (query.search) dbQuery.$or = [
    { title: toRegex(query.search) },
    { description: toRegex(query.search) },
    { topic: toRegex(query.search) }
  ];
  return dbQuery;
};

const scoreSubjectiveAnswer = (answer = "", reference = "") => {
  const answerText = String(answer).toLowerCase();
  const keywords = String(reference).toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length > 3);
  if (!keywords.length) return false;
  const hits = keywords.filter((word) => answerText.includes(word)).length;
  return hits / keywords.length >= 0.35;
};

const evaluateAnswer = (question, answer, timeSpent = 0) => {
  let isCorrect = false;
  const normalizedAnswer = typeof answer === "string" ? answer.trim() : answer;

  if (question.type === "MCQ") {
    isCorrect = String(normalizedAnswer) === String(question.correctAnswer);
  } else if (question.type === "Coding") {
    isCorrect = String(normalizedAnswer || "").trim().length >= 20;
  } else {
    isCorrect = scoreSubjectiveAnswer(normalizedAnswer, question.correctAnswer);
  }

  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    feedback: isCorrect ? "Good attempt. Keep the explanation crisp and structured." : `Suggested direction: ${question.correctAnswer}`,
    timeSpent
  };
};

const getSeedQuestionById = (id) => softwareSeedQuestions.find((question) => String(question._id) === String(id));

export const getQuestions = async (req, res) => {
  const limit = parseLimit(req.query.limit, 20);
  const page = parsePage(req.query.page);
  const skip = (page - 1) * limit;
  const paginated = req.query.paginated === "true";

  try {
    const dbQuery = buildDbQuery(req.query);
    const [items, total] = await Promise.all([
      Question.find(dbQuery).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Question.countDocuments(dbQuery)
    ]);

    if (total > 0) {
      if (paginated) {
        return res.json({
          items,
          total,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(total / limit))
        });
      }

      return res.json(items);
    }
  } catch (error) {
    console.error("getQuestions error:", error.message || error);
  }

  const filtered = filterSeedQuestions(req.query);
  const items = filtered.slice(skip, skip + limit);

  if (paginated) {
    return res.json({
      items,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(filtered.length / limit))
    });
  }

  return res.json(items);
};

export const evaluateQuestion = async (req, res) => {
  let question = null;

  try {
    question = await Question.findById(req.params.id).lean();
  } catch {
    question = null;
  }

  if (!question) {
    question = getSeedQuestionById(req.params.id);
  }

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  const { answer, timeSpent = 0 } = req.body;
  return res.json(evaluateAnswer(question, answer, timeSpent));
};
