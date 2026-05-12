import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import api from "../api/client";
import { buildDetailedSolution } from "../utils/answerHelpers";
import { useToast } from "../components/ui/ToastProvider";

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
    setStartedAt(Date.now());
    setAnswer(question.type === "Coding" ? question.starterCode?.[language] || "" : "");
  }, [question, language]);

  const openQuestion = (id) => {
    navigate(`/practice/${id}${location.search}`);
  };

  const goBackToList = () => {
    navigate(`/practice${location.search}`);
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
      <div className="container-fluid py-4 practice-pro-page snx-page-shell">
        <div className="hero-panel mb-4">
          <div className="row g-4 align-items-end">
            <div className="col-lg-8">
              <p className="eyebrow mb-2">Practice Mode</p>
              <h1 className="h2 fw-bold mb-2">Choose a question to start practice</h1>
              <p className="text-secondary mb-0">
                Filter your question list and open a dedicated practice screen with next, previous, and bookmark controls.
              </p>
            </div>
            <div className="col-lg-4">
              <div className="question-bank-summary-grid">
                <div className="metric-card compact">
                  <span>Filtered</span>
                  <h3>{filteredQuestions.length}</h3>
                </div>
                <div className="metric-card compact">
                  <span>Mode</span>
                  <h3>{selectedType === "all" ? "Mix" : selectedType}</h3>
                </div>
                <div className="metric-card compact">
                  <span>Field</span>
                  <h3>{targetField}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 practice-panel-card">
          <div className="row g-3 mb-3">
            <div className="col-12 col-lg-4">
              <label className="form-label">Search</label>
              <input className="form-control" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by topic or title" />
            </div>
            <div className="col-sm-6 col-lg-4">
              <label className="form-label">Category</label>
              <select className="form-select" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                <option value="">All Categories</option>
                {softwareCategoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <div className="col-sm-6 col-lg-4">
              <label className="form-label">Question Type</label>
              <select className="form-select" value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
                {typeOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </div>
          </div>

          {loading && !filteredQuestions.length ? <p className="text-secondary mb-0">Loading questions...</p> : (
            <div className="row g-3">
              {filteredQuestions.map((item, index) => (
                <div className="col-12 col-lg-6" key={item._id}>
                  <button className="practice-question-card-btn" onClick={() => openQuestion(item._id)}>
                    <div className="d-flex align-items-start gap-3">
                      <span className="practice-question-index">{index + 1}</span>
                      <div className="text-start">
                        <strong>{item.title.replace(/\s+Practice Variant\s+\d+$/i, "")}</strong>
                        <small className="d-block mt-1">{item.topic} | {item.type} | {item.difficulty}</small>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
      <div className="container-fluid py-4 practice-pro-page snx-page-shell">
        <div className="glass-card p-4 question-card practice-workspace-card">
          {question ? (
          <>
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3 practice-question-toolbar">
              <div className="flex-grow-1">
                <button className="btn btn-outline-light mb-3" onClick={goBackToList}>Back to Question List</button>
                <p className="eyebrow mb-2">Practice Question</p>
                <h2 className="h3 fw-bold mb-2">{question.title.replace(/\s+Practice Variant\s+\d+$/i, "")}</h2>
                <p className="text-secondary mb-0">{String(question.description).replace(/\s*Practice focus\s*\d*:\s*.+$/i, "").trim()}</p>
              </div>
              <button className={`btn ${isBookmarked ? "btn-info" : "btn-outline-light"}`} onClick={toggleBookmark}>
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </button>
            </div>

            <div className="d-flex gap-2 flex-wrap mb-4">
              <span className="badge text-bg-dark">{question.category}</span>
              <span className="badge text-bg-dark">{question.topic}</span>
              <span className="badge text-bg-dark">{question.company}</span>
              <span className="badge text-bg-info">{question.type}</span>
              <span className="badge text-bg-secondary">{question.difficulty}</span>
            </div>

            {question.type === "MCQ" ? (
              <div className="vstack gap-2 mb-4">
                {(question.options || []).map((option) => (
                  <button
                    key={option}
                    className={`btn option-btn ${answer === option ? "option-btn-selected" : "btn-outline-light"} text-start`}
                    onClick={() => setAnswer((current) => (current === option ? "" : option))}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}

            {question.type === "Subjective" ? (
              <textarea
                className="form-control mb-4 practice-answer-box"
                rows="9"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Write your answer here..."
              />
            ) : null}

            {question.type === "Coding" ? (
              <>
                <div className="row g-3 mb-3">
                  <div className="col-sm-4">
                    <label className="form-label">Language</label>
                    <select className="form-select" value={language} onChange={(event) => setLanguage(event.target.value)}>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                    </select>
                  </div>
                </div>
                <div className="practice-editor-shell">
                  <Editor
                    height="360px"
                    theme="vs-dark"
                    language={language === "cpp" ? "cpp" : language}
                    value={answer}
                    onChange={(value) => setAnswer(value || "")}
                  />
                </div>
              </>
            ) : null}

            <div className="d-flex gap-2 flex-wrap mt-4 practice-question-actions">
              <button className="btn btn-outline-light" onClick={() => moveQuestion("prev")}>Previous</button>
              <button className="btn btn-info" onClick={submit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </button>
              {question.type === "Coding" ? (
                <button className="btn btn-outline-light" onClick={runCode} disabled={runningCode}>
                  {runningCode ? "Running..." : "Run Code"}
                </button>
              ) : null}
              <button className="btn btn-outline-light" onClick={() => moveQuestion("next")}>Next</button>
            </div>

            {feedback ? (
              <div className="mt-4 vstack gap-3">
                <div className="answer-reveal-panel">
                  <div className="answer-reveal-card">
                    <span className="feedback-label">Your Answer</span>
                    <p className="mb-0">{String(answer || "No answer submitted")}</p>
                  </div>
                  <div className="answer-reveal-card">
                    <span className="feedback-label">Correct Answer</span>
                    <p className="mb-0">{String(feedback.correctAnswer)}</p>
                  </div>
                </div>
                <div className="feedback-detail-grid">
                  <div className="feedback-detail-card feedback-detail-card-wide">
                    <span className="feedback-label">Detailed Solution</span>
                    <p className="mb-0">{detailedSolution}</p>
                  </div>
                  <div className="feedback-detail-card feedback-detail-card-wide">
                    <span className="feedback-label">Explanation</span>
                    <p className="mb-0">{feedback.explanation}</p>
                  </div>
                </div>
                {feedback.codeOutput ? (
                  <div className="terminal-panel">
                    <p className="mb-2"><strong>Status:</strong> {feedback.codeStatus}</p>
                    <pre className="mb-0">{feedback.codeOutput}</pre>
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-secondary mb-3">This question is not available in the current filter set.</p>
            <button className="btn btn-info" onClick={goBackToList}>Back to Question List</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticePage;
