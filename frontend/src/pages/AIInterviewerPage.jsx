import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiMic, FiZap } from "react-icons/fi";
import api from "../api/client";
import AnswerAnalysisBlock from "../components/AnswerAnalysisBlock";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import SurfaceCard from "../components/ui/SurfaceCard";
import { useToast } from "../components/ui/ToastProvider";
import { fetchAnswerAnalysis } from "../services/answerAnalysisService";

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
  const [answerAnalysis, setAnswerAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

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
      setAnswerAnalysis(null);
      setAnalysisLoading(false);
      showToast("AI interview generated successfully.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to generate interview right now.", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadAnswerAnalysis = async (payload) => {
    setAnalysisLoading(true);
    try {
      const data = await fetchAnswerAnalysis(payload);
      setAnswerAnalysis(data);
    } catch {
      setAnswerAnalysis(null);
    } finally {
      setAnalysisLoading(false);
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
      void loadAnswerAnalysis({
        questionId: currentQuestion.id,
        userAnswer: answer,
        correctAnswer: data.idealAnswer,
        topic: currentQuestion.category
      });
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to evaluate the answer right now.", "error");
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="AI Interview Studio"
        title="Create professional mock interviews with a guided AI flow."
        description="Configure role, experience, and skill focus, then generate a realistic interview sequence with layered AI evaluation and answer analysis."
        actions={(
          <>
            <button className="snx-btn-accent" onClick={generateInterview} disabled={loading}>
              {loading ? "Generating..." : "Generate Interview"}
            </button>
            <button className="snx-btn-secondary" onClick={() => setStep(1)}>Restart Setup</button>
          </>
        )}
        aside={(
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {[
              { label: "Role", value: config.role },
              { label: "Experience", value: config.experienceLevel },
              { label: "Skills", value: `${config.skills.length} selected` }
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/70 bg-white/80 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</div>
                <div className="mt-2 text-lg font-semibold text-slate-950">{item.value}</div>
              </div>
            ))}
          </div>
        )}
      />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
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

          <div className="flex flex-wrap justify-between gap-3">
            <button className="snx-btn-secondary" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>
              Back
            </button>
            {step < 4 ? (
              <button className="snx-btn-primary" onClick={() => setStep((current) => Math.min(4, current + 1))}>Continue</button>
            ) : (
              <button className="snx-btn-primary" onClick={generateInterview} disabled={loading}>
                {loading ? "Generating..." : "Generate Interview"}
              </button>
            )}
          </div>
        </div>
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
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="snx-btn-primary" onClick={evaluateAnswer} disabled={evaluating}>
                    {evaluating ? "Evaluating..." : "Evaluate Answer"}
                  </button>
                  <button className="snx-btn-secondary" onClick={() => { setCurrentIndex((index) => Math.max(index - 1, 0)); setAnswer(""); setEvaluation(null); setAnswerAnalysis(null); }}>
                    <FiChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button className="snx-btn-secondary" onClick={() => { setCurrentIndex((index) => Math.min(index + 1, interviewQuestions.length - 1)); setAnswer(""); setEvaluation(null); setAnswerAnalysis(null); }}>
                    Next
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <aside className="snx-card space-y-5 lg:h-fit lg:sticky lg:top-6">
            <div>
              <span className="snx-kicker">AI feedback</span>
              <h2 className="snx-heading-3 mt-3 text-slate-custom-900">Evaluation summary</h2>
            </div>
            {evaluation ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="snx-stat">
                    <div className="snx-label">Confidence</div>
                    <div className="mt-3 text-2xl font-semibold text-slate-custom-900">{evaluation.confidenceScore}</div>
                  </div>
                  <div className="snx-stat">
                    <div className="snx-label">Communication</div>
                    <div className="mt-3 text-2xl font-semibold text-slate-custom-900">{evaluation.communicationScore}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="snx-stat">
                    <div className="snx-label">Feedback</div>
                    <p className="mt-3 snx-body-sm text-slate-custom-600">{evaluation.feedback}</p>
                  </div>
                  <div className="snx-stat">
                    <div className="snx-label">Ideal answer</div>
                    <p className="mt-3 snx-body-sm text-slate-custom-600">{evaluation.idealAnswer}</p>
                  </div>
                  <div className="grid gap-4">
                    <div className="snx-stat bg-emerald-50 border-emerald-200">
                      <div className="snx-label text-emerald-700">Strengths</div>
                      <ul className="mt-3 space-y-2 snx-body-sm text-emerald-900">
                        {(evaluation.strengths || []).length ? evaluation.strengths.map((item) => <li key={item}>• {item}</li>) : <li>• Clear response direction</li>}
                      </ul>
                    </div>
                    <div className="rounded-[24px] border border-amber-200 bg-amber-50/70 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Improvements</div>
                      <ul className="mt-3 space-y-2 text-sm text-amber-900">
                        {(evaluation.improvements || []).length ? evaluation.improvements.map((item) => <li key={item}>- {item}</li>) : <li>- Add stronger examples</li>}
                      </ul>
                    </div>
                    <div className="snx-stat bg-amber-50 border-amber-200">
                      <div className="snx-label text-amber-700">Improvements</div>
                      <ul className="mt-3 space-y-2 snx-body-sm text-amber-900">
                        {(evaluation.improvements || []).length ? evaluation.improvements.map((item) => <li key={item}>• {item}</li>) : <li>• Add stronger examples</li>}
                      </ul>
                    </div>
                  </div>
                </div>
                <AnswerAnalysisBlock analysis={answerAnalysis} loading={analysisLoading} />
              </>
            ) : (
              <EmptyState
                title="No feedback yet"
                description="Submit an answer to unlock confidence scoring, communication guidance, ideal answer suggestions, and concept-level AI analysis."
              />
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
