import openai from "../config/openai.js";

const clamp = (value, min = 0, max = 10) => Math.max(min, Math.min(max, Number(value) || 0));

const normalizeList = (value, fallback = []) => {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 8);
};

const wordCount = (text = "") => String(text).trim().split(/\s+/).filter(Boolean).length;

const buildFallbackEvaluation = ({
  question = "",
  userAnswer = "",
  topic = "General",
  difficulty = "Medium",
  interviewType = "practice"
}) => {
  const words = wordCount(userAnswer);
  const depthBoost = Math.min(4, Math.floor(words / 25));
  const technical = clamp(4 + depthBoost + (interviewType.includes("coding") ? 1 : 0));
  const communication = clamp(3 + depthBoost + (words > 30 ? 2 : 0));
  const clarity = clamp(3 + depthBoost);
  const problemSolving = clamp(4 + depthBoost);
  const confidence = clamp(3 + depthBoost + (words > 50 ? 1 : 0));
  const completeness = clamp(3 + depthBoost + (words > 80 ? 2 : 1));
  const industry = clamp(3 + depthBoost);

  const dimensions = [technical, communication, clarity, problemSolving, confidence, completeness, industry];
  const score = Math.round((dimensions.reduce((sum, item) => sum + item, 0) / dimensions.length) * 10);

  const missedConcepts =
    words < 40
      ? [`${topic} fundamentals`, "Real-world examples", "Trade-offs"]
      : [`Advanced ${topic} patterns`, "Performance optimization"];

  return {
    source: "fallback",
    score,
    technicalScore: technical,
    communicationScore: communication,
    clarityScore: clarity,
    problemSolvingScore: problemSolving,
    confidenceScore: confidence,
    completenessScore: completeness,
    industryReadinessScore: industry,
    strengths:
      words > 50
        ? ["Good answer depth", "Structured explanation", "Relevant terminology"]
        : ["Clear starting direction", "Addresses the core question"],
    weaknesses:
      words > 50
        ? ["Could add more measurable impact", "Missing optimization discussion"]
        : ["Answer is too brief", "Needs a concrete example"],
    missedConcepts: missedConcepts.slice(0, 4),
    suggestions: [
      "Lead with a direct answer in the first 20 seconds",
      "Add one measurable outcome or metric",
      `Mention practical ${topic} use cases`,
      `Practice ${difficulty.toLowerCase()}-level follow-up questions`
    ],
    idealAnswer: `For this ${interviewType} question on ${topic}, start with a concise direct answer, explain your approach step-by-step, include one real project example, and close with impact or trade-offs.`,
    recruiterFeedback:
      words > 50
        ? "This answer shows solid fundamentals. Deepen it with optimization patterns and sharper examples to stand out."
        : "Promising direction, but the answer needs more structure, examples, and confidence for a strong hire signal.",
    followUpQuestions: [
      `How would you apply ${topic} in a production scenario?`,
      "What trade-offs did you consider?",
      "How would you measure success for this solution?"
    ]
  };
};

export const runAnswerEvaluation = async (payload = {}) => {
  const {
    question = "",
    userAnswer = "",
    topic = "General",
    role = "Software Engineer",
    difficulty = "Medium",
    interviewType = "practice",
    codingExplanation = "",
    voiceTranscript = ""
  } = payload;

  const combinedAnswer = [userAnswer, codingExplanation, voiceTranscript].filter(Boolean).join("\n\n");

  if (!question || !combinedAnswer.trim()) {
    throw new Error("Question and answer are required");
  }

  if (!openai) {
    return buildFallbackEvaluation({ question, userAnswer: combinedAnswer, topic, difficulty, interviewType });
  }

  const prompt = `You are a senior technical recruiter evaluating interview answers.
Return valid JSON only with this exact shape:
{
  "score": number 0-100,
  "technicalScore": number 0-10,
  "communicationScore": number 0-10,
  "clarityScore": number 0-10,
  "problemSolvingScore": number 0-10,
  "confidenceScore": number 0-10,
  "completenessScore": number 0-10,
  "industryReadinessScore": number 0-10,
  "strengths": string[],
  "weaknesses": string[],
  "missedConcepts": string[],
  "suggestions": string[],
  "idealAnswer": string,
  "recruiterFeedback": string,
  "followUpQuestions": string[]
}

Context:
- Role: ${role}
- Topic: ${topic}
- Difficulty: ${difficulty}
- Interview type: ${interviewType}

Question:
${question}

Candidate answer:
${combinedAnswer}`;

  try {
    const completion = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: prompt
    });

    const parsed = JSON.parse(completion.output_text);
    const dimensions = [
      clamp(parsed.technicalScore),
      clamp(parsed.communicationScore),
      clamp(parsed.clarityScore),
      clamp(parsed.problemSolvingScore),
      clamp(parsed.confidenceScore),
      clamp(parsed.completenessScore),
      clamp(parsed.industryReadinessScore)
    ];
    const computedScore = Math.round((dimensions.reduce((sum, n) => sum + n, 0) / dimensions.length) * 10);

    return {
      source: "openai",
      score: Math.min(100, Math.max(0, Number(parsed.score) || computedScore)),
      technicalScore: dimensions[0],
      communicationScore: dimensions[1],
      clarityScore: dimensions[2],
      problemSolvingScore: dimensions[3],
      confidenceScore: dimensions[4],
      completenessScore: dimensions[5],
      industryReadinessScore: dimensions[6],
      strengths: normalizeList(parsed.strengths, ["Clear fundamentals"]),
      weaknesses: normalizeList(parsed.weaknesses, ["Add more depth"]),
      missedConcepts: normalizeList(parsed.missedConcepts),
      suggestions: normalizeList(parsed.suggestions, ["Use structured STAR format"]),
      idealAnswer: String(parsed.idealAnswer || "").trim() || buildFallbackEvaluation({ question, userAnswer: combinedAnswer, topic, difficulty, interviewType }).idealAnswer,
      recruiterFeedback: String(parsed.recruiterFeedback || "").trim() || "Solid attempt with room to strengthen depth and examples.",
      followUpQuestions: normalizeList(parsed.followUpQuestions, ["Can you walk through a real example?"])
    };
  } catch {
    return buildFallbackEvaluation({ question, userAnswer: combinedAnswer, topic, difficulty, interviewType });
  }
};

export const buildEvaluationAnalytics = (evaluations = []) => {
  if (!evaluations.length) {
    return {
      totalEvaluated: 0,
      averageScore: 0,
      highestScore: 0,
      improvementRate: 0,
      aiReadinessScore: 0,
      bestTopic: "",
      weakestTopic: "",
      strongestSkills: [],
      weakestSkills: [],
      accuracyTrend: [],
      communicationTrend: [],
      confidenceTrend: [],
      weeklyProgress: [],
      monthlyProgress: [],
      topicMastery: []
    };
  }

  const sorted = [...evaluations].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const scores = sorted.map((item) => item.score || 0);
  const averageScore = Math.round(scores.reduce((sum, n) => sum + n, 0) / scores.length);
  const highestScore = Math.max(...scores);

  const midpoint = Math.floor(scores.length / 2);
  const firstHalf = scores.slice(0, midpoint || 1);
  const secondHalf = scores.slice(midpoint || 0);
  const firstAvg = firstHalf.reduce((sum, n) => sum + n, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, n) => sum + n, 0) / secondHalf.length;
  const improvementRate = Math.round(secondAvg - firstAvg);

  const topicMap = {};
  sorted.forEach((item) => {
    const key = item.topic || "General";
    topicMap[key] ||= { total: 0, count: 0, technical: 0, communication: 0 };
    topicMap[key].total += item.score || 0;
    topicMap[key].count += 1;
    topicMap[key].technical += item.technicalScore || 0;
    topicMap[key].communication += item.communicationScore || 0;
  });

  const topicMastery = Object.entries(topicMap)
    .map(([topic, stats]) => ({
      topic,
      score: Math.round(stats.total / stats.count),
      technical: Math.round((stats.technical / stats.count) * 10),
      communication: Math.round((stats.communication / stats.count) * 10)
    }))
    .sort((a, b) => b.score - a.score);

  const bestTopic = topicMastery[0]?.topic || "";
  const weakestTopic = topicMastery[topicMastery.length - 1]?.topic || "";

  const bucketByWeek = {};
  const bucketByMonth = {};
  sorted.forEach((item) => {
    const date = new Date(item.createdAt);
    const weekKey = `${date.getFullYear()}-W${Math.ceil((date.getDate() + 6 - date.getDay()) / 7)}`;
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    bucketByWeek[weekKey] ||= [];
    bucketByMonth[monthKey] ||= [];
    bucketByWeek[weekKey].push(item.score || 0);
    bucketByMonth[monthKey].push(item.score || 0);
  });

  const weeklyProgress = Object.entries(bucketByWeek).map(([label, values]) => ({
    label,
    score: Math.round(values.reduce((sum, n) => sum + n, 0) / values.length)
  }));

  const monthlyProgress = Object.entries(bucketByMonth).map(([label, values]) => ({
    label,
    score: Math.round(values.reduce((sum, n) => sum + n, 0) / values.length)
  }));

  const lastTen = sorted.slice(-10);
  const accuracyTrend = lastTen.map((item, index) => ({
    label: `A${index + 1}`,
    value: Math.round(((item.technicalScore || 0) + (item.problemSolvingScore || 0)) / 2 * 10)
  }));
  const communicationTrend = lastTen.map((item, index) => ({
    label: `C${index + 1}`,
    value: (item.communicationScore || 0) * 10
  }));
  const confidenceTrend = lastTen.map((item, index) => ({
    label: `F${index + 1}`,
    value: (item.confidenceScore || 0) * 10
  }));

  const recentAvg = scores.slice(-5);
  const aiReadinessScore = recentAvg.length
    ? Math.round(recentAvg.reduce((sum, n) => sum + n, 0) / recentAvg.length)
    : averageScore;

  return {
    totalEvaluated: evaluations.length,
    averageScore,
    highestScore,
    improvementRate,
    aiReadinessScore,
    bestTopic,
    weakestTopic,
    strongestSkills: topicMastery.slice(0, 3).map((item) => item.topic),
    weakestSkills: topicMastery.slice(-3).reverse().map((item) => item.topic),
    accuracyTrend,
    communicationTrend,
    confidenceTrend,
    weeklyProgress,
    monthlyProgress,
    topicMastery
  };
};
