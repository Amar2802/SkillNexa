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
- concept: 1 short line with the key concept to remember

Topic: ${safeTopic}
Correct answer: ${safeCorrectAnswer}
User answer: ${safeUserAnswer}`;

  try {
    const completion = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      input: prompt
    });
    const parsed = JSON.parse(completion.output_text);
    const verdict = normalizeVerdict(parsed.verdict, safeUserAnswer, safeCorrectAnswer);
    return {
      verdict,
      whyCorrect: String(parsed.whyCorrect || "").trim() || buildFallbackAnalysis({ userAnswer: safeUserAnswer, correctAnswer: safeCorrectAnswer, topic: safeTopic }).whyCorrect,
      whyWrong: verdict === "Correct" ? "" : String(parsed.whyWrong || "").trim() || buildFallbackAnalysis({ userAnswer: safeUserAnswer, correctAnswer: safeCorrectAnswer, topic: safeTopic }).whyWrong,
      concept: String(parsed.concept || "").trim() || buildFallbackAnalysis({ userAnswer: safeUserAnswer, correctAnswer: safeCorrectAnswer, topic: safeTopic }).concept
    };
  } catch {
    return buildFallbackAnalysis({ userAnswer: safeUserAnswer, correctAnswer: safeCorrectAnswer, topic: safeTopic });
  }
};
