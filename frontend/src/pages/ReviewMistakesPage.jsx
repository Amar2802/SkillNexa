import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ReviewMistakesPage = ({ history = [] }) => {
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState("All Topics");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const mistakes = useMemo(() => {
    return history.flatMap((result) =>
      (result.answers || [])
        .filter((answer) => !answer.isCorrect)
        .map((answer, index) => {
          const question = answer.question || null;

          return {
            id: `${result._id}-${question?._id || index}`,
            resultId: result._id,
            testTitle: result.test?.title || "Mock Test",
            createdAt: result.createdAt,
            question,
            topic: question?.topic || answer.topic || "General",
            category: question?.category || "General",
            difficulty: question?.difficulty || "Mixed",
            questionTitle: question?.title || `Question ${index + 1}`,
            questionDescription: question?.description || answer.feedback || "Review this question carefully.",
            submittedAnswer: answer.submittedAnswer,
            correctAnswer: question?.correctAnswer || answer.correctAnswer || "Review in question bank",
            explanation: question?.explanation || answer.feedback || "Review this concept again."
          };
        })
    );
  }, [history]);

  const topics = useMemo(
    () => ["All Topics", ...new Set(mistakes.map((mistake) => mistake.topic).filter(Boolean))],
    [mistakes]
  );

  const filteredMistakes = useMemo(() => {
    return mistakes.filter((mistake) => {
      const dateKey = toDateInputValue(mistake.createdAt);
      const matchesTopic = activeTopic === "All Topics" || mistake.topic === activeTopic;
      const matchesFrom = !dateFrom || dateKey >= dateFrom;
      const matchesTo = !dateTo || dateKey <= dateTo;

      return matchesTopic && matchesFrom && matchesTo;
    });
  }, [mistakes, activeTopic, dateFrom, dateTo]);

  const openTopicReview = (mistake) => {
    const params = new URLSearchParams();
    if (mistake.topic) params.set("topic", mistake.topic);
    if (mistake.category) params.set("category", mistake.category);
    navigate(`/questions?${params.toString()}`);
  };

  const resetFilters = () => {
    setActiveTopic("All Topics");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="container py-4">
      <p className="eyebrow mb-1">Review Mistakes</p>
      <h1 className="h2 fw-bold mb-2">Learn from previous wrong answers</h1>
      <p className="text-secondary mb-4">This page collects incorrect answers from your mock tests so you can revise faster and focus on weak concepts.</p>

      {mistakes.length ? (
        <>
          <div className="card glass-card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div>
                  <h2 className="h5 mb-1">Filter mistakes by topic or date</h2>
                  <p className="text-secondary mb-0">Use the topic selector and date range to quickly review the mistakes you want.</p>
                </div>
                <span className="badge text-bg-info review-count-badge">
                  Showing {filteredMistakes.length} of {mistakes.length}
                </span>
              </div>
              <div className="row g-3 review-filter-grid">
                <div className="col-lg-5 col-md-12">
                  <label className="form-label">Topic</label>
                  <select className="form-select" value={activeTopic} onChange={(e) => setActiveTopic(e.target.value)}>
                    {topics.map((topic) => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-3 col-md-6">
                  <label className="form-label">From Date</label>
                  <input className="form-control" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                </div>
                <div className="col-lg-3 col-md-6">
                  <label className="form-label">To Date</label>
                  <input className="form-control" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </div>
                <div className="col-lg-1 col-md-12 d-flex align-items-end">
                  <button type="button" className="btn btn-outline-light w-100" onClick={resetFilters}>Reset</button>
                </div>
              </div>
            </div>
          </div>

          {filteredMistakes.length ? (
            <div className="vstack gap-3">
              {filteredMistakes.map((mistake) => (
                <button type="button" className="card glass-card mistake-card" key={mistake.id} onClick={() => openTopicReview(mistake)}>
                  <div className="card-body text-start">
                    <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                      <div>
                        <p className="eyebrow mb-2">{mistake.testTitle}</p>
                        <h2 className="h5 mb-2">{mistake.questionTitle}</h2>
                        <p className="mb-0 text-secondary">{mistake.category} | {mistake.topic} | {mistake.difficulty}</p>
                      </div>
                      <span className="badge text-bg-info align-self-start">{new Date(mistake.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="feedback-detail-card mb-3">
                      <span className="feedback-label">Question</span>
                      <p className="mb-0">{mistake.questionDescription}</p>
                    </div>
                    <div className="mistake-grid">
                      <div className="feedback-detail-card">
                        <span className="feedback-label">Your Answer</span>
                        <p className="mb-0">{mistake.submittedAnswer ? String(mistake.submittedAnswer) : "No answer submitted"}</p>
                      </div>
                      <div className="feedback-detail-card">
                        <span className="feedback-label">Correct Answer</span>
                        <p className="mb-0">{String(mistake.correctAnswer)}</p>
                      </div>
                      <div className="feedback-detail-card feedback-detail-card-wide">
                        <span className="feedback-label">Explanation</span>
                        <p className="mb-2"><strong>Right Answer:</strong> {String(mistake.correctAnswer)}</p>
                        <p className="mb-0">{mistake.explanation}</p>
                      </div>
                    </div>
                    <p className="mt-3 mb-0 text-secondary">Click to open related questions in the Question Bank for revision.</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="card glass-card">
              <div className="card-body">
                <p className="mb-0 text-secondary">No mistakes match the current filters. Try a different topic or date range.</p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="card glass-card">
          <div className="card-body">
            <p className="mb-0 text-secondary">No mistakes recorded yet. Complete a mock test and your incorrect answers will appear here automatically.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewMistakesPage;
