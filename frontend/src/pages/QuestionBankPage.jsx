import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client";

const PAGE_SIZE = 24;

const typeSections = [
  { id: "all", label: "All Questions" },
  { id: "Coding", label: "Coding Questions" },
  { id: "Subjective", label: "Descriptive Questions" }
];

const filterLabels = {
  category: "Category",
  difficulty: "Difficulty",
  topic: "Topic",
  company: "Company"
};

const codeLanguageLabels = {
  python: "Python",
  cpp: "C++",
  java: "Java"
};

const FIELD_BANK_COPY = {
  Software: {
    title: "Explore software interview questions by subject",
    subtitle: "Browse coding and descriptive questions for technical rounds, aptitude, HR, and core-CS prep."
  }
};

const splitPracticeNote = (value = "", marker) => {
  const parts = String(value).split(marker);
  return {
    main: (parts[0] || value).trim(),
    note: parts[1]?.trim() || ""
  };
};

const parseQuestionDisplay = (question) => {
  const rawTitle = question.title || "Untitled Question";
  const title = rawTitle.replace(/\s+Practice Variant\s+\d+$/i, "").trim();
  const descriptionParts = splitPracticeNote(question.description || "", /Practice focus\s+\d+:\s*/i);
  const explanationParts = splitPracticeNote(question.explanation || "", /Practice note:\s*/i);

  return {
    title,
    description: descriptionParts.main,
    advice: descriptionParts.note,
    explanation: explanationParts.main
  };
};

const defaultCategoryOptions = ["DSA", "Aptitude", "HR", "Core Subjects"];

const QuestionBankPage = ({ questions, filters, setFilters, loadQuestions, defaultField = "Software" }) => {
  const location = useLocation();
  const [openAnswers, setOpenAnswers] = useState({});
  const [activeSection, setActiveSection] = useState("all");
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagedQuestions, setPagedQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const bankCopy = FIELD_BANK_COPY[defaultField] || FIELD_BANK_COPY.Software;

  const usableQuestions = useMemo(
    () => questions.filter((question) => question && question._id && (question.field || defaultField) === defaultField),
    [questions, defaultField]
  );

  const filterOptions = useMemo(() => ({
    category: [...new Set([...defaultCategoryOptions, ...usableQuestions.map((question) => question.category).filter(Boolean)])].sort(),
    difficulty: [...new Set(usableQuestions.map((question) => question.difficulty).filter(Boolean))].sort(),
    topic: [...new Set(usableQuestions.map((question) => question.topic).filter(Boolean))].sort(),
    company: [...new Set(usableQuestions.map((question) => question.company).filter(Boolean))].sort()
  }), [usableQuestions]);

  const fetchPage = async (page, nextFilters = filters, nextCategory = activeCategory, nextSection = activeSection) => {
    setLoading(true);
    try {
      const params = {
        ...nextFilters,
        field: defaultField,
        page,
        limit: PAGE_SIZE,
        paginated: true
      };

      if (nextCategory) params.category = nextCategory;
      if (nextSection !== "all") params.type = nextSection;

      const { data } = await api.get("/questions", { params, timeout: 4000 });
      setPagedQuestions(data.items || []);
      setCurrentPage(data.page || page);
      setTotalPages(data.totalPages || 1);
    } catch {
      setPagedQuestions([]);
      setCurrentPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const topic = params.get("topic") || "";
    const category = params.get("category") || "";

    if (topic || category) {
      const nextFilters = {
        ...filters,
        topic,
        category,
        difficulty: filters.difficulty || "",
        company: filters.company || ""
      };
      setFilters(nextFilters);
      setActiveCategory(category || "");
      fetchPage(1, nextFilters, category || "", activeSection).catch(() => undefined);
      return;
    }

    fetchPage(1).catch(() => undefined);
  }, [location.search]);

  useEffect(() => {
    if (!location.search) {
      fetchPage(1).catch(() => undefined);
    }
  }, [activeSection, activeCategory]);

  const toggleAnswer = (id) => {
    setOpenAnswers((current) => ({ ...current, [id]: !current[id] }));
  };

  const applyFilters = () => {
    fetchPage(1, filters, activeCategory, activeSection).catch(() => undefined);
  };

  return (
    <div className="container py-4">
      <p className="eyebrow mb-1">Question Bank</p>
      <h1 className="h2 fw-bold mb-2">{bankCopy.title}</h1>
      <p className="text-secondary mb-2">{bankCopy.subtitle}</p>
      <p className="text-secondary mb-4">Active field: <span className="fw-semibold text-light">{defaultField}</span></p>

      <div className="card glass-card mb-4">
        <div className="card-body">
          <div className="row g-3">
            {Object.keys(filters).map((key) => (
              <div className="col-md-3" key={key}>
                <label className="form-label">{filterLabels[key] || key}</label>
                <select className="form-select" value={filters[key]} onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}>
                  <option value="">All {filterLabels[key] || key}</option>
                  {(filterOptions[key] || []).map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
            ))}
          </div>
          <button className="btn btn-info mt-3" onClick={applyFilters}>Apply Filters</button>
        </div>
      </div>

      <div className="card glass-card mb-4">
        <div className="card-body">
          <div className="question-bank-tabs mb-3">
            {typeSections.map((section) => (
              <button key={section.id} className={`question-bank-tab ${activeSection === section.id ? "active" : ""}`} onClick={() => { setActiveSection(section.id); setCurrentPage(1); }}>
                {section.label}
              </button>
            ))}
          </div>
          <div className="question-bank-tabs compact">
            {filterOptions.category.map((category) => (
              <button key={category} className={`question-bank-tab ${activeCategory === category ? "active" : ""}`} onClick={() => { setActiveCategory(activeCategory === category ? "" : category); setCurrentPage(1); }}>
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && !pagedQuestions.length ? (
        <div className="card glass-card mt-4"><div className="card-body"><p className="text-secondary mb-0">Loading questions...</p></div></div>
      ) : (
        <>
          <div className="question-bank-stack">
            {pagedQuestions.map((q) => {
              const isOpen = !!openAnswers[q._id];
              const display = parseQuestionDisplay(q);
              const starterCode = q.type === "Coding" ? Object.entries(q.starterCode || {}).filter(([, value]) => value) : [];

              return (
                <div className="question-bank-stack-item" key={q._id}>
                  <div className="card glass-card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between gap-3 mb-3 flex-wrap">
                        <div>
                          <h2 className="h5">{display.title}</h2>
                          <p className="text-secondary mb-0">{display.description}{display.advice ? <span className="question-bank-advice"> ({display.advice})</span> : null}</p>
                        </div>
                        <span className="badge text-bg-secondary align-self-start">{q.difficulty}</span>
                      </div>
                      <div className="d-flex gap-2 flex-wrap mb-3">
                        <span className="badge text-bg-dark">{q.field || defaultField}</span>
                        <span className="badge text-bg-dark">{q.category}</span>
                        <span className="badge text-bg-dark">{q.topic}</span>
                        <span className="badge text-bg-dark">{q.company}</span>
                        <span className="badge text-bg-info">{q.type}</span>
                      </div>
                      <button className="btn btn-outline-light mb-3" onClick={() => toggleAnswer(q._id)}>{isOpen ? "Hide Answers" : "Show Answers"}</button>
                      {isOpen && (
                        <>
                          <div className="mb-3"><p className="fw-semibold mb-2">Suggested Answer</p><div className="question-bank-answer">{String(q.correctAnswer)}</div></div>
                          {starterCode.length ? (
                            <div className="mb-3">
                              <p className="fw-semibold mb-2">Starter Code</p>
                              <div className="vstack gap-3">
                                {starterCode.map(([language, code]) => (
                                  <div className="question-bank-code-block" key={`${q._id}-${language}`}>
                                    <span className="question-bank-code-label">{codeLanguageLabels[language] || language}</span>
                                    <pre className="question-bank-code-pre"><code>{code}</code></pre>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}
                          <div><p className="fw-semibold mb-2">Explanation</p><div className="question-bank-explanation">{display.explanation}</div></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4">
            <p className="text-secondary mb-0">Page {currentPage} of {totalPages}</p>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-light" disabled={currentPage <= 1 || loading} onClick={() => fetchPage(currentPage - 1, filters, activeCategory, activeSection)}>Previous Page</button>
              <button className="btn btn-outline-light" disabled={currentPage >= totalPages || loading} onClick={() => fetchPage(currentPage + 1, filters, activeCategory, activeSection)}>Next Page</button>
            </div>
          </div>

          {!pagedQuestions.length && (
            <div className="card glass-card mt-4">
              <div className="card-body">
                <p className="text-secondary mb-0">No questions found for this section yet. Try another subject or format.</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionBankPage;
