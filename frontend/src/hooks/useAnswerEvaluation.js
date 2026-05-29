import { useCallback, useRef, useState } from "react";
import { submitAnswerEvaluation } from "../services/evaluationService";
import { useToast } from "../components/ui/ToastProvider";

const mapModuleToInterviewType = (module, category = "") => {
  const cat = String(category).toLowerCase();
  if (module === "ai-interviewer") return "ai-interviewer";
  if (module === "mock-test") return "mock-interview";
  if (module === "question-bank") return "question-bank";
  if (cat.includes("hr") || cat.includes("behavioral")) return "hr-interview";
  if (cat.includes("aptitude")) return "aptitude";
  if (module === "practice" && cat.includes("dsa")) return "coding";
  return module || "practice";
};

export const useAnswerEvaluation = ({ onSuccess, refreshProfile } = {}) => {
  const { showToast } = useToast();
  const abortRef = useRef(null);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const evaluate = useCallback(async ({
    questionId,
    question,
    userAnswer,
    topic,
    role,
    difficulty,
    module = "practice",
    category = "",
    codingExplanation = "",
    voiceTranscript = ""
  }) => {
    if (!question || !String(userAnswer || "").trim()) {
      showToast("Please provide an answer before evaluation.", "error");
      return null;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");
    setEvaluation(null);

    try {
      const data = await submitAnswerEvaluation(
        {
          questionId: questionId || "",
          question,
          userAnswer,
          topic: topic || category || "General",
          role: role || "Software Engineer",
          difficulty: difficulty || "Medium",
          interviewType: mapModuleToInterviewType(module, category),
          module,
          codingExplanation,
          voiceTranscript
        },
        { signal: controller.signal }
      );
      setEvaluation(data);
      onSuccess?.(data);
      refreshProfile?.();
      return data;
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") return null;
      const message = err.response?.data?.message || "Evaluation failed. Please retry.";
      setError(message);
      showToast(message, "error");
      return null;
    } finally {
      setLoading(false);
    }
  }, [onSuccess, refreshProfile, showToast]);

  const retry = useCallback((payload) => evaluate(payload), [evaluate]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setEvaluation(null);
    setError("");
    setLoading(false);
  }, []);

  return { evaluation, loading, error, evaluate, retry, reset };
};

export default useAnswerEvaluation;
