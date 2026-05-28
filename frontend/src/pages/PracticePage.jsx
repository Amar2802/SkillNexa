import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { FiArrowLeft, FiArrowRight, FiBookmark, FiCode, FiPlay, FiSend } from "react-icons/fi";
import api from "../api/client";
import AnswerAnalysisBlock from "../components/AnswerAnalysisBlock";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import SurfaceCard from "../components/ui/SurfaceCard";
import { useToast } from "../components/ui/ToastProvider";
import { fetchAnswerAnalysis } from "../services/answerAnalysisService";
import { buildDetailedSolution } from "../utils/answerHelpers";

const typeOptions = [
  { id: "all", label: "All Questions" },
  { id: "Coding", label: "Coding" },
  { id: "Subjective", label: "Descriptive" },
  { id: "MCQ", label: "MCQ" }
];
const softwareCategoryOptions = ["DSA", "Aptitude", "Core Subjects", "HR", "Behavioral"];

const PracticePage = ({ questions = [], bookmarks = [], refreshBookmarks, targetField = "Software", loadQuestions }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { questionId } = useParams();
  const { showToast } = useToast();
  const params = new URLSearchParams(location.search);

  const [selectedCategory, setSelectedCategory] = useState(params.get("category") || "");
  const [selectedType, setSelectedType] = useState(params.get("type") || "all");
  const [search, setSearch] = useState(params.get("search") || "");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runningCode, setRunningCode] = useState(false);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [answerAnalysis, setAnswerAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

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

  useEffect(() => {
    const nextParams = new URLSearchParams();
    if (selectedCategory) nextParams.set("category", selectedCategory);
    if (selectedType && selectedType !== "all") nextParams.set("type", selectedType);
    if (search) nextParams.set("search", search);
    const nextSearch = nextParams.toString();
    const currentSearch = location.search.replace(/^\?/, "");
    if (nextSearch !== currentSearch) {
      navigate(`${questionId ? `/practice/${questionId}` : "/practice"}${nextSearch ? `?${nextSearch}` : ""}`, { replace: true });
    }
  }, [navigate, location.search, questionId, search, selectedCategory, selectedType]);

  const matchesCategory = (question, category) => {
    if (!category) return true;
    if (category === "Behavioral") {
      return question.category === "HR" && /behavioral/i.test(question.topic || "");
    }
    return question.category === category;
  };

  const filteredQuestions = useMemo(() => questions.filter((question) => {
    if (!matchesCategory(question, selectedCategory)) return false;
    if (selectedType !== "all" && question.type !== selectedType) return false;
    if (search) {
      const haystack = `${question.title} ${question.topic} ${question.description}`.toLowerCase();
      if (!haystack.includes(search.toLowerCase())) return false;
    }
    return true;
  }), [questions, search, selectedCategory, selectedType]);

  const question = useMemo(() => {
    if (!questionId) return null;
    return filteredQuestions.find((item) => item._id === questionId) || questions.find((item) => item._id === questionId) || null;
  }, [filteredQuestions, questionId, questions]);

  const navigationPool = questionId && filteredQuestions.length ? filteredQuestions : questions;
  const currentIndex = question ? navigationPool.findIndex((item) => item._id === question._id) : -1;
  const isBookmarked = bookmarks.some((item) => item._id === questionId);

  useEffect(() => {
    if (!question) return;
    setFeedback(null);
    setAnswerAnalysis(null);
    setAnalysisLoading(false);
    setStartedAt(Date.now());
    setAnswer(question.type === "Coding" ? question.starterCode?.[language] || "" : "");
  }, [question, language]);

  const openQuestion = (id) => {
    navigate(`/practice/${id}${location.search}`);
  };

  const goBackToList = () => {
    navigate(`/practice${location.search}`);
  };

  const loadAnswerAnalysis = async (payload) => {
    setAnalysisLoading(true);
    try {
      const data = await fetchAnswerAnalysis(payload);
      setAnswerAnalysis(data);
    } catch {
      setAnswerAnalysis(null);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const submit = async () => {
    if (!question) return;
    try {
      setSubmitting(true);
      const { data } = await api.post(`/questions/${question._id}/evaluate`, {
        answer,
        timeSpent: Math.round((Date.now() - startedAt) / 1000)
      }, { timeout: 25000 });
      setFeedback(data);
      showToast("Answer evaluated successfully.", "success");
      void loadAnswerAnalysis({
        questionId: question._id,
        userAnswer: answer,
        correctAnswer: data.correctAnswer,
        topic: question.topic
      });
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to evaluate your answer right now.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const runCode = async () => {
    try {
      setRunningCode(true);
      const { data } = await api.post("/code/run", { code: answer, language }, { timeout: 25000 });
      setFeedback((current) => ({ ...current, codeOutput: data.output, codeStatus: data.status }));
      showToast("Code executed successfully.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to run code right now.", "error");
    } finally {
      setRunningCode(false);
    }
  };

  const toggleBookmark = async () => {
    if (!question) return;
    try {
      await api.post(`/users/bookmarks/${question._id}`, {}, { timeout: 25000 });
      await refreshBookmarks?.();
      showToast(isBookmarked ? "Removed from bookmarks." : "Added to bookmarks.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to update bookmarks right now.", "error");
    }
  };

  const moveQuestion = (direction) => {
    if (!navigationPool.length || currentIndex < 0) return;
    const nextIndex = direction === "next"
      ? (currentIndex + 1) % navigationPool.length
      : currentIndex > 0 ? currentIndex - 1 : navigationPool.length - 1;
    const nextQuestion = navigationPool[nextIndex];
    if (nextQuestion) {
      navigate(`/practice/${nextQuestion._id}${location.search}`);
    }
  };

  const detailedSolution = question
    ? buildDetailedSolution(question, feedback?.correctAnswer || question.correctAnswer, feedback?.explanation || question.explanation)
    : "";

  if (!questionId) {
    return (
      <div className="space-y-6">
        <PageHeader
          kicker="Practice workspace"
          title="Choose a question and move through practice with a focused workflow."
          description="Filter by category, search by topic, then open a dedicated practice screen with bookmark, previous, and next controls."
          aside={(
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {[
                { label: "Filtered", value: filteredQuestions.length },
                { label: "Mode", value: selectedType === "all" ? "Mixed" : selectedType },
                { label: "Field", value: targetField }
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</div>
                  <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{item.value}</div>
                </div>
              ))}
            </div>
          )}
        />

        <div className="snx-panel-muted">
          <div className="grid gap-4 lg:grid-cols-3">
            <label className="block space-y-2">
              <span className="snx-label">Search</span>
              <input className="snx-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="By topic or title" />
            </label>
            <label className="block space-y-2">
              <span className="snx-label">Category</span>
              <select className="snx-select" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                <option value="">All Categories</option>
                {softwareCategoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="snx-label">Type</span>
              <select className="snx-select" value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
                {typeOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
          </div>
        </div>

        {loading && !filteredQuestions.length ? (
          <SurfaceCard><p className="text-sm text-slate-custom-600">Loading questions...</p></SurfaceCard>
        ) : filteredQuestions.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredQuestions.map((item, index) => (
              <button
                key={item._id}
                className="rounded-[28px] border border-slate-200/70 bg-white/80 p-5 text-left shadow-[0_18px_44px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_20px_50px_rgba(20,184,166,0.12)]"
                onClick={() => openQuestion(item._id)}
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-slate-950">{item.title.replace(/\s+Practice Variant\s+\d+$/i, "")}</div>
                    <p className="mt-2 text-sm text-slate-500">{item.topic} • {item.type} • {item.difficulty}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No questions match this filter set"
            description="Try widening the topic or switching back to a mixed mode so you can continue practicing without friction."
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="snx-panel-muted space-y-6">
        {question ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <button className="snx-btn-secondary snx-btn-sm" onClick={goBackToList}>
                  <FiArrowLeft className="h-4 w-4" />
                  Back to List
                </button>
                <div>
                  <span className="snx-kicker">Practice question</span>
                  <h1 className="snx-heading-3 mt-2 text-slate-custom-900">{question.title.replace(/\s+Practice Variant\s+\d+$/i, "")}</h1>
                  <p className="mt-2 snx-body text-slate-custom-600">{String(question.description).replace(/\s*Practice focus\s*\d*:\s*.+$/i, "").trim()}</p>
                </div>
              </div>
              <button className={isBookmarked ? "snx-btn-primary" : "snx-btn-secondary"} onClick={toggleBookmark}>
                <FiBookmark className="h-4 w-4" />
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="snx-badge-primary text-xs">{question.category}</span>
              <span className="snx-badge text-xs">{question.topic}</span>
              <span className="snx-badge text-xs">{question.company}</span>
              <span className="snx-badge text-xs">{question.type}</span>
              <span className="snx-badge text-xs">{question.difficulty}</span>
            </div>

            {question.type === "MCQ" ? (
              <div className="grid gap-3">
                {(question.options || []).map((option) => (
                  <button
                    key={option}
                    className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${
                      answer === option
                        ? "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-md-soft"
                        : "border-slate-custom-200 bg-white text-slate-custom-700 hover:border-indigo-200 hover:bg-indigo-50"
                    }`}
                    onClick={() => setAnswer((current) => (current === option ? "" : option))}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}

            {question.type === "Subjective" ? (
              <textarea
                className="snx-textarea min-h-[240px]"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Write your answer here..."
              />
            ) : null}

            {question.type === "Coding" ? (
              <div className="space-y-4">
                <label className="block max-w-xs space-y-2">
                  <span className="snx-label">Language</span>
                  <select className="snx-select" value={language} onChange={(event) => setLanguage(event.target.value)}>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                  </select>
                </label>
                <div className="overflow-hidden rounded-lg border border-slate-custom-200 shadow-md-soft">
                  <Editor
                    height="420px"
                    theme="vs-dark"
                    language={language === "cpp" ? "cpp" : language}
                    value={answer}
                    onChange={(value) => setAnswer(value || "")}
                  />
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
              <button className="snx-btn-secondary" onClick={() => moveQuestion("prev")}>
                <FiArrowLeft className="h-4 w-4" />
                Previous
              </button>
              <button className="snx-btn-primary" onClick={submit} disabled={submitting}>
                <FiSend className="h-4 w-4" />
                {submitting ? "Submitting..." : "Submit"}
              </button>
              {question.type === "Coding" ? (
                <button className="snx-btn-secondary" onClick={runCode} disabled={runningCode}>
                  <FiPlay className="h-4 w-4" />
                  {runningCode ? "Running..." : "Run Code"}
                </button>
              ) : null}
              <button className="snx-btn-secondary" onClick={() => moveQuestion("next")}>
                Next
                <FiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <EmptyState
            title="Question not available"
            description="Go back and select another question from the filtered set."
            action={<button className="snx-btn-primary" onClick={goBackToList}>Back to List</button>}
          />
        )}
      </div>

      {feedback && question ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="snx-panel-muted space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-custom-200 bg-white p-4">
                <div className="snx-label">Your answer</div>
                <p className="mt-2 snx-body-sm text-slate-custom-600">{String(answer || "No answer submitted")}</p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="snx-label text-emerald-700">Correct answer</div>
                <p className="mt-2 snx-body-sm text-emerald-900">{String(feedback.correctAnswer)}</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-custom-200 bg-white p-4">
              <div className="snx-label">Detailed solution</div>
              <p className="mt-2 snx-body-sm text-slate-custom-600">{detailedSolution}</p>
            </div>
            <div className="rounded-lg border border-slate-custom-200 bg-white p-4">
              <div className="snx-label">Explanation</div>
              <p className="mt-2 snx-body-sm text-slate-custom-600">{feedback.explanation}</p>
            </div>
            {feedback.codeOutput ? (
              <div className="overflow-hidden rounded-lg border border-slate-custom-200 bg-slate-custom-900">
                <div className="border-b border-slate-custom-700 px-4 py-3">
                  <span className="snx-label inline-flex items-center gap-2 text-white"><FiCode className="h-4 w-4" /> {feedback.codeStatus}</span>
                </div>
                <pre className="snx-scrollbar overflow-x-auto px-4 py-4 text-sm text-slate-100"><code>{feedback.codeOutput}</code></pre>
              </div>
            ) : null}
          </div>
          <aside className="snx-card space-y-4 lg:h-fit lg:sticky lg:top-6">
            <div>
              <div className="snx-label">Question progress</div>
              <div className="mt-3 h-3 w-full rounded-full bg-slate-custom-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%` }}
                />
              </div>
              <p className="mt-3 snx-body-sm text-slate-custom-600">
                Question {currentQuestionIndex + 1} of {allQuestions.length}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-slate-custom-100 px-3 py-2">
                <span className="snx-label">Accuracy</span>
                <span className="text-sm font-semibold text-indigo-600">{accuracy}%</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-custom-100 px-3 py-2">
                <span className="snx-label">Your result</span>
                <span className="text-sm font-semibold text-emerald-600">{feedback ? (feedback.isCorrect ? "✓ Correct" : "✗ Incorrect") : "Pending"}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-custom-100 px-3 py-2">
                <span className="snx-label">Time</span>
                <span className="text-sm font-semibold text-slate-custom-700">{formatTime(timeElapsed)}</span>
              </div>
            </div>
            <button className="w-full snx-btn-secondary" onClick={goBackToList}>
              <FiArrowLeft className="h-4 w-4" />
              Exit Practice
            </button>
            <AnswerAnalysisBlock analysis={answerAnalysis} loading={analysisLoading} />
        </div>
      ) : null}
    </div>
  );
};

export default PracticePage;
