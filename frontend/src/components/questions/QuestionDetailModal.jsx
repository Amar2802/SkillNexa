import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiBookmark, 
  FiCode, 
  FiCheckSquare, 
  FiFileText, 
  FiEye, 
  FiEyeOff, 
  FiCheck, 
  FiX, 
  FiMessageSquare, 
  FiArrowRight, 
  FiArrowLeft, 
  FiHelpCircle,
  FiSend,
  FiZap,
  FiTerminal
} from "react-icons/fi";
import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import CodeBlock from "../mentor/CodeBlock";
import AnswerEvaluationCard from "../evaluation/AnswerEvaluationCard";
import useAnswerEvaluation from "../../hooks/useAnswerEvaluation";
import api from "../../api/client";

export const QuestionDetailModal = ({
  isOpen,
  onClose,
  question,
  isBookmarked = false,
  onToggleBookmark,
  isBookmarkLoading = false,
  onPrevQuestion,
  onNextQuestion,
  hasPrev = false,
  hasNext = false,
  refreshProfile
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("problem"); // 'problem' | 'practice' | 'solution' | 'mentor'
  const [revealSolution, setRevealSolution] = useState(false);

  // Practice state
  const [mcqSelected, setMcqSelected] = useState("");
  const [mcqSubmitted, setMcqSubmitted] = useState(false);
  const [mcqResult, setMcqResult] = useState(null);
  const [checkingAnswer, setCheckingAnswer] = useState(false);

  const [subjectiveText, setSubjectiveText] = useState("");
  const [quickResult, setQuickResult] = useState(null);

  const { 
    evaluation, 
    loading: deepEvalLoading, 
    evaluate: runDeepEvaluation, 
    reset: resetDeepEvaluation 
  } = useAnswerEvaluation({ refreshProfile });

  // Record view count when question is opened
  useEffect(() => {
    if (isOpen && question?._id) {
      api.post(`/questions/${question._id}/view`).catch(() => undefined);
      // Reset view state when question changes
      setRevealSolution(false);
      setMcqSelected("");
      setMcqSubmitted(false);
      setMcqResult(null);
      setSubjectiveText("");
      setQuickResult(null);
      resetDeepEvaluation();
      setActiveTab("problem");
    }
  }, [isOpen, question?._id]);

  if (!question) return null;

  const isCoding = question.type === "Coding";
  const isMCQ = question.type === "MCQ";
  const isSubjective = !isCoding && !isMCQ;

  // Handle MCQ Answer Check
  const handleCheckMCQ = async () => {
    if (!mcqSelected || checkingAnswer) return;
    setCheckingAnswer(true);

    try {
      const { data } = await api.post(`/questions/${question._id}/evaluate`, {
        answer: mcqSelected
      });
      setMcqResult(data);
      setMcqSubmitted(true);
    } catch {
      // Local fallback evaluation
      const isCorrect = String(mcqSelected).trim() === String(question.correctAnswer).trim();
      setMcqResult({
        isCorrect,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation || "Review the technical details in the solution tab."
      });
      setMcqSubmitted(true);
    } finally {
      setCheckingAnswer(false);
    }
  };

  // Handle Quick Subjective Evaluation
  const handleQuickEvaluate = async () => {
    if (!subjectiveText.trim() || checkingAnswer) return;
    setCheckingAnswer(true);
    try {
      const { data } = await api.post(`/questions/${question._id}/evaluate`, {
        answer: subjectiveText.trim()
      });
      setQuickResult(data);
    } catch {
      setQuickResult({
        isCorrect: subjectiveText.trim().length > 30,
        explanation: question.explanation || "Great attempt. Compare your points with the model answer."
      });
    } finally {
      setCheckingAnswer(false);
    }
  };

  // Handle Deep AI Evaluation
  const handleDeepEvaluate = async () => {
    if (!subjectiveText.trim()) return;
    await runDeepEvaluation({
      questionId: question._id,
      question: question.title + ": " + (question.description || ""),
      userAnswer: subjectiveText.trim(),
      topic: question.topic,
      category: question.category,
      difficulty: question.difficulty,
      module: "question-bank"
    });
  };

  // Handoff to AI Mentor
  const handleLaunchMentor = (customPrompt = "") => {
    onClose();
    const promptToSend = customPrompt || `Can you help me understand the optimal approach and edge cases for the problem: "${question.title}"?`;
    navigate("/ai-mentor", {
      state: {
        context: {
          type: "problem",
          title: question.title,
          topic: question.topic || "Technical Interview",
          description: question.description || ""
        },
        mode: "explain",
        initialPrompt: promptToSend
      }
    });
  };

  const cleanTitle = (question.title || "Untitled Question").replace(
    /\s+Practice Variant\s+\d+$/i,
    ""
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-4xl"
      title={
        <div className="flex items-center gap-2 flex-wrap pr-6">
          <Badge difficulty={question.difficulty || "Medium"} size="sm" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {question.category || "DSA"}
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {question.topic || "General"}
          </span>
          {question.company && (
            <span className="font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/60 dark:border-indigo-900 dark:text-indigo-300">
              {question.company}
            </span>
          )}
        </div>
      }
      description={
        <div className="flex items-center justify-between gap-4 mt-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
            {cleanTitle}
          </h2>
          <button
            type="button"
            disabled={isBookmarkLoading}
            onClick={() => onToggleBookmark?.(question._id)}
            className={`p-1.5 rounded-lg border transition cursor-pointer shrink-0 ${
              isBookmarked
                ? "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                : "border-[var(--snx-border)] text-slate-400 hover:text-slate-700 dark:border-slate-800 dark:hover:text-slate-200"
            }`}
            title={isBookmarked ? "Remove bookmark" : "Bookmark this question"}
          >
            <FiBookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </button>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          {/* Question Stepper */}
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              disabled={!hasPrev}
              onClick={onPrevQuestion}
              className="!h-8 !px-2.5 inline-flex items-center gap-1"
            >
              <FiArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!hasNext}
              onClick={onNextQuestion}
              className="!h-8 !px-2.5 inline-flex items-center gap-1"
            >
              <span className="hidden sm:inline">Next</span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Context Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleLaunchMentor()}
              className="!h-8 !px-3 inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400"
            >
              <FiMessageSquare className="h-3.5 w-3.5" />
              <span>Ask AI Mentor</span>
            </Button>

            {isCoding ? (
              <Link to={`/practice/${question._id}`}>
                <Button
                  variant="primary"
                  size="sm"
                  className="!h-8 !px-3.5 inline-flex items-center gap-1.5"
                >
                  <FiTerminal className="h-3.5 w-3.5" />
                  <span>Open Coding IDE</span>
                </Button>
              </Link>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={onClose}
                className="!h-8 !px-3"
              >
                Close
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[var(--snx-border)] pb-2 dark:border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("problem")}
            className={`pb-1.5 px-1 border-b-2 transition ${
              activeTab === "problem"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Question Statement
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("practice")}
            className={`pb-1.5 px-1 border-b-2 transition ${
              activeTab === "practice"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Practice & Self-Test
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("solution")}
            className={`pb-1.5 px-1 border-b-2 transition ${
              activeTab === "solution"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Solution & Deep Dive
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("mentor")}
            className={`pb-1.5 px-1 border-b-2 transition ${
              activeTab === "mentor"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            AI Guidance
          </button>
        </div>

        {/* Tab 1: Question Statement */}
        {activeTab === "problem" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 snx-scrollbar">
            {/* Description */}
            <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {question.description || "No description provided for this question."}
            </div>

            {/* MCQ Options preview */}
            {isMCQ && question.options?.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Multiple Choice Options
                </h4>
                <div className="grid gap-2">
                  {question.options.map((option, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-xs text-slate-700 dark:border-slate-800 dark:text-slate-300"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coding Starter Preview */}
            {isCoding && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Starter Code Preview
                  </h4>
                  <Link
                    to={`/practice/${question._id}`}
                    className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400 inline-flex items-center gap-1"
                  >
                    <span>Launch Monaco Editor</span>
                    <FiArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {question.starterCode && typeof question.starterCode === "object" ? (
                  <CodeBlock
                    language="python"
                    code={
                      question.starterCode instanceof Map
                        ? question.starterCode.get("python") || question.starterCode.get("javascript") || "# Write code here"
                        : question.starterCode.python || question.starterCode.javascript || "# Write your solution here"
                    }
                  />
                ) : (
                  <div className="p-4 rounded-xl border border-slate-700 bg-slate-900 text-xs font-mono text-slate-400">
                    # Open the coding workspace to view full code templates and test runner
                  </div>
                )}

                <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5 dark:border-indigo-900/40 dark:bg-indigo-950/20 flex items-center justify-between gap-3">
                  <div className="text-xs text-indigo-900 dark:text-indigo-300">
                    This is an algorithmic coding problem with unit test cases and execution support.
                  </div>
                  <Link to={`/practice/${question._id}`}>
                    <Button variant="primary" size="sm" className="!h-8 !px-3 shrink-0">
                      Practice in IDE
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Tags / Metadata */}
            {question.tags?.length > 0 && (
              <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-400">Tags:</span>
                {question.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Practice & Self-Test */}
        {activeTab === "practice" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 snx-scrollbar">
            {isMCQ && (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select the correct answer and click "Check Answer" to test your recall:
                </div>

                <div className="space-y-2">
                  {(question.options || []).map((opt, idx) => {
                    const isSelected = mcqSelected === opt;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setMcqSelected(opt);
                          setMcqSubmitted(false);
                          setMcqResult(null);
                        }}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50/70 text-indigo-950 font-semibold dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-white"
                            : "border-[var(--snx-border)] bg-[var(--snx-surface)] text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!mcqSelected || checkingAnswer}
                    loading={checkingAnswer}
                    onClick={handleCheckMCQ}
                  >
                    Check Answer
                  </Button>
                </div>

                {mcqSubmitted && mcqResult && (
                  <div
                    className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                      mcqResult.isCorrect
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200"
                        : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      {mcqResult.isCorrect ? (
                        <>
                          <FiCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Correct! Well done.</span>
                        </>
                      ) : (
                        <>
                          <FiX className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                          <span>Incorrect. Correct answer is: {question.correctAnswer}</span>
                        </>
                      )}
                    </div>
                    {question.explanation && (
                      <p className="pt-1 text-slate-700 dark:text-slate-300">
                        {question.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {isSubjective && (
              <div className="space-y-4">
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Type your technical response in your own words. You can evaluate it instantly or run full AI rubric grading:
                </div>

                <textarea
                  rows={6}
                  value={subjectiveText}
                  onChange={(e) => setSubjectiveText(e.target.value)}
                  placeholder="Explain the technical concepts, trade-offs, architecture, and step-by-step logic here..."
                  className="w-full rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-3 text-xs leading-relaxed text-slate-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{subjectiveText.trim().split(/\s+/).filter(Boolean).length} words</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={!subjectiveText.trim() || checkingAnswer}
                      loading={checkingAnswer}
                      onClick={handleQuickEvaluate}
                      className="!h-8 !px-3 inline-flex items-center gap-1.5"
                    >
                      <FiZap className="h-3.5 w-3.5 text-amber-500" />
                      <span>Quick Check</span>
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      disabled={!subjectiveText.trim() || deepEvalLoading}
                      loading={deepEvalLoading}
                      onClick={handleDeepEvaluate}
                      className="!h-8 !px-3 inline-flex items-center gap-1.5"
                    >
                      <FiSend className="h-3.5 w-3.5" />
                      <span>Deep AI Evaluation</span>
                    </Button>
                  </div>
                </div>

                {/* Quick Result Feedback */}
                {quickResult && !evaluation && (
                  <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/70 text-xs leading-relaxed dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200 space-y-1.5">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <FiZap className="h-4 w-4 text-amber-500" />
                      <span>Quick Evaluation Result</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">
                      {quickResult.feedback || quickResult.explanation}
                    </p>
                  </div>
                )}

                {/* Deep Evaluation Rubric Breakdown */}
                {evaluation && (
                  <div className="pt-2">
                    <AnswerEvaluationCard evaluation={evaluation} />
                  </div>
                )}
              </div>
            )}

            {isCoding && (
              <div className="p-6 rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-center space-y-3 dark:border-slate-800">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <FiTerminal className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Full Coding IDE & Unit Test Environment
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Practice this problem with our Monaco code editor, multiple language runtimes (Python, JavaScript, Java, C++), custom input console, and automated test runners.
                </p>
                <Link to={`/practice/${question._id}`}>
                  <Button variant="primary" size="md" className="inline-flex items-center gap-2 mt-2">
                    <span>Launch SkillNexa Code IDE</span>
                    <FiArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Solution & Deep Dive (Progressive Reveal) */}
        {activeTab === "solution" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 snx-scrollbar">
            {!revealSolution ? (
              <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50/70 text-center space-y-3 dark:border-amber-900/50 dark:bg-amber-950/20">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300">
                  <FiEyeOff className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    Solution is hidden to prevent spoilers
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 max-w-sm mx-auto">
                    Try solving or outlining your answer before revealing the optimal technical explanation and code solution.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setRevealSolution(true)}
                  className="inline-flex items-center gap-1.5 !bg-amber-600 hover:!bg-amber-700 text-white"
                >
                  <FiEye className="h-3.5 w-3.5" />
                  <span>Reveal Solution & Explanation</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Optimal Solution & Breakdown
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRevealSolution(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 inline-flex items-center gap-1"
                  >
                    <FiEyeOff className="h-3.5 w-3.5" />
                    <span>Hide again</span>
                  </button>
                </div>

                {/* Model / Correct Answer */}
                {question.correctAnswer && (
                  <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-xs font-mono text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                    <span className="font-bold uppercase tracking-wider font-sans block text-[10px] text-emerald-700 dark:text-emerald-400 mb-1">
                      Expected Output / Key Answer:
                    </span>
                    {typeof question.correctAnswer === "object"
                      ? JSON.stringify(question.correctAnswer, null, 2)
                      : String(question.correctAnswer)}
                  </div>
                )}

                {/* Formatted Technical Explanation */}
                <div className="p-4 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-xs leading-relaxed text-slate-800 dark:border-slate-800 dark:text-slate-200 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    Technical Explanation & Approach
                  </h4>
                  <div className="whitespace-pre-wrap">
                    {question.explanation || "No extended explanation provided for this question yet."}
                  </div>
                </div>

                {/* Complexity Hints */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Time Complexity Target
                    </span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      {isCoding ? "O(N) or O(N log N) optimal" : "Crisp 2-3 minute structured explanation"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Space Complexity Target
                    </span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      {isCoding ? "O(1) auxiliary space preferred" : "Structured points with STAR technique"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: AI Guidance & Interview Coaching */}
        {activeTab === "mentor" && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 snx-scrollbar">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              Get 1-on-1 coaching from the SkillNexa AI Mentor. Click any prompt below to jump into an interactive discussion:
            </div>

            <div className="grid gap-2.5">
              {[
                {
                  title: "Give me an intuitive hint",
                  desc: "Understand the core algorithmic pattern without spoiling the code."
                },
                {
                  title: "Walk through edge cases & pitfalls",
                  desc: "What edge cases would a senior interviewer test you on?"
                },
                {
                  title: "Explain optimal time & space complexity",
                  desc: "Compare naive brute-force vs optimal approach."
                },
                {
                  title: "Simulate a live interviewer follow-up",
                  desc: "How does this scale in distributed or high-concurrency systems?"
                }
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLaunchMentor(item.title + ` for question: "${question.title}"`)}
                  className="flex items-start justify-between p-3.5 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] hover:border-indigo-300 hover:bg-indigo-50/30 text-left transition cursor-pointer dark:border-slate-800 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/20 group"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </div>
                  </div>
                  <FiArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 mt-0.5" />
                </button>
              ))}
            </div>

            <div className="pt-2 text-center">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleLaunchMentor()}
                className="inline-flex items-center gap-1.5"
              >
                <FiMessageSquare className="h-3.5 w-3.5" />
                <span>Open Dedicated AI Mentor Chat</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default QuestionDetailModal;
