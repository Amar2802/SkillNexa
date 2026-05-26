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
        <SurfaceCard strong className="space-y-5">
          <div>
            <span className="snx-kicker">Interview setup</span>
            <h2 className="snx-heading mt-4">Four-step workflow</h2>
          </div>
          <div className="space-y-3">
            {steps.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`flex w-full items-center gap-3 rounded-[24px] border px-4 py-4 text-left transition ${
                  step === item.id
                    ? "border-slate-950 bg-slate-950 text-white shadow-[0_18px_34px_rgba(15,23,42,0.22)]"
                    : step > item.id
                      ? "border-brand-200 bg-brand-50 text-brand-800"
                      : "border-slate-200 bg-white text-slate-600 hover:border-brand-200"
                }`}
                onClick={() => setStep(item.id)}
              >
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold ${
                  step === item.id ? "bg-white/15 text-white" : "bg-white text-slate-700"
                }`}>
                  {step > item.id ? "Done" : item.id}
                </span>
                <span className="font-medium">{item.title}</span>
              </button>
            ))}
          </div>
          <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4 text-sm text-slate-600">
            <div><strong>Company:</strong> {config.company}</div>
            <div className="mt-2"><strong>Flow:</strong> {config.roundType}</div>
            <div className="mt-2"><strong>Questions:</strong> {config.count}</div>
            <div className="mt-2"><strong>Skills:</strong> {config.skills.join(", ")}</div>
          </div>
        </SurfaceCard>

        <SurfaceCard strong className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="snx-kicker">Conversational setup</span>
              <h2 className="snx-heading mt-4">Step {step} of 4</h2>
            </div>
            <div className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              {config.roundType}
            </div>
          </div>

          {step === 1 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {roleOptions.map((role) => (
                <button key={role} type="button" className={`rounded-[24px] border p-4 text-left transition ${
                  config.role === role ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white hover:border-brand-200"
                }`} onClick={() => setConfig((current) => ({ ...current, role }))}>
                  <div className="font-semibold">{role}</div>
                  <div className={`mt-2 text-sm ${config.role === role ? "text-slate-200" : "text-slate-500"}`}>Use this role to drive AI-generated prompts and follow-up emphasis.</div>
                </button>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {experienceOptions.map((level) => (
                <button key={level} type="button" className={`rounded-[24px] border p-4 text-left transition ${
                  config.experienceLevel === level ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white hover:border-brand-200"
                }`} onClick={() => setConfig((current) => ({ ...current, experienceLevel: level }))}>
                  <div className="font-semibold">{level}</div>
                  <div className={`mt-2 text-sm ${config.experienceLevel === level ? "text-slate-200" : "text-slate-500"}`}>Adjusts tone, expectations, and AI interviewer depth.</div>
                </button>
              ))}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">Choose up to six focus areas so the interview feels relevant and company-ready.</p>
              <div className="flex flex-wrap gap-3">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className={`rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
                      config.skills.includes(skill)
                        ? "border-brand-500 bg-brand-500 text-white shadow-[0_16px_32px_rgba(20,184,166,0.24)]"
                        : "border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50"
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
                <span className="text-sm font-medium text-slate-700">Company</span>
                <select className="snx-select" value={config.company} onChange={(event) => setConfig((current) => ({ ...current, company: event.target.value }))}>
                  {companyOptions.map((company) => <option key={company} value={company}>{company}</option>)}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Interview flow</span>
                <select className="snx-select" value={config.roundType} onChange={(event) => setConfig((current) => ({ ...current, roundType: event.target.value }))}>
                  {roundOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Question count</span>
                <select className="snx-select" value={config.count} onChange={(event) => setConfig((current) => ({ ...current, count: Number(event.target.value) }))}>
                  {[3, 4, 5, 6, 7].map((count) => <option key={count} value={count}>{count}</option>)}
                </select>
              </label>
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-[28px] border border-slate-200/70 bg-slate-950 px-6 py-6 text-white">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex gap-2">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-300" />
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent-300 [animation-delay:150ms]" />
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/70 [animation-delay:300ms]" />
                </div>
                <span className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">Generating</span>
              </div>
              <p className="text-sm text-slate-200">Building your interview flow with company context, round pacing, and skill-aware prompts.</p>
            </div>
          ) : null}

          <div className="flex flex-wrap justify-between gap-3">
            <button className="snx-btn-secondary" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>
              Back
            </button>
            {step < 4 ? (
              <button className="snx-btn-accent" onClick={() => setStep((current) => Math.min(4, current + 1))}>Continue</button>
            ) : (
              <button className="snx-btn-accent" onClick={generateInterview} disabled={loading}>
                {loading ? "Generating..." : "Generate Interview"}
              </button>
            )}
          </div>
        </SurfaceCard>
      </div>

      {interviewQuestions.length ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
          <div className="space-y-6">
            <SurfaceCard strong>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="snx-kicker">Interview plan</span>
                  <h2 className="snx-heading mt-4">Your AI-generated round sequence</h2>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
                  <FiZap className="h-4 w-4" />
                  AI adaptive
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                {roundSummary.map((round, index) => (
                  <span
                    key={`${round}-${index}`}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      index === currentIndex ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {index + 1}. {round}
                  </span>
                ))}
              </div>
            </SurfaceCard>

            {currentQuestion ? (
              <SurfaceCard strong className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="snx-kicker">Question {currentIndex + 1} of {interviewQuestions.length}</span>
                    <h2 className="snx-heading mt-4">{currentQuestion.round}</h2>
                    <p className="mt-2 text-sm text-slate-500">{currentQuestion.category}</p>
                  </div>
                  <span className="snx-badge">{currentQuestion.difficulty}</span>
                </div>

                <div className="rounded-[28px] border border-slate-200/70 bg-slate-950 px-6 py-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
                  <p className="text-base leading-8 text-slate-100">{currentQuestion.question}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { label: "Intent", value: currentQuestion.intent },
                    { label: "Evaluation Focus", value: currentQuestion.evaluationFocus },
                    { label: "Follow-up Hint", value: currentQuestion.followUpHint }
                  ].map((item) => (
                    <div key={item.label} className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">Your answer</label>
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
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
                  <button className="snx-btn-accent" onClick={evaluateAnswer} disabled={evaluating}>
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
              </SurfaceCard>
            ) : null}
          </div>

          <SurfaceCard strong className="space-y-5">
            <div>
              <span className="snx-kicker">AI feedback</span>
              <h2 className="snx-heading mt-4">Evaluation summary</h2>
            </div>
            {evaluation ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Confidence</div>
                    <div className="mt-3 text-3xl font-semibold text-slate-950">{evaluation.confidenceScore}</div>
                  </div>
                  <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Communication</div>
                    <div className="mt-3 text-3xl font-semibold text-slate-950">{evaluation.communicationScore}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Feedback</div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{evaluation.feedback}</p>
                  </div>
                  <div className="rounded-[24px] border border-slate-200/70 bg-white/80 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Ideal answer</div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{evaluation.idealAnswer}</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/70 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Strengths</div>
                      <ul className="mt-3 space-y-2 text-sm text-emerald-900">
                        {(evaluation.strengths || []).length ? evaluation.strengths.map((item) => <li key={item}>- {item}</li>) : <li>- Clear response direction</li>}
                      </ul>
                    </div>
                    <div className="rounded-[24px] border border-amber-200 bg-amber-50/70 p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Improvements</div>
                      <ul className="mt-3 space-y-2 text-sm text-amber-900">
                        {(evaluation.improvements || []).length ? evaluation.improvements.map((item) => <li key={item}>- {item}</li>) : <li>- Add stronger examples</li>}
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
          </SurfaceCard>
        </div>
      ) : (
        <EmptyState
          title="No interviews yet"
          description="Finish the four-step setup and generate a tailored interview loop to begin your AI-powered practice round."
          action={<button className="snx-btn-accent" onClick={() => setStep(1)}>Start Setup</button>}
        />
      )}
    </div>
  );
};

export default AIInterviewerPage;
