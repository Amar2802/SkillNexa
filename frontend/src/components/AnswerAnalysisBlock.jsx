const AnswerAnalysisSkeleton = () => (
  <div className="glass-card p-4 mt-3 answer-analysis-card">
    <p className="eyebrow mb-2">Answer Analysis</p>
    <div className="placeholder-glow vstack gap-2">
      <span className="placeholder col-4" />
      <span className="placeholder col-12" />
      <span className="placeholder col-10" />
      <span className="placeholder col-8" />
    </div>
  </div>
);

const AnswerAnalysisBlock = ({ analysis, loading }) => {
  if (loading) return <AnswerAnalysisSkeleton />;
  if (!analysis) return null;

  const isCorrect = String(analysis.verdict || "").toLowerCase() === "correct";

  return (
    <div className="glass-card p-4 mt-3 answer-analysis-card">
      <p className="eyebrow mb-2">Answer Analysis</p>
      <p className={`mb-3 fw-semibold ${isCorrect ? "text-success" : "text-danger"}`}>{analysis.verdict}</p>
      <div className="vstack gap-3">
        {analysis.suggestedAnswer ? (
          <div>
            <span className="feedback-label">Suggested answer you can give</span>
            <p className="mb-0 text-secondary">{analysis.suggestedAnswer}</p>
          </div>
        ) : null}
        <div>
          <span className="feedback-label">Why the correct answer is right</span>
          <p className="mb-0 text-secondary">{analysis.whyCorrect}</p>
        </div>
        {!isCorrect && analysis.whyWrong ? (
          <div>
            <span className="feedback-label">Why your answer was wrong</span>
            <p className="mb-0 text-secondary">{analysis.whyWrong}</p>
          </div>
        ) : null}
        <div>
          <span className="feedback-label">Key concept</span>
          <p className="mb-0 text-secondary">{analysis.concept}</p>
        </div>
      </div>
    </div>
  );
};

export default AnswerAnalysisBlock;
