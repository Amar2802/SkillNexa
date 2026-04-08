import Question from "../models/Question.js";
import openai from "../config/openai.js";
import { heuristicInterviewEvaluation } from "../utils/analytics.js";

const ROUND_BLUEPRINTS = {
  "Full Loop": [
    { round: "Aptitude Screen", category: "Aptitude", focus: "aptitude, speed, and accuracy" },
    { round: "Technical Coding", category: "DSA", focus: "coding, data structures, and problem solving" },
    { round: "Core CS", category: "Core Subjects", focus: "DBMS, operating systems, networks, and OOP" },
    { round: "Project Discussion", category: "HR", focus: "projects, ownership, decisions, and learning" },
    { round: "HR Final", category: "HR", focus: "behavioral readiness, communication, and company fit" }
  ],
  Technical: [
    { round: "Technical Coding", category: "DSA", focus: "coding, data structures, and problem solving" },
    { round: "Core CS", category: "Core Subjects", focus: "DBMS, operating systems, networks, and OOP" },
    { round: "Project Discussion", category: "HR", focus: "projects, ownership, and technical decisions" }
  ],
  HR: [
    { round: "HR Warmup", category: "HR", focus: "communication, self introduction, and motivation" },
    { round: "Behavioral Round", category: "HR", focus: "conflict, leadership, pressure, and learning" },
    { round: "Company Fit", category: "HR", focus: "company fit, goals, and role alignment" }
  ],
  Mixed: [
    { round: "Technical Coding", category: "DSA", focus: "coding, data structures, and problem solving" },
    { round: "Core CS", category: "Core Subjects", focus: "DBMS, operating systems, networks, and OOP" },
    { round: "HR Final", category: "HR", focus: "behavioral readiness, communication, and company fit" }
  ]
};

const normalizeQuestionPayload = (questions = []) => {
  return questions.map((item, index) => ({
    id: item.id || `q-${index + 1}`,
    round: item.round || "Interview Round",
    question: item.question || item.prompt || item.title || `Interview Question ${index + 1}`,
    category: item.category || "General",
    difficulty: item.difficulty || "Medium",
    intent: item.intent || "Assess interview readiness.",
    evaluationFocus: item.evaluationFocus || "Clarity, structure, confidence, and relevance.",
    followUpHint: item.followUpHint || item.follow_up_hint || "Support your answer with a concrete example."
  }));
};

const buildRoundPlan = (roundType = "Full Loop", count = 5) => {
  const basePlan = ROUND_BLUEPRINTS[roundType] || ROUND_BLUEPRINTS["Full Loop"];
  const safeCount = Math.max(3, Math.min(7, Number(count) || basePlan.length));
  return Array.from({ length: safeCount }, (_, index) => basePlan[index % basePlan.length]);
};

const buildQuestionFromBank = (question, round, focus, index) => ({
  id: question._id ? String(question._id) : `fallback-${index + 1}`,
  round,
  question: `${String(question.title || "Question").replace(/\s+Practice Variant\s+\d+$/i, "")} - ${String(question.description || "").replace(/\s*Practice focus\s*\d*:\s*.+$/i, "").trim()}`.trim(),
  category: question.topic || question.category || "General",
  difficulty: question.difficulty || "Medium",
  intent: `Assess ${focus}.`,
  evaluationFocus: "Direct answer, structured explanation, confidence, and one concrete example.",
  followUpHint: `If this round goes well, be ready to extend the answer with one practical example from ${question.topic || question.category || "your preparation"}.`
});

const fallbackQuestions = async ({ count, roundType }) => {
  const roundPlan = buildRoundPlan(roundType, count);

  const questions = await Promise.all(roundPlan.map(async (item, index) => {
    try {
      const matches = await Question.aggregate([
        { $match: { field: "Software", category: item.category } },
        { $sample: { size: 1 } }
      ]);
      if (matches[0]) {
        return buildQuestionFromBank(matches[0], item.round, item.focus, index);
      }
    } catch {
      // fall through to synthetic fallback below
    }

    return {
      id: `fallback-${index + 1}`,
      round: item.round,
      question: `Explain how you would handle a ${item.focus} question in a real ${item.round.toLowerCase()} for a software role.`,
      category: item.category,
      difficulty: index % 2 === 0 ? "Medium" : "Easy",
      intent: `Assess ${item.focus}.`,
      evaluationFocus: "Clarity, confidence, structure, and practical relevance.",
      followUpHint: "Give one practical example and one trade-off or lesson learned."
    };
  }));

  return questions;
};

const enrichFallbackEvaluation = (answer = "", question = "", round = "Interview Round") => {
  const base = heuristicInterviewEvaluation(answer);
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const structureScore = Math.min(100, 40 + Math.round(words * 1.1));
  const technicalScore = Math.min(100, 38 + Math.round(words));

  return {
    ...base,
    structureScore,
    technicalScore,
    strengths: words > 60
      ? ["Good answer depth", "Shows structured thinking", "Uses useful detail"]
      : ["Clear starting direction", "Relevant to the round"],
    improvements: words > 60
      ? ["Sharpen the first 20 seconds", "End with one stronger impact statement"]
      : ["Add one concrete example", "Use STAR or a step-by-step structure"],
    followUpQuestion: `In the ${round} round, how would you support your answer to "${question}" with one specific real example?`
  };
};

export const generateInterviewQuestions = async (req, res) => {
  const {
    role = "Software Engineer",
    focus = "DSA, projects, HR, and core subjects",
    count = 5,
    roundType = "Full Loop",
    experienceLevel = "Fresher",
    company = "General"
  } = req.body;

  const safeCount = Math.min(7, Math.max(3, Number(count) || 5));

  if (!openai) {
    return res.json({
      source: "fallback",
      questions: await fallbackQuestions({ count: safeCount, roundType })
    });
  }

  const roundPlan = buildRoundPlan(roundType, safeCount)
    .map((item, index) => `${index + 1}. ${item.round} (${item.category}) focusing on ${item.focus}`)
    .join("\n");

  const prompt = `You are an expert interviewer simulating a realistic software interview loop.
Generate ${safeCount} interview questions for these settings:
- Target role: ${role}
- Focus area: ${focus}
- Interview format: ${roundType}
- Experience level: ${experienceLevel}
- Target company: ${company}

Use this round plan:
${roundPlan}

Return valid JSON only as an array of objects.
Each object must include these string fields:
- id
- round
- question
- category
- difficulty
- intent
- evaluationFocus
- followUpHint

Make the flow feel like a real hiring process with different rounds and realistic interviewer wording.`;

  const completion = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    input: prompt
  });

  try {
    const parsed = JSON.parse(completion.output_text);
    res.json({ source: "openai", questions: normalizeQuestionPayload(parsed) });
  } catch {
    res.json({ source: "openai", questions: normalizeQuestionPayload(await fallbackQuestions({ count: safeCount, roundType })) });
  }
};

export const evaluateInterviewAnswer = async (req, res) => {
  const { question, answer, role = "Software Engineer", roundType = "Full Loop", round = "Interview Round" } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ message: "Question and answer are required" });
  }

  if (!openai) {
    return res.json({ source: "fallback", ...enrichFallbackEvaluation(answer, question, round) });
  }

  const prompt = `Evaluate this interview answer for a ${role} candidate.
The current interview format is ${roundType} and this question belongs to the ${round}.
Return valid JSON only with these fields:
- feedback: string
- idealAnswer: string
- confidenceScore: number from 0 to 100
- communicationScore: number from 0 to 100
- structureScore: number from 0 to 100
- technicalScore: number from 0 to 100
- strengths: array of short strings
- improvements: array of short strings
- followUpQuestion: string

Question: ${question}
Answer: ${answer}`;

  const completion = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    input: prompt
  });

  try {
    const parsed = JSON.parse(completion.output_text);
    res.json({
      source: "openai",
      feedback: parsed.feedback || "Solid answer overall.",
      idealAnswer: parsed.idealAnswer || "Start with a direct answer, support it with a clear example, and end with impact.",
      confidenceScore: Number(parsed.confidenceScore) || 75,
      communicationScore: Number(parsed.communicationScore) || 75,
      structureScore: Number(parsed.structureScore) || 75,
      technicalScore: Number(parsed.technicalScore) || 75,
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Clear overall direction"],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ["Add one stronger example"],
      followUpQuestion: parsed.followUpQuestion || "Can you back that up with one measurable example?"
    });
  } catch {
    res.json({ source: "openai", ...enrichFallbackEvaluation(answer, question, round) });
  }
};

export const getRecommendations = async (req, res) => {
  const topics = req.body.weakTopics?.length ? req.body.weakTopics : ["Arrays", "DBMS", "Probability"];
  res.json(await Question.find({ topic: { $in: topics } }).limit(6));
};
