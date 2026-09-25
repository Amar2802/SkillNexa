import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiCode, FiFileText, FiTerminal, FiCheck, FiSend, FiPlay } from "react-icons/fi";
import api from "../api/client";
import { CodingHeader, ProblemDescriptionPanel, CodeEditorPanel, TestConsolePanel } from "../components/coding";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { useToast } from "../components/ui/ToastProvider";
import useAnswerEvaluation from "../hooks/useAnswerEvaluation";
import { buildDetailedSolution } from "../utils/answerHelpers";

export const PracticePage = ({
  questions = [],
  bookmarks = [],
  refreshBookmarks,
  refreshProfile,
  targetField = "Software",
  loadQuestions
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { questionId } = useParams();
  const { showToast } = useToast();

  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [language, setLanguage] = useState("python");
  const [stdin, setStdin] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runningCode, setRunningCode] = useState(false);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [codingExplanation, setCodingExplanation] = useState("");
  const [mobileTab, setMobileTab] = useState("editor"); // 'problem' | 'editor' | 'console'
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { evaluation, loading: evalLoading, evaluate, reset: resetEvaluation } = useAnswerEvaluation({ refreshProfile });

  useEffect(() => {
    if (questions.length || !loadQuestions) return;
    let active = true;
    setLoading(true);
    loadQuestions({ limit: 80 })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [questions.length, loadQuestions]);

  const question = useMemo(() => {
    if (!questionId) return null;
    return questions.find((item) => String(item._id) === String(questionId)) || null;
  }, [questions, questionId]);

  const currentIndex = question ? questions.findIndex((item) => String(item._id) === String(question._id)) : -1;
  const isBookmarked = bookmarks.some((item) => String(item._id) === String(questionId));

  useEffect(() => {
    if (!question) return;
    setFeedback(null);
    resetEvaluation();
    setCodingExplanation("");
    setStartedAt(Date.now());
    setAnswer(question.type === "Coding" ? question.starterCode?.[language] || "" : "");
  }, [question, language, resetEvaluation]);

  const resetToStarterCode = () => {
    if (question && question.type === "Coding") {
      setAnswer(question.starterCode?.[language] || "");
      showToast("Reset to starter code template.", "info");
    }
  };

  const submit = async () => {
    if (!question) return;
    try {
      setSubmitting(true);
      const { data } = await api.post(
        `/questions/${question._id}/evaluate`,
        {
          answer,
          timeSpent: Math.round((Date.now() - startedAt) / 1000)
        },
        { timeout: 25000 }
      );
      setFeedback(data);

      const questionText = `${question.title}. ${String(question.description || "").trim()}`;
      await evaluate({
        questionId: question._id,
        question: questionText,
        userAnswer: answer,
        topic: question.topic,
        difficulty: question.difficulty,
        category: question.category,
        module: "practice",
        codingExplanation: question.type === "Coding" ? codingExplanation : ""
      });

      setMobileTab("console");
      showToast("Solution submitted & evaluated.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to evaluate answer right now.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const runCode = async () => {
    try {
      setRunningCode(true);
      const { data } = await api.post(
        "/code/run",
        { code: answer, language, stdin },
        { timeout: 25000 }
      );
      setFeedback((current) => ({
        ...current,
        codeOutput: data.output,
        codeStatus: data.status
      }));
      setMobileTab("console");
      showToast("Code executed successfully.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Execution failed.", "error");
    } finally {
      setRunningCode(false);
    }
  };

  const toggleBookmark = async () => {
    if (!question) return;
    try {
      await api.post(`/users/bookmarks/${question._id}`, {}, { timeout: 25000 });
      await refreshBookmarks?.();
      showToast(isBookmarked ? "Removed from saved." : "Saved problem.", "success");
    } catch {
      showToast("Unable to update bookmark.", "error");
    }
  };

  const moveQuestion = (direction) => {
    if (!questions.length || currentIndex < 0) return;
    const nextIndex =
      direction === "next"
        ? (currentIndex + 1) % questions.length
        : currentIndex > 0
        ? currentIndex - 1
        : questions.length - 1;
    const nextQ = questions[nextIndex];
    if (nextQ) {
      navigate(`/practice/${nextQ._id}`);
    }
  };

  const timeElapsed = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
  const detailedSolution = question
    ? buildDetailedSolution(
        question,
        feedback?.correctAnswer || question.correctAnswer,
        feedback?.explanation || question.explanation
      )
    : "";

  // If no questionId was passed in route, redirect or prompt user to explore problems
  if (!questionId) {
    return (
      <div className="space-y-6">
        <EmptyState
          title="No problem selected"
          description="Choose a problem from the Problem Explorer to start your coding session."
          action={
            <Link to="/questions">
              <Button variant="primary" size="md">
                Browse Problem Explorer
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (!question && loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center text-xs text-slate-500 animate-pulse">
        Loading problem workspace...
      </div>
    );
  }

  if (!question) {
    return (
      <div className="py-12">
        <EmptyState
          title="Problem not found"
          description="The selected problem is not available in the question bank."
          action={
            <Link to="/questions">
              <Button variant="primary" size="sm">
                Back to Explorer
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-[calc(100vh-5rem)] rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] overflow-hidden shadow-subtle dark:border-slate-800 ${isFullscreen ? "!fixed !inset-0 !z-50 !h-screen !rounded-none" : ""}`}>
      {/* 1. Top Navigation Bar */}
      <CodingHeader
        question={question}
        onBack={() => navigate("/questions")}
        isBookmarked={isBookmarked}
        onToggleBookmark={toggleBookmark}
        onPrev={() => moveQuestion("prev")}
        onNext={() => moveQuestion("next")}
        hasPrev={questions.length > 1}
        hasNext={questions.length > 1}
        timeElapsed={timeElapsed}
        currentIndex={currentIndex}
        totalCount={questions.length}
      />

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden border-b border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => setMobileTab("problem")}
          className={`flex-1 py-2 font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
            mobileTab === "problem"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500"
          }`}
        >
          <FiFileText className="h-3.5 w-3.5" />
          <span>Problem</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-2 font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
            mobileTab === "editor"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500"
          }`}
        >
          <FiCode className="h-3.5 w-3.5" />
          <span>Editor</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("console")}
          className={`flex-1 py-2 font-semibold flex items-center justify-center gap-1.5 border-b-2 transition ${
            mobileTab === "console"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
              : "border-transparent text-slate-500"
          }`}
        >
          <FiTerminal className="h-3.5 w-3.5" />
          <span>Console</span>
        </button>
      </div>

      {/* 2. Main Coding Workspace */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Column: Problem Details Panel */}
        <div
          className={`h-full overflow-hidden border-r border-[var(--snx-border)] dark:border-slate-800 ${
            mobileTab !== "problem" ? "hidden md:block" : "block"
          }`}
        >
          <ProblemDescriptionPanel
            question={question}
            solutionText={detailedSolution}
          />
        </div>

        {/* Right Column: Code Editor & Console Workspace */}
        <div
          className={`h-full flex flex-col overflow-hidden ${
            mobileTab === "problem" ? "hidden md:flex" : "flex"
          }`}
        >
          {question.type === "Coding" ? (
            <>
              {/* Top Half: Code Editor */}
              <div
                className={`flex-1 min-h-[50%] overflow-hidden ${
                  mobileTab === "console" ? "hidden md:block" : "block"
                }`}
              >
                <CodeEditorPanel
                  code={answer}
                  onChange={setAnswer}
                  language={language}
                  onLanguageChange={setLanguage}
                  onResetCode={resetToStarterCode}
                  onRun={runCode}
                  onSubmit={submit}
                  running={runningCode}
                  submitting={submitting || evalLoading}
                  explanation={codingExplanation}
                  onExplanationChange={setCodingExplanation}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
                />
              </div>

              {/* Bottom Half: Test Console */}
              <div
                className={`h-48 md:h-56 shrink-0 overflow-hidden ${
                  mobileTab === "editor" ? "hidden md:block" : "block"
                }`}
              >
                <TestConsolePanel
                  codeOutput={feedback?.codeOutput || ""}
                  codeStatus={feedback?.codeStatus || ""}
                  stdin={stdin}
                  onStdinChange={setStdin}
                  feedback={feedback}
                  evaluation={evaluation}
                  onNextProblem={() => moveQuestion("next")}
                />
              </div>
            </>
          ) : question.type === "MCQ" ? (
            /* MCQ Question Format */
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                Select the correct option
              </h3>
              <div className="space-y-3 max-w-xl">
                {(question.options || []).map((option) => {
                  const selected = answer === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setAnswer(option)}
                      className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition duration-150 flex items-center justify-between ${
                        selected
                          ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-200 shadow-subtle"
                          : "border-[var(--snx-border)] bg-[var(--snx-surface)] text-slate-800 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300"
                      }`}
                    >
                      <span>{option}</span>
                      {selected && <FiCheck className="h-4 w-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={submit}
                  loading={submitting || evalLoading}
                  disabled={!answer}
                  icon={FiSend}
                >
                  Submit Answer
                </Button>
              </div>

              {feedback && (
                <div className="mt-4 p-4 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-xs dark:border-slate-800">
                  <span className={`font-bold ${feedback.isCorrect ? "text-emerald-600" : "text-rose-600"}`}>
                    {feedback.isCorrect ? "✓ Correct Answer!" : "✕ Incorrect"}
                  </span>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">{feedback.explanation}</p>
                </div>
              )}
            </div>
          ) : (
            /* Subjective / Descriptive Question Format */
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
                Your Answer & Technical Explanation
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your comprehensive explanation, trade-offs, and examples here..."
                className="w-full h-64 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-4 text-sm text-slate-800 outline-none focus:border-indigo-500 transition dark:border-slate-800 dark:text-slate-200"
              />

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={submit}
                  loading={submitting || evalLoading}
                  disabled={!answer.trim()}
                  icon={FiSend}
                >
                  Submit for AI Evaluation
                </Button>
              </div>

              {feedback && (
                <div className="mt-4 p-4 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-xs dark:border-slate-800">
                  <p className="font-bold text-slate-900 dark:text-white mb-1">Evaluation & Feedback:</p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feedback.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
