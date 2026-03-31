import Question from "../models/Question.js";
import openai from "../config/openai.js";
import { heuristicInterviewEvaluation } from "../utils/analytics.js";

const fallbackQuestions = ({ role, focus, count, roundType, experienceLevel, company }) => {
  const prompts = [
    {
      question: `Tell me about yourself and why you are a good fit for a ${role} position.`,
      category: "Introduction",
      difficulty: "Easy",
      intent: "Assess clarity, confidence, and role alignment.",
      followUpHint: "Mention one project or internship outcome that proves your fit."
    },
    {
      question: `Describe a challenging ${focus} problem you solved and how you approached it.`,
      category: roundType === "HR" ? "Behavioral" : "Technical",
      difficulty: "Medium",
      intent: "Check structured thinking and problem-solving depth.",
      followUpHint: "Explain trade-offs, constraints, and what you learned."
    },
    {
      question: `How would you prepare for a ${company || "general"} interview over the next 30 days?`,
      category: "Strategy",
      difficulty: "Medium",
      intent: "Evaluate planning ability and prioritization.",
      followUpHint: "Break the answer into weekly milestones and mock-test practice."
    },
    {
      question: `Describe a time you received tough feedback and what you changed afterward.`,
      category: "Behavioral",
      difficulty: experienceLevel === "Experienced" ? "Medium" : "Easy",
      intent: "Measure self-awareness and coachability.",
      followUpHint: "Use STAR and emphasize the improvement made."
    },
    {
      question: `What is one core concept in ${focus} that candidates often misunderstand, and how would you explain it clearly?`,
      category: "Conceptual",
      difficulty: "Medium",
      intent: "Test subject clarity and communication skill.",
      followUpHint: "Use one simple example and one technical detail."
    },
    {
      question: `If you had 10 extra minutes in an interview, what part of your background would you want to highlight and why?`,
      category: "Personal Pitch",
      difficulty: "Easy",
      intent: "Understand strengths and personal branding.",
      followUpHint: "Tie it to business value or measurable impact."
    }
  ];

  return prompts.slice(0, count).map((item, index) => ({
    id: `fallback-${index + 1}`,
    ...item
  }));
};

const normalizeQuestionPayload = (questions = []) => {
  return questions.map((item, index) => ({
    id: item.id || `q-${index + 1}`,
    question: item.question || item.prompt || item.title || `Interview Question ${index + 1}`,
    category: item.category || "General",
    difficulty: item.difficulty || "Medium",
    intent: item.intent || "Assess interview readiness.",
    followUpHint: item.followUpHint || item.follow_up_hint || "Support your answer with a concrete example."
  }));
};

const enrichFallbackEvaluation = (answer = "", question = "") => {
  const base = heuristicInterviewEvaluation(answer);
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const structureScore = Math.min(100, 38 + Math.round(words * 1.2));
  const technicalScore = Math.min(100, 35 + Math.round(words * 1.1));

  return {
    ...base,
    structureScore,
    technicalScore,
    strengths: words > 50
      ? ["Good answer depth", "Shows effort to explain clearly"]
      : ["Direct response", "Good starting point"],
    improvements: words > 50
      ? ["Add sharper opening summary", "Include one measurable result"]
      : ["Add one real example", "Use STAR or problem-solution-impact structure"],
    followUpQuestion: `Can you support your answer to "${question}" with one specific example?`
  };
};

export const generateInterviewQuestions = async (req, res) => {
  const {
    role = "Software Engineer",
    focus = "DSA and behavioral",
    count = 5,
    roundType = "Mixed",
    experienceLevel = "Fresher",
    company = ""
  } = req.body;

  const safeCount = Math.min(8, Math.max(3, Number(count) || 5));

  if (!openai) {
    return res.json({
      source: "fallback",
      questions: fallbackQuestions({ role, focus, count: safeCount, roundType, experienceLevel, company })
    });
  }

  const prompt = `You are an expert technical interviewer.
Generate ${safeCount} interview questions for a candidate with these settings:
- Target role: ${role}
- Focus area: ${focus}
- Interview round: ${roundType}
- Experience level: ${experienceLevel}
- Target company: ${company || "General"}

Return valid JSON only as an array of objects.
Each object must include these string fields:
- id
- question
- category
- difficulty
- intent
- followUpHint

Keep the questions realistic for interviews and vary them across technical, behavioral, and communication dimensions when appropriate.`;

  const completion = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    input: prompt
  });

  try {
    const parsed = JSON.parse(completion.output_text);
    res.json({ source: "openai", questions: normalizeQuestionPayload(parsed) });
  } catch {
    res.json({
      source: "openai",
      questions: normalizeQuestionPayload(
        completion.output_text
          .split("\n")
          .map((line, index) => ({ id: `fallback-openai-${index + 1}`, question: line.trim() }))
          .filter((item) => item.question)
      )
    });
  }
};

export const evaluateInterviewAnswer = async (req, res) => {
  const { question, answer, role = "Software Engineer", roundType = "Mixed" } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ message: "Question and answer are required" });
  }

  if (!openai) {
    return res.json({ source: "fallback", ...enrichFallbackEvaluation(answer, question) });
  }

  const prompt = `Evaluate this interview answer for a ${role} candidate in a ${roundType} round.
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
    res.json({ source: "openai", ...enrichFallbackEvaluation(answer, question) });
  }
};

export const getRecommendations = async (req, res) => {
  const topics = req.body.weakTopics?.length ? req.body.weakTopics : ["Arrays", "DBMS", "Probability"];
  res.json(await Question.find({ topic: { $in: topics } }).limit(6));
};
