import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiMic, FiZap } from "react-icons/fi";
import api from "../api/client";
import AnswerEvaluationCard from "../components/evaluation/AnswerEvaluationCard";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import { useToast } from "../components/ui/ToastProvider";
import useAnswerEvaluation from "../hooks/useAnswerEvaluation";

const roundOptions = ["Full Loop", "Technical", "HR", "Mixed"];
const companyOptions = ["General", "Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture"];
const roleOptions = ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Analyst", "QA Engineer"];
const experienceOptions = ["Fresher", "1-2 Years", "3-5 Years", "5+ Years"];
const skillOptions = ["React", "Node.js", "JavaScript", "DSA", "System Design", "SQL", "DBMS", "Operating Systems", "Aptitude", "Behavioral"];

const steps = [
  { id: 1, title: "Select role" },
  { id: 2, title: "Experience" },
  { id: 3, title: "Skills" },
  { id: 4, title: "Generate" }
];

const AIInterviewerPage = ({ refreshProfile }) => {
  const { showToast } = useToast();
  const { evaluation, loading: evalLoading, error: evalError, evaluate, retry, reset: resetEvaluation } = useAnswerEvaluation({ refreshProfile });
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
  const [loading, setLoading] = useState(false);
  const [voiceNote, setVoiceNote] = useState("");

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
      resetEvaluation();
      setVoiceNote("");
      showToast("AI interview generated successfully.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to generate interview right now.", "error");
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswer = async () => {
    if (!currentQuestion || !answer.trim()) return;
    const data = await evaluate({
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      userAnswer: answer,
      topic: currentQuestion.category,
      role: config.role,
      difficulty: currentQuestion.difficulty,
      category: currentQuestion.category,
      module: "ai-interviewer",
      voiceTranscript: voiceNote
    });
    if (data) showToast("AI feedback is ready.", "success");
  };

  const goToNextQuestion = () => {
    const score = evaluation?.score || 0;
    if (score < 55 && currentQuestion?.difficulty !== "Hard") {
      showToast("Next question difficulty increased based on your score.", "info");
    }
    setCurrentIndex((index) => Math.min(index + 1, interviewQuestions.length - 1));
    setAnswer("");
    resetEvaluation();
    setVoiceNote("");
  };

  return (
    <div className="space-y-6 snx-fade-in">
      <PageHeader
        kicker="AI Interview Studio"
        title="Build a mock interview in four steps"
        description="Set role, experience, skills, and company — then generate your AI interview."
        actions={(
          <button type="button" className="snx-btn-primary" onClick={generateInterview} disabled={loading}>
            {loading ? "Generating..." : "Generate Interview"}
          </button>
        )}
        aside={(
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
            {[
              { label: "Role", value: config.role },
              { label: "Experience", value: config.experienceLevel },
              { label: "Skills", value: config.skills.length }
            ].map((item) => (
              <div key={item.label} className="snx-stat !p-3">
                <div className="snx-label">{item.label}</div>
                <div className="mt-1 truncate text-sm font-semibold text-slate-custom-900 dark:text-white">{item.value}</div>
              </div>
            ))}
          </div>
        )}
      />

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="snx-panel-muted space-y-5">
          <div>
            <span className="snx-kicker">Interview setup</span>
            <h2 className="snx-heading-3 mt-3 text-slate-custom-900">Four-step workflow</h2>
          </div>
          <div className="space-y-3">
            {steps.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-4 text-left transition-all duration-300 ${
                  step === item.id
                    ? "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-md-soft"
                    : step > item.id
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                      : "border-slate-custom-200 bg-white text-slate-custom-600 hover:border-indigo-200"
                }`}
                onClick={() => setStep(item.id)}
              >
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold ${
                  step === item.id ? "bg-indigo-600 text-white" : step > item.id ? "bg-indigo-600 text-white" : "bg-slate-custom-100 text-slate-custom-700"
                }`}>
                  {step > item.id ? "✓" : item.id}
                </span>
                <span className="font-medium">{item.title}</span>
              </button>
            ))}
          </div>
          <div className="snx-stat">
            <div className="snx-label">Configuration</div>
            <div className="mt-3 space-y-2 snx-body-sm text-slate-custom-600">
              <div><strong>Company:</strong> {config.company}</div>
              <div><strong>Flow:</strong> {config.roundType}</div>
              <div><strong>Questions:</strong> {config.count}</div>
              <div><strong>Skills:</strong> {config.skills.join(", ")}</div>
            </div>
          </div>
        </div>

        <div className="snx-panel-muted space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="snx-kicker">Conversational setup</span>
              <h2 className="snx-heading-3 mt-3 text-slate-custom-900">Step {step} of 4</h2>
            </div>
            <div className="snx-badge-primary">{config.roundType}</div>
          </div>

          {step === 1 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {roleOptions.map((role) => (
                <button key={role} type="button" className={`snx-card border transition-all duration-300 cursor-pointer ${
                  config.role === role ? "border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50" : "hover:border-indigo-200"
                }`} onClick={() => setConfig((current) => ({ ...current, role }))}>
                  <div className={`font-semibold ${config.role === role ? "text-indigo-900" : "text-slate-custom-900"}`}>{role}</div>
                  <div className={`mt-2 snx-body-sm ${config.role === role ? "text-indigo-700" : "text-slate-custom-600"}`}>Use this role to drive AI-generated prompts and follow-up emphasis.</div>
                </button>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {experienceOptions.map((level) => (
                <button key={level} type="button" className={`snx-card border transition-all duration-300 cursor-pointer ${
                  config.experienceLevel === level ? "border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50" : "hover:border-indigo-200"
                }`} onClick={() => setConfig((current) => ({ ...current, experienceLevel: level }))}>
                  <div className={`font-semibold ${config.experienceLevel === level ? "text-indigo-900" : "text-slate-custom-900"}`}>{level}</div>
                  <div className={`mt-2 snx-body-sm ${config.experienceLevel === level ? "text-indigo-700" : "text-slate-custom-600"}`}>Adjusts tone, expectations, and AI interviewer depth.</div>
                </button>
              ))}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <p className="snx-body-sm text-slate-custom-600">Choose up to six focus areas so the interview feels relevant and company-ready.</p>
              <div className="flex flex-wrap gap-3">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className={`snx-badge transition-all duration-300 cursor-pointer ${
                      config.skills.includes(skill)
                        ? "snx-badge-primary ring-2 ring-indigo-200"
                        : "border border-slate-custom-200 bg-white text-slate-custom-700 hover:border-indigo-200 hover:bg-indigo-50"
                    }`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block space-y-2">
                <span className="snx-label">Company</span>
                <select className="snx-select" value={config.company} onChange={(event) => setConfig((current) => ({ ...current, company: event.target.value }))}>
                  {companyOptions.map((company) => <option key={company} value={company}>{company}</option>)}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="snx-label">Interview flow</span>
                <select className="snx-select" value={config.roundType} onChange={(event) => setConfig((current) => ({ ...current, roundType: event.target.value }))}>
                  {roundOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="snx-label">Question count</span>
                <select className="snx-select" value={config.count} onChange={(event) => setConfig((current) => ({ ...current, count: Number(event.target.value) }))}>
                  {[3, 4, 5, 6, 7].map((count) => <option key={count} value={count}>{count}</option>)}
                </select>
              </label>
            </div>
          ) : null}

          {loading ? (
            <div className="snx-panel-dark space-y-3 text-white">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-400" />
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-300 [animation-delay:150ms]" />
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-200 [animation-delay:300ms]" />
                </div>
                <span className="snx-label text-white/70">Generating</span>
              </div>
              <p className="snx-body-sm text-slate-300">Building your interview flow with company context, round pacing, and skill-aware prompts.</p>
            </div>
          ) : null}

        </div>
      </div>

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-card border border-slate-custom-200 bg-white/95 p-4 shadow-lg-soft backdrop-blur-md dark:border-slate-custom-600 dark:bg-slate-custom-900/95">
        <button type="button" className="snx-btn-secondary" onClick={() => setStep((c) => Math.max(1, c - 1))} disabled={step === 1}>
          Back
        </button>
        {step < 4 ? (
          <button type="button" className="snx-btn-primary min-w-[140px]" onClick={() => setStep((c) => Math.min(4, c + 1))}>
            Continue
          </button>
        ) : (
          <button type="button" className="snx-btn-primary min-w-[180px]" onClick={generateInterview} disabled={loading}>
            {loading ? "Generating..." : "Generate Interview"}
          </button>
        )}
      </div>

      {interviewQuestions.length ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <div className="snx-panel-muted">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="snx-kicker">Interview plan</span>
                  <h2 className="snx-heading-3 mt-3 text-slate-custom-900">Your AI-generated round sequence</h2>
                </div>
                <span className="snx-badge-primary inline-flex items-center gap-2">
                  <FiZap className="h-4 w-4" />
                  AI adaptive
                </span>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {roundSummary.map((round, index) => (
                  <button
                    key={`${round}-${index}`}
                    className={`snx-badge transition-all duration-300 cursor-pointer ${
                      index === currentIndex ? "snx-badge-primary" : "border border-slate-custom-200 bg-white text-slate-custom-600 hover:border-indigo-200"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    {index + 1}. {round}
                  </button>
                ))}
              </div>
            </div>

            {currentQuestion ? (
              <div className="snx-panel-muted space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="snx-kicker">Question {currentIndex + 1} of {interviewQuestions.length}</span>
                    <h2 className="snx-heading-3 mt-3 text-slate-custom-900">{currentQuestion.round}</h2>
                    <p className="mt-2 snx-body-sm text-slate-custom-600">{currentQuestion.category}</p>
                  </div>
                  <span className="snx-badge-primary text-xs">{currentQuestion.difficulty}</span>
                </div>

                <div className="snx-panel-dark space-y-4 text-white">
                  <p className="snx-body leading-8 text-slate-100">{currentQuestion.question}</p>
                </div>

                <div className="snx-grid-auto">
                  {[
                    { label: "Intent", value: currentQuestion.intent },
                    { label: "Evaluation Focus", value: currentQuestion.evaluationFocus },
                    { label: "Follow-up Hint", value: currentQuestion.followUpHint }
                  ].map((item) => (
                    <div key={item.label} className="snx-stat">
                      <div className="snx-label">{item.label}</div>
                      <p className="mt-3 snx-body-sm text-slate-custom-600">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="snx-label">Your answer</label>
                    <span className="inline-flex items-center gap-2 rounded-lg border border-slate-custom-200 bg-slate-custom-100 px-3 py-1 text-xs font-medium text-slate-custom-700">
                      <FiMic className="h-3.5 w-3.5" />
                      Voice UI placeholder
                    </span>
                  </div>
                  <textarea
                    className="snx-textarea min-h-[220px]"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder="Write your answer as though you are speaking to a senior interviewer in a real mock round..."
                  />
                  <label className="block space-y-2">
                    <span className="snx-label">Voice transcript (optional)</span>
                    <textarea
                      className="snx-textarea min-h-[100px]"
                      value={voiceNote}
                      onChange={(event) => setVoiceNote(event.target.value)}
                      placeholder="Paste speech-to-text transcript for communication scoring..."
                    />
                  </label>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="button" className="snx-btn-primary" onClick={evaluateAnswer} disabled={evalLoading}>
                    {evalLoading ? "Evaluating..." : "Evaluate Answer"}
                  </button>
                  <button type="button" className="snx-btn-secondary" onClick={() => { setCurrentIndex((index) => Math.max(index - 1, 0)); setAnswer(""); resetEvaluation(); setVoiceNote(""); }}>
                    <FiChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button type="button" className="snx-btn-secondary" onClick={goToNextQuestion}>
                    Next
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <AnswerEvaluationCard
                  evaluation={evaluation}
                  loading={evalLoading}
                  error={evalError}
                  onRetry={() => currentQuestion && evaluate({
                    questionId: currentQuestion.id,
                    question: currentQuestion.question,
                    userAnswer: answer,
                    topic: currentQuestion.category,
                    role: config.role,
                    difficulty: currentQuestion.difficulty,
                    category: currentQuestion.category,
                    module: "ai-interviewer",
                    voiceTranscript: voiceNote
                  })}
                />
              </div>
            ) : null}
          </div>

          <aside className="snx-card space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <span className="snx-kicker">Follow-ups</span>
            <h2 className="snx-heading-3 mt-1">Adaptive interview loop</h2>
            {evaluation?.followUpQuestions?.length ? (
              <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-custom-600 dark:text-slate-custom-300">
                {evaluation.followUpQuestions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <p className="snx-body-sm">Evaluate your answer to unlock recruiter follow-up questions and difficulty adaptation.</p>
            )}
          </aside>
        </div>
      ) : (
        <EmptyState
          title="No interviews yet"
          description="Finish the four-step setup and generate a tailored interview loop to begin your AI-powered practice round."
          action={<button className="snx-btn-primary" onClick={() => setStep(1)}>Start Setup</button>}
        />
      )}
    </div>
  );
};

export default AIInterviewerPage;
