import { useMemo, useState } from "react";

const ReviewMistakesPage = ({ history = [] }) => {
  const [topic, setTopic] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const mistakes = useMemo(() => {
    return history
      .flatMap((result) => (result.answers || []).filter((answer) => !answer.isCorrect).map((answer) => ({
        ...answer,
        testTitle: result.test?.title || "Mock Test",
        createdAt: result.createdAt
      })))
      .filter((item) => {
        const created = item.createdAt ? new Date(item.createdAt) : null;
        if (topic && item.question?.topic !== topic) return false;
        if (fromDate && created && created < new Date(fromDate)) return false;
        if (toDate && created && created > new Date(`${toDate}T23:59:59`)) return false;
        return true;
      });
  }, [history, topic, fromDate, toDate]);

  const topics = [...new Set(mistakes.map((item) => item.question?.topic).filter(Boolean))];

  return (
    <div className="container py-4">
      <p className="eyebrow mb-1">Review Mistakes</p>
      <h1 className="h2 fw-bold mb-2">Turn wrong answers into revision</h1>
      <p className="text-secondary mb-4">See the question, your answer, the right answer, and explanation in one place.</p>

      <div className="glass-card p-4 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Topic</label>
            <select className="form-select" value={topic} onChange={(event) => setTopic(event.target.value)}>
              <option value="">All topics</option>
              {topics.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">From Date</label>
            <input type="date" className="form-control" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">To Date</label>
            <input type="date" className="form-control" value={toDate} onChange={(event) => setToDate(event.target.value)} />
          </div>
        </div>
      </div>

      {mistakes.length ? (
        <div className="vstack gap-4">
          {mistakes.map((item, index) => (
            <div className="glass-card p-4" key={`${item.question?._id || index}-${index}`}>
              <p className="eyebrow mb-1">{item.testTitle}</p>
              <h2 className="h4 mb-2">{item.question?.title || "Question"}</h2>
              <p className="text-secondary mb-3">{item.question?.description || ""}</p>
              <div className="answer-reveal-panel">
                <div className="answer-reveal-card"><span className="feedback-label">Your Answer</span><p className="mb-0">{String(item.submittedAnswer || "No answer submitted")}</p></div>
                <div className="answer-reveal-card"><span className="feedback-label">Correct Answer</span><p className="mb-0">{String(item.question?.correctAnswer || "")}</p></div>
              </div>
              <div className="answer-reveal-card mt-3"><span className="feedback-label">Explanation</span><p className="mb-0">Right Answer: {String(item.question?.correctAnswer || "")}. {item.question?.explanation || item.feedback || ""}</p></div>
            </div>
          ))}
        </div>
      ) : <div className="glass-card p-4"><p className="text-secondary mb-0">No mistakes to review yet. Take a mock test and this page will start becoming useful.</p></div>}
    </div>
  );
};

export default ReviewMistakesPage;
