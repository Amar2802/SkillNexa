import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import api from "../api/client";
import { buildDetailedSolution } from "../utils/answerHelpers";

const typeOptions = [
  { id: "all", label: "All Questions" },
  { id: "Coding", label: "Coding" },
  { id: "Subjective", label: "Descriptive" },
  { id: "MCQ", label: "MCQ" }
];

const PracticePage = ({ questions = [], bookmarks = [], refreshBookmarks, targetField = "Software", loadQuestions }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedId, setSelectedId] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);
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

  const categoryOptions = useMemo(() => [...new Set(questions.map((question) => question.category).filter(Boolean))].sort(), [questions]);
  const filteredQuestions = useMemo(() => questions.filter((question) => {
    if (selectedCategory && question.category !== selectedCategory) return false;
    if (selectedType !== "all" && question.type !== selectedType) return false;
    return true;
  }), [questions, selectedCategory, selectedType]);

  const question = useMemo(() => filteredQuestions.find((item) => item._id === selectedId), [filteredQuestions, selectedId]);
  const currentIndex = filteredQuestions.findIndex((item) => item._id === selectedId);
  const isBookmarked = bookmarks.some((item) => item._id === selectedId);

  useEffect(() => {
    if (!filteredQuestions.length) {
      setSelectedId("");
      return;
    }
    if (!selectedId || !filteredQuestions.some((item) => item._id === selectedId)) {
      setSelectedId(filteredQuestions[0]._id);
    }
  }, [filteredQuestions, selectedId]);

  useEffect(() => {
    if (!question) return;
    setFeedback(null);
    setStartedAt(Date.now());
    setAnswer(question.type === "Coding" ? question.starterCode?.[language] || "" : "");
  }, [question, language]);

  const submit = async () => {
    if (!question) return;
    const { data } = await api.post(`/questions/${question._id}/evaluate`, {
      answer,
      timeSpent: Math.round((Date.now() - startedAt) / 1000)
    }, { timeout: 25000 });
    setFeedback(data);
  };

  const runCode = async () => {
    const { data } = await api.post("/code/run", { code: answer, language }, { timeout: 25000 });
    setFeedback((current) => ({ ...current, codeOutput: data.output, codeStatus: data.status }));
  };

  const toggleBookmark = async () => {
    if (!question) return;
    await api.post(`/users/bookmarks/${question._id}`, {}, { timeout: 25000 });
    refreshBookmarks?.();
  };

  const nextQuestion = () => {
    if (!filteredQuestions.length) return;
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % filteredQuestions.length : 0;
    setSelectedId(filteredQuestions[nextIndex]._id);
  };

  const previousQuestion = () => {
    if (!filteredQuestions.length) return;
    const nextIndex = currentIndex > 0 ? currentIndex - 1 : filteredQuestions.length - 1;
    setSelectedId(filteredQuestions[nextIndex]._id);
  };

  const detailedSolution = question ? buildDetailedSolution(question, feedback?.correctAnswer || question.correctAnswer, feedback?.explanation || question.explanation) : "";

  return (
    <div className="container py-4 practice-pro-page">
      <div className="hero-panel mb-4">
        <p className="eyebrow mb-2">Practice Mode</p>
        <h1 className="h2 fw-bold mb-2">Daily software practice</h1>
        <p className="text-secondary mb-0">Practice coding, aptitude, HR, behavioral, and core-subject questions one by one with instant feedback.</p>
      </div>

      <div className="row g-4">
        <div className="col-xl-4">
          <div className="glass-card p-4 practice-panel-card">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              <h2 className="h4 mb-0">Question Navigator</h2>
              <span className="badge text-bg-info">{filteredQuestions.length} questions</span>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-12">
                <label className="form-label">Category</label>
                <select className="form-select" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                  <option value="">All Categories</option>
                  {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Question Type</label>
                <select className="form-select" value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>
                  {typeOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                </select>
              </div>
            </div>

            {loading && !filteredQuestions.length ? <p className="text-secondary mb-0">Loading questions...</p> : (
              <div className="practice-question-list">
                {filteredQuestions.map((item, index) => (
                  <button key={item._id} className={`practice-question-item ${selectedId === item._id ? "active" : ""}`} onClick={() => setSelectedId(item._id)}>
                    <span className="practice-question-index">{index + 1}</span>
                    <span>
                      <strong>{item.title.replace(/\s+Practice Variant\s+\d+$/i, "")}</strong>
                      <small>{item.topic} | {item.type} | {item.difficulty}</small>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-xl-8">
          <div className="glass-card p-4 question-card">
            {question ? (
              <>
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                  <div>
                    <p className="eyebrow mb-2">Current Question</p>
                    <h2 className="h3 fw-bold mb-2">{question.title.replace(/\s+Practice Variant\s+\d+$/i, "")}</h2>
                    <p className="text-secondary mb-0">{String(question.description).replace(/\s*Practice focus\s*\d*:\s*.+$/i, "").trim()}</p>
                  </div>
                  <button className={`btn ${isBookmarked ? "btn-info" : "btn-outline-light"}`} onClick={toggleBookmark}>{isBookmarked ? "Bookmarked" : "Bookmark"}</button>
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
                      <button key={option} className={`btn option-btn ${answer === option ? "option-btn-selected" : "btn-outline-light"} text-start`} onClick={() => setAnswer((current) => current === option ? "" : option)}>{option}</button>
                    ))}
                  </div>
                ) : null}

                {question.type === "Subjective" ? <textarea className="form-control mb-4" rows="8" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Write your answer here..." /> : null}

                {question.type === "Coding" ? (
                  <>
                    <div className="row g-3 mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Language</label>
                        <select className="form-select" value={language} onChange={(event) => setLanguage(event.target.value)}>
                          <option value="python">Python</option>
                          <option value="cpp">C++</option>
                          <option value="java">Java</option>
                        </select>
                      </div>
                    </div>
                    <Editor height="340px" theme="vs-dark" language={language === "cpp" ? "cpp" : language} value={answer} onChange={(value) => setAnswer(value || "")} />
                  </>
                ) : null}

                <div className="d-flex gap-2 flex-wrap mt-4">
                  <button className="btn btn-outline-light" onClick={previousQuestion}>Previous</button>
                  <button className="btn btn-info" onClick={submit}>Submit</button>
                  {question.type === "Coding" ? <button className="btn btn-outline-light" onClick={runCode}>Run Code</button> : null}
                  <button className="btn btn-outline-light" onClick={nextQuestion}>Next</button>
                </div>

                {feedback ? (
                  <div className="mt-4 vstack gap-3">
                    <div className="answer-reveal-card"><span className="feedback-label">Your Answer</span><p className="mb-0">{String(answer || "No answer submitted")}</p></div>
                    <div className="answer-reveal-card"><span className="feedback-label">Correct Answer</span><p className="mb-0">{String(feedback.correctAnswer)}</p></div>
                    <div className="answer-reveal-card"><span className="feedback-label">Detailed Solution</span><p className="mb-0">{detailedSolution}</p></div>
                    <div className="answer-reveal-card"><span className="feedback-label">Explanation</span><p className="mb-0">{feedback.explanation}</p></div>
                    {feedback.codeOutput ? <div className="terminal-panel"><p className="mb-2"><strong>Status:</strong> {feedback.codeStatus}</p><pre className="mb-0">{feedback.codeOutput}</pre></div> : null}
                  </div>
                ) : null}
              </>
            ) : (
              <p className="text-secondary mb-0">{loading ? "Loading questions..." : "No practice question is available right now."}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
