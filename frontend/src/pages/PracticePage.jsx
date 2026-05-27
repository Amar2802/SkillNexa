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

        <SurfaceCard strong>
          <div className="grid gap-4 lg:grid-cols-3">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Search</span>
              <input className="snx-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by topic or title" />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Category</span>
              <select className="snx-select" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                <option value="">All Categories</option>
                {softwareCategoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Question Type</span>
              <select className="snx-select" value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
                {typeOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
          </div>
        </SurfaceCard>

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
    <div className="space-y-6">
      <SurfaceCard strong className="space-y-6">
        {question ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-3">
                <button className="snx-btn-secondary" onClick={goBackToList}>
                  <FiArrowLeft className="h-4 w-4" />
                  Back to Question List
                </button>
                <div>
                  <span className="snx-kicker">Practice question</span>
                  <h1 className="snx-heading mt-4">{question.title.replace(/\s+Practice Variant\s+\d+$/i, "")}</h1>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{String(question.description).replace(/\s*Practice focus\s*\d*:\s*.+$/i, "").trim()}</p>
                </div>
              </div>
              <button className={isBookmarked ? "snx-btn-accent" : "snx-btn-secondary"} onClick={toggleBookmark}>
                <FiBookmark className="h-4 w-4" />
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="snx-badge snx-label">{question.category}</span>
              <span className="snx-badge snx-label">{question.topic}</span>
              <span className="snx-badge snx-label">{question.company}</span>
              <span className="snx-badge snx-label">{question.type}</span>
              <span className="snx-badge snx-label">{question.difficulty}</span>
            </div>

            {question.type === "MCQ" ? (
              <div className="grid gap-3">
                {(question.options || []).map((option) => (
                  <button
                    key={option}
                    className={`rounded-[22px] border px-4 py-4 text-left text-sm font-medium transition ${
                      answer === option
                        ? "border-brand-500 bg-brand-500 text-white shadow-[0_18px_36px_rgba(20,184,166,0.22)]"
                        : "border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50"
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
                  <span className="text-sm font-medium text-slate-700">Language</span>
                  <select className="snx-select" value={language} onChange={(event) => setLanguage(event.target.value)}>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                  </select>
                </label>
                <div className="overflow-hidden rounded-[28px] border border-slate-200/70 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
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

            <div className="flex flex-col gap-4 md:flex-row md:gap-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <button className="snx-btn-secondary h-12 px-6" onClick={() => moveQuestion("prev")}>
                  <FiArrowLeft className="h-4 w-4" />
                  Previous
                </button>
                <button className="snx-btn-primary h-12 px-6" onClick={submit} disabled={submitting}>
                  <FiSend className="h-4 w-4" />
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
              {question.type === "Coding" ? (
                <button className="snx-btn-secondary h-12 px-6" onClick={runCode} disabled={runningCode}>
                  <FiPlay className="h-4 w-4" />
                  {runningCode ? "Running..." : "Run Code"}
                </button>
              ) : null}
              <button className="snx-btn-secondary h-12 px-6" onClick={() => moveQuestion("next")}>
                Next
                <FiArrowRight className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <EmptyState
            title="This question is not available in the current filter set"
            description="Go back to the practice list and reopen another question from the filtered collection."
            action={<button className="snx-btn-accent" onClick={goBackToList}>Back to Question List</button>}
          />
        )}
      </SurfaceCard>

      {feedback && question ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <SurfaceCard strong className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Your answer</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{String(answer || "No answer submitted")}</p>
              </div>
              <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/70 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Correct answer</div>
                <p className="mt-3 text-sm leading-7 text-emerald-900">{String(feedback.correctAnswer)}</p>
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Detailed solution</div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{detailedSolution}</p>
            </div>
            <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Explanation</div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{feedback.explanation}</p>
            </div>
            {feedback.codeOutput ? (
              <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-950">
                <div className="border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  <span className="inline-flex items-center gap-2"><FiCode className="h-4 w-4" /> {feedback.codeStatus}</span>
                </div>
                <pre className="snx-scrollbar overflow-x-auto px-4 py-4 text-sm text-slate-100"><code>{feedback.codeOutput}</code></pre>
              </div>
            ) : null}
          </SurfaceCard>

          <div className="space-y-6">
            <AnswerAnalysisBlock analysis={answerAnalysis} loading={analysisLoading} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PracticePage;
