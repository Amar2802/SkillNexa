import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { FiBookmark, FiFilter, FiSearch } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import api from "../api/client";
import AnswerEvaluationCard from "../components/evaluation/AnswerEvaluationCard";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import { useToast } from "../components/ui/ToastProvider";
import { submitAnswerEvaluation } from "../services/evaluationService";
import { buildDetailedSolution } from "../utils/answerHelpers";

const PAGE_SIZE = 18;
const typeOptions = [
  { id: "all", label: "All Questions" },
  { id: "Coding", label: "Coding" },
  { id: "Subjective", label: "Descriptive" },
  { id: "MCQ", label: "MCQ" }
];
const softwareCategoryOptions = ["DSA", "Aptitude", "Core Subjects", "HR", "Behavioral"];
const initialFilters = { category: "", difficulty: "", topic: "", company: "", search: "" };

const splitDisplay = (question) => {
  const title = (question.title || "Untitled Question").replace(/\s+Practice Variant\s+\d+$/i, "").trim();
  const descMatch = String(question.description || "").split(/Practice focus\s*\d*:\s*/i);
  const expMatch = String(question.explanation || "").split(/Practice note:\s*/i);
  return {
    title,
    description: (descMatch[0] || "").trim(),
    advice: descMatch[1]?.trim() || "",
    explanation: (expMatch[0] || question.explanation || "").trim()
  };
};

const SkeletonCard = () => (
  <div className="snx-card animate-pulse space-y-4">
    <div className="h-3 w-28 rounded-full bg-slate-200" />
    <div className="h-6 w-2/3 rounded-full bg-slate-200" />
    <div className="space-y-2">
      <div className="h-4 w-full rounded-full bg-slate-200" />
      <div className="h-4 w-5/6 rounded-full bg-slate-200" />
    </div>
  </div>
);

const QuestionBankPage = ({ questions = [], loadQuestions, defaultField = "Software", bookmarks = [], refreshBookmarks, refreshProfile }) => {
  const location = useLocation();
  const { showToast } = useToast();
  const loadMoreRef = useRef(null);
  const requestRef = useRef(0);
  const [filters, setFilters] = useState(initialFilters);
  const [type, setType] = useState("all");
  const deferredFilters = useDeferredValue(filters);
  const deferredType = useDeferredValue(type);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [openAnswers, setOpenAnswers] = useState({});
  const [bookmarkLoadingId, setBookmarkLoadingId] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [evaluationByQuestionId, setEvaluationByQuestionId] = useState({});
  const [evaluationLoadingByQuestionId, setEvaluationLoadingByQuestionId] = useState({});

  const sourceQuestions = questions.length ? questions : items;
  const bookmarkedIds = useMemo(() => new Set((bookmarks || []).map((item) => item._id)), [bookmarks]);
  const filterOptions = useMemo(() => ({
    category: softwareCategoryOptions,
    difficulty: [...new Set(sourceQuestions.map((question) => question.difficulty).filter(Boolean))].sort(),
    topic: [...new Set(sourceQuestions.map((question) => question.topic).filter(Boolean))].sort(),
    company: [...new Set(sourceQuestions.map((question) => question.company).filter(Boolean))].sort()
  }), [sourceQuestions]);
  const hasMore = page < totalPages;

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(Boolean).length + (type !== "all" ? 1 : 0),
    [filters, type]
  );

  const buildApiFilters = (nextFilters) => {
    const normalized = { ...nextFilters };
    if (normalized.category === "Behavioral") {
      normalized.category = "HR";
      if (!normalized.topic) normalized.topic = "Behavioral Interviews";
    }
    return normalized;
  };

  const matchesCategory = (question, selectedCategory) => {
    if (!selectedCategory) return true;
    if (selectedCategory === "Behavioral") {
      return question.category === "HR" && /behavioral/i.test(question.topic || "");
    }
    return question.category === selectedCategory;
  };

  const fetchQuestions = async (nextPage = 1, nextFilters = deferredFilters, nextType = deferredType, append = false) => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    append ? setLoadingMore(true) : setLoading(true);

    try {
      const params = {
        field: defaultField,
        paginated: true,
        page: nextPage,
        limit: PAGE_SIZE,
        ...buildApiFilters(nextFilters)
      };

      if (!params.category) delete params.category;
      if (!params.difficulty) delete params.difficulty;
      if (!params.topic) delete params.topic;
      if (!params.company) delete params.company;
      if (!params.search) delete params.search;
      if (nextType !== "all") params.type = nextType;

      const { data } = await api.get("/questions", { params, timeout: 25000 });
      if (requestRef.current !== requestId) return;

      const nextItems = data.items || [];
      setItems((current) => (
        append
          ? [...current, ...nextItems.filter((item) => !current.some((existing) => existing._id === item._id))]
          : nextItems
      ));
      setTotal(data.total || nextItems.length);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || nextPage);
    } catch {
      const fallback = await loadQuestions({
        ...buildApiFilters(nextFilters),
        limit: PAGE_SIZE * nextPage,
        type: nextType !== "all" ? nextType : undefined
      }).catch(() => []);

      if (requestRef.current !== requestId) return;

      const fallbackItems = (fallback || [])
        .filter((question) => matchesCategory(question, nextFilters.category))
        .filter((question) => !nextFilters.difficulty || question.difficulty === nextFilters.difficulty)
        .filter((question) => !nextFilters.topic || String(question.topic || "").toLowerCase().includes(nextFilters.topic.toLowerCase()))
        .filter((question) => !nextFilters.company || String(question.company || "").toLowerCase().includes(nextFilters.company.toLowerCase()))
        .filter((question) => nextType === "all" || question.type === nextType)
        .filter((question) => {
          if (!nextFilters.search) return true;
          const haystack = `${question.title} ${question.description} ${question.topic}`.toLowerCase();
          return haystack.includes(nextFilters.search.toLowerCase());
        });

      setItems(fallbackItems.slice(0, PAGE_SIZE * nextPage));
      setTotal(fallbackItems.length);
      setTotalPages(Math.max(1, Math.ceil(fallbackItems.length / PAGE_SIZE)));
      setPage(nextPage);
    } finally {
      if (requestRef.current === requestId) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  };

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setOpenAnswers({});
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setType("all");
    setOpenAnswers({});
  };

  const displayTitle = (question) => (question.title || "Untitled Question").replace(/\s+Practice Variant\s+\d+$/i, "").trim();

  const evaluateQuestionAnswer = async (question) => {
    const userAnswer = userAnswers[question._id];
    if (!String(userAnswer || "").trim()) {
      showToast("Write your answer before requesting AI evaluation.", "error");
      return;
    }
    setEvaluationLoadingByQuestionId((current) => ({ ...current, [question._id]: true }));
    try {
      const data = await submitAnswerEvaluation({
        questionId: question._id,
        question: `${displayTitle(question)}. ${question.description || ""}`,
        userAnswer,
        topic: question.topic,
        difficulty: question.difficulty,
        interviewType: question.category === "HR" ? "hr-interview" : question.category === "Aptitude" ? "aptitude" : "question-bank",
        module: "question-bank"
      });
      setEvaluationByQuestionId((current) => ({ ...current, [question._id]: data }));
      refreshProfile?.();
      showToast("AI evaluation ready.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Evaluation failed.", "error");
    } finally {
      setEvaluationLoadingByQuestionId((current) => ({ ...current, [question._id]: false }));
    }
  };

  const toggleBookmark = async (questionId) => {
    try {
      setBookmarkLoadingId(questionId);
      await api.post(`/users/bookmarks/${questionId}`, {}, { timeout: 25000 });
      await refreshBookmarks?.();
    } finally {
      setBookmarkLoadingId("");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nextFilters = {
      category: params.get("category") || "",
      difficulty: "",
      topic: params.get("topic") || "",
      company: "",
      search: params.get("search") || ""
    };
    setFilters(nextFilters);
    setOpenAnswers({});
  }, [location.search]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchQuestions(1, deferredFilters, deferredType, false).catch(() => undefined);
    }, 180);

    return () => clearTimeout(timerId);
  }, [deferredFilters, deferredType]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loading && !loadingMore && hasMore) {
        fetchQuestions(page + 1, deferredFilters, deferredType, true).catch(() => undefined);
      }
    }, { rootMargin: "240px" });

    observer.observe(node);
    return () => observer.disconnect();
  }, [deferredFilters, deferredType, hasMore, loading, loadingMore, page]);

  const visibleItems = items;

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Question bank"
        title="Explore premium interview questions with cleaner filtering and faster scanning."
        description="Search by company, topic, difficulty, and question type while keeping detailed solutions and starter code one click away."
        aside={(
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {[
              { label: "Showing", value: visibleItems.length },
              { label: "Total Matches", value: total },
              { label: "Active Filters", value: activeFilterCount }
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-custom-600">{item.label}</div>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-custom-900">{item.value}</div>
              </div>
            ))}
          </div>
        )}
      />

      <div className="snx-card">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <label className="block space-y-2">
              <span className="snx-label">Search questions</span>
              <div className="relative">
                <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-custom-500" />
                <input
                  className="snx-input pl-11"
                  value={filters.search}
                  onChange={(event) => updateFilter("search", event.target.value)}
                  placeholder="Search by title, topic, or concept"
                />
              </div>
            </label>

            {[
              { label: "Category", key: "category", options: filterOptions.category },
              { label: "Difficulty", key: "difficulty", options: filterOptions.difficulty },
              { label: "Topic", key: "topic", options: filterOptions.topic },
              { label: "Type", key: "type", options: typeOptions.map((option) => option.label) }
            ].map((filter) => (
              <label key={filter.key} className="block space-y-2">
                <span className="snx-label">{filter.label}</span>
                {filter.key === "type" ? (
                  <select className="snx-input" value={type} onChange={(event) => setType(event.target.value)}>
                    {typeOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                  </select>
                ) : (
                  <select className="snx-input" value={filters[filter.key]} onChange={(event) => updateFilter(filter.key, event.target.value)}>
                    <option value="">All</option>
                    {(filter.options || []).map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                )}
              </label>
            ))}
          </div>

          <label className="block space-y-2">
            <span className="snx-label">Company</span>
            <select className="snx-input w-full" value={filters.company} onChange={(event) => updateFilter("company", event.target.value)}>
              <option value="">All</option>
              {(filterOptions.company || []).map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-custom-600">
            <FiFilter className="h-4 w-4 text-indigo-600" />
            {activeFilterCount} filters active
          </div>
          <button className="snx-btn-secondary" onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>

      {loading && !visibleItems.length ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : null}

      {visibleItems.length ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {visibleItems.map((question) => {
            const display = splitDisplay(question);
            const show = !!openAnswers[question._id];
            const codeEntries = Object.entries(question.starterCode || {}).filter(([, code]) => code);
            const detailedSolution = buildDetailedSolution(question, question.correctAnswer, display.explanation);
            const isBookmarked = bookmarkedIds.has(question._id);
            const isSavingBookmark = bookmarkLoadingId === question._id;

            return (
              <div key={question._id} className="snx-card snx-fade-in p-6 space-y-5">
                <div className="flex flex-wrap gap-2">
                  <span className="snx-badge-primary">{question.category}</span>
                  <span className="snx-badge">{question.topic}</span>
                  <span className="snx-badge">{question.company}</span>
                  <span className="snx-badge">{question.type}</span>
                  <span className="snx-badge">{question.difficulty}</span>
                </div>
                <div>
                  <h2 className="snx-heading-3 text-slate-custom-900">{display.title}</h2>
                  <p className="snx-body-sm mt-3 text-slate-custom-700">
                    {display.description}
                    {display.advice ? ` (${display.advice})` : ""}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    className="snx-btn-secondary"
                    onClick={() => setOpenAnswers((current) => ({ ...current, [question._id]: !current[question._id] }))}
                  >
                    {show ? "Hide Details" : "View Details"}
                  </button>
                  <button
                    className={isBookmarked ? "snx-btn-accent" : "snx-btn-secondary"}
                    disabled={isSavingBookmark}
                    onClick={() => toggleBookmark(question._id)}
                  >
                    <FiBookmark className="h-4 w-4" />
                    {isSavingBookmark ? "Saving..." : isBookmarked ? "Saved" : "Save"}
                  </button>
                </div>

                {show ? (
                  <div className="space-y-4 rounded-[16px] border border-slate-200/70 bg-slate-50/70 p-5">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-custom-600">Suggested answer</div>
                      <p className="snx-body-sm mt-2 text-slate-custom-700">{String(question.correctAnswer)}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-custom-600">Detailed solution</div>
                      <p className="snx-body-sm mt-2 text-slate-custom-700">{detailedSolution}</p>
                    </div>
                    {codeEntries.length ? (
                      <div className="space-y-3">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-custom-600">Starter code</div>
                        {codeEntries.map(([language, code]) => (
                          <div key={`${question._id}-${language}`} className="overflow-hidden rounded-[12px] border border-slate-200 bg-slate-950">
                            <div className="border-b border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">{language}</div>
                            <pre className="snx-scrollbar overflow-x-auto px-4 py-4 text-sm text-slate-100"><code>{code}</code></pre>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {question.options?.length ? (
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <div key={`${question._id}-${option}`} className={`flex items-center justify-between rounded-[12px] border px-4 py-3 text-sm ${
                            option === question.correctAnswer ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-custom-700"
                          }`}>
                            <span>{option}</span>
                            {option === question.correctAnswer ? <strong>Correct</strong> : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-custom-600">Explanation</div>
                      <p className="snx-body-sm mt-2 text-slate-custom-700">{display.explanation}</p>
                    </div>
                    <div className="space-y-3 border-t border-slate-custom-200 pt-4">
                      <span className="snx-label">Your answer</span>
                      <textarea
                        className="snx-textarea min-h-[120px]"
                        value={userAnswers[question._id] || ""}
                        onChange={(event) => setUserAnswers((current) => ({ ...current, [question._id]: event.target.value }))}
                        placeholder="Type your answer for AI recruiter-style evaluation..."
                      />
                      <div className="flex flex-wrap gap-2">
                        <button type="button" className="snx-btn-primary snx-btn-sm" onClick={() => evaluateQuestionAnswer(question)}>
                          Evaluate with AI
                        </button>
                        <Link to={`/practice/${question._id}`} className="snx-btn-secondary snx-btn-sm">Open in Practice</Link>
                      </div>
                      <AnswerEvaluationCard
                        evaluation={evaluationByQuestionId[question._id]}
                        loading={evaluationLoadingByQuestionId[question._id]}
                        onRetry={() => evaluateQuestionAnswer(question)}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {!loading && !visibleItems.length ? (
        <EmptyState
          title="No questions found"
          description="Try broadening your filters, switching the question type, or clearing the current search to explore more interview prompts."
        />
      ) : null}

      {visibleItems.length ? (
        <div ref={loadMoreRef} className="pb-4 text-center text-sm text-slate-custom-600">
          {loadingMore ? "Loading more questions..." : hasMore ? "Scroll to load more questions" : "You have reached the end of this question set."}
        </div>
      ) : null}
    </div>
  );
};

export default QuestionBankPage;
