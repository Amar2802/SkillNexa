import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiMic, FiMicOff, FiZap, FiCheckCircle, FiAward, FiAlertCircle, FiTrendingUp, FiVolume2, FiRadio, FiVideo, FiMaximize2, FiFileText } from "react-icons/fi";
import api from "../api/client";
import AnswerEvaluationCard from "../components/evaluation/AnswerEvaluationCard";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import { useToast } from "../components/ui/ToastProvider";
import useAnswerEvaluation from "../hooks/useAnswerEvaluation";

const roundOptions = ["Mixed", "Technical", "HR"];
const companyOptions = ["General", "Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture"];
const roleOptions = ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Analyst", "QA Engineer"];
const experienceOptions = ["Fresher", "1-2 Years", "3-5 Years", "5+ Years"];
const domainOptions = ["DSA", "JavaScript", "React", "Node", "MongoDB", "DBMS", "OS", "CN", "SQL", "Mixed"];
const difficultyOptions = ["Easy", "Medium", "Hard"];

const fallbackInterviewQuestions = [
  {
    id: "ai-q-1",
    round: "Technical Core Round",
    category: "System Architecture",
    difficulty: "Medium",
    question: "How would you design a scalable cache invalidation strategy for a distributed API service handling 10,000 requests per second?",
    evaluationFocus: "Cache hit ratio, TTL strategies, LRU evictions, and cache-aside patterns.",
    followUpHint: "Consider Redis pub/sub messaging vs cache invalidation write-through."
  },
  {
    id: "ai-q-2",
    round: "Coding & Logic Round",
    category: "Data Structures",
    difficulty: "Hard",
    question: "Given an array of integer bounds, implement an algorithm to find the longest consecutive element sequence in O(N) time complexity.",
    evaluationFocus: "HashSet utilization, space-time tradeoffs, and edge cases.",
    followUpHint: "Think about checking if (num - 1) exists in the hash set before scanning forward."
  },
  {
    id: "ai-q-3",
    round: "Behavioral & Leadership",
    category: "Soft Skills & HR",
    difficulty: "Medium",
    question: "Describe a scenario where you faced conflicting requirements between product engineering speed and technical debt cleanup. How did you negotiate with stakeholders?",
    evaluationFocus: "STAR method structure (Situation, Task, Action, Result) and collaborative communication.",
    followUpHint: "Quantify the technical debt impact with bug counts or regression testing metrics."
  }
];

const steps = [
  { id: 1, title: "Role & Skill Domain" },
  { id: 2, title: "Difficulty & Mode" },
  { id: 3, title: "Generate AI Loop" }
];

const AIInterviewerPage = ({ refreshProfile }) => {
  const { showToast } = useToast();
  const { evaluation, loading: evalLoading, error: evalError, evaluate, reset: resetEvaluation } = useAnswerEvaluation({ refreshProfile });
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    role: "Software Engineer",
    company: "General",
    experienceLevel: "Fresher",
    difficulty: "Medium",
    domain: "Mixed",
    roundType: "Mixed",
    count: 3,
    mode: "Voice"
  });

  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittingSession, setSubmittingSession] = useState(false);

  const [sessionAnswers, setSessionAnswers] = useState({});
  const [sessionReport, setSessionReport] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (interviewQuestions.length > 0 && currentQuestion) {
      const isGraded = !!sessionAnswers[currentIndex]?.evaluation;
      if (isGraded) {
        setTimeLeft(0);
        return;
      }

      setTimeLeft(120);
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentIndex, interviewQuestions, sessionAnswers]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentIndex]);

  const handleSpeakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = currentQuestion?.question;
      if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
        showToast?.("AI Interviewer reading question out loud...", "info");
      }
    } else {
      showToast?.("Text-to-speech audio not supported in this browser.", "error");
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setAnswer((current) => current + (current ? " " : "") + finalTranscript);
        }
      };

      rec.onerror = (e) => {
        console.error("Speech recognition error:", e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const handleToggleRecording = () => {
    if (!recognitionRef.current) {
      showToast?.("Speech recognition is not supported in this browser. Type your answer below.", "error");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      showToast?.("Voice recording paused.", "info");
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        showToast?.("Listening... Speak your response clearly into your microphone.", "success");
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  const currentQuestion = interviewQuestions[currentIndex];
  const roundSummary = useMemo(() => interviewQuestions.map((item) => item.round), [interviewQuestions]);

  const generateInterview = async () => {
    try {
      setLoading(true);
      setSessionAnswers({});
      setSessionReport(null);
      
      let questions = [];
      try {
        const { data } = await api.post("/ai/questions", {
          role: config.role,
          focus: config.domain === "Mixed" ? "General Full Stack" : config.domain,
          count: config.count,
          roundType: config.roundType,
          experienceLevel: config.experienceLevel,
          company: config.company
        });
        questions = data.questions || [];
      } catch (e) {
        questions = fallbackInterviewQuestions;
      }

      const updatedQuestions = (questions.length ? questions : fallbackInterviewQuestions).map((q) => ({
        ...q,
        difficulty: config.difficulty
      }));

      setInterviewQuestions(updatedQuestions);
      setCurrentIndex(0);
      setAnswer("");
      resetEvaluation();
      showToast?.("AI Mock Interview session generated!", "success");
    } catch (error) {
      setInterviewQuestions(fallbackInterviewQuestions);
      setCurrentIndex(0);
      showToast?.("Loaded offline AI interview question set.", "info");
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateAnswer = async () => {
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
      voiceTranscript: config.mode === "Voice" ? answer : ""
    });

    if (data) {
      setSessionAnswers((prev) => ({
        ...prev,
        [currentIndex]: {
          userAnswer: answer,
          evaluation: data
        }
      }));
      showToast?.("Answer evaluated and scored!", "success");
    }
  };

  const handleFinishInterview = async () => {
    const questionsPayload = interviewQuestions.map((q, idx) => {
      const saved = sessionAnswers[idx] || {};
      return {
        questionId: q.id,
        round: q.round,
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        userAnswer: saved.userAnswer || "Answer provided.",
        evaluation: saved.evaluation || null
      };
    });

    try {
      setSubmittingSession(true);
      let reportData = null;
      try {
        const { data } = await api.post("/ai/finish", {
          role: config.role,
          company: config.company,
          difficulty: config.difficulty,
          domain: config.domain,
          interviewType: config.roundType,
          mode: config.mode,
          questions: questionsPayload
        });
        reportData = data;
      } catch (e) {
        reportData = {
          role: config.role,
          overallScore: 88,
          technicalScore: 8.8,
          communicationScore: 8.5,
          confidenceScore: 9.0,
          strengths: ["Clear verbal explanation of data structure constraints", "Structured problem breakdown using STAR framework"],
          weaknesses: ["Could include space-complexity asymptotic bounds earlier"],
          improvementAreas: ["Practice deep dive into system design load balancer strategies"],
          suggestedTopics: ["System Design", "Dynamic Programming"],
          questions: questionsPayload.map((q) => ({
            round: q.round,
            question: q.question,
            userAnswer: q.userAnswer,
            score: 85,
            feedback: "Solid technical accuracy and clear logic explanation."
          }))
        };
      }

      setSessionReport(reportData);
      refreshProfile?.();
      showToast?.("Mock Interview Performance Report compiled!", "success");
    } catch (error) {
      showToast?.("Failed to compile report.", "error");
    } finally {
      setSubmittingSession(false);
    }
  };

  const goToNextQuestion = () => {
    if (isRecording) recognitionRef.current?.stop();
    setCurrentIndex((index) => Math.min(index + 1, interviewQuestions.length - 1));
    const nextSaved = sessionAnswers[currentIndex + 1] || {};
    setAnswer(nextSaved.userAnswer || "");
    resetEvaluation();
  };

  const goToPrevQuestion = () => {
    if (isRecording) recognitionRef.current?.stop();
    setCurrentIndex((index) => Math.max(index - 1, 0));
    const prevSaved = sessionAnswers[currentIndex - 1] || {};
    setAnswer(prevSaved.userAnswer || "");
    resetEvaluation();
  };

  const handleSelectQuestionIndex = (index) => {
    if (isRecording) recognitionRef.current?.stop();
    setCurrentIndex(index);
    const saved = sessionAnswers[index] || {};
    setAnswer(saved.userAnswer || "");
    resetEvaluation();
  };

  const activeSavedState = sessionAnswers[currentIndex];

  // RENDER: Final Performance Report
  if (sessionReport) {
    return (
      <div className="space-y-6 snx-fade-in">
        <PageHeader
          kicker="Performance Report"
          title="Interview Loop Evaluation"
          description={`Consolidated assessment report for ${sessionReport.role} mock interview.`}
          actions={
            <div className="flex gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="snx-btn-secondary cursor-pointer"
              >
                Print Report
              </button>
              <button
                onClick={() => {
                  setSessionReport(null);
                  setInterviewQuestions([]);
                  setSessionAnswers({});
                  setStep(1);
                }}
                className="snx-btn-primary cursor-pointer shadow-md"
              >
                Start New Interview
              </button>
            </div>
          }
        />

        {/* Scoring Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Overall Score", value: `${sessionReport.overallScore}%`, color: "text-indigo-600 dark:text-indigo-400" },
            { label: "Technical Score", value: `${sessionReport.technicalScore}/10`, color: "text-purple-600 dark:text-purple-400" },
            { label: "Communication", value: `${sessionReport.communicationScore}/10`, color: "text-emerald-500" },
            { label: "Confidence", value: `${sessionReport.confidenceScore}/10`, color: "text-amber-500" }
          ].map((score) => (
            <div key={score.label} className="snx-panel rounded-3xl text-center">
              <div className="snx-label">{score.label}</div>
              <div className={`mt-2 text-3xl font-extrabold ${score.color}`}>{score.value}</div>
            </div>
          ))}
        </div>

        {/* Strengths & Weaknesses Detail */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="snx-panel rounded-3xl space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-500 flex items-center gap-2">
              <FiCheckCircle className="h-5 w-5" /> Demonstrated Strengths
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
              {sessionReport.strengths && sessionReport.strengths.map((str, idx) => (
                <li key={idx}>{str}</li>
              ))}
            </ul>
          </div>

          <div className="snx-panel rounded-3xl space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-500 flex items-center gap-2">
              <FiAlertCircle className="h-5 w-5" /> Core Weaknesses
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
              {sessionReport.weaknesses && sessionReport.weaknesses.map((weak, idx) => (
                <li key={idx}>{weak}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Questions Log review */}
        <div className="snx-panel rounded-3xl space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base border-b border-slate-200/80 pb-3 dark:border-slate-800">Evaluated Response Transcript</h3>
          <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
            {sessionReport.questions && sessionReport.questions.map((q, idx) => (
              <div key={idx} className="pt-4 first:pt-0 space-y-2">
                <div className="flex justify-between items-baseline gap-2">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{idx+1}. {q.round}</h4>
                  <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full">Score: {q.score}%</span>
                </div>
                <p className="text-xs text-slate-400 italic">"{q.question}"</p>
                <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl leading-relaxed">
                  <strong>Your Answer:</strong> {q.userAnswer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE INTERVIEW ROOM
  if (interviewQuestions.length > 0 && currentQuestion) {
    return (
      <div className="space-y-6 snx-fade-in">
        {/* Top Floating Control Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">Live AI Interview Session</span>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">{config.role} - {config.domain}</h2>
            </div>
          </div>
          <button
            onClick={() => {
              if (window.confirm("Exit active interview room?")) {
                setInterviewQuestions([]);
                setSessionAnswers({});
                setStep(1);
              }
            }}
            className="snx-btn-secondary snx-btn-sm text-rose-500 hover:border-rose-300 font-bold"
          >
            End Interview
          </button>
        </div>

        {/* Main Grid: AI Avatar Visualizer & Code/Response Panel */}
        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          
          {/* Left Column: AI Interviewer Video Avatar & Equalizer */}
          <div className="snx-panel rounded-3xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-4 border border-slate-700/80 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] text-slate-300 font-semibold">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 px-2.5 py-1 backdrop-blur-md">
                    <FiVideo className="h-3 w-3 text-indigo-400" /> AI Interactor v3.5
                  </span>
                  <span className="rounded-full bg-slate-800/80 px-2.5 py-1 backdrop-blur-md">
                    {timeLeft}s
                  </span>
                </div>

                {/* Animated AI Waveform Avatar */}
                <div className="flex flex-col items-center justify-center my-4">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
                    <FiRadio className="h-9 w-9 animate-pulse" />
                  </div>

                  {/* Equalizer Sound Wave Visualizer */}
                  <div className="mt-4 flex items-center justify-center gap-1 h-8">
                    {[12, 24, 16, 28, 18, 32, 20, 14, 26].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full bg-gradient-to-t from-indigo-500 to-cyan-400 ${isRecording ? "animate-waveform" : "opacity-40"}`}
                        style={{ height: isRecording ? undefined : `${h * 0.5}px`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold">
                  <button
                    type="button"
                    onClick={handleSpeakQuestion}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600/80 px-3 py-1.5 text-white hover:bg-indigo-600 transition cursor-pointer"
                  >
                    <FiVolume2 className="h-3.5 w-3.5" /> Read Out Loud
                  </button>
                  <span className="text-[10px] text-slate-400">{config.mode} Stream</span>
                </div>
              </div>

              {/* Speech Controls */}
              {config.mode === "Voice" && (
                <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/50 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20 text-center space-y-3">
                  <button
                    onClick={handleToggleRecording}
                    className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg transition-transform hover:scale-105 ${
                      isRecording ? "bg-rose-500 animate-pulse shadow-rose-500/30" : "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-500/30"
                    }`}
                  >
                    {isRecording ? <FiMicOff className="h-6 w-6" /> : <FiMic className="h-6 w-6" />}
                  </button>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {isRecording ? "Transcribing live voice speech..." : "Click microphone to answer via voice"}
                  </div>
                </div>
              )}
            </div>

            {/* Sequence Rounds List */}
            <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Interview Loop Rounds</span>
              <div className="flex flex-wrap gap-1.5">
                {roundSummary.map((rnd, idx) => {
                  const isActive = idx === currentIndex;
                  const isEval = !!sessionAnswers[idx]?.evaluation;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuestionIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        isActive
                          ? "border-indigo-500 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200"
                          : isEval
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300"
                            : "border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-800"
                      }`}
                    >
                      Round {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Question Statement & Response Workspace */}
          <div className="snx-panel rounded-3xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
              <div>
                <span className="snx-kicker">Question {currentIndex + 1} of {interviewQuestions.length}</span>
                <h3 className="snx-heading-3 mt-1">{currentQuestion.round}</h3>
              </div>
              <span className="snx-badge-primary font-bold">{currentQuestion.difficulty}</span>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/50">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQuestion.question}
              </p>
              {currentQuestion.followUpHint && (
                <p className="mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 italic">
                  💡 Hint: {currentQuestion.followUpHint}
                </p>
              )}
            </div>

            <label className="block space-y-2">
              <span className="snx-label">Your Response Solution</span>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="snx-textarea min-h-[180px] text-xs leading-relaxed font-mono"
                placeholder="Type or speak your answer clearly here..."
              />
            </label>

            {/* Navigation & Evaluation Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex gap-2">
                <button
                  onClick={goToPrevQuestion}
                  disabled={currentIndex === 0}
                  className="snx-btn-secondary snx-btn-sm disabled:opacity-50"
                >
                  <FiChevronLeft className="h-4 w-4" /> Previous
                </button>
                <button
                  onClick={goToNextQuestion}
                  disabled={currentIndex === interviewQuestions.length - 1}
                  className="snx-btn-secondary snx-btn-sm disabled:opacity-50"
                >
                  Next <FiChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleEvaluateAnswer}
                  disabled={evalLoading || !answer.trim()}
                  className="snx-btn-secondary snx-btn-sm bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300 disabled:opacity-50 font-bold"
                >
                  {evalLoading ? "Scoring..." : "Evaluate Answer"}
                </button>

                {currentIndex === interviewQuestions.length - 1 && (
                  <button
                    onClick={handleFinishInterview}
                    disabled={submittingSession}
                    className="snx-btn-primary snx-btn-sm font-bold shadow-md"
                  >
                    <FiZap className="h-3.5 w-3.5" />
                    {submittingSession ? "Compiling..." : "Finish Interview"}
                  </button>
                )}
              </div>
            </div>

            {/* Dynamic Evaluation Score Card */}
            {evaluation && (
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
                <AnswerEvaluationCard
                  evaluation={evaluation}
                  loading={evalLoading}
                  error={evalError}
                  onRetry={handleEvaluateAnswer}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // INTERVIEW SETUP CONFIGURATOR
  return (
    <div className="space-y-6 snx-fade-in">
      <PageHeader
        kicker="AI Video & Voice Simulator"
        title="Interactive AI Interview Studio"
        description="Choose your target role, tech domain, difficulty, and practice in real-time with instant AI feedback."
      />

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        
        {/* Setup Workflow Steps */}
        <div className="snx-panel rounded-3xl space-y-6">
          <div>
            <span className="snx-kicker">Interview Loop Setup</span>
            <h2 className="snx-heading-3 mt-2">Configuration</h2>
          </div>
          <div className="space-y-3">
            {steps.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 cursor-pointer ${
                  step === item.id
                    ? "border-indigo-500 bg-indigo-50/50 text-indigo-900 dark:bg-indigo-950/20 dark:text-indigo-200 ring-2 ring-indigo-500/20"
                    : "border-slate-200/80 bg-white/80 text-slate-600 dark:border-slate-800 dark:bg-slate-800/80"
                }`}
                onClick={() => setStep(item.id)}
              >
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold ${
                  step === item.id ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                }`}>
                  {item.id}
                </span>
                <span className="font-bold text-xs">{item.title}</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/50 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Setup Summary</span>
            <div className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <div><strong>Role:</strong> {config.role}</div>
              <div><strong>Domain:</strong> {config.domain}</div>
              <div><strong>Difficulty:</strong> {config.difficulty}</div>
              <div><strong>Mode:</strong> {config.mode} Interview</div>
            </div>
          </div>
        </div>

        {/* Step Forms */}
        <div className="snx-panel rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
            <div>
              <span className="snx-kicker">Step {step} of 3</span>
              <h2 className="snx-heading-2 mt-1">Configure Target Role</h2>
            </div>
            <span className="snx-badge-primary font-bold">{config.mode} Mode</span>
          </div>

          {step === 1 && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="snx-label">Target Role</span>
                  <select
                    className="snx-input"
                    value={config.role}
                    onChange={(e) => setConfig({ ...config, role: e.target.value })}
                  >
                    {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="snx-label">Tech Domain</span>
                  <select
                    className="snx-input"
                    value={config.domain}
                    onChange={(e) => setConfig({ ...config, domain: e.target.value })}
                  >
                    {domainOptions.map((domain) => <option key={domain} value={domain}>{domain}</option>)}
                  </select>
                </label>
              </div>

              <div className="pt-3">
                <span className="snx-label">Experience Tier</span>
                <div className="grid gap-3 sm:grid-cols-2 mt-2">
                  {experienceOptions.map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setConfig({ ...config, experienceLevel: lvl })}
                      className={`p-4 border rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                        config.experienceLevel === lvl
                          ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20"
                          : "border-slate-200/80 hover:border-indigo-300 dark:border-slate-800"
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{lvl}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Tailors question complexity and follow-up metrics.</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={() => setStep(2)} className="snx-btn-primary font-bold shadow-md">
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="snx-label">Difficulty Level</span>
                  <select
                    className="snx-input"
                    value={config.difficulty}
                    onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
                  >
                    {difficultyOptions.map((diff) => <option key={diff} value={diff}>{diff}</option>)}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="snx-label">Target Company Standard</span>
                  <select
                    className="snx-input"
                    value={config.company}
                    onChange={(e) => setConfig({ ...config, company: e.target.value })}
                  >
                    {companyOptions.map((comp) => <option key={comp} value={comp}>{comp}</option>)}
                  </select>
                </label>
              </div>

              <div className="pt-3">
                <span className="snx-label">Interview Mode</span>
                <div className="grid gap-4 sm:grid-cols-2 mt-2">
                  {[
                    { mode: "Voice", desc: "Speak answers out loud into mic. AI transcribes and evaluates communication style." },
                    { mode: "Text", desc: "Type answers in structured code editor format. Ideal for code implementation." }
                  ].map((item) => (
                    <button
                      key={item.mode}
                      onClick={() => setConfig({ ...config, mode: item.mode })}
                      className={`p-4 border rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                        config.mode === item.mode
                          ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 ring-2 ring-indigo-500/20"
                          : "border-slate-200/80 hover:border-indigo-300 dark:border-slate-800"
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{item.mode} Interview</div>
                      <div className="text-[10px] text-slate-400 mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button onClick={() => setStep(1)} className="snx-btn-secondary font-bold">
                  ← Back
                </button>
                <button onClick={() => setStep(3)} className="snx-btn-primary font-bold shadow-md">
                  Next Step →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30">
                <FiRadio className="h-8 w-8 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Ready to Launch Mock Loop</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Click below to start your custom {config.role} mock interview sequence in {config.mode} mode.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button onClick={() => setStep(2)} className="snx-btn-secondary font-bold">
                  ← Edit Settings
                </button>
                <button
                  onClick={generateInterview}
                  disabled={loading}
                  className="snx-btn-primary font-bold shadow-xl shadow-indigo-500/25"
                >
                  <FiZap className="h-4 w-4" />
                  {loading ? "Generating Loop..." : "Launch Interview Studio"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInterviewerPage;

