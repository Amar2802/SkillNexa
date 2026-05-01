import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client";
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

const QuestionCardSkeleton = () => (
  <div className="question-bank-stack-item">
    <div className="glass-card p-4 question-skeleton-card">
      <div className="placeholder-glow mb-3">
        <span className="placeholder col-7" />
      </div>
      <div className="placeholder-glow mb-3">
        <span className="placeholder col-12" />
        <span className="placeholder col-10" />
      </div>
      <div className="d-flex gap-2 flex-wrap mb-3">
        <span className="placeholder rounded-pill col-2" />
        <span className="placeholder rounded-pill col-2" />
        <span className="placeholder rounded-pill col-2" />
      </div>
      <div className="placeholder-glow">
        <span className="placeholder col-4" />
      </div>
    </div>
  </div>
);

const QuestionBankPage = ({ questions = [], loadQuestions, defaultField = "Software", bookmarks = [], refreshBookmarks }) => {
  const location = useLocation();
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
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

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
      search: ""
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
    }, { rootMargin: "300px" });

    observer.observe(node);
    return () => observer.disconnect();
  }, [deferredFilters, deferredType, hasMore, loading, loadingMore, page]);

  const visibleItems = items;

  return (
    <div className="container py-4 question-bank-page">
      <div className="hero-panel mb-4">
        <div className="row g-4 align-items-end">
          <div className="col-lg-8">
            <p className="eyebrow mb-2">Question Bank</p>
            <h1 className="h2 fw-bold mb-2">Explore software interview questions faster</h1>
            <p className="text-secondary mb-0">
              Search, filter, and skim questions quickly with progressive loading, cleaner cards, and mobile-friendly browsing.
            </p>
          </div>
          <div className="col-lg-4">
            <div className="question-bank-summary-grid">
              <div className="metric-card compact">
                <span>Showing</span>
                <h3>{visibleItems.length}</h3>
              </div>
              <div className="metric-card compact">
                <span>Total Matches</span>
                <h3>{total}</h3>
              </div>
              <div className="metric-card compact">
                <span>Active Filters</span>
                <h3>{activeFilterCount}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-4">
            <label className="form-label">Search Questions</label>
            <input
              className="form-control"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Search by title, topic, or concept"
            />
          </div>
          <div className="col-6 col-md-4 col-xl-2">
            <label className="form-label">Category</label>
            <select className="form-select" value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}>
              <option value="">All</option>
              {filterOptions.category.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-4 col-xl-2">
            <label className="form-label">Difficulty</label>
            <select className="form-select" value={filters.difficulty} onChange={(event) => updateFilter("difficulty", event.target.value)}>
              <option value="">All</option>
              {(filterOptions.difficulty || []).map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-4 col-xl-2">
            <label className="form-label">Topic</label>
            <select className="form-select" value={filters.topic} onChange={(event) => updateFilter("topic", event.target.value)}>
              <option value="">All</option>
              {(filterOptions.topic || []).map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-6 col-md-4 col-xl-2">
            <label className="form-label">Type</label>
            <select className="form-select" value={type} onChange={(event) => setType(event.target.value)}>
              {typeOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </div>
          <div className="col-12 col-md-8 col-xl-4">
            <label className="form-label">Company</label>
            <select className="form-select" value={filters.company} onChange={(event) => updateFilter("company", event.target.value)}>
              <option value="">All</option>
              {(filterOptions.company || []).map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-12 col-md-4 col-xl-2">
            <button className="btn btn-outline-light w-100" onClick={clearFilters}>Clear Filters</button>
          </div>
        </div>
      </div>

      {loading && !visibleItems.length ? (
        <div className="question-bank-stack">
          {Array.from({ length: 4 }).map((_, index) => <QuestionCardSkeleton key={index} />)}
        </div>
      ) : null}

      <div className="question-bank-stack">
        {visibleItems.map((question) => {
          const display = splitDisplay(question);
          const show = !!openAnswers[question._id];
          const codeEntries = Object.entries(question.starterCode || {}).filter(([, code]) => code);
          const detailedSolution = buildDetailedSolution(question, question.correctAnswer, display.explanation);
          const isBookmarked = bookmarkedIds.has(question._id);
          const isSavingBookmark = bookmarkLoadingId === question._id;

          return (
            <div className="question-bank-stack-item" key={question._id}>
              <div className="glass-card p-4 question-bank-card">
                <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
                  <div className="question-bank-card-copy">
                    <div className="d-flex gap-2 flex-wrap mb-2">
                      <span className="badge text-bg-dark">{question.category}</span>
                      <span className="badge text-bg-dark">{question.topic}</span>
                      <span className="badge text-bg-dark">{question.company}</span>
                      <span className="badge text-bg-info">{question.type}</span>
                      <span className="badge text-bg-secondary">{question.difficulty}</span>
                    </div>
                    <h2 className="h4 mb-2">{display.title}</h2>
                    <p className="text-secondary mb-0">
                      {display.description}
                      {display.advice ? ` (${display.advice})` : ""}
                    </p>
                  </div>
                  <div className="d-flex gap-2 flex-wrap question-bank-actions">
                    <button
                      className="btn btn-outline-light"
                      onClick={() => setOpenAnswers((current) => ({ ...current, [question._id]: !current[question._id] }))}
                    >
                      {show ? "Hide Details" : "View Details"}
                    </button>
                    <button
                      className={`btn ${isBookmarked ? "btn-info" : "btn-outline-light"}`}
                      disabled={isSavingBookmark}
                      onClick={() => toggleBookmark(question._id)}
                    >
                      {isSavingBookmark ? "Saving..." : isBookmarked ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>

                {show ? (
                  <>
                    <div className="question-bank-answer mb-3">
                      <strong>Suggested Answer:</strong> {String(question.correctAnswer)}
                    </div>
                    <div className="question-bank-explanation mb-3">
                      <strong>Detailed Solution:</strong> {detailedSolution}
                    </div>
                    {codeEntries.length ? (
                      <div className="mb-3">
                        <p className="fw-semibold mb-2">Starter Code</p>
                        <div className="vstack gap-3">
                          {codeEntries.map(([language, code]) => (
                            <div key={`${question._id}-${language}`} className="question-bank-code-block">
                              <span className="question-bank-code-label text-uppercase">{language}</span>
                              <pre className="question-bank-code-pre mb-0"><code>{code}</code></pre>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {question.options?.length ? (
                      <div className="vstack gap-2 mb-3">
                        {question.options.map((option) => (
                          <div key={`${question._id}-${option}`} className={`question-bank-option ${option === question.correctAnswer ? "correct" : ""}`}>
                            <span>{option}</span>
                            {option === question.correctAnswer ? <strong>Correct</strong> : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <div className="question-bank-explanation">
                      <strong>Explanation:</strong> {display.explanation}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {!loading && !visibleItems.length ? (
        <div className="glass-card p-4 mt-4">
          <p className="text-secondary mb-0">No questions found. Try a broader search or clear a few filters.</p>
        </div>
      ) : null}

      {visibleItems.length ? (
        <div ref={loadMoreRef} className="py-4 text-center text-secondary">
          {loadingMore ? "Loading more questions..." : hasMore ? "Scroll to load more questions" : "You have reached the end of this question set."}
        </div>
      ) : null}
    </div>
  );
};

export default QuestionBankPage;
