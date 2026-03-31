import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import api from "../api/client";
import { mapCategoryToBucket, recordDailyAttempt } from "../utils/prepTracking";

const BookmarkIcon = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M6 4.75C6 4.33579 6.33579 4 6.75 4H17.25C17.6642 4 18 4.33579 18 4.75V20L12 16.25L6 20V4.75Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

const practiceTips = {
  MCQ: "Read every option once before locking your choice, then eliminate weak distractors.",
  Subjective: "Structure your response with a short definition, a clear explanation, and one example.",
  Coding: "State the approach first, then write clean code and validate edge cases before submission."
};

const FIELD_PRACTICE_COPY = {
  Software: {
    title: "Sharpen one concept at a time",
    subtitle: "Move through software-interview questions with instant feedback, bookmarks, and coding support without losing your context."
  },
  UPSC: {
    title: "Build answer quality one concept at a time",
    subtitle: "Practice structured civil-services responses for current affairs, ethics, and personality-test style prompts."
  },
  NDA: {
    title: "Build defence-round confidence one question at a time",
    subtitle: "Practice mathematics, general ability, and SSB-style questions with clear thinking and confident delivery."
  },
  Banking: {
    title: "Build exam confidence one question at a time",
    subtitle: "Practice banking-focused quant, reasoning, English, and awareness questions with fast feedback."
  },
  SSC: {
    title: "Strengthen competitive-exam performance one question at a time",
    subtitle: "Practice SSC-style reasoning, aptitude, English, and awareness questions in a focused flow."
  },
  Railways: {
    title: "Strengthen railway-prep performance one question at a time",
    subtitle: "Practice technical, operational, and awareness questions relevant to railway recruitment and interviews."
  },
  Teaching: {
    title: "Strengthen classroom-ready responses one question at a time",
    subtitle: "Practice pedagogy, teaching aptitude, and communication questions with clear, student-focused structure."
  },
  "State PSC": {
    title: "Strengthen state-services preparation one question at a time",
    subtitle: "Practice governance, current affairs, and interview-personality questions with public-service focus."
  }
};

const stripPracticeVariant = (value = "") => value.replace(/\s*Practice Variant\s*\d+/gi, "").trim();

const getPracticeDisplayText = (question) => {
  if (!question) {
    return {
      cleanTitle: "",
      cleanDescription: "",
      bracketedAdvice: ""
    };
  }

  const cleanTitle = stripPracticeVariant(question.title || "");
  const rawDescription = (question.description || "").trim();
  const practiceFocusMatch = rawDescription.match(/Practice focus\s*\d*\s*:\s*(.+)$/i);
  const focusAdvice = practiceFocusMatch?.[1]?.trim() || "";
  const cleanDescription = rawDescription.replace(/\s*Practice focus\s*\d*\s*:\s*.+$/i, "").trim();

  return {
    cleanTitle,
    cleanDescription: focusAdvice ? (cleanDescription + " (" + focusAdvice + ")").trim() : cleanDescription,
    bracketedAdvice: focusAdvice ? "(" + focusAdvice + ")" : ""
  };
};

const PracticePage = ({ questions, bookmarks = [], refreshBookmarks, targetField = "Software" }) => {
  const pageCopy = FIELD_PRACTICE_COPY[targetField] || FIELD_PRACTICE_COPY.Software;
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

    if (question) {
      recordDailyAttempt({
        bucket: mapCategoryToBucket(question.category, "", question.field || targetField),
        questionId: question._id,
        title: question.title,
        topic: question.topic,
        category: question.category,
        source: "practice",
        field: question.field || targetField
      });
    }
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

  const currentQuestionNumber = currentIndex >= 0 ? currentIndex + 1 : 0;
  const completionLabel = filteredQuestions.length ? `${currentQuestionNumber}/${filteredQuestions.length}` : "0/0";
  const completionPercent = filteredQuestions.length ? Math.round((currentQuestionNumber / filteredQuestions.length) * 100) : 0;
  const categoryQuestionTypes = useMemo(() => {
    const counts = filteredQuestions.reduce(
      (acc, currentQuestion) => {
        acc[currentQuestion.type] = (acc[currentQuestion.type] || 0) + 1;
        return acc;
      },
      {}
    );

    return [
      { label: "Coding", value: counts.Coding || 0 },
      { label: "Subjective", value: counts.Subjective || 0 },
      { label: "MCQ", value: counts.MCQ || 0 }
    ];
  }, [filteredQuestions]);

  const displayQuestion = useMemo(() => getPracticeDisplayText(question), [question]);
  const practiceAdvice = question ? practiceTips[question.type] : "Choose a question to get focused preparation advice.";
  const nextMove = feedback
    ? feedback.isCorrect
      ? "Move to the next question or bookmark this one if you want to revise it later."
      : "Read the explanation once, improve your wording or logic, and submit again."
    : "Pick your answer carefully, then submit to reveal detailed feedback and the correct answer.";

  return (
    <div className="container py-4 practice-pro-page">
      <div className="practice-hero-strip mb-4">
        <div>
          <p className="eyebrow mb-2">Practice Mode</p>
          <h1 className="h2 fw-bold mb-2">{pageCopy.title}</h1>
          <p className="text-secondary mb-0">{pageCopy.subtitle}</p>
        </div>
        <div className="practice-hero-metrics">
          <div className="practice-hero-chip">
            <span>Field</span>
            <strong>{targetField}</strong>
          </div>
          <div className="practice-hero-chip">
            <span>Category</span>
            <strong>{selectedCategory || "Not selected"}</strong>
          </div>
          <div className="practice-hero-chip">
            <span>Question</span>
            <strong>{completionLabel}</strong>
          </div>
          <div className="practice-hero-chip">
            <span>Bookmarks</span>
            <strong>{bookmarks.length}</strong>
          </div>
        </div>
      </div>

      <div className="row g-4 align-items-start">
        <div className="col-xl-4">
          <div className="card glass-card practice-control-card practice-panel-card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div>
                  <p className="eyebrow mb-2">Question Navigator</p>
                  <h2 className="h4 mb-0">Focused question list</h2>
                </div>
                <span className="badge text-bg-info">{filteredQuestions.length} questions</span>
              </div>
              <p className="text-secondary mb-4">Choose a subject, jump between questions, and keep your {targetField} preparation targeted.</p>

              <div className="practice-panel-summary mb-4">
                <div className="practice-progress-ring">
                  <strong>{completionPercent}%</strong>
                  <span>Progress</span>
                </div>
                <div className="practice-summary-copy">
                  <strong>{question?.topic || "Pick a topic"}</strong>
                  <span>{practiceAdvice}</span>
                </div>
              </div>

              <div className="practice-mini-stats mb-4">
                {categoryQuestionTypes.map((item) => (
                  <div key={item.label} className="practice-mini-stat">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>

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
                      <strong>{stripPracticeVariant(currentQuestion.title)}</strong>
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
            <div className="card glass-card question-card practice-main-card">
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
                      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
                        <div>
                          <p className="eyebrow mb-2">Current Question</p>
                          <h2 className="h3 fw-bold mb-2">{displayQuestion.cleanTitle}</h2>
                        </div>
                        <span className="badge text-bg-info">Question {currentQuestionNumber} of {filteredQuestions.length}</span>
                      </div>
                      <p className="text-secondary mb-3">{displayQuestion.cleanDescription}</p>
                      <div className="d-flex gap-2 flex-wrap">
                        <span className="badge text-bg-dark">{question.field || targetField}</span>
                        <span className="badge text-bg-dark">{question.category}</span>
                        <span className="badge text-bg-dark">{question.topic}</span>
                        <span className="badge text-bg-info">{question.type}</span>
                        <span className="badge text-bg-secondary">{question.difficulty}</span>
                      </div>
                    </div>

                    <div className="practice-focus-strip mb-4">
                      <div>
                        <span className="feedback-label">Practice Focus</span>
                        <p className="mb-0">{practiceAdvice} {displayQuestion.bracketedAdvice}</p>
                      </div>
                      <div className="practice-focus-side">
                        <span className="feedback-label">Recommended Move</span>
                        <p className="mb-0">{nextMove}</p>
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
                      <textarea className="form-control mb-4" rows="9" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder={`Write your ${targetField} answer here...`} />
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

            <div className="card glass-card practice-feedback-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                  <h2 className="h4 mb-0">Instant Feedback</h2>
                  {feedback && <span className={`badge ${feedback.isCorrect ? "text-bg-info" : "text-bg-secondary"}`}>{feedback.isCorrect ? "Correct" : "Needs work"}</span>}
                </div>
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
                  <p className="text-secondary mb-0">Submit an answer to get correctness feedback, explanation, and answer comparison here.</p>
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
