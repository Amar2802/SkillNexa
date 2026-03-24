import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const typeSections = [
  { id: "non-mcq", label: "Interview Bank" },
  { id: "Coding", label: "Coding Questions" },
  { id: "Subjective", label: "Descriptive Questions" },
  { id: "MCQ", label: "MCQ Section" }
];

const QuestionBankPage = ({ questions, filters, setFilters, loadQuestions }) => {
  const location = useLocation();
  const [openAnswers, setOpenAnswers] = useState({});
  const [activeSection, setActiveSection] = useState("non-mcq");
  const [activeCategory, setActiveCategory] = useState("All");

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

  const categories = useMemo(() => ["All", ...new Set(questions.map((question) => question.category))], [questions]);

  const sectionQuestions = useMemo(() => {
    return questions.filter((question) => {
      const typeMatch =
        activeSection === "non-mcq"
          ? question.type !== "MCQ"
          : question.type === activeSection;

      const categoryMatch = activeCategory === "All" ? true : question.category === activeCategory;
      return typeMatch && categoryMatch;
    });
  }, [questions, activeSection, activeCategory]);

  return (
    <div className="container py-4">
      <p className="eyebrow mb-1">Question Bank</p>
      <h1 className="h2 fw-bold mb-4">Explore questions by format and subject</h1>
      <div className="card glass-card mb-4">
        <div className="card-body">
          <div className="row g-3">
            {Object.keys(filters).map((key) => (
              <div className="col-md-3" key={key}>
                <label className="form-label text-capitalize">{key}</label>
                <input className="form-control" value={filters[key]} onChange={(e) => setFilters({ ...filters, [key]: e.target.value })} />
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

      <div className="row g-3">
        {sectionQuestions.map((q) => {
          const isOpen = !!openAnswers[q._id];

          return (
            <div className="col-lg-6" key={q._id}>
              <div className="card glass-card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between gap-3 mb-3">
                    <div>
                      <h2 className="h5">{q.title}</h2>
                      <p className="text-secondary mb-0">{q.description}</p>
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
                      {q.type === "MCQ" && q.options?.length > 0 && (
                        <div className="mb-3">
                          <p className="fw-semibold mb-2">Options</p>
                          <div className="vstack gap-2">
                            {q.options.map((option) => (
                              <div key={option} className={`question-bank-option ${String(option) === String(q.correctAnswer) ? "correct" : ""}`}>
                                <span>{option}</span>
                                {String(option) === String(q.correctAnswer) && <strong>Correct</strong>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {q.type !== "MCQ" && (
                        <div className="mb-3">
                          <p className="fw-semibold mb-2">Suggested Answer</p>
                          <div className="question-bank-answer">{String(q.correctAnswer)}</div>
                        </div>
                      )}

                      {q.type === "MCQ" && (
                        <div className="mb-3">
                          <p className="fw-semibold mb-2">Correct Answer</p>
                          <div className="question-bank-answer">{String(q.correctAnswer)}</div>
                        </div>
                      )}

                      <div>
                        <p className="fw-semibold mb-2">Explanation</p>
                        <div className="question-bank-explanation">{q.explanation}</div>
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
