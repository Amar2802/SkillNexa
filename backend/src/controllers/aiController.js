import Question from "../models/Question.js";
import openai from "../config/openai.js";
import { heuristicInterviewEvaluation } from "../utils/analytics.js";
import AnswerEvaluation from "../models/AnswerEvaluation.js";
import { runAnswerEvaluation } from "../utils/answerEvaluationEngine.js";
import Prompt from "../models/Prompt.js";
import InterviewSession from "../models/InterviewSession.js";

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

  let systemPrompt = "";
  try {
    const dbPrompt = await Prompt.findOne({ key: "interview_generation" });
    if (dbPrompt) {
      systemPrompt = dbPrompt.content
        .replace(/\{\{safeCount\}\}/g, safeCount)
        .replace(/\{\{role\}\}/g, role)
        .replace(/\{\{focus\}\}/g, focus)
        .replace(/\{\{roundType\}\}/g, roundType)
        .replace(/\{\{experienceLevel\}\}/g, experienceLevel)
        .replace(/\{\{company\}\}/g, company)
        .replace(/\{\{roundPlan\}\}/g, roundPlan);
    }
  } catch (err) {
    console.error("Error loading prompt from DB:", err);
  }

  if (!systemPrompt) {
    systemPrompt = `You are an expert interviewer simulating a realistic software interview loop.
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
  }

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: systemPrompt }]
  });

  try {
    const output_text = completion.choices[0].message.content;
    const parsed = JSON.parse(output_text);
    res.json({ source: "openai", questions: normalizeQuestionPayload(parsed) });
  } catch {
    res.json({ source: "openai", questions: normalizeQuestionPayload(await fallbackQuestions({ count: safeCount, roundType })) });
  }
};

export const evaluateInterviewAnswer = async (req, res) => {
  const {
    question,
    answer,
    role = "Software Engineer",
    roundType = "Full Loop",
    round = "Interview Round",
    topic = round,
    difficulty = "Medium",
    questionId = ""
  } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ message: "Question and answer are required" });
  }

  const result = await runAnswerEvaluation({
    question,
    userAnswer: answer,
    topic,
    role,
    difficulty,
    interviewType: `ai-interview-${roundType.toLowerCase().replace(/\s+/g, "-")}`
  });

  const saved = await AnswerEvaluation.create({
    user: req.user._id,
    questionId: String(questionId || ""),
    question,
    userAnswer: answer,
    topic,
    role,
    difficulty,
    interviewType: "ai-interviewer",
    module: "ai-interviewer",
    ...result
  });

  const legacy = enrichFallbackEvaluation(answer, question, round);
  res.json({
    ...saved.toObject(),
    feedback: result.recruiterFeedback || legacy.feedback,
    idealAnswer: result.idealAnswer,
    confidenceScore: (result.confidenceScore || 0) * 10,
    communicationScore: (result.communicationScore || 0) * 10,
    structureScore: (result.clarityScore || 0) * 10,
    technicalScore: (result.technicalScore || 0) * 10,
    strengths: result.strengths,
    improvements: result.weaknesses,
    followUpQuestion: result.followUpQuestions?.[0] || legacy.followUpQuestion,
    followUpQuestions: result.followUpQuestions
  });
};

export const getRecommendations = async (req, res) => {
  const topics = req.body.weakTopics?.length ? req.body.weakTopics : ["Arrays", "DBMS", "Probability"];
  res.json(await Question.find({ topic: { $in: topics } }).limit(6));
};

export const finishInterviewSession = async (req, res) => {
  const { role, company, difficulty, domain, interviewType, mode, questions } = req.body;

  if (!questions || !questions.length) {
    return res.status(400).json({ message: "Questions and answers are required" });
  }

  // Quick offline averages in case OpenAI fails
  let totalScore = 0;
  let totalComm = 0;
  let totalTech = 0;
  let totalConf = 0;

  questions.forEach(q => {
    const evalObj = q.evaluation || {};
    totalScore += Number(evalObj.score) || 0;
    totalComm += (Number(evalObj.communicationScore) || 0) * 10;
    totalTech += (Number(evalObj.technicalScore) || 0) * 10;
    totalConf += (Number(evalObj.confidenceScore) || 0) * 10;
  });

  const count = questions.length;
  const avgScore = Math.round(totalScore / count);
  const avgComm = Math.round(totalComm / count);
  const avgTech = Math.round(totalTech / count);
  const avgConf = Math.round(totalConf / count);

  let consolidated = {
    overallScore: avgScore,
    communicationScore: avgComm,
    technicalScore: avgTech,
    confidenceScore: avgConf,
    strengths: ["Shows basic knowledge in domain subject", "Responds to all questions"],
    weaknesses: ["Needs deeper technical explanations", "Consider adding concrete project metrics"],
    improvementAreas: ["Revise standard definitions", "Practice timed coding scenarios"],
    suggestedTopics: [domain],
    suggestedQuestions: ["Prepare standard conceptual questions for next round"]
  };

  if (openai) {
    const questionsAndAnswersText = questions.map((q, idx) => `
Question ${idx+1}: [${q.round}] ${q.question}
Answer: ${q.userAnswer}
Score: ${q.evaluation?.score || 'N/A'}
Feedback: ${q.evaluation?.recruiterFeedback || q.evaluation?.feedback || 'N/A'}
`).join("\n\n");

    const systemPrompt = `You are a senior engineering manager and principal recruiter compiling a consolidated performance review for a candidate's mock interview session.
Analyze the candidate's answers and technical details:
- Role: ${role}
- Company: ${company}
- Domain: ${domain}
- Difficulty: ${difficulty}
- Interview Type: ${interviewType}

Here is the log of questions and answers:
${questionsAndAnswersText}

Compile a comprehensive evaluation report.
Return valid JSON only matching this shape:
{
  "overallScore": number (0-100),
  "communicationScore": number (0-100),
  "technicalScore": number (0-100),
  "confidenceScore": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "improvementAreas": string[],
  "suggestedTopics": string[],
  "suggestedQuestions": string[]
}
`;

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: systemPrompt }]
      });
      const parsed = JSON.parse(completion.choices[0].message.content);
      if (parsed) {
        consolidated = {
          overallScore: Number(parsed.overallScore) || avgScore,
          communicationScore: Number(parsed.communicationScore) || avgComm,
          technicalScore: Number(parsed.technicalScore) || avgTech,
          confidenceScore: Number(parsed.confidenceScore) || avgConf,
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 5) : consolidated.strengths,
          weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.slice(0, 5) : consolidated.weaknesses,
          improvementAreas: Array.isArray(parsed.improvementAreas) ? parsed.improvementAreas.slice(0, 5) : consolidated.improvementAreas,
          suggestedTopics: Array.isArray(parsed.suggestedTopics) ? parsed.suggestedTopics.slice(0, 5) : consolidated.suggestedTopics,
          suggestedQuestions: Array.isArray(parsed.suggestedQuestions) ? parsed.suggestedQuestions.slice(0, 5) : consolidated.suggestedQuestions
        };
      }
    } catch (err) {
      console.error("OpenAI consolidated report failed, using offline heuristics:", err);
    }
  }

  try {
    const session = await InterviewSession.create({
      user: req.user._id,
      role,
      company,
      difficulty,
      domain,
      interviewType,
      mode,
      questions: questions.map(q => ({
        questionId: q.questionId,
        round: q.round,
        question: q.question,
        category: q.category || domain,
        difficulty: q.difficulty || difficulty,
        userAnswer: q.userAnswer,
        score: q.evaluation?.score || 0,
        feedback: q.evaluation?.recruiterFeedback || q.evaluation?.feedback || "",
        idealAnswer: q.evaluation?.idealAnswer || "",
        followUpQuestions: q.evaluation?.followUpQuestions || []
      })),
      ...consolidated
    });

    res.status(201).json(session);
  } catch (error) {
    console.error("finishInterviewSession save failed:", error);
    res.status(500).json({ message: "Error compiling and saving the interview session." });
  }
};
