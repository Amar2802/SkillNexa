import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

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

const QuestionBankPage = ({ questions, filters, setFilters, loadQuestions }) => {
  const location = useLocation();
  const [openAnswers, setOpenAnswers] = useState({});
  const [activeSection, setActiveSection] = useState("all");
  const [activeCategory, setActiveCategory] = useState("");

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
      loadQuestions(nextFilters);
      if (category) setActiveCategory(category);
    }
  }, [location.search]);

  const toggleAnswer = (id) => {
    setOpenAnswers((current) => ({ ...current, [id]: !current[id] }));
  };

  const nonMcqQuestions = useMemo(() => questions.filter((question) => question.type !== "MCQ"), [questions]);
  const categories = useMemo(() => [...new Set(nonMcqQuestions.map((question) => question.category).filter(Boolean))], [nonMcqQuestions]);

  const filterOptions = useMemo(() => ({
    category: [...new Set(nonMcqQuestions.map((question) => question.category).filter(Boolean))].sort(),
    difficulty: [...new Set(nonMcqQuestions.map((question) => question.difficulty).filter(Boolean))].sort(),
    topic: [...new Set(nonMcqQuestions.map((question) => question.topic).filter(Boolean))].sort(),
    company: [...new Set(nonMcqQuestions.map((question) => question.company).filter(Boolean))].sort()
  }), [nonMcqQuestions]);

  const sectionQuestions = useMemo(() => {
    return nonMcqQuestions.filter((question) => {
      const typeMatch = activeSection === "all" ? true : question.type === activeSection;
      const categoryMatch = !activeCategory ? true : question.category === activeCategory;
      return typeMatch && categoryMatch;
    });
  }, [nonMcqQuestions, activeSection, activeCategory]);

  return (
    <div className="container py-4">
      <p className="eyebrow mb-1">Question Bank</p>
      <h1 className="h2 fw-bold mb-2">Explore questions by subject</h1>
      <p className="text-secondary mb-4">This section focuses on coding and descriptive interview questions. Answers stay hidden until you choose to view them.</p>

      <div className="card glass-card mb-4">
        <div className="card-body">
          <div className="row g-3">
            {Object.keys(filters).map((key) => (
              <div className="col-md-3" key={key}>
                <label className="form-label">{filterLabels[key] || key}</label>
                <select
                  className="form-select"
                  value={filters[key]}
                  onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                >
                  <option value="">All {filterLabels[key] || key}</option>
                  {(filterOptions[key] || []).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <button className="btn btn-info mt-3" onClick={() => loadQuestions(filters)}>Apply Filters</button>
        </div>
      </div>

      <div className="card glass-card mb-4">
        <div className="card-body">
          <div className="question-bank-tabs mb-3">
            {typeSections.map((section) => (
              <button
                key={section.id}
                className={`question-bank-tab ${activeSection === section.id ? "active" : ""}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>
          <div className="question-bank-tabs compact">
            {categories.map((category) => (
              <button
                key={category}
                className={`question-bank-tab ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="question-bank-stack">
        {sectionQuestions.map((q) => {
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
                      <p className="text-secondary mb-0">
                        {display.description}
                        {display.advice ? <span className="question-bank-advice"> ({display.advice})</span> : null}
                      </p>
                    </div>
                    <span className="badge text-bg-secondary align-self-start">{q.difficulty}</span>
                  </div>

                  <div className="d-flex gap-2 flex-wrap mb-3">
                    <span className="badge text-bg-dark">{q.category}</span>
                    <span className="badge text-bg-dark">{q.topic}</span>
                    <span className="badge text-bg-dark">{q.company}</span>
                    <span className="badge text-bg-info">{q.type}</span>
                  </div>

                  <button className="btn btn-outline-light mb-3" onClick={() => toggleAnswer(q._id)}>
                    {isOpen ? "Hide Answers" : "Show Answers"}
                  </button>

                  {isOpen && (
                    <>
                      <div className="mb-3">
                        <p className="fw-semibold mb-2">Suggested Answer</p>
                        <div className="question-bank-answer">{String(q.correctAnswer)}</div>
                      </div>

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

                      <div>
                        <p className="fw-semibold mb-2">Explanation</p>
                        <div className="question-bank-explanation">
                          {display.explanation}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!sectionQuestions.length && (
        <div className="card glass-card mt-4">
          <div className="card-body">
            <p className="text-secondary mb-0">No questions found for this section yet. Try another subject or format.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBankPage;
