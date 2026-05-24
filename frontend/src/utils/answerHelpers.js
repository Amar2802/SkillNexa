const trimText = (value) => String(value || "").trim();

export const buildDetailedSolution = (question, answerText, explanationText) => {
  const correctAnswer = trimText(answerText);
  const explanation = trimText(explanationText);
  const type = question?.type || "Subjective";

  if (type === "Coding") {
    return [
      `Approach: ${correctAnswer || "Start by identifying the right data structure and keeping the solution linear whenever possible."}`,
      `How to solve it: Break the problem into input handling, core logic, and final return value. Use the starter code structure to implement the main loop or recursion, test edge cases, and then confirm the time and space complexity.`,
      `Why this works: ${explanation || "The solution works because it processes each required state in a controlled way and avoids unnecessary repeated work."}`
    ].join(" ");
  }

  if (type === "MCQ") {
    return [
      `Correct choice: ${correctAnswer}.`,
      `Reasoning: Eliminate the options that do not match the core concept first, then confirm the final option using the definition or formula being tested.`,
      `Explanation: ${explanation || "The selected option is the only one consistent with the concept asked in the question."}`
    ].join(" ");
  }

  return [
    `Direct answer: ${correctAnswer || "Answer the concept clearly in one or two lines."}`,
    `How to explain it: Start with the definition, then mention the main idea, one interview-style example, and any trade-off or practical use when relevant.`,
    `Detailed explanation: ${explanation || "A strong answer should connect the concept to its practical use and common interview follow-up points."}`
  ].join(" ");
};
