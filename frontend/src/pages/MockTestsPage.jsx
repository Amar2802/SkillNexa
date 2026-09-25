import { useEffect, useMemo, useRef, useState } from "react";
import { FiPlus, FiClock, FiCheckCircle, FiTarget, FiZap, FiLayers } from "react-icons/fi";
import api from "../api/client";
import {
  TestCard,
  TestInstructionsModal,
  ActiveTestInterface,
  TestResultsView
} from "../components/mockTests";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { useToast } from "../components/ui/ToastProvider";
import { submitAnswerEvaluation } from "../services/evaluationService";

export const MockTestsPage = ({
  tests = [],
  refreshTests,
  refreshProfile,
  refreshHistory
}) => {
  const { showToast } = useToast();

  const [activeTest, setActiveTest] = useState(null);
  const [selectedInstructionTest, setSelectedInstructionTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const autoSubmittedRef = useRef(false);

  const [evaluationByQuestionId, setEvaluationByQuestionId] = useState({});
  const [evaluationLoadingByQuestionId, setEvaluationLoadingByQuestionId] = useState({});

  // Timer Countdown Effect
  useEffect(() => {
    if (!activeTest || submitting) return undefined;

    if (remainingSeconds <= 0) {
      if (!autoSubmittedRef.current) {
        autoSubmittedRef.current = true;
        void submitTest(true);
      }
      return undefined;
    }

    const timerId = setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timerId);
  }, [activeTest, remainingSeconds, submitting]);

  const generateTest = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/tests", {});
      await refreshTests?.().catch(() => undefined);
      showToast("Fresh mock test generated.", "success");
      setSelectedInstructionTest(data);
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to generate mock test.", "error");
    } finally {
      setLoading(false);
    }
  };

  const startTestFromInstructions = () => {
    if (!selectedInstructionTest) return;
    const testToStart = selectedInstructionTest;
    setSelectedInstructionTest(null);
    setAnswers({});
    setResult(null);
    setEvaluationByQuestionId({});
    setEvaluationLoadingByQuestionId({});
    setActiveTest(testToStart);
    setRemainingSeconds((testToStart.duration || 30) * 60);
    autoSubmittedRef.current = false;
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const submitTest = async (autoSubmit = false) => {
    if (!activeTest || submitting) return;

    try {
      setSubmitting(true);
      const totalDurationSeconds = (activeTest.duration || 30) * 60;
      const spentSeconds = Math.max(0, totalDurationSeconds - remainingSeconds);

      const payload = Object.entries(answers).map(([questionId, submittedAnswer]) => ({
        questionId,
        submittedAnswer,
        timeSpent: 0
      }));

      const { data } = await api.post(`/tests/${activeTest._id}/submit`, {
        answers: payload,
        totalTimeSpent: spentSeconds
      });

      setResult({ ...data, autoSubmitted: autoSubmit });

      // Run AI evaluation in background for each question
      (data?.answers || []).forEach((entry) => {
        const question = entry?.question;
        if (!question || typeof question !== "object") return;

        setEvaluationLoadingByQuestionId((current) => ({ ...current, [question._id]: true }));
        void submitAnswerEvaluation({
          questionId: question._id,
          question: `${question.title}. ${question.description || ""}`,
          userAnswer: String(entry.submittedAnswer || ""),
          topic: question.topic,
          difficulty: question.difficulty,
          interviewType: "mock-interview",
          module: "mock-test"
        })
          .then((evaluation) => {
            setEvaluationByQuestionId((current) => ({ ...current, [question._id]: evaluation }));
          })
          .catch(() => undefined)
          .finally(() => {
            setEvaluationLoadingByQuestionId((current) => ({ ...current, [question._id]: false }));
          });
      });

      setActiveTest(null);
      setAnswers({});
      setRemainingSeconds(0);
      refreshProfile?.();
      refreshHistory?.();
      showToast(
        autoSubmit ? "Time expired! Test auto-submitted." : "Test submitted successfully.",
        "success"
      );
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to submit test.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const availableTests = useMemo(() => {
    if (categoryFilter === "all") return tests;
    return tests.filter((t) =>
      (t.sections || []).some((s) => s.category?.toLowerCase() === categoryFilter.toLowerCase())
    );
  }, [tests, categoryFilter]);

  // 1. If currently in an Active Test, show full-screen focused interface
  if (activeTest) {
    return (
      <ActiveTestInterface
        test={activeTest}
        remainingSeconds={remainingSeconds}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        onSubmit={submitTest}
        submitting={submitting}
      />
    );
  }

  // 2. If viewing a Test Result
  if (result) {
    return (
      <PageContainer
        title="Assessment Results"
        description="Detailed score analysis, strengths, weaknesses, and question reviews."
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setResult(null)}
          >
            Back to Assessment Hub
          </Button>
        }
      >
        <TestResultsView
          result={result}
          evaluationByQuestionId={evaluationByQuestionId}
          evaluationLoadingByQuestionId={evaluationLoadingByQuestionId}
          onRetakeTest={() => {
            setResult(null);
            generateTest();
          }}
        />
      </PageContainer>
    );
  }

  // 3. Default: Assessment Hub / Test Listing
  return (
    <PageContainer
      title="Mock Tests"
      description="Test your software engineering knowledge under real timed interview conditions."
      actions={
        <Button
          variant="primary"
          size="md"
          onClick={generateTest}
          loading={loading}
          icon={FiPlus}
        >
          Generate New Test
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Quick Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Format
            </span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Balanced 30 Qs
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Algorithms, Core CS & Aptitude</p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Duration
            </span>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              30 Minutes
            </div>
            <p className="text-xs text-slate-500 mt-0.5">~1 minute pacing per question</p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Grading & AI Feedback
            </span>
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              Instant Analysis
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Deep answer evaluations & weak spots</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: "all", label: "All Tests" },
            { id: "dsa", label: "Algorithms (DSA)" },
            { id: "core subjects", label: "Core CS & Systems" },
            { id: "aptitude", label: "Quantitative Aptitude" },
            { id: "hr", label: "Behavioral & HR" }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`rounded-lg px-3 py-1.5 font-medium transition whitespace-nowrap ${
                categoryFilter === cat.id
                  ? "bg-indigo-600 text-white shadow-subtle font-semibold"
                  : "bg-[var(--snx-surface)] border border-[var(--snx-border)] text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Test Cards Grid */}
        {availableTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTests.map((test, index) => (
              <TestCard
                key={test._id || index}
                test={test}
                isRecommended={index === 0}
                onStart={(t) => setSelectedInstructionTest(t)}
                loading={loading}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Ready for your first mock test?"
            description="Generate a fresh software assessment covering algorithms, system concepts, and aptitude."
            action={
              <Button
                variant="primary"
                size="md"
                onClick={generateTest}
                loading={loading}
                icon={FiPlus}
              >
                Generate Mock Test
              </Button>
            }
          />
        )}
      </div>

      {/* Instructions Modal */}
      <TestInstructionsModal
        isOpen={Boolean(selectedInstructionTest)}
        onClose={() => setSelectedInstructionTest(null)}
        test={selectedInstructionTest}
        onStart={startTestFromInstructions}
        loading={loading}
      />
    </PageContainer>
  );
};

export default MockTestsPage;
