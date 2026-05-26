import { useEffect, useMemo, useRef, useState } from "react";
import { FiClock, FiRefreshCw, FiZap } from "react-icons/fi";
import api from "../api/client";
import AnswerAnalysisBlock from "../components/AnswerAnalysisBlock";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import SurfaceCard from "../components/ui/SurfaceCard";
import { useToast } from "../components/ui/ToastProvider";
import { fetchAnswerAnalysis } from "../services/answerAnalysisService";

const formatTimer = (seconds) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const MockTestsPage = ({ refreshTests, refreshProfile, refreshHistory }) => {
  const { showToast } = useToast();
  const [activeTest, setActiveTest] = useState(null);
  const [pendingTest, setPendingTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [generationError, setGenerationError] = useState("");
  const autoSubmittedRef = useRef(false);
  const [analysisByQuestionId, setAnalysisByQuestionId] = useState({});
  const [analysisLoadingByQuestionId, setAnalysisLoadingByQuestionId] = useState({});

  const questionCount = useMemo(() => activeTest ? activeTest.sections.flatMap((section) => section.questions).length : 0, [activeTest]);
  const pendingQuestionCount = useMemo(() => pendingTest ? pendingTest.sections.flatMap((section) => section.questions).length : 0, [pendingTest]);

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
      setGenerationError("");
      const { data } = await api.post("/tests", {});
      setPendingTest(data);
      setActiveTest(null);
      setAnswers({});
      setResult(null);
      setAnalysisByQuestionId({});
      setAnalysisLoadingByQuestionId({});
      setRemainingSeconds(0);
      autoSubmittedRef.current = false;
      await refreshTests?.().catch(() => undefined);
      showToast("Mock test generated successfully.", "success");
    } catch (error) {
      if (error?.response?.status === 401) {
        return;
      }
      setGenerationError(error.response?.data?.message || "Unable to generate a mock test right now.");
      showToast(error.response?.data?.message || "Unable to generate a mock test right now.", "error");
    } finally {
      setLoading(false);
    }
  };

  const startPendingTest = () => {
    if (!pendingTest) return;
    setActiveTest(pendingTest);
    setPendingTest(null);
    setAnswers({});
    setResult(null);
    setRemainingSeconds((pendingTest.duration || 30) * 60);
    autoSubmittedRef.current = false;
  };

  const requestQuestionAnalysis = async (question) => {
    const userAnswer = answers[question._id];
    if (!String(userAnswer || "").trim()) return;

    setAnalysisLoadingByQuestionId((current) => ({ ...current, [question._id]: true }));
    try {
      const data = await fetchAnswerAnalysis({
        questionId: question._id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        topic: question.topic
      });
      setAnalysisByQuestionId((current) => ({ ...current, [question._id]: data }));
    } catch {
      setAnalysisByQuestionId((current) => ({ ...current, [question._id]: null }));
    } finally {
      setAnalysisLoadingByQuestionId((current) => ({ ...current, [question._id]: false }));
    }
  };

  const submitTest = async (autoSubmit = false) => {
    if (!activeTest || submitting) return;

    try {
      setSubmitting(true);
      const totalDurationSeconds = (activeTest.duration || 30) * 60;
      const spentSeconds = Math.max(0, totalDurationSeconds - remainingSeconds);
      const payload = Object.entries(answers).map(([questionId, submittedAnswer]) => ({ questionId, submittedAnswer, timeSpent: 0 }));
      const { data } = await api.post(`/tests/${activeTest._id}/submit`, { answers: payload, totalTimeSpent: spentSeconds });
      setResult({ ...data, autoSubmitted });
      (data?.answers || []).forEach((entry) => {
        const question = entry?.question;
        if (!question || typeof question !== "object") return;
        setAnalysisLoadingByQuestionId((current) => ({ ...current, [question._id]: true }));
        void fetchAnswerAnalysis({
          questionId: question._id,
          userAnswer: entry.submittedAnswer,
          correctAnswer: question.correctAnswer,
          topic: question.topic
        }).then((analysis) => {
          setAnalysisByQuestionId((current) => ({ ...current, [question._id]: analysis }));
        }).catch(() => undefined).finally(() => {
          setAnalysisLoadingByQuestionId((current) => ({ ...current, [question._id]: false }));
        });
      });
      setActiveTest(null);
      setPendingTest(null);
      setAnswers({});
      setRemainingSeconds(0);
      refreshProfile?.();
      refreshHistory?.();
      showToast(autoSubmit ? "Mock test auto-submitted." : "Mock test submitted successfully.", "success");
    } catch (error) {
      if (error?.response?.status === 401) {
        return;
      }
      showToast(error.response?.data?.message || "Unable to submit the mock test right now.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Mock interview tests"
        title="Run timed software mock tests with clean pacing and production-style review."
        description="Generate a balanced software round across DSA, aptitude, HR, and core subjects, then review your answer quality with structured post-test analysis."
        actions={(
          <button className="snx-btn-accent" onClick={generateTest} disabled={loading}>
            {loading ? "Generating..." : "Generate Mock Test"}
          </button>
        )}
        aside={(
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {[
              { label: "Format", value: "30 Q mix" },
              { label: "Timer", value: activeTest ? formatTimer(remainingSeconds) : "Adaptive" },
              { label: "Mode", value: activeTest ? "Live" : pendingTest ? "Ready" : "Idle" }
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</div>
                <div className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</div>
              </div>
            ))}
          </div>
        )}
      />

      {loading && !pendingTest && !activeTest ? (
        <SurfaceCard strong>
          <div className="flex items-center gap-3 text-slate-700">
            <FiZap className="h-5 w-5 text-brand-600" />
            <div>
              <div className="font-semibold">Generating your mock test...</div>
              <div className="mt-1 text-sm text-slate-500">Preparing a balanced question set from your software interview bank.</div>
            </div>
          </div>
        </SurfaceCard>
      ) : null}

      {generationError ? (
        <SurfaceCard strong>
          <div className="text-sm font-medium text-rose-700">{generationError}</div>
        </SurfaceCard>
      ) : null}

      {pendingTest ? (
        <SurfaceCard strong className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="snx-kicker">Generated test</span>
              <h2 className="snx-heading mt-4">{pendingTest.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">Your software mock is ready. Review the format and start when you are ready.</p>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-950 px-5 py-4 text-white">
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">Duration</div>
              <div className="mt-2 text-2xl font-semibold">{formatTimer((pendingTest.duration || 30) * 60)}</div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Questions</div>
              <div className="mt-2 text-3xl font-semibold text-slate-950">{pendingQuestionCount}</div>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Duration</div>
              <div className="mt-2 text-3xl font-semibold text-slate-950">{pendingTest.duration || 30} mins</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="snx-btn-accent" onClick={startPendingTest}>Start Test</button>
            <button className="snx-btn-secondary" onClick={generateTest} disabled={loading}>
              <FiRefreshCw className="h-4 w-4" />
              {loading ? "Generating..." : "Regenerate"}
            </button>
          </div>
        </SurfaceCard>
      ) : null}

      {activeTest ? (
        <SurfaceCard strong className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="snx-heading">{activeTest.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Answer each question and submit any time, or let the test auto-submit when the timer reaches zero.
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-950 px-5 py-4 text-white">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
                <FiClock className="h-4 w-4" />
                Time left
              </div>
              <div className="mt-2 text-2xl font-semibold">{formatTimer(remainingSeconds)}</div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Questions</div>
              <div className="mt-2 text-3xl font-semibold text-slate-950">{questionCount}</div>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Duration</div>
              <div className="mt-2 text-3xl font-semibold text-slate-950">{activeTest.duration || 30} mins</div>
            </div>
          </div>

          <div className="space-y-4">
            {activeTest.sections.flatMap((section) => section.questions).map((question, index) => (
              <div key={question._id} className="rounded-[28px] border border-slate-200/70 bg-white/80 p-5">
                <div className="mb-4 flex items-start gap-4">
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-slate-950">{question.title.replace(/\s+Practice Variant\s+\d+$/i, "")}</h3>
                    <p className="mt-2 text-sm text-slate-500">{String(question.description).replace(/\s*Practice focus\s*\d*:\s*.+$/i, "").trim()}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="snx-badge">{question.category}</span>
                      <span className="snx-badge">{question.topic}</span>
                      <span className="snx-badge">{question.type}</span>
                    </div>
                  </div>
                </div>

                {question.type === "MCQ" ? (
                  <div className="grid gap-2">
                    {(question.options || []).map((option) => (
                      <button key={option} className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                        answers[question._id] === option
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50"
                      }`} onClick={() => setAnswers((current) => ({ ...current, [question._id]: option }))}>{option}</button>
                    ))}
                  </div>
                ) : (
                  <textarea
                    className="snx-textarea min-h-[150px]"
                    value={answers[question._id] || ""}
                    onChange={(event) => setAnswers((current) => ({ ...current, [question._id]: event.target.value }))}
                    placeholder={question.type === "Coding" ? "Write code or your approach here..." : "Write your answer here..."}
                  />
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="snx-btn-secondary"
                    onClick={() => requestQuestionAnalysis(question)}
                    disabled={!String(answers[question._id] || "").trim() || analysisLoadingByQuestionId[question._id]}
                  >
                    {analysisLoadingByQuestionId[question._id] ? "Analyzing..." : "Analyze Answer"}
                  </button>
                </div>
                <AnswerAnalysisBlock analysis={analysisByQuestionId[question._id]} loading={analysisLoadingByQuestionId[question._id]} />
              </div>
            ))}
          </div>

          <button className="snx-btn-accent" onClick={() => submitTest(false)} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Test"}
          </button>
        </SurfaceCard>
      ) : null}

      {result ? (
        <SurfaceCard strong className="space-y-6">
          <div>
            <span className="snx-kicker">Latest result</span>
            <h2 className="snx-heading mt-4">{result.autoSubmitted ? "Mock test auto-submitted when time ended" : "Mock test submitted successfully"}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-400">Score</div><div className="mt-2 text-3xl font-semibold text-slate-950">{result.score}</div></div>
            <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-400">Accuracy</div><div className="mt-2 text-3xl font-semibold text-slate-950">{result.accuracy}%</div></div>
            <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-400">Weak Topics</div><div className="mt-2 text-sm font-medium text-slate-700">{(result.weakTopics || []).join(", ") || "None"}</div></div>
            <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4"><div className="text-xs uppercase tracking-[0.18em] text-slate-400">Strengths</div><div className="mt-2 text-sm font-medium text-slate-700">{(result.strengths || []).join(", ") || "None"}</div></div>
          </div>
          <div className="space-y-4">
            {(result.answers || []).map((entry, index) => {
              const question = entry?.question;
              if (!question || typeof question !== "object") return null;
              return (
                <div key={question._id || index} className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
                  <h3 className="text-lg font-semibold text-slate-950">{question.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{String(entry.submittedAnswer || "No answer submitted")}</p>
                  <AnswerAnalysisBlock analysis={analysisByQuestionId[question._id]} loading={analysisLoadingByQuestionId[question._id]} />
                </div>
              );
            })}
          </div>
        </SurfaceCard>
      ) : null}

      {!activeTest && !pendingTest && !result ? (
        <EmptyState
          title="Ready for a fresh mock?"
          description="Generate a new software mock test to practice DSA, aptitude, HR, and core subjects in one polished round."
          action={<button className="snx-btn-accent" onClick={generateTest}>Generate Mock Test</button>}
        />
      ) : null}
    </div>
  );
};

export default MockTestsPage;
