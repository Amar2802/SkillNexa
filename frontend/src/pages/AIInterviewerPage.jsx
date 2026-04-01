import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { mapCategoryToBucket, recordDailyAttempt } from "../utils/prepTracking";
import { FIELD_COMPANY_TRACKS } from "../utils/fieldOptions";

const FIELD_AI_CONFIG = {
  Software: {
    title: "Run a guided software interview simulation",
    subtitle: "Generate technical, HR, and project questions tailored for software roles.",
    role: "Software Engineer",
    focus: "DSA, system fundamentals, HR, and project discussion",
    rounds: ["Mixed", "Technical", "HR", "Managerial", "Project Discussion"]
  }
};

const experienceOptions = ["Student", "Fresher", "Experienced"];

const buildFallbackInterviewSet = ({ questions, focus, company }) => {
  const focusTerm = String(focus || "").toLowerCase();
  const companyTerm = String(company || "").toLowerCase();
  const matchedPool = questions.filter((question) => {
    const matchesFocus = !focusTerm || `${question.topic} ${question.category} ${question.title}`.toLowerCase().includes(focusTerm);
    const matchesCompany = !companyTerm || String(question.company || "").toLowerCase().includes(companyTerm);
    return matchesFocus && matchesCompany;
  });
  const sourcePool = matchedPool.length ? matchedPool : questions;

  return sourcePool.slice(0, 6).map((question, index) => ({
    id: question._id || `fallback-ai-${index + 1}`,
    question: question.description || question.title,
    category: question.category || "General",
    difficulty: question.difficulty || "Medium",
    intent: `Practice ${question.topic || "interview"} explanations with clear structure and examples.`,
    followUpHint: question.explanation || "Explain your thinking clearly and support it with one concrete example."
  }));
};

const AIInterviewerPage = ({ targetField = "Software", questions = [] }) => {
  const fieldConfig = FIELD_AI_CONFIG[targetField] || FIELD_AI_CONFIG.Software;
  const companyOptions = FIELD_COMPANY_TRACKS[targetField] || FIELD_COMPANY_TRACKS.Software;
  const [role, setRole] = useState(fieldConfig.role);
  const [focus, setFocus] = useState(fieldConfig.focus);
  const [roundType, setRoundType] = useState(fieldConfig.rounds[0]);
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [company, setCompany] = useState("");
  const [questionsState, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    setRole(fieldConfig.role);
    setFocus(fieldConfig.focus);
    setRoundType(fieldConfig.rounds[0]);
    setCompany("");
    setQuestions([]);
    setSelectedQuestionId("");
    setAnswer("");
    setEvaluation(null);
  }, [targetField]);

  const selectedQuestionIndex = useMemo(() => questionsState.findIndex((item) => item.id === selectedQuestionId), [questionsState, selectedQuestionId]);
  const selectedQuestion = useMemo(() => (selectedQuestionIndex >= 0 ? questionsState[selectedQuestionIndex] : null), [questionsState, selectedQuestionIndex]);
  const hasNextQuestion = selectedQuestionIndex >= 0 && selectedQuestionIndex < questionsState.length - 1;

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
        targetField,
        count: 6
      });
      const generatedQuestions = data.questions?.length ? data.questions : buildFallbackInterviewSet({ questions, focus, company });
      setQuestions(generatedQuestions);
      setSelectedQuestionId(generatedQuestions[0]?.id || "");
    } catch {
      const fallbackQuestions = buildFallbackInterviewSet({ questions, focus, company });
      setQuestions(fallbackQuestions);
      setSelectedQuestionId(fallbackQuestions[0]?.id || "");
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
        roundType,
        targetField
      });
      setEvaluation(data);
      recordDailyAttempt({
        bucket: mapCategoryToBucket(selectedQuestion.category, roundType, targetField),
        questionId: selectedQuestion.id,
        title: selectedQuestion.question,
        topic: selectedQuestion.intent || selectedQuestion.category,
        category: selectedQuestion.category || roundType,
        source: "ai",
        field: targetField
      });
    } catch {
      setEvaluation({
        feedback: "Your answer is on the right track. Make it more structured and support it with one concrete example.",
        idealAnswer: "Start with a direct answer, explain your reasoning clearly, then end with outcome or impact.",
        confidenceScore: 72,
        communicationScore: 74,
        structureScore: 70,
        technicalScore: 71,
        strengths: ["Good intent", "Shows topic awareness"],
        improvements: ["Add one stronger example", "Use a sharper opening summary"],
        followUpQuestion: "Can you explain this with one real example from your preparation or project work?"
      });
    } finally {
      setEvaluating(false);
    }
  };

  const goToNextQuestion = () => {
    if (!hasNextQuestion) return;
    const nextQuestion = questionsState[selectedQuestionIndex + 1];
    setSelectedQuestionId(nextQuestion.id);
    setAnswer("");
    setEvaluation(null);
  };

  const scoreCards = evaluation
    ? [
        { label: "Confidence", value: evaluation.confidenceScore },
        { label: "Communication", value: evaluation.communicationScore },
        { label: "Structure", value: evaluation.structureScore },
        { label: "Technical Depth", value: evaluation.technicalScore }
      ]
    : [];

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card glass-card h-100">
            <div className="card-body">
              <p className="eyebrow">AI Interviewer</p>
              <h1 className="h3 fw-bold">{fieldConfig.title}</h1>
              <p className="text-secondary mb-2">{fieldConfig.subtitle}</p>
              <p className="text-secondary mb-4">Active field: <strong>{targetField}</strong></p>

              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Target Role</label>
                  <input className="form-control" value={role} onChange={(e) => setRole(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Interview Round</label>
                  <select className="form-select" value={roundType} onChange={(e) => setRoundType(e.target.value)}>
                    {fieldConfig.rounds.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Experience Level</label>
                  <select className="form-select" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
                    {experienceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Target Track</label>
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

              <div className="feedback-detail-card mt-4">
                <span className="feedback-label">Interview Progress</span>
                {questionsState.length ? (
                  <>
                    <p className="mb-1"><strong>Question {selectedQuestionIndex + 1}</strong> of {questionsState.length}</p>
                    <p className="mb-0 text-secondary">Current round: {selectedQuestion?.category || roundType}</p>
                  </>
                ) : (
                  <p className="mb-0 text-secondary">Generate a question set to begin your {targetField} interview round.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card glass-card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
                <div>
                  <p className="eyebrow mb-2">Current Interview Question</p>
                  <h2 className="h4 mb-2">{selectedQuestion ? `Question ${selectedQuestionIndex + 1}` : `Generate a ${targetField} question set`}</h2>
                  <p className="text-secondary mb-0">Answer as if you are in a live {targetField} interview. Keep your response structured, specific, and outcome-focused.</p>
                </div>
                {selectedQuestion && <span className="badge text-bg-info align-self-start">{selectedQuestion.category} | {selectedQuestion.difficulty}</span>}
              </div>

              <div className="feedback-detail-card mb-3">
                <span className="feedback-label">Question Prompt</span>
                <p className="mb-2">{selectedQuestion?.question || `Generate a ${targetField} question set to begin.`}</p>
                {selectedQuestion?.followUpHint ? <p className="mb-0 text-secondary"><strong>Hint:</strong> {selectedQuestion.followUpHint}</p> : null}
              </div>

              <textarea className="form-control" rows="10" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder={`Write your ${targetField} interview answer here...`} />

              <div className="d-flex gap-2 flex-wrap mt-3">
                <button className="btn btn-success" onClick={evaluate} disabled={!selectedQuestion || !answer.trim() || evaluating}>{evaluating ? "Evaluating..." : "Evaluate with AI"}</button>
                <button className="btn btn-outline-light" onClick={goToNextQuestion} disabled={!hasNextQuestion}>Next Question</button>
              </div>

              {evaluation && (
                <div className="mt-4">
                  <div className="row g-3">
                    {scoreCards.map((card) => (
                      <div className="col-md-6" key={card.label}><div className="metric-card"><span>{card.label}</span><h3>{card.value}/100</h3></div></div>
                    ))}
                  </div>
                  <div className="card glass-card mt-3">
                    <div className="card-body">
                      <p><strong>Feedback:</strong> {evaluation.feedback}</p>
                      <p><strong>Ideal Answer Direction:</strong> {evaluation.idealAnswer}</p>
                      <p className="mb-2"><strong>Follow-up Question:</strong> {evaluation.followUpQuestion}</p>
                      <div className="row g-3 mt-1">
                        <div className="col-md-6"><div className="feedback-detail-card h-100"><span className="feedback-label">Strengths</span><ul className="mb-0 text-secondary">{(evaluation.strengths || []).map((item) => <li key={item}>{item}</li>)}</ul></div></div>
                        <div className="col-md-6"><div className="feedback-detail-card h-100"><span className="feedback-label">Improvements</span><ul className="mb-0 text-secondary">{(evaluation.improvements || []).map((item) => <li key={item}>{item}</li>)}</ul></div></div>
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
