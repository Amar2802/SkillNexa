import Question from "../models/Question.js";
import openai from "../config/openai.js";
import { heuristicInterviewEvaluation } from "../utils/analytics.js";

export const generateInterviewQuestions = async (req, res) => {
  const { role = "Software Engineer", focus = "DSA and behavioral", count = 5 } = req.body;

  if (!openai) {
    return res.json({
      source: "fallback",
      questions: [
        `Explain a challenging ${role} problem you solved recently.`,
        `How would you prepare a ${focus} study plan for the next 30 days?`,
        "Describe a time you received tough feedback and how you handled it.",
        "How do you optimize time and space complexity in coding rounds?",
        "Which core subject would you revise first before interviews and why?"
      ].slice(0, count)
    });
  }

  const completion = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    input: `Generate ${count} interview questions for a ${role} candidate focused on ${focus}. Return a JSON array of strings only.`
  });

  try {
    res.json({ source: "openai", questions: JSON.parse(completion.output_text) });
  } catch {
    res.json({
      source: "openai",
      questions: completion.output_text
        .split("\n")
        .map((line) => line.replace(/^\d+[.)\s-]*/, "").trim())
        .filter(Boolean)
    });
  }
};

export const evaluateInterviewAnswer = async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ message: "Question and answer are required" });
  }

  if (!openai) {
    return res.json({ source: "fallback", ...heuristicInterviewEvaluation(answer) });
  }

  const completion = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    input: `Evaluate this interview answer and return JSON with feedback, idealAnswer, confidenceScore, communicationScore. Question: ${question}\nAnswer: ${answer}`
  });

  try {
    res.json({ source: "openai", ...JSON.parse(completion.output_text) });
  } catch {
    res.json({
      source: "openai",
      feedback: completion.output_text,
      idealAnswer: "Answer directly, support with evidence, and finish with measurable impact.",
      confidenceScore: 76,
      communicationScore: 74
    });
  }
};

export const getRecommendations = async (req, res) => {
  const topics = req.body.weakTopics?.length ? req.body.weakTopics : ["Arrays", "DBMS", "Probability"];
  res.json(await Question.find({ topic: { $in: topics } }).limit(6));
};
