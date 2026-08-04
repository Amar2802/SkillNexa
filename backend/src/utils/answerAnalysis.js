import openai from "../config/openai.js";

const normalizeVerdict = (value, userAnswer, correctAnswer) => {
  const verdict = String(value || "").trim();
  if (/^correct$/i.test(verdict)) return "Correct";
  if (/^incorrect$/i.test(verdict)) return "Incorrect";
  const user = String(userAnswer || "").trim().toLowerCase();
  const correct = String(correctAnswer || "").trim().toLowerCase();
  if (user && correct && user === correct) return "Correct";
  return "Incorrect";
};

const buildFallbackAnalysis = ({ userAnswer, correctAnswer, topic }) => {
  const verdict = normalizeVerdict("", userAnswer, correctAnswer);
  return {
    verdict,
    suggestedAnswer: String(correctAnswer || "").trim(),
    whyCorrect: `The expected answer reflects the core idea for ${topic || "this topic"}: ${String(correctAnswer).slice(0, 180)}`,
    whyWrong: verdict === "Correct" ? "" : "Your answer missed key points from the expected solution. Compare structure, terms, and reasoning.",
    concept: `Remember the main ${topic || "concept"} pattern behind this question.`
  };
};

export const generateAnswerAnalysis = async ({ userAnswer, correctAnswer, topic = "General" }) => {
  const safeUserAnswer = String(userAnswer || "").trim();
  const safeCorrectAnswer = String(correctAnswer || "").trim();
  const safeTopic = String(topic || "General").trim() || "General";

  if (!safeUserAnswer || !safeCorrectAnswer) {
    throw new Error("userAnswer and correctAnswer are required");
  }

  if (!openai) {
    return buildFallbackAnalysis({ userAnswer: safeUserAnswer, correctAnswer: safeCorrectAnswer, topic: safeTopic });
  }

  const prompt = `Analyze this interview practice answer.
Return valid JSON only with:
- verdict: "Correct" or "Incorrect"
- whyCorrect: 1-2 short lines explaining why the correct answer is right
- whyWrong: 1-2 short lines explaining why the user's answer was wrong (empty string if correct)
- suggestedAnswer: a clear, interview-ready model answer the candidate can give (2-4 sentences or concise bullets)
- concept: 1 short line with the key concept to remember

Topic: ${safeTopic}
Correct answer: ${safeCorrectAnswer}
User answer: ${safeUserAnswer}`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });
    const parsed = JSON.parse(completion.choices[0].message.content);
    const verdict = normalizeVerdict(parsed.verdict, safeUserAnswer, safeCorrectAnswer);
    const fallback = buildFallbackAnalysis({ userAnswer: safeUserAnswer, correctAnswer: safeCorrectAnswer, topic: safeTopic });
    return {
      verdict,
      suggestedAnswer: String(parsed.suggestedAnswer || "").trim() || fallback.suggestedAnswer,
      whyCorrect: String(parsed.whyCorrect || "").trim() || fallback.whyCorrect,
      whyWrong: verdict === "Correct" ? "" : String(parsed.whyWrong || "").trim() || fallback.whyWrong,
      concept: String(parsed.concept || "").trim() || fallback.concept
    };
  } catch {
    return buildFallbackAnalysis({ userAnswer: safeUserAnswer, correctAnswer: safeCorrectAnswer, topic: safeTopic });
  }
};
