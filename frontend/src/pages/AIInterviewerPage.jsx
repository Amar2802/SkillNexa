import { useMemo, useState } from "react";
import api from "../api/client";

const roundOptions = ["Full Loop", "Technical", "HR", "Mixed"];
const companyOptions = ["General", "Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture"];

const AIInterviewerPage = ({ questions = [] }) => {
  const [config, setConfig] = useState({
    role: "Software Engineer",
    company: "General",
    experienceLevel: "Fresher",
    roundType: "Full Loop",
    count: 5
  });
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const generateInterview = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/ai/questions", {
        role: config.role,
        focus: "DSA, projects, HR, aptitude, and core subjects",
        count: config.count,
        roundType: config.roundType,
        experienceLevel: config.experienceLevel,
        company: config.company
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
  const roundSummary = useMemo(() => interviewQuestions.map((item) => item.round), [interviewQuestions]);

  const evaluateAnswer = async () => {
    if (!currentQuestion || !answer.trim()) return;
    try {
      setEvaluating(true);
      const { data } = await api.post("/ai/evaluate", {
        question: currentQuestion.question,
        answer,
        role: config.role,
        roundType: config.roundType,
        round: currentQuestion.round
      });
      setEvaluation(data);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="hero-panel mb-4">
        <p className="eyebrow mb-2">AI Interviewer</p>
        <h1 className="h2 fw-bold mb-2">Practice a realistic software interview loop</h1>
        <p className="text-secondary mb-0">Generate a multi-round interview flow with aptitude, technical, project, and HR style questioning.</p>
      </div>

      <div className="glass-card p-4 mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Role</label>
            <input className="form-control" value={config.role} onChange={(event) => setConfig((current) => ({ ...current, role: event.target.value }))} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Company</label>
            <select className="form-select" value={config.company} onChange={(event) => setConfig((current) => ({ ...current, company: event.target.value }))}>
              {companyOptions.map((company) => <option key={company} value={company}>{company}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Experience</label>
            <select className="form-select" value={config.experienceLevel} onChange={(event) => setConfig((current) => ({ ...current, experienceLevel: event.target.value }))}>
              <option value="Fresher">Fresher</option>
              <option value="Experienced">Experienced</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Interview Flow</label>
            <select className="form-select" value={config.roundType} onChange={(event) => setConfig((current) => ({ ...current, roundType: event.target.value }))}>
              {roundOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Questions</label>
            <select className="form-select" value={config.count} onChange={(event) => setConfig((current) => ({ ...current, count: Number(event.target.value) }))}>
              {[3, 4, 5, 6, 7].map((count) => <option key={count} value={count}>{count}</option>)}
            </select>
          </div>
        </div>
        <button className="btn btn-info mt-3" onClick={generateInterview} disabled={loading}>{loading ? "Generating..." : "Generate Interview Round"}</button>
      </div>

      {interviewQuestions.length ? (
        <div className="glass-card p-4 mb-4">
          <p className="eyebrow mb-2">Interview Plan</p>
          <div className="d-flex gap-2 flex-wrap">
            {roundSummary.map((round, index) => (
              <span key={`${round}-${index}`} className={`badge ${index === currentIndex ? "text-bg-info" : "text-bg-dark"}`}>{index + 1}. {round}</span>
            ))}
          </div>
        </div>
      ) : null}

      {currentQuestion ? (
        <div className="glass-card p-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <p className="eyebrow mb-1">Question {currentIndex + 1} of {interviewQuestions.length}</p>
              <h2 className="h4 mb-1">{currentQuestion.round}</h2>
              <p className="text-secondary mb-0">{currentQuestion.category}</p>
            </div>
            <span className="badge text-bg-secondary">{currentQuestion.difficulty}</span>
          </div>

          <div className="feedback-detail-grid mb-4">
            <div className="feedback-detail-card"><span className="feedback-label">Interviewer Intent</span><p className="mb-0">{currentQuestion.intent}</p></div>
            <div className="feedback-detail-card"><span className="feedback-label">Evaluation Focus</span><p className="mb-0">{currentQuestion.evaluationFocus}</p></div>
            <div className="feedback-detail-card"><span className="feedback-label">Follow-up Hint</span><p className="mb-0">{currentQuestion.followUpHint}</p></div>
          </div>

          <p className="mb-4">{currentQuestion.question}</p>
          <textarea className="form-control mb-3" rows="8" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Type your interview answer here as if you are speaking to a real interviewer..." />
          <div className="d-flex gap-2 flex-wrap mb-4">
            <button className="btn btn-info" onClick={evaluateAnswer} disabled={evaluating}>{evaluating ? "Evaluating..." : "Evaluate Answer"}</button>
            <button className="btn btn-outline-light" onClick={() => { setCurrentIndex((index) => Math.max(index - 1, 0)); setAnswer(""); setEvaluation(null); }} disabled={currentIndex <= 0}>Previous Question</button>
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
              <div className="feedback-detail-card"><span className="feedback-label">Strengths</span><p className="mb-0">{(evaluation.strengths || []).join(", ")}</p></div>
              <div className="feedback-detail-card"><span className="feedback-label">Improvements</span><p className="mb-0">{(evaluation.improvements || []).join(", ")}</p></div>
              <div className="feedback-detail-card"><span className="feedback-label">Follow-up Question</span><p className="mb-0">{evaluation.followUpQuestion}</p></div>
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
