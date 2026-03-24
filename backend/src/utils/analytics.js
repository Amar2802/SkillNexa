export const weakTopicsFromAnswers = (answers) => {
  const map = {};

  answers.forEach((item) => {
    if (!item.question?.topic) return;
    map[item.question.topic] ||= { total: 0, wrong: 0 };
    map[item.question.topic].total += 1;
    if (!item.isCorrect) map[item.question.topic].wrong += 1;
  });

  return Object.entries(map)
    .filter(([, value]) => value.wrong > 0)
    .sort((a, b) => b[1].wrong - a[1].wrong)
    .map(([topic]) => topic)
    .slice(0, 4);
};

export const heuristicInterviewEvaluation = (answer = "") => {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;

  return {
    feedback:
      words > 40
        ? "Good depth. Improve structure with a clear beginning, example, and outcome."
        : "Your answer is short. Add context, details, and a measurable result.",
    idealAnswer: "Lead with a direct answer, support it with one concrete example, and close with impact.",
    confidenceScore: Math.min(100, 45 + words),
    communicationScore: Math.min(100, 40 + Math.round(words * 1.4))
  };
};
