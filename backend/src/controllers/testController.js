import Test from "../models/Test.js";
import Result from "../models/Result.js";
import Question from "../models/Question.js";

const DEFAULT_CATEGORIES = ["DSA", "Aptitude", "HR", "Core Subjects"];
const DEFAULT_TOTAL_QUESTIONS = 30;
const DEFAULT_DURATION = 30;

const buildDistribution = (categories, totalQuestions, questionsPerCategory) => {
  if (questionsPerCategory) {
    return categories.map((category) => ({ category, count: Number(questionsPerCategory) || 1 }));
  }

  const safeTotal = Math.max(Number(totalQuestions) || DEFAULT_TOTAL_QUESTIONS, categories.length);
  const baseCount = Math.floor(safeTotal / categories.length);
  const remainder = safeTotal % categories.length;

  return categories.map((category, index) => ({
    category,
    count: baseCount + (index < remainder ? 1 : 0)
  }));
};

export const getTests = async (req, res) => {
  const query = req.query.company ? { "sections.category": { $exists: true } } : {};
  res.json(await Test.find(query).populate("sections.questions").sort({ createdAt: -1 }));
};

export const createTest = async (req, res) => {
  const {
    categories = DEFAULT_CATEGORIES,
    duration = DEFAULT_DURATION,
    totalQuestions = DEFAULT_TOTAL_QUESTIONS,
    questionsPerCategory,
    company = ""
  } = req.body;

  const distribution = buildDistribution(categories, totalQuestions, questionsPerCategory);
  const sections = [];

  for (const { category, count } of distribution) {
    const match = { category };
    if (company) {
      match.company = { $in: [company, "General"] };
    }

    let questions = await Question.aggregate([
      { $match: match },
      { $sample: { size: Number(count) } }
    ]);

    if (!questions.length) {
      questions = await Question.aggregate([
        { $match: { category } },
        { $sample: { size: Number(count) } }
      ]);
    }

    sections.push({
      name: `${category} Section`,
      category,
      questions: questions.map((question) => question._id)
    });
  }

  const title = company ? `${company} Preparation Mock Test` : "Adaptive Mock Test";
  const description = company
    ? `Auto-generated interview practice test focused on ${company} style questions.`
    : "Auto-generated test for interview practice.";

  const test = await Test.create({
    title,
    description,
    duration: Number(duration) || DEFAULT_DURATION,
    sections,
    createdBy: req.user._id
  });

  res.status(201).json(await Test.findById(test._id).populate("sections.questions"));
};

export const submitTest = async (req, res) => {
  const test = await Test.findById(req.params.id).populate("sections.questions");
  if (!test) {
    return res.status(404).json({ message: "Test not found" });
  }

  const submitted = req.body.answers || [];
  const flatQuestions = test.sections.flatMap((section) => section.questions);
  const answers = flatQuestions.map((question) => {
    const input = submitted.find((answer) => answer.questionId === question._id.toString()) || {};
    const isCorrect = String(input.submittedAnswer || "").trim() === String(question.correctAnswer).trim();

    return {
      question,
      submittedAnswer: input.submittedAnswer || "",
      isCorrect,
      score: isCorrect ? 1 : 0,
      timeSpent: input.timeSpent || 0,
      feedback: isCorrect ? "Correct." : question.explanation
    };
  });

  const score = answers.reduce((sum, answer) => sum + answer.score, 0);
  const accuracy = flatQuestions.length ? Math.round((score / flatQuestions.length) * 100) : 0;
  const topicStats = {};

  answers.forEach((answer) => {
    topicStats[answer.question.topic] ||= { total: 0, correct: 0 };
    topicStats[answer.question.topic].total += 1;
    if (answer.isCorrect) topicStats[answer.question.topic].correct += 1;
  });

  const weakTopics = Object.entries(topicStats)
    .filter(([, value]) => value.correct / value.total < 0.5)
    .map(([topic]) => topic);
  const strengths = Object.entries(topicStats)
    .filter(([, value]) => value.correct / value.total >= 0.75)
    .map(([topic]) => topic);

  const result = await Result.create({
    user: req.user._id,
    test: test._id,
    answers: answers.map((answer) => ({
      question: answer.question._id,
      submittedAnswer: answer.submittedAnswer,
      isCorrect: answer.isCorrect,
      score: answer.score,
      timeSpent: answer.timeSpent,
      feedback: answer.feedback
    })),
    score,
    accuracy,
    weakTopics,
    strengths,
    totalTimeSpent: req.body.totalTimeSpent || 0
  });

  req.user.progress = {
    testsTaken: (req.user.progress?.testsTaken || 0) + 1,
    accuracy,
    weakTopics,
    recommendedTopics: weakTopics.length ? weakTopics : strengths
  };
  await req.user.save();

  res.status(201).json(await Result.findById(result._id).populate("answers.question", "title topic difficulty"));
};
