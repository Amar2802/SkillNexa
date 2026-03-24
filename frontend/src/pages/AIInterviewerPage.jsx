import { useState } from "react";
import api from "../api/client";

const AIInterviewerPage = () => {
  const [role, setRole] = useState("Software Engineer");
  const [focus, setFocus] = useState("DSA, HR, and core CS subjects");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);

  const generate = async () => {
    const { data } = await api.post("/ai/questions", { role, focus, count: 5 });
    setQuestions(data.questions);
    setSelectedQuestion(data.questions[0] || "");
  };

  const evaluate = async () => {
    const { data } = await api.post("/ai/evaluate", { question: selectedQuestion, answer });
    setEvaluation(data);
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-5"><div className="card glass-card h-100"><div className="card-body"><p className="eyebrow">AI Interviewer</p><h1 className="h3 fw-bold">Practice dynamic interview conversations</h1><div className="mb-3"><label className="form-label">Target Role</label><input className="form-control" value={role} onChange={(e) => setRole(e.target.value)} /></div><div className="mb-3"><label className="form-label">Focus Area</label><textarea className="form-control" rows="3" value={focus} onChange={(e) => setFocus(e.target.value)} /></div><button className="btn btn-info" onClick={generate}>Generate Questions</button><div className="mt-4">{questions.map((q) => <button key={q} className={`btn w-100 text-start mb-2 ${selectedQuestion === q ? "btn-info" : "btn-outline-light"}`} onClick={() => setSelectedQuestion(q)}>{q}</button>)}</div></div></div></div>
        <div className="col-lg-7"><div className="card glass-card h-100"><div className="card-body"><h2 className="h4 mb-3">Your Response</h2><p className="text-secondary">{selectedQuestion || "Generate a question to begin."}</p><textarea className="form-control" rows="10" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Write your interview answer here..." /><button className="btn btn-success mt-3" onClick={evaluate} disabled={!selectedQuestion}>Evaluate with AI</button>{evaluation && <div className="mt-4"><div className="row g-3"><div className="col-md-6"><div className="metric-card"><span>Confidence Score</span><h3>{evaluation.confidenceScore}/100</h3></div></div><div className="col-md-6"><div className="metric-card"><span>Communication Score</span><h3>{evaluation.communicationScore}/100</h3></div></div></div><div className="card bg-dark-subtle border-0 mt-3"><div className="card-body"><p><strong>Feedback:</strong> {evaluation.feedback}</p><p className="mb-0"><strong>Suggested answer:</strong> {evaluation.idealAnswer}</p></div></div></div>}</div></div></div>
      </div>
    </div>
  );
};

export default AIInterviewerPage;
