import { useState } from "react";
import api from "../api/client";

const AIInterviewerPage = ({ questions = [] }) => {
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateInterview = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/ai/questions", {
        role: "Software Engineer",
        focus: "DSA, projects, HR, and core subjects",
        count: 5,
        roundType: "Mixed",
        experienceLevel: "Fresher",
        company: "General"
      });
      setInterviewQuestions(data.questions || []);
      setCurrentIndex(0);
      setAnswer("");
      setEvaluation(null);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = interviewQuestions[currentIndex];

  const evaluateAnswer = async () => {
    if (!currentQuestion || !answer.trim()) return;
    const { data } = await api.post("/ai/evaluate", {
      question: currentQuestion.question,
      answer,
      role: "Software Engineer",
      roundType: "Mixed"
    });
    setEvaluation(data);
  };

  return (
    <div className="container py-4">
      <div className="hero-panel mb-4">
        <p className="eyebrow mb-2">AI Interviewer</p>
        <h1 className="h2 fw-bold mb-2">Practice a guided software interview round</h1>
        <p className="text-secondary mb-0">Generate one software-focused interview set, answer question by question, and review instant evaluation.</p>
      </div>

      <div className="glass-card p-4 mb-4">
        <button className="btn btn-info" onClick={generateInterview} disabled={loading}>{loading ? "Generating..." : "Generate Interview Round"}</button>
      </div>

      {currentQuestion ? (
        <div className="glass-card p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <p className="eyebrow mb-1">Question {currentIndex + 1} of {interviewQuestions.length}</p>
              <h2 className="h4 mb-0">{currentQuestion.category}</h2>
            </div>
            <span className="badge text-bg-secondary">{currentQuestion.difficulty}</span>
          </div>
          <p className="mb-4">{currentQuestion.question}</p>
          <textarea className="form-control mb-3" rows="8" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Type your interview answer here..." />
          <div className="d-flex gap-2 flex-wrap mb-4">
            <button className="btn btn-info" onClick={evaluateAnswer}>Evaluate Answer</button>
            <button className="btn btn-outline-light" onClick={() => { setCurrentIndex((index) => Math.min(index + 1, interviewQuestions.length - 1)); setAnswer(""); setEvaluation(null); }} disabled={currentIndex >= interviewQuestions.length - 1}>Next Question</button>
          </div>

          {evaluation ? (
            <div className="feedback-detail-grid">
              <div className="feedback-detail-card"><span className="feedback-label">Feedback</span><p className="mb-0">{evaluation.feedback}</p></div>
              <div className="feedback-detail-card"><span className="feedback-label">Ideal Answer</span><p className="mb-0">{evaluation.idealAnswer}</p></div>
              <div className="feedback-detail-card"><span className="feedback-label">Confidence</span><p className="mb-0">{evaluation.confidenceScore}</p></div>
              <div className="feedback-detail-card"><span className="feedback-label">Communication</span><p className="mb-0">{evaluation.communicationScore}</p></div>
              <div className="feedback-detail-card"><span className="feedback-label">Structure</span><p className="mb-0">{evaluation.structureScore}</p></div>
              <div className="feedback-detail-card"><span className="feedback-label">Technical Depth</span><p className="mb-0">{evaluation.technicalScore}</p></div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="glass-card p-4"><p className="text-secondary mb-0">Generate an interview round to begin.</p></div>
      )}
    </div>
  );
};

export default AIInterviewerPage;

