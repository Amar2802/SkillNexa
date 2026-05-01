import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import api from "../api/client";
import InterviewStepPill from "../components/interview/InterviewStepPill";
import TypingPulse from "../components/interview/TypingPulse";
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

const metricCard = (label, value) => (
  <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
  </div>
);

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

  const strengths = evaluation?.strengths || [];
  const improvements = evaluation?.improvements || [];

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="snx-panel-strong p-6 md:p-8">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <span className="snx-badge">AI Interview Generator</span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                Build a realistic interview loop in four guided steps.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
                Set your role, define your experience level, choose the right skill focus, and generate an AI-powered interview flow that feels production-ready.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              {metricCard("Role", config.role)}
              {metricCard("Experience", config.experienceLevel)}
              {metricCard("Skill Focus", config.skills.length)}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <div className="snx-panel-strong p-6">
              <span className="snx-badge">Step-Based Flow</span>
              <div className="mt-5 space-y-3">
                {steps.map((item) => (
                  <InterviewStepPill key={item.id} index={item.id} title={item.title} active={step === item.id} complete={step > item.id} />
                ))}
              </div>
            </div>

            <div className="snx-panel-strong p-6">
              <span className="snx-badge">Interview Blueprint</span>
              <div className="mt-5 space-y-3 text-sm text-slate-500">
                <p><span className="font-semibold text-slate-900">Company:</span> {config.company}</p>
                <p><span className="font-semibold text-slate-900">Flow:</span> {config.roundType}</p>
                <p><span className="font-semibold text-slate-900">Questions:</span> {config.count}</p>
                <p><span className="font-semibold text-slate-900">Skills:</span> {config.skills.join(", ") || "Choose up to 6"}</p>
              </div>
            </div>
          </div>

          <div className="snx-panel-strong p-6 md:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="snx-badge">Conversational Setup</span>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Design your next AI interview round</h2>
              </div>
              <div className="text-sm font-medium text-slate-500">Step {step} of 4</div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div key="step-1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Select your target role</label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {roleOptions.map((role) => (
                        <button key={role} type="button" onClick={() => setConfig((current) => ({ ...current, role }))} className={`rounded-3xl border px-4 py-4 text-left transition ${
                          config.role === role ? "border-brand-200 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-700 hover:border-brand-200"
                        }`}>
                          <p className="font-semibold">{role}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button className="snx-button-primary" onClick={() => setStep(2)}>Continue</button>
                  </div>
                </motion.div>
              ) : null}

              {step === 2 ? (
                <motion.div key="step-2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Choose experience level</label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {experienceOptions.map((level) => (
                        <button key={level} type="button" onClick={() => setConfig((current) => ({ ...current, experienceLevel: level }))} className={`rounded-3xl border px-4 py-4 text-left transition ${
                          config.experienceLevel === level ? "border-brand-200 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-700 hover:border-brand-200"
                        }`}>
                          <p className="font-semibold">{level}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button className="snx-button-secondary" onClick={() => setStep(1)}>Back</button>
                    <button className="snx-button-primary" onClick={() => setStep(3)}>Continue</button>
                  </div>
                </motion.div>
              ) : null}

              {step === 3 ? (
                <motion.div key="step-3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Choose up to 6 skill focus areas</label>
                    <div className="flex flex-wrap gap-3">
                      {skillOptions.map((skill) => (
                        <button key={skill} type="button" onClick={() => toggleSkill(skill)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          config.skills.includes(skill) ? "border-brand-200 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-600 hover:border-brand-200"
                        }`}>
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button className="snx-button-secondary" onClick={() => setStep(2)}>Back</button>
                    <button className="snx-button-primary" onClick={() => setStep(4)}>Continue</button>
                  </div>
                </motion.div>
              ) : null}

              {step === 4 ? (
                <motion.div key="step-4" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Target company</label>
                      <select className="snx-select" value={config.company} onChange={(event) => setConfig((current) => ({ ...current, company: event.target.value }))}>
                        {companyOptions.map((company) => <option key={company} value={company}>{company}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Interview flow</label>
                      <select className="snx-select" value={config.roundType} onChange={(event) => setConfig((current) => ({ ...current, roundType: event.target.value }))}>
                        {roundOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">Question count</label>
                      <select className="snx-select" value={config.count} onChange={(event) => setConfig((current) => ({ ...current, count: Number(event.target.value) }))}>
                        {[3, 4, 5, 6, 7].map((count) => <option key={count} value={count}>{count}</option>)}
                      </select>
                    </div>
                  </div>

                  {loading ? <TypingPulse text="Generating your interview..." /> : null}

                  <div className="flex justify-between">
                    <button className="snx-button-secondary" onClick={() => setStep(3)}>Back</button>
                    <button className="snx-button-primary" onClick={generateInterview} disabled={loading}>
                      {loading ? "Generating..." : "Generate Interview"}
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </section>

        {interviewQuestions.length ? (
          <section className="snx-panel-strong p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="snx-badge">Interview Plan</span>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Your AI-generated round sequence</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {roundSummary.map((round, index) => (
                  <span key={`${round}-${index}`} className={`rounded-full px-4 py-2 text-xs font-semibold ${
                    index === currentIndex ? "bg-brand-500 text-white" : "border border-slate-200 bg-white text-slate-600"
                  }`}>
                    {index + 1}. {round}
                  </span>
                ))}
              </div>
            </div>

            {currentQuestion ? (
              <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-5">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Question {currentIndex + 1} of {interviewQuestions.length}</p>
                        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{currentQuestion.round}</h3>
                        <p className="mt-1 text-sm text-slate-500">{currentQuestion.category}</p>
                      </div>
                      <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600">{currentQuestion.difficulty}</span>
                    </div>
                    <p className="text-base leading-7 text-slate-700">{currentQuestion.question}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Intent</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{currentQuestion.intent}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Evaluation Focus</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{currentQuestion.evaluationFocus}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Follow-Up Hint</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{currentQuestion.followUpHint}</p>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Your response</label>
                    <textarea className="snx-input min-h-[220px] resize-none" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Write your answer here as if you are speaking to a real interviewer..." />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button className="snx-button-primary" onClick={evaluateAnswer} disabled={evaluating}>
                      {evaluating ? "Evaluating..." : "Evaluate Answer"}
                    </button>
                    <button className="snx-button-secondary" onClick={() => { setCurrentIndex((index) => Math.max(index - 1, 0)); setAnswer(""); setEvaluation(null); }} disabled={currentIndex <= 0}>
                      Previous Question
                    </button>
                    <button className="snx-button-secondary" onClick={() => { setCurrentIndex((index) => Math.min(index + 1, interviewQuestions.length - 1)); setAnswer(""); setEvaluation(null); }} disabled={currentIndex >= interviewQuestions.length - 1}>
                      Next Question
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="snx-panel p-5">
                    <span className="snx-badge">AI Feedback</span>
                    {evaluation ? (
                      <div className="mt-4 space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          {metricCard("Confidence", evaluation.confidenceScore)}
                          {metricCard("Communication", evaluation.communicationScore)}
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Feedback</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{evaluation.feedback}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Ideal Answer</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{evaluation.idealAnswer}</p>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">Strengths</p>
                            <ul className="mt-3 space-y-2 text-sm text-emerald-900">
                              {strengths.length ? strengths.map((item) => <li key={item}>• {item}</li>) : <li>• Clear response direction</li>}
                            </ul>
                          </div>
                          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
                            <p className="text-xs uppercase tracking-[0.24em] text-amber-700">Improvements</p>
                            <ul className="mt-3 space-y-2 text-sm text-amber-900">
                              {improvements.length ? improvements.map((item) => <li key={item}>• {item}</li>) : <li>• Add a stronger example</li>}
                            </ul>
                          </div>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Follow-Up Question</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{evaluation.followUpQuestion}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50/60 p-5">
                        <p className="text-sm font-semibold text-slate-900">No feedback yet</p>
                        <p className="mt-2 text-sm leading-6 text-slate-500">Submit your answer to see AI scoring, strengths, improvements, and the ideal answer path.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        ) : (
          <section className="snx-panel-strong border-dashed p-10 text-center">
            <p className="text-lg font-semibold text-slate-950">No interviews yet</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Complete the four-step setup and generate an interview to unlock question flow, AI evaluation, and follow-up guidance.
            </p>
            <button className="snx-button-primary mt-6" onClick={() => setStep(1)}>Start Interview Setup</button>
          </section>
        )}
      </div>
    </motion.div>
  );
};

export default AIInterviewerPage;
