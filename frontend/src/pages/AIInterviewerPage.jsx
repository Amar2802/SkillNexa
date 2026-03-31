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
  },
  UPSC: {
    title: "Run a guided civil-services interview simulation",
    subtitle: "Practice personality-test style questions with structure, balance, and public-service orientation.",
    role: "UPSC Aspirant",
    focus: "polity, current affairs, ethics, governance, and personality test discussion",
    rounds: ["Mixed", "Personality Test", "Current Affairs", "Ethics", "Governance"]
  },
  NDA: {
    title: "Run a guided defence interview simulation",
    subtitle: "Practice SSB-style communication, leadership, and defence-awareness responses.",
    role: "NDA Candidate",
    focus: "leadership, SSB communication, current affairs, mathematics confidence, and defence awareness",
    rounds: ["Mixed", "SSB Interview", "Leadership", "Current Affairs", "Personality"]
  },
  Banking: {
    title: "Run a guided banking interview simulation",
    subtitle: "Practice aptitude-facing, awareness, and personal interview questions for banking roles.",
    role: "Banking Aspirant",
    focus: "quantitative aptitude, reasoning, banking awareness, current affairs, and HR responses",
    rounds: ["Mixed", "Banking Awareness", "HR", "Reasoning", "Current Affairs"]
  },
  SSC: {
    title: "Run a guided competitive-exam interview simulation",
    subtitle: "Practice awareness, reasoning, and personality questions in a structured flow.",
    role: "SSC Candidate",
    focus: "general awareness, reasoning, English confidence, and interview personality",
    rounds: ["Mixed", "General Awareness", "Reasoning", "English", "Personality"]
  },
  Railways: {
    title: "Run a guided railway interview simulation",
    subtitle: "Practice operational awareness, technical aptitude, and safety-focused interview answers.",
    role: "Railway Candidate",
    focus: "technical aptitude, railway awareness, safety thinking, mathematics, and public-service communication",
    rounds: ["Mixed", "Technical Aptitude", "Railway Operations", "General Awareness", "Safety Discussion"]
  },
  Teaching: {
    title: "Run a guided teaching interview simulation",
    subtitle: "Practice pedagogy, classroom communication, and learner-focused interview responses.",
    role: "Teaching Candidate",
    focus: "pedagogy, child development, communication, classroom management, and subject delivery",
    rounds: ["Mixed", "Teaching Aptitude", "Pedagogy", "Classroom Communication", "Subject Knowledge"]
  },
  "State PSC": {
    title: "Run a guided state-services interview simulation",
    subtitle: "Practice governance, current affairs, and public-administration questions with state context.",
    role: "State PSC Aspirant",
    focus: "state governance, current affairs, polity, administration, and interview personality",
    rounds: ["Mixed", "Interview Personality", "Current Affairs", "Governance", "Administration"]
  }
};

const experienceOptions = ["Student", "Fresher", "Experienced"];

const AIInterviewerPage = ({ targetField = "Software" }) => {
  const fieldConfig = FIELD_AI_CONFIG[targetField] || FIELD_AI_CONFIG.Software;
  const companyOptions = FIELD_COMPANY_TRACKS[targetField] || FIELD_COMPANY_TRACKS.Software;
  const [role, setRole] = useState(fieldConfig.role);
  const [focus, setFocus] = useState(fieldConfig.focus);
  const [roundType, setRoundType] = useState(fieldConfig.rounds[0]);
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [company, setCompany] = useState("");
  const [questions, setQuestions] = useState([]);
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

  const selectedQuestionIndex = useMemo(
    () => questions.findIndex((item) => item.id === selectedQuestionId),
    [questions, selectedQuestionId]
  );

  const selectedQuestion = useMemo(
    () => (selectedQuestionIndex >= 0 ? questions[selectedQuestionIndex] : null),
    [questions, selectedQuestionIndex]
  );

  const hasNextQuestion = selectedQuestionIndex >= 0 && selectedQuestionIndex < questions.length - 1;

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
    } finally {
      setEvaluating(false);
    }
  };

  const goToNextQuestion = () => {
    if (!hasNextQuestion) return;
    const nextQuestion = questions[selectedQuestionIndex + 1];
    setSelectedQuestionId(nextQuestion.id);
    setAnswer("");
    setEvaluation(null);
  };

  const scoreCards = evaluation
    ? [
        { label: "Confidence", value: evaluation.confidenceScore },
        { label: "Communication", value: evaluation.communicationScore },
        { label: targetField === "Software" ? "Structure" : "Clarity", value: evaluation.structureScore },
        { label: targetField === "Software" ? "Technical Depth" : "Content Depth", value: evaluation.technicalScore }
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
                {questions.length ? (
                  <>
                    <p className="mb-1"><strong>Question {selectedQuestionIndex + 1}</strong> of {questions.length}</p>
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
                  <h2 className="h4 mb-2">
                    {selectedQuestion ? `Question ${selectedQuestionIndex + 1}` : `Generate a ${targetField} question set`}
                  </h2>
                  <p className="text-secondary mb-0">Answer as if you are in a live {targetField} interview. Keep your response structured, specific, and outcome-focused.</p>
                </div>
                {selectedQuestion && <span className="badge text-bg-info align-self-start">{selectedQuestion.category} | {selectedQuestion.difficulty}</span>}
              </div>

              <div className="feedback-detail-card mb-3">
                <span className="feedback-label">Question Prompt</span>
                <p className="mb-2">{selectedQuestion?.question || `Generate a ${targetField} question set to begin.`}</p>
                {selectedQuestion?.followUpHint ? <p className="mb-0 text-secondary"><strong>Hint:</strong> {selectedQuestion.followUpHint}</p> : null}
              </div>

              <textarea
                className="form-control"
                rows="10"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={`Write your ${targetField} interview answer here...`}
              />

              <div className="d-flex gap-2 flex-wrap mt-3">
                <button className="btn btn-success" onClick={evaluate} disabled={!selectedQuestion || !answer.trim() || evaluating}>
                  {evaluating ? "Evaluating..." : "Evaluate with AI"}
                </button>
                <button className="btn btn-outline-light" onClick={goToNextQuestion} disabled={!hasNextQuestion}>
                  Next Question
                </button>
              </div>

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
