import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import api from "../api/client";

const BookmarkIcon = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 4.75C6 4.33579 6.33579 4 6.75 4H17.25C17.6642 4 18 4.33579 18 4.75V20L12 16.25L6 20V4.75Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

const PracticePage = ({ questions, bookmarks = [], refreshBookmarks }) => {
  const categories = useMemo(() => [...new Set(questions.map((question) => question.category))], [questions]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [language, setLanguage] = useState("python");
  const [runResult, setRunResult] = useState(null);
  const [startedAt, setStartedAt] = useState(Date.now());

  useEffect(() => {
    if (categories.length && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  const filteredQuestions = useMemo(
    () => questions.filter((question) => !selectedCategory || question.category === selectedCategory),
    [questions, selectedCategory]
  );

  useEffect(() => {
    if (!filteredQuestions.length) {
      setSelectedId("");
      return;
    }

    const existsInCategory = filteredQuestions.some((question) => question._id === selectedId);
    if (!selectedId || !existsInCategory) {
      setSelectedId(filteredQuestions[0]._id);
    }
  }, [filteredQuestions, selectedId]);

  const currentIndex = useMemo(
    () => filteredQuestions.findIndex((question) => question._id === selectedId),
    [filteredQuestions, selectedId]
  );

  const question = useMemo(
    () => filteredQuestions.find((currentQuestion) => currentQuestion._id === selectedId),
    [filteredQuestions, selectedId]
  );

  const isBookmarked = useMemo(
    () => bookmarks.some((bookmark) => bookmark._id === selectedId),
    [bookmarks, selectedId]
  );

  useEffect(() => {
    if (!question) return;
    setStartedAt(Date.now());
    setFeedback(null);
    setRunResult(null);
    setAnswer(question.type === "Coding" ? (question.starterCode?.[language] || "") : "");
  }, [question, language]);

  const submit = async () => {
    const { data } = await api.post(`/questions/${selectedId}/evaluate`, {
      answer,
      timeSpent: Math.round((Date.now() - startedAt) / 1000)
    });
    setFeedback(data);
  };

  const runCode = async () => {
    const { data } = await api.post("/code/run", { code: answer, language });
    setRunResult(data);
  };

  const bookmark = async () => {
    await api.post(`/users/bookmarks/${selectedId}`);
    refreshBookmarks();
  };

  const goToPreviousQuestion = () => {
    if (!filteredQuestions.length) return;
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : filteredQuestions.length - 1;
    setSelectedId(filteredQuestions[previousIndex]._id);
  };

  const goToNextQuestion = () => {
    if (!filteredQuestions.length) return;
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % filteredQuestions.length : 0;
    setSelectedId(filteredQuestions[nextIndex]._id);
  };

  const getOptionState = (option) => {
    if (question?.type !== "MCQ") return "default";
    if (!feedback) {
      return String(option) === String(answer) ? "selected" : "default";
    }
    if (String(option) === String(feedback.correctAnswer)) return "correct";
    if (String(option) === String(answer) && !feedback.isCorrect) return "incorrect";
    return "default";
  };

  const getOptionLabel = (option) => {
    const state = getOptionState(option);
    if (state === "selected") return "Selected";
    if (state === "correct") return "Correct";
    if (state === "incorrect") return "Incorrect";
    return "Option";
  };

  return (
    <div className="container py-4">
      <div className="row g-4 align-items-start">
        <div className="col-xl-4">
          <div className="card glass-card practice-control-card">
            <div className="card-body">
              <p className="eyebrow mb-2">Practice Mode</p>
              <h1 className="h3 fw-bold mb-3">Question Library</h1>
              <p className="text-secondary mb-4">Switch between focused sections and practice only the related questions.</p>

              <div className="practice-category-tabs mb-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`practice-category-tab ${selectedCategory === category ? "active" : ""}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="practice-question-list">
                {filteredQuestions.map((currentQuestion, index) => (
                  <button
                    key={currentQuestion._id}
                    className={`practice-question-item ${selectedId === currentQuestion._id ? "active" : ""}`}
                    onClick={() => setSelectedId(currentQuestion._id)}
                  >
                    <span className="practice-question-index">{String(index + 1).padStart(2, "0")}</span>
                    <span>
                      <strong>{currentQuestion.title}</strong>
                      <small>{currentQuestion.topic} | {currentQuestion.type} | {currentQuestion.difficulty}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-8">
          <div className="vstack gap-4">
            <div className="card glass-card question-card">
              <div className="card-body question-card-body">
                {question ? (
                  <>
                    <button
                      className={`btn question-bookmark-btn ${isBookmarked ? "btn-info" : "btn-outline-warning"}`}
                      onClick={bookmark}
                      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark question"}
                      title={isBookmarked ? "Bookmarked" : "Bookmark question"}
                    >
                      <BookmarkIcon active={isBookmarked} />
                    </button>

                    <div className="question-header mb-3">
                      <p className="eyebrow mb-2">Current Question</p>
                      <h2 className="h3 fw-bold mb-2">{question.title}</h2>
                      <p className="text-secondary mb-3">{question.description}</p>
                      <div className="d-flex gap-2 flex-wrap">
                        <span className="badge text-bg-dark">{question.category}</span>
                        <span className="badge text-bg-dark">{question.topic}</span>
                        <span className="badge text-bg-info">{question.type}</span>
                        <span className="badge text-bg-secondary">{question.difficulty}</span>
                      </div>
                    </div>

                    {question.type === "MCQ" && (
                      <div className="vstack gap-2 mb-4">
                        {question.options.map((option) => {
                          const optionState = getOptionState(option);
                          return (
                            <button
                              key={option}
                              className={`btn option-btn option-btn-${optionState} ${answer === option ? "option-selected" : ""} text-start`}
                              onClick={() => setAnswer(option)}
                            >
                              <span className={`option-state-pill option-state-pill-${optionState}`}>{getOptionLabel(option)}</span>
                              <span className="option-text">{option}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {question.type === "Subjective" && (
                      <textarea className="form-control mb-4" rows="9" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Write your answer here..." />
                    )}

                    {question.type === "Coding" && (
                      <>
                        <div className="row g-3 mb-3">
                          <div className="col-md-4">
                            <label className="form-label">Language</label>
                            <select className="form-select question-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                              <option value="python">Python</option>
                              <option value="cpp">C++</option>
                              <option value="java">Java</option>
                            </select>
                          </div>
                        </div>
                        <Editor height="360px" theme="vs-dark" language={language === "cpp" ? "cpp" : language} value={answer} onChange={(value) => setAnswer(value || "")} />
                      </>
                    )}

                    {feedback && (
                      <div className="answer-reveal-panel mt-4">
                        <div className="answer-reveal-card">
                          <span className="feedback-label">Your Answer</span>
                          <p className="mb-0">{answer ? String(answer) : "No answer submitted"}</p>
                        </div>
                        <div className="answer-reveal-card">
                          <span className="feedback-label">Correct Answer</span>
                          <p className="mb-0">{String(feedback.correctAnswer)}</p>
                        </div>
                      </div>
                    )}

                    <div className="d-flex gap-2 mt-4 flex-wrap">
                      <button className="btn btn-outline-light" onClick={goToPreviousQuestion}>Previous</button>
                      <button className="btn btn-info" onClick={submit}>Submit</button>
                      {question.type === "Coding" && <button className="btn btn-outline-light" onClick={runCode}>Run Code</button>}
                      <button className="btn btn-outline-light" onClick={goToNextQuestion}>Next</button>
                    </div>
                  </>
                ) : (
                  <p className="text-secondary mb-0">Select a question to begin practicing.</p>
                )}
              </div>
            </div>

            <div className="card glass-card">
              <div className="card-body">
                <h2 className="h4 mb-3">Instant Feedback</h2>
                {feedback ? (
                  <>
                    <div className={`alert ${feedback.isCorrect ? "alert-success" : "alert-warning"}`}>
                      {feedback.isCorrect ? "Your submitted answer is correct." : "Your submitted answer needs improvement."}
                    </div>
                    <div className="feedback-detail-grid">
                      <div className="feedback-detail-card">
                        <span className="feedback-label">Correct Answer</span>
                        <p className="mb-0">{String(feedback.correctAnswer)}</p>
                      </div>
                      <div className="feedback-detail-card feedback-detail-card-wide">
                        <span className="feedback-label">Detailed Explanation</span>
                        <p className="mb-0">{feedback.explanation}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-secondary mb-0">Submit an answer to get correctness and detailed explanation.</p>
                )}

                {runResult && (
                  <div className="terminal-panel mt-4">
                    <p className="mb-2"><strong>Status:</strong> {runResult.status}</p>
                    <pre className="mb-0">{runResult.output}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
