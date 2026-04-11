import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client";
import { buildDetailedSolution } from "../utils/answerHelpers";

const PAGE_SIZE = 20;
const typeOptions = [
  { id: "all", label: "All Questions" },
  { id: "Coding", label: "Coding Questions" },
  { id: "Subjective", label: "Descriptive Questions" },
  { id: "MCQ", label: "MCQ Questions" }
];
const softwareCategoryOptions = ["DSA", "Aptitude", "Core Subjects", "HR", "Behavioral"];

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

const QuestionBankPage = ({ questions = [], loadQuestions, defaultField = "Software", bookmarks = [], refreshBookmarks }) => {
  const location = useLocation();
  const loadMoreRef = useRef(null);
  const [filters, setFilters] = useState({ category: "", difficulty: "", topic: "", company: "" });
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
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

  const fetchQuestions = async (nextPage = 1, nextFilters = filters, nextType = type, append = false) => {
    setLoading(true);
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
      if (nextType !== "all") params.type = nextType;
      const { data } = await api.get("/questions", { params, timeout: 25000 });
      const nextItems = data.items || [];
      setItems((current) => append ? [...current, ...nextItems.filter((item) => !current.some((existing) => existing._id === item._id))] : nextItems);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || nextPage);
    } catch {
      const fallback = await loadQuestions({ ...buildApiFilters(nextFilters), limit: PAGE_SIZE * nextPage, type: nextType !== "all" ? nextType : undefined }).catch(() => []);
      const fallbackItems = (fallback || [])
        .filter((question) => matchesCategory(question, nextFilters.category))
        .filter((question) => nextType === "all" || question.type === nextType);
      setItems(fallbackItems.slice(0, PAGE_SIZE * nextPage));
      setTotalPages(Math.max(1, Math.ceil(fallbackItems.length / PAGE_SIZE)));
      setPage(nextPage);
    } finally {
      setLoading(false);
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
      company: ""
    };
    setFilters(nextFilters);
    setOpenAnswers({});
    fetchQuestions(1, nextFilters, type, false).catch(() => undefined);
  }, [location.search]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loading && hasMore) {
        fetchQuestions(page + 1, filters, type, true).catch(() => undefined);
      }
    }, { rootMargin: "320px" });

    observer.observe(node);
    return () => observer.disconnect();
  }, [filters, hasMore, loading, page, type]);

  const visibleItems = items;

  return (
    <div className="container py-4">
      <p className="eyebrow mb-1">Question Bank</p>
      <h1 className="h2 fw-bold mb-2">Explore software interview questions by subject</h1>
      <p className="text-secondary mb-4">Browse coding, aptitude, HR, behavioral, and core-subject questions with detailed answers.</p>

      <div className="glass-card p-4 mb-4">
        <div className="row g-3">
          {Object.entries(filters).map(([key, value]) => (
            <div className="col-md-3" key={key}>
              <label className="form-label text-capitalize">{key}</label>
              <select className="form-select" value={value} onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))}>
                <option value="">All {key}</option>
                {(filterOptions[key] || []).map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          ))}
          <div className="col-md-3">
            <label className="form-label">Question Type</label>
            <select className="form-select" value={type} onChange={(event) => setType(event.target.value)}>
              {typeOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </div>
        </div>
        <button className="btn btn-info mt-3" onClick={() => {
          setOpenAnswers({});
          fetchQuestions(1, filters, type, false);
        }}>Apply Filters</button>
      </div>

      {loading && !visibleItems.length ? <div className="glass-card p-4"><p className="text-secondary mb-0">Loading questions...</p></div> : null}

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
              <div className="glass-card p-4">
                <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
                  <div>
                    <h2 className="h4 mb-2">{display.title}</h2>
                    <p className="text-secondary mb-0">{display.description}{display.advice ? ` (${display.advice})` : ""}</p>
                  </div>
                  <span className="badge text-bg-secondary">{question.difficulty}</span>
                </div>
                <div className="d-flex gap-2 flex-wrap mb-3">
                  <span className="badge text-bg-dark">{question.category}</span>
                  <span className="badge text-bg-dark">{question.topic}</span>
                  <span className="badge text-bg-dark">{question.company}</span>
                  <span className="badge text-bg-info">{question.type}</span>
                </div>
                <div className="d-flex gap-2 flex-wrap mb-3">
                  <button className="btn btn-outline-light" onClick={() => setOpenAnswers((current) => ({ ...current, [question._id]: !current[question._id] }))}>{show ? "Hide Answers" : "Show Answers"}</button>
                  <button className={`btn ${isBookmarked ? "btn-info" : "btn-outline-light"}`} disabled={isSavingBookmark} onClick={() => toggleBookmark(question._id)}>{isSavingBookmark ? "Saving..." : isBookmarked ? "Bookmarked" : "Add to Bookmarks"}</button>
                </div>
                {show ? (
                  <>
                    <div className="question-bank-answer mb-3"><strong>Suggested Answer:</strong> {String(question.correctAnswer)}</div>
                    <div className="question-bank-explanation mb-3"><strong>Detailed Solution:</strong> {detailedSolution}</div>
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
                    <div className="question-bank-explanation"><strong>Explanation:</strong> {display.explanation}</div>
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {!loading && !visibleItems.length ? <div className="glass-card p-4 mt-4"><p className="text-secondary mb-0">No questions found. Try changing the filters or question type.</p></div> : null}

      {visibleItems.length ? <div ref={loadMoreRef} className="py-4 text-center text-secondary">{loading ? "Loading more questions..." : hasMore ? "Scroll to load more questions" : "You have reached the end of this question set."}</div> : null}
    </div>
  );
};

export default QuestionBankPage;
