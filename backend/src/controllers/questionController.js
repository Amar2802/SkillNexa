import Question from "../models/Question.js";
import seedQuestions from "../data/seedQuestions.js";

const SOFTWARE_FIELD = "Software";

const parseSafeLimit = (value, fallback) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, 1000);
};

const parseSafePage = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 1;
  return parsed;
};

const softwareSeedQuestions = seedQuestions
  .filter((question) => (question.field || SOFTWARE_FIELD) === SOFTWARE_FIELD)
  .map((question, index) => ({
    ...question,
    _id: `seed-${index}`,
    field: question.field || SOFTWARE_FIELD,
    starterCode: question.starterCode || {}
  }));

const getSeedQuestionById = (id) => softwareSeedQuestions.find((question) => String(question._id) === String(id));

const filterQuestionList = (questionList, queryParams = {}) => {
  const requestedField = queryParams.field || SOFTWARE_FIELD;
  const { category, difficulty, topic, company, type, search } = queryParams;

  return questionList.filter((question) => {
    if ((question.field || SOFTWARE_FIELD) !== requestedField) return false;
    if (category && question.category !== category) return false;
    if (difficulty && question.difficulty !== difficulty) return false;
    if (topic && !new RegExp(topic, "i").test(question.topic || "")) return false;
    if (company && !new RegExp(company, "i").test(question.company || "")) return false;
    if (type && question.type !== type) return false;
    if (search && !new RegExp(search, "i").test(question.title || "")) return false;
    return true;
  });
};

const evaluateAnswer = (question, answer, timeSpent = 0) => {
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

  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    feedback,
    timeSpent
  };
};

export const getQuestions = async (req, res) => {
  const queryField = req.query.field || SOFTWARE_FIELD;
  const hasFocusedFilter = Boolean(req.query.category || req.query.difficulty || req.query.topic || req.query.company || req.query.type || req.query.search);
  const safeLimit = parseSafeLimit(req.query.limit, hasFocusedFilter ? 320 : 220);
  const page = parseSafePage(req.query.page);
  const skip = (page - 1) * safeLimit;
  const wantsPaginated = req.query.paginated === "true";

  try {
    const query = { field: queryField };
    if (req.query.category) query.category = req.query.category;
    if (req.query.difficulty) query.difficulty = req.query.difficulty;
    if (req.query.topic) query.topic = new RegExp(req.query.topic, "i");
    if (req.query.company) query.company = new RegExp(req.query.company, "i");
    if (req.query.type) query.type = req.query.type;
    if (req.query.search) query.title = new RegExp(req.query.search, "i");

    const [dbResults, total] = await Promise.all([
      Question.find(query).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
      Question.countDocuments(query)
    ]);

    if (dbResults.length || total > 0) {
      if (wantsPaginated) {
        return res.json({
          items: dbResults,
          total,
          page,
          limit: safeLimit,
          totalPages: Math.max(1, Math.ceil(total / safeLimit))
        });
      }
      return res.json(dbResults);
    }
  } catch (error) {
    console.error("getQuestions error:", error);
  }

  const filteredSeedQuestions = filterQuestionList(softwareSeedQuestions, { ...req.query, field: queryField });
  const pagedSeedQuestions = filteredSeedQuestions.slice(skip, skip + safeLimit);

  if (wantsPaginated) {
    return res.json({
      items: pagedSeedQuestions,
      total: filteredSeedQuestions.length,
      page,
      limit: safeLimit,
      totalPages: Math.max(1, Math.ceil(filteredSeedQuestions.length / safeLimit))
    });
  }

  return res.json(filteredSeedQuestions.slice(0, safeLimit));
};

export const evaluateQuestion = async (req, res) => {
  let question = null;

  try {
    question = await Question.findById(req.params.id);
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
