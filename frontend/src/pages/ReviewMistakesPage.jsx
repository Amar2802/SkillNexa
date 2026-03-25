import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const ReviewMistakesPage = ({ history = [] }) => {
  const navigate = useNavigate();

  const mistakes = useMemo(() => {
    return history.flatMap((result) =>
      (result.answers || [])
        .filter((answer) => !answer.isCorrect && answer.question)
        .map((answer, index) => ({
          id: `${result._id}-${answer.question?._id || index}`,
          resultId: result._id,
          testTitle: result.test?.title || "Mock Test",
          createdAt: result.createdAt,
          question: answer.question,
          submittedAnswer: answer.submittedAnswer,
          feedback: answer.feedback
        }))
    );
  }, [history]);

  const openTopicReview = (mistake) => {
    const params = new URLSearchParams();
    if (mistake.question?.topic) params.set("topic", mistake.question.topic);
    if (mistake.question?.category) params.set("category", mistake.question.category);
    navigate(`/questions?${params.toString()}`);
  };

  return (
    <div className="container py-4">
      <p className="eyebrow mb-1">Review Mistakes</p>
      <h1 className="h2 fw-bold mb-2">Learn from previous wrong answers</h1>
      <p className="text-secondary mb-4">This page collects incorrect answers from your mock tests so you can revise faster and focus on weak concepts.</p>

      {mistakes.length ? (
        <div className="vstack gap-3">
          {mistakes.map((mistake) => (
            <button type="button" className="card glass-card mistake-card" key={mistake.id} onClick={() => openTopicReview(mistake)}>
              <div className="card-body text-start">
                <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                  <div>
                    <p className="eyebrow mb-2">{mistake.testTitle}</p>
                    <h2 className="h5 mb-2">{mistake.question.title}</h2>
                    <p className="mb-0 text-secondary">{mistake.question.category} | {mistake.question.topic} | {mistake.question.difficulty}</p>
                  </div>
                  <span className="badge text-bg-info align-self-start">{new Date(mistake.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="feedback-detail-card mb-3">
                  <span className="feedback-label">Question</span>
                  <p className="mb-0">{mistake.question.description || "Review this question carefully."}</p>
                </div>
                <div className="mistake-grid">
                  <div className="feedback-detail-card">
                    <span className="feedback-label">Your Answer</span>
                    <p className="mb-0">{mistake.submittedAnswer ? String(mistake.submittedAnswer) : "No answer submitted"}</p>
                  </div>
                  <div className="feedback-detail-card">
                    <span className="feedback-label">Correct Answer</span>
                    <p className="mb-0">{String(mistake.question.correctAnswer)}</p>
                  </div>
                  <div className="feedback-detail-card feedback-detail-card-wide">
                    <span className="feedback-label">Explanation</span>
                    <p className="mb-0">{mistake.question.explanation || mistake.feedback || "Review this concept again."}</p>
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
            <p className="mb-0 text-secondary">No mistakes recorded yet. Complete a mock test and your incorrect answers will appear here automatically.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewMistakesPage;
