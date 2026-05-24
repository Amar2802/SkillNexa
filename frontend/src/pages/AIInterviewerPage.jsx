import { useMemo, useState } from "react";
import api from "../api/client";
import { useToast } from "../components/ui/ToastProvider";

const roundOptions = ["Full Loop", "Technical", "HR", "Mixed"];
const companyOptions = ["General", "Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture"];
const roleOptions = ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Analyst", "QA Engineer"];
const experienceOptions = ["Fresher", "1-2 Years", "3-5 Years", "5+ Years"];
const skillOptions = ["React", "Node.js", "JavaScript", "DSA", "System Design", "SQL", "DBMS", "Operating Systems", "Aptitude", "Behavioral"];

const steps = [
  { id: 1, title: "Select role" },
  { id: 2, title: "Experience level" },
  { id: 3, title: "Skills" },
  { id: 4, title: "Generate interview" }
];

const AIInterviewerPage = () => {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    role: "Software Engineer",
    company: "General",
    experienceLevel: "Fresher",
    roundType: "Full Loop",
    count: 5,
    skills: ["React", "Node.js", "DSA"]
  });
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const currentQuestion = interviewQuestions[currentIndex];
  const roundSummary = useMemo(() => interviewQuestions.map((item) => item.round), [interviewQuestions]);

  const toggleSkill = (skill) => {
    setConfig((current) => ({
      ...current,
      skills: current.skills.includes(skill)
        ? current.skills.filter((item) => item !== skill)
        : [...current.skills, skill].slice(0, 6)
    }));
  };

  const generateInterview = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/ai/questions", {
        role: config.role,
        focus: config.skills.join(", "),
        count: config.count,
        roundType: config.roundType,
        experienceLevel: config.experienceLevel,
        company: config.company
      });
      setInterviewQuestions(data.questions || []);
      setCurrentIndex(0);
      setAnswer("");
      setEvaluation(null);
      showToast("AI interview generated successfully.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to generate interview right now.", "error");
    } finally {
      setLoading(false);
    }
  };

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
      showToast("AI feedback is ready.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to evaluate the answer right now.", "error");
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="container-fluid py-4 snx-page-shell">
      <div className="snx-hero-card mb-4">
        <div className="row g-4 align-items-center">
          <div className="col-xl-8">
            <span className="snx-kicker">AI Interview Generator</span>
            <h1 className="snx-page-title mt-3">Create your interview loop in four guided steps</h1>
            <p className="snx-page-subtitle mb-0">
              Set your role, experience, and skill focus, then generate a realistic AI interview round with structured feedback.
            </p>
          </div>
          <div className="col-xl-4">
            <div className="row g-3">
              <div className="col-sm-4 col-xl-12">
                <div className="snx-highlight-card primary">
                  <span>Role</span>
                  <strong>{config.role}</strong>
                  <small>Selected interview target</small>
                </div>
              </div>
              <div className="col-sm-4 col-xl-12">
                <div className="snx-highlight-card success">
                  <span>Experience</span>
                  <strong>{config.experienceLevel}</strong>
                  <small>Current answer style baseline</small>
                </div>
              </div>
              <div className="col-sm-4 col-xl-12">
                <div className="snx-highlight-card neutral">
                  <span>Skills</span>
                  <strong>{config.skills.length}</strong>
                  <small>Chosen focus areas</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-4">
          <div className="snx-surface-card h-100">
            <div className="snx-section-head">
              <div>
                <span className="snx-kicker">Step Flow</span>
                <h2>Interview setup</h2>
              </div>
            </div>
            <div className="snx-step-list">
              {steps.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`snx-step-item ${step === item.id ? "active" : ""} ${step > item.id ? "complete" : ""}`}
                  onClick={() => setStep(item.id)}
                >
                  <span className="snx-step-index">{step > item.id ? "✓" : item.id}</span>
                  <span>{item.title}</span>
                </button>
              ))}
            </div>

            <div className="snx-config-summary mt-4">
              <div><strong>Company:</strong> {config.company}</div>
              <div><strong>Flow:</strong> {config.roundType}</div>
              <div><strong>Questions:</strong> {config.count}</div>
              <div><strong>Skills:</strong> {config.skills.join(", ")}</div>
            </div>
          </div>
        </div>

        <div className="col-xl-8">
          <div className="snx-surface-card h-100">
            <div className="snx-section-head">
              <div>
                <span className="snx-kicker">Conversational Setup</span>
                <h2>Step {step} of 4</h2>
              </div>
            </div>

            {step === 1 ? (
              <div>
                <label className="form-label">Select your target role</label>
                <div className="row g-3">
                  {roleOptions.map((role) => (
                    <div className="col-md-6" key={role}>
                      <button type="button" className={`snx-select-card ${config.role === role ? "active" : ""}`} onClick={() => setConfig((current) => ({ ...current, role }))}>
                        {role}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <label className="form-label">Choose experience level</label>
                <div className="row g-3">
                  {experienceOptions.map((level) => (
                    <div className="col-md-6" key={level}>
                      <button type="button" className={`snx-select-card ${config.experienceLevel === level ? "active" : ""}`} onClick={() => setConfig((current) => ({ ...current, experienceLevel: level }))}>
                        {level}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div>
                <label className="form-label">Choose up to 6 skill focus areas</label>
                <div className="snx-chip-grid">
                  {skillOptions.map((skill) => (
                    <button key={skill} type="button" className={`snx-chip-button ${config.skills.includes(skill) ? "active" : ""}`} onClick={() => toggleSkill(skill)}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Company</label>
                  <select className="form-select" value={config.company} onChange={(event) => setConfig((current) => ({ ...current, company: event.target.value }))}>
                    {companyOptions.map((company) => <option key={company} value={company}>{company}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Interview Flow</label>
                  <select className="form-select" value={config.roundType} onChange={(event) => setConfig((current) => ({ ...current, roundType: event.target.value }))}>
                    {roundOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Question Count</label>
                  <select className="form-select" value={config.count} onChange={(event) => setConfig((current) => ({ ...current, count: Number(event.target.value) }))}>
                    {[3, 4, 5, 6, 7].map((count) => <option key={count} value={count}>{count}</option>)}
                  </select>
                </div>
              </div>
            ) : null}

            {loading ? (
              <div className="snx-generating-box mt-4">
                <div className="snx-generating-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <p className="mb-0">Generating your interview...</p>
              </div>
            ) : null}

            <div className="d-flex flex-wrap justify-content-between gap-2 mt-4">
              <button className="btn snx-btn-secondary" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>
                Back
              </button>
              <div className="d-flex flex-wrap gap-2">
                {step < 4 ? (
                  <button className="btn snx-btn-primary" onClick={() => setStep((current) => Math.min(4, current + 1))}>
                    Continue
                  </button>
                ) : (
                  <button className="btn snx-btn-primary" onClick={generateInterview} disabled={loading}>
                    {loading ? "Generating..." : "Generate Interview"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {interviewQuestions.length ? (
        <>
          <div className="snx-surface-card mb-4">
            <div className="snx-section-head">
              <div>
                <span className="snx-kicker">Interview Plan</span>
                <h2>Your AI-generated round sequence</h2>
              </div>
            </div>
            <div className="d-flex flex-wrap gap-2">
              {roundSummary.map((round, index) => (
                <span key={`${round}-${index}`} className={`snx-round-pill ${index === currentIndex ? "active" : ""}`}>
                  {index + 1}. {round}
                </span>
              ))}
            </div>
          </div>

          {currentQuestion ? (
            <div className="row g-4">
              <div className="col-xl-7">
                <div className="snx-surface-card h-100">
                  <div className="snx-section-head">
                    <div>
                      <span className="snx-kicker">Question {currentIndex + 1} of {interviewQuestions.length}</span>
                      <h2>{currentQuestion.round}</h2>
                      <p className="text-secondary mb-0">{currentQuestion.category}</p>
                    </div>
                    <span className="badge text-bg-secondary">{currentQuestion.difficulty}</span>
                  </div>

                  <div className="snx-question-prompt mb-4">{currentQuestion.question}</div>

                  <div className="row g-3 mb-4">
                    <div className="col-md-4">
                      <div className="snx-mini-detail">
                        <span>Intent</span>
                        <p>{currentQuestion.intent}</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="snx-mini-detail">
                        <span>Evaluation Focus</span>
                        <p>{currentQuestion.evaluationFocus}</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="snx-mini-detail">
                        <span>Follow-up Hint</span>
                        <p>{currentQuestion.followUpHint}</p>
                      </div>
                    </div>
                  </div>

                  <textarea className="form-control mb-3" rows="8" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Write your answer as if you are speaking to a real interviewer..." />

                  <div className="d-flex flex-wrap gap-2">
                    <button className="btn snx-btn-primary" onClick={evaluateAnswer} disabled={evaluating}>
                      {evaluating ? "Evaluating..." : "Evaluate Answer"}
                    </button>
                    <button className="btn snx-btn-secondary" onClick={() => { setCurrentIndex((index) => Math.max(index - 1, 0)); setAnswer(""); setEvaluation(null); }} disabled={currentIndex <= 0}>
                      Previous
                    </button>
                    <button className="btn snx-btn-secondary" onClick={() => { setCurrentIndex((index) => Math.min(index + 1, interviewQuestions.length - 1)); setAnswer(""); setEvaluation(null); }} disabled={currentIndex >= interviewQuestions.length - 1}>
                      Next
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-xl-5">
                <div className="snx-surface-card h-100">
                  <div className="snx-section-head">
                    <div>
                      <span className="snx-kicker">AI Feedback</span>
                      <h2>Evaluation Summary</h2>
                    </div>
                  </div>

                  {evaluation ? (
                    <>
                      <div className="row g-3 mb-4">
                        <div className="col-6">
                          <div className="snx-stat-card compact">
                            <span>Confidence</span>
                            <strong>{evaluation.confidenceScore}</strong>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="snx-stat-card compact">
                            <span>Communication</span>
                            <strong>{evaluation.communicationScore}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="snx-feedback-block">
                        <span>Feedback</span>
                        <p>{evaluation.feedback}</p>
                      </div>
                      <div className="snx-feedback-block">
                        <span>Ideal Answer</span>
                        <p>{evaluation.idealAnswer}</p>
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="snx-feedback-list strengths">
                            <span>Strengths</span>
                            <ul>
                              {(evaluation.strengths || []).length ? evaluation.strengths.map((item) => <li key={item}>{item}</li>) : <li>Clear response direction</li>}
                            </ul>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="snx-feedback-list improvements">
                            <span>Improvements</span>
                            <ul>
                              {(evaluation.improvements || []).length ? evaluation.improvements.map((item) => <li key={item}>{item}</li>) : <li>Add stronger examples</li>}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="snx-empty-state left">
                      <h3>No feedback yet</h3>
                      <p>Submit your answer to unlock AI scoring, strengths, and ideal answer guidance.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div className="snx-surface-card">
          <div className="snx-empty-state">
            <h3>No interviews yet</h3>
            <p>Complete the 4-step setup and generate an interview to begin your AI practice round.</p>
            <button className="btn snx-btn-primary" onClick={() => setStep(1)}>Start Setup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInterviewerPage;
