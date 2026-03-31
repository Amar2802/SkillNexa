import { useMemo, useState } from "react";
import api from "../api/client";

const roundOptions = ["Mixed", "Technical", "HR", "Managerial", "Project Discussion"];
const experienceOptions = ["Student", "Fresher", "Experienced"];
const companyOptions = ["", "Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture"];

const AIInterviewerPage = () => {
  const [role, setRole] = useState("Software Engineer");
  const [focus, setFocus] = useState("DSA, system fundamentals, HR, and project discussion");
  const [roundType, setRoundType] = useState("Mixed");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [company, setCompany] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const selectedQuestion = useMemo(
    () => questions.find((item) => item.id === selectedQuestionId) || null,
    [questions, selectedQuestionId]
  );

  const generate = async () => {
    try {
      setLoadingQuestions(true);
      setEvaluation(null);
      setAnswer("");
      const { data } = await api.post("/ai/questions", {
        role,
        focus,
        roundType,
        experienceLevel,
        company,
        count: 6
      });
      const generatedQuestions = data.questions || [];
      setQuestions(generatedQuestions);
      setSelectedQuestionId(generatedQuestions[0]?.id || "");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const evaluate = async () => {
    if (!selectedQuestion?.question || !answer.trim()) return;

    try {
      setEvaluating(true);
      const { data } = await api.post("/ai/evaluate", {
        question: selectedQuestion.question,
        answer,
        role,
        roundType
      });
      setEvaluation(data);
    } finally {
      setEvaluating(false);
    }
  };

  const pickQuestion = (questionId) => {
    setSelectedQuestionId(questionId);
    setAnswer("");
    setEvaluation(null);
  };

  const scoreCards = evaluation ? [
    { label: "Confidence", value: evaluation.confidenceScore },
    { label: "Communication", value: evaluation.communicationScore },
    { label: "Structure", value: evaluation.structureScore },
    { label: "Technical Depth", value: evaluation.technicalScore }
  ] : [];

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card glass-card h-100">
            <div className="card-body">
              <p className="eyebrow">AI Interviewer</p>
              <h1 className="h3 fw-bold">Run a more realistic interview simulation</h1>
              <p className="text-secondary mb-4">Configure the round, generate targeted questions, and get structured feedback with follow-up guidance.</p>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Target Role</label>
                  <input className="form-control" value={role} onChange={(e) => setRole(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Interview Round</label>
                  <select className="form-select" value={roundType} onChange={(e) => setRoundType(e.target.value)}>
                    {roundOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Experience Level</label>
                  <select className="form-select" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                    {experienceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Target Company</label>
                  <select className="form-select" value={company} onChange={(e) => setCompany(e.target.value)}>
                    {companyOptions.map((option) => <option key={option || "general"} value={option}>{option || "General"}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Focus Area</label>
                  <textarea className="form-control" rows="3" value={focus} onChange={(e) => setFocus(e.target.value)} />
                </div>
              </div>

              <button className="btn btn-info mt-3" onClick={generate} disabled={loadingQuestions}>
                {loadingQuestions ? "Generating..." : "Generate Interview Set"}
              </button>

              <div className="mt-4 vstack gap-3">
                {questions.map((item, index) => (
                  <button
                    key={item.id}
                    className={`card border-0 text-start ${selectedQuestionId === item.id ? "glass-card" : "bg-transparent"}`}
                    onClick={() => pickQuestion(item.id)}
                    type="button"
                  >
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between gap-2 flex-wrap mb-2">
                        <span className="badge text-bg-dark">Question {index + 1}</span>
                        <div className="d-flex gap-2 flex-wrap">
                          <span className="badge text-bg-secondary">{item.category}</span>
                          <span className="badge text-bg-info">{item.difficulty}</span>
                        </div>
                      </div>
                      <h2 className="h6 mb-2">{item.question}</h2>
                      <p className="text-secondary small mb-1"><strong>Intent:</strong> {item.intent}</p>
                      <p className="text-secondary small mb-0"><strong>Follow-up Hint:</strong> {item.followUpHint}</p>
                    </div>
                  </button>
                ))}
                {!questions.length && <p className="text-secondary mb-0">Generate a question set to begin your mock interview.</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card glass-card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
                <div>
                  <h2 className="h4 mb-2">Your Response</h2>
                  <p className="text-secondary mb-0">Answer as if you are in a live interview. Aim for a clear structure, one concrete example, and a concise closing point.</p>
                </div>
                {selectedQuestion && <span className="badge text-bg-info align-self-start">{selectedQuestion.category} Round</span>}
              </div>

              <div className="feedback-detail-card mb-3">
                <span className="feedback-label">Current Question</span>
                <p className="mb-2">{selectedQuestion?.question || "Generate a question set to begin."}</p>
                {selectedQuestion?.followUpHint ? <p className="mb-0 text-secondary"><strong>Hint:</strong> {selectedQuestion.followUpHint}</p> : null}
              </div>

              <textarea
                className="form-control"
                rows="10"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your interview answer here..."
              />

              <button className="btn btn-success mt-3" onClick={evaluate} disabled={!selectedQuestion || !answer.trim() || evaluating}>
                {evaluating ? "Evaluating..." : "Evaluate with AI"}
              </button>

              {evaluation && (
                <div className="mt-4">
                  <div className="row g-3">
                    {scoreCards.map((card) => (
                      <div className="col-md-6" key={card.label}>
                        <div className="metric-card">
                          <span>{card.label}</span>
                          <h3>{card.value}/100</h3>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card glass-card mt-3">
                    <div className="card-body">
                      <p><strong>Feedback:</strong> {evaluation.feedback}</p>
                      <p><strong>Ideal Answer Direction:</strong> {evaluation.idealAnswer}</p>
                      <p className="mb-2"><strong>Follow-up Question:</strong> {evaluation.followUpQuestion}</p>
                      <div className="row g-3 mt-1">
                        <div className="col-md-6">
                          <div className="feedback-detail-card h-100">
                            <span className="feedback-label">Strengths</span>
                            <ul className="mb-0 text-secondary">
                              {(evaluation.strengths || []).map((item) => <li key={item}>{item}</li>)}
                            </ul>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="feedback-detail-card h-100">
                            <span className="feedback-label">Improvements</span>
                            <ul className="mb-0 text-secondary">
                              {(evaluation.improvements || []).map((item) => <li key={item}>{item}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewerPage;
