import { useMemo, useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight, FiMic, FiMicOff, FiZap, FiCheckCircle, FiAward, FiAlertCircle, FiTrendingUp, FiVolume2 } from "react-icons/fi";
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

const steps = [
  { id: 1, title: "Select Role & Domain" },
  { id: 2, title: "Difficulty & Settings" },
  { id: 3, title: "Generate Flow" }
];

const AIInterviewerPage = ({ refreshProfile }) => {
  const { showToast } = useToast();
  const { evaluation, loading: evalLoading, error: evalError, evaluate, retry, reset: resetEvaluation } = useAnswerEvaluation({ refreshProfile });
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    role: "Software Engineer",
    company: "General",
    experienceLevel: "Fresher",
    difficulty: "Medium",
    domain: "Mixed",
    roundType: "Mixed",
    count: 5,
    mode: "Text" // Text or Voice
  });

  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittingSession, setSubmittingSession] = useState(false);

  // Store completed question evaluations in frontend state
  const [sessionAnswers, setSessionAnswers] = useState({}); // map of questionIndex -> { userAnswer, evaluation }
  const [sessionReport, setSessionReport] = useState(null); // hold final consolidated report

  // Voice Speech Recognition State
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // Timer State for interview pacing
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    if (interviewQuestions.length > 0 && currentQuestion) {
      // If we already evaluated this question, don't run the timer
      const isGraded = !!sessionAnswers[currentIndex]?.evaluation;
      if (isGraded) {
        setTimeLeft(0);
        return;
      }

      setTimeLeft(120); // reset 120s timer
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
        showToast("Reading question out loud...", "info");
      }
    } else {
      showToast("Audio voice reading not supported in this browser.", "error");
    }
  };

  useEffect(() => {
    // Setup Speech Recognition if supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
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
      showToast("Speech recognition is not supported in this browser.", "error");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      showToast("Voice recording stopped.", "info");
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        showToast("Listening... Speak your answer clearly.", "success");
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
      
      const { data } = await api.post("/ai/questions", {
        role: config.role,
        focus: config.domain === "Mixed" ? "General Full Stack" : config.domain,
        count: config.count,
        roundType: config.roundType,
        experienceLevel: config.experienceLevel,
        company: config.company
      });

      // Force difficulties on questions based on config difficulty
      const updatedQuestions = (data.questions || []).map((q) => ({
        ...q,
        difficulty: config.difficulty
      }));

      setInterviewQuestions(updatedQuestions);
      setCurrentIndex(0);
      setAnswer("");
      resetEvaluation();
      showToast("AI mock interview sequence loaded.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to generate interview sequence.", "error");
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
      showToast("Answer evaluation recorded.", "success");
    }
  };

  const handleFinishInterview = async () => {
    // Collect all answers
    const questionsPayload = interviewQuestions.map((q, idx) => {
      const saved = sessionAnswers[idx] || {};
      return {
        questionId: q.id,
        round: q.round,
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        userAnswer: saved.userAnswer || "No answer submitted.",
        evaluation: saved.evaluation || null
      };
    });

    try {
      setSubmittingSession(true);
      const { data } = await api.post("/ai/finish", {
        role: config.role,
        company: config.company,
        difficulty: config.difficulty,
        domain: config.domain,
        interviewType: config.roundType,
        mode: config.mode,
        questions: questionsPayload
      });

      setSessionReport(data);
      refreshProfile?.();
      showToast("Mock Interview Report compiled successfully!", "success");
    } catch (error) {
      showToast("Failed to compile interview report.", "error");
    } finally {
      setSubmittingSession(false);
    }
  };

  const goToNextQuestion = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    }
    
    // Save current answer state in case they didn't hit evaluate but we want to carry it over
    if (answer.trim() && !sessionAnswers[currentIndex]) {
      setSessionAnswers(prev => ({
        ...prev,
        [currentIndex]: { userAnswer: answer, evaluation: null }
      }));
    }

    setCurrentIndex((index) => Math.min(index + 1, interviewQuestions.length - 1));
    const nextSaved = sessionAnswers[currentIndex + 1] || {};
    setAnswer(nextSaved.userAnswer || "");
    resetEvaluation();
  };

  const goToPrevQuestion = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    }
    
    setCurrentIndex((index) => Math.max(index - 1, 0));
    const prevSaved = sessionAnswers[currentIndex - 1] || {};
    setAnswer(prevSaved.userAnswer || "");
    resetEvaluation();
  };

  const handleSelectQuestionIndex = (index) => {
    if (isRecording) {
      recognitionRef.current?.stop();
    }
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
          kicker="Evaluation Report"
          title="Interview Loop Results"
          description={`Consolidated assessment report for ${sessionReport.role} mock interview loop.`}
          actions={
            <div className="flex gap-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="snx-btn-secondary cursor-pointer flex items-center gap-1.5"
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
                className="snx-btn-primary cursor-pointer"
              >
                Start New Mock Loop
              </button>
            </div>
          }
        />

        {/* Scoring Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Overall Score", value: `${sessionReport.overallScore}%`, color: "text-brand-600 dark:text-brand-400" },
            { label: "Technical Score", value: `${sessionReport.technicalScore}/10`, color: "text-indigo-600 dark:text-indigo-400" },
            { label: "Communication Score", value: `${sessionReport.communicationScore}/10`, color: "text-green-600 dark:text-green-400" },
            { label: "Confidence Score", value: `${sessionReport.confidenceScore}/10`, color: "text-purple-600 dark:text-purple-400" }
          ].map((score) => (
            <div key={score.label} className="snx-stat snx-card-elevated text-center">
              <div className="snx-label">{score.label}</div>
              <div className={`mt-3 text-3xl font-extrabold ${score.color}`}>{score.value}</div>
            </div>
          ))}
        </div>

        {/* Strengths & Weaknesses Detail */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="snx-panel-muted space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-green-600 dark:text-green-400 flex items-center gap-2">
              <FiCheckCircle className="h-5 w-5" /> Demonstrated Strengths
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-custom-600 dark:text-slate-custom-300">
              {sessionReport.strengths && sessionReport.strengths.map((str, idx) => (
                <li key={idx}>{str}</li>
              ))}
            </ul>
          </div>

          <div className="snx-panel-muted space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-red-500 flex items-center gap-2">
              <FiAlertCircle className="h-5 w-5" /> Core Weaknesses
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-custom-600 dark:text-slate-custom-300">
              {sessionReport.weaknesses && sessionReport.weaknesses.map((weak, idx) => (
                <li key={idx}>{weak}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Areas of Improvement */}
        <div className="snx-panel-muted space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-2">
            <FiTrendingUp className="h-5 w-5" /> Key Areas of Improvement
          </h3>
          <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-custom-600 dark:text-slate-custom-300">
            {sessionReport.improvementAreas && sessionReport.improvementAreas.map((imp, idx) => (
              <li key={idx}>{imp}</li>
            ))}
          </ol>
        </div>

        {/* Suggested Topics & Questions */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="snx-panel-muted space-y-3">
            <h4 className="font-bold text-sm text-slate-custom-900 dark:text-white uppercase tracking-wider">Suggested Topics</h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {sessionReport.suggestedTopics && sessionReport.suggestedTopics.map((topic) => (
                <span key={topic} className="snx-badge-primary text-[10px] font-bold">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="snx-panel-muted space-y-3">
            <h4 className="font-bold text-sm text-slate-custom-900 dark:text-white uppercase tracking-wider">Follow-up Preparation Questions</h4>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-custom-600 dark:text-slate-custom-400">
              {sessionReport.suggestedQuestions && sessionReport.suggestedQuestions.map((qText, idx) => (
                <li key={idx}>{qText}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Questions Log review */}
        <div className="snx-panel-muted space-y-4">
          <h3 className="font-bold text-slate-custom-900 dark:text-white text-base border-b pb-2">Completed Questions Log</h3>
          <div className="space-y-4 divide-y divide-slate-custom-100 dark:divide-slate-custom-800">
            {sessionReport.questions && sessionReport.questions.map((q, idx) => (
              <div key={idx} className="pt-4 first:pt-0 space-y-2">
                <div className="flex justify-between items-baseline gap-2">
                  <h4 className="font-bold text-xs text-slate-custom-850 dark:text-white">{idx+1}. {q.round}</h4>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-50 dark:bg-brand-950/20 px-2 py-0.5 rounded">Score: {q.score}%</span>
                </div>
                <p className="text-xs text-slate-custom-500 italic">"{q.question}"</p>
                <div className="text-xs text-slate-custom-700 dark:text-slate-custom-300 bg-slate-custom-50 dark:bg-slate-custom-850 p-3 rounded-lg leading-relaxed">
                  <strong>Your Answer:</strong> {q.userAnswer}
                </div>
                {q.feedback && (
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    <strong>Feedback:</strong> {q.feedback}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (interviewQuestions.length > 0 && currentQuestion) {
    return (
      <div className="space-y-6 snx-fade-in">
        {/* Minimalist Header for Active mock loop */}
        <div className="flex items-center justify-between border-b border-slate-custom-200 pb-3 dark:border-slate-custom-700">
          <div>
            <span className="snx-kicker">Mock Interview Session in Progress</span>
            <h2 className="text-lg font-bold text-slate-custom-900 dark:text-white">{config.role} - {config.domain}</h2>
          </div>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to exit the interview loop? Progress will be lost.")) {
                setInterviewQuestions([]);
                setSessionAnswers({});
                setStep(1);
              }
            }}
            className="snx-btn-secondary snx-btn-sm !text-red-500 hover:!border-red-400 border border-transparent cursor-pointer font-semibold"
          >
            Exit Loop
          </button>
        </div>

        {/* Active Interview Panel */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            
            {/* Horizontal Rounds sequence */}
            <div className="snx-panel-muted space-y-3">
              <div className="flex items-center justify-between">
                <span className="snx-kicker">Mock Sequence</span>
                <span className="text-xs font-semibold text-brand-600">{config.mode} Mode</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {roundSummary.map((rnd, idx) => {
                  const isActive = idx === currentIndex;
                  const isEval = !!sessionAnswers[idx]?.evaluation;
                  let style = "border-slate-custom-200 bg-white text-slate-custom-600 dark:border-slate-custom-700 dark:bg-slate-custom-850";
                  if (isActive) style = "border-brand-500 bg-brand-50/50 text-brand-900 dark:bg-brand-950/20 dark:text-brand-300 ring-2 ring-brand-500/10";
                  else if (isEval) style = "border-green-500 bg-green-50 text-green-800 dark:bg-green-950/15 dark:text-green-300";

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuestionIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer truncate max-w-[120px] transition duration-200 ${style}`}
                    >
                      {idx+1}. {rnd}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Question details */}
            <div className="snx-panel-muted space-y-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <span className="snx-kicker">Question {currentIndex + 1} of {interviewQuestions.length}</span>
                  <h3 className="snx-heading-3 mt-1.5">{currentQuestion.round}</h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-3">
                    <span className="text-[10px] text-slate-custom-500 font-bold uppercase tracking-wider">{currentQuestion.category} • {currentQuestion.difficulty}</span>
                    {timeLeft > 0 && !activeSavedState?.evaluation && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        timeLeft > 60 ? "bg-green-550/10 text-green-600 border border-green-200" : timeLeft > 20 ? "bg-yellow-550/10 text-yellow-750 border border-yellow-250" : "bg-red-50 text-red-600 border border-red-200 animate-pulse"
                      }`}>
                        ⏱️ {timeLeft}s remaining
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSpeakQuestion}
                    className="h-8 w-8 rounded-lg border border-slate-custom-200 flex items-center justify-center text-slate-custom-650 hover:bg-slate-custom-50 dark:border-slate-custom-700 dark:hover:bg-slate-custom-850 cursor-pointer shrink-0"
                    title="Speak Question out loud"
                  >
                    <FiVolume2 className="h-4 w-4" />
                  </button>
                  {activeSavedState?.evaluation && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-950/25 px-2.5 py-1 rounded-full">
                      ✓ Graded
                    </span>
                  )}
                </div>
              </div>

              {timeLeft > 0 && !activeSavedState?.evaluation && (
                <div className="h-1 w-full rounded-full bg-slate-custom-200 dark:bg-slate-custom-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      timeLeft > 60 ? "bg-green-500" : timeLeft > 20 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${(timeLeft / 120) * 100}%` }}
                  />
                </div>
              )}

              {timeLeft === 0 && !activeSavedState?.evaluation && (
                <div className="bg-red-50 border border-red-200 text-red-800 text-[10px] font-bold p-2.5 rounded-lg flex items-center gap-2 animate-pulse dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-300">
                  <FiAlertCircle className="h-3.5 w-3.5" />
                  Pacing Alert: Time's up! Formulate your final response and click "Submit Answer".
                </div>
              )}

              <p className="text-sm leading-relaxed text-slate-custom-850 dark:text-white bg-slate-custom-50 dark:bg-slate-custom-850 p-4 rounded-xl font-medium border-l-4 border-brand-500">
                {currentQuestion.question}
              </p>

              {/* Speech input panel for Voice mode */}
              {config.mode === "Voice" && (
                <div className="flex flex-col items-center p-4 border border-indigo-100 bg-indigo-50/20 rounded-xl space-y-3 dark:border-indigo-900/20">
                  <button
                    onClick={handleToggleRecording}
                    className={`h-14 w-14 rounded-full flex items-center justify-center text-white cursor-pointer shadow-md transition-all duration-300 ${
                      isRecording
                        ? "bg-red-500 animate-pulse hover:bg-red-650"
                        : "bg-brand-500 hover:bg-brand-650"
                    }`}
                  >
                    {isRecording ? <FiMicOff className="h-6 w-6" /> : <FiMic className="h-6 w-6" />}
                  </button>
                  <span className="text-[10px] font-bold text-slate-custom-500 uppercase">
                    {isRecording ? "Transcribing voice in real-time..." : "Click to speak your response"}
                  </span>
                </div>
              )}

              <label className="block space-y-1.5">
                <span className="snx-label">Your response</span>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="snx-textarea min-h-[160px] text-xs leading-relaxed"
                  placeholder="Formulate your response as though explaining it directly to a senior recruiter..."
                />
              </label>

              {/* Actions panel */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex gap-2">
                  <button
                    onClick={goToPrevQuestion}
                    disabled={currentIndex === 0}
                    className="snx-btn-secondary snx-btn-sm flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <FiChevronLeft className="h-4 w-4" /> Previous
                  </button>
                  <button
                    onClick={goToNextQuestion}
                    disabled={currentIndex === interviewQuestions.length - 1}
                    className="snx-btn-secondary snx-btn-sm flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    Next <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={evalLoading || !answer.trim()}
                    className="snx-btn-secondary snx-btn-sm bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 cursor-pointer disabled:opacity-50"
                  >
                    {evalLoading ? "Grading..." : "Submit Answer"}
                  </button>

                  {/* Finish report compilation button */}
                  {currentIndex === interviewQuestions.length - 1 && (
                    <button
                      onClick={handleFinishInterview}
                      disabled={submittingSession}
                      className="snx-btn-primary snx-btn-sm flex items-center gap-1 cursor-pointer"
                    >
                      <FiZap className="h-3.5 w-3.5" />
                      {submittingSession ? "Compiling..." : "Finish & Compile Report"}
                    </button>
                  )}
                </div>
              </div>

              {/* Dynamic feedback panel below */}
              {evaluation && (
                <div className="pt-4 border-t border-slate-custom-100 dark:border-slate-custom-800">
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

          {/* Setup details details cards */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <div className="snx-card space-y-4">
              <span className="snx-kicker">Evaluations Info</span>
              <h4 className="font-bold text-sm text-slate-custom-900 dark:text-white uppercase tracking-wider">Evaluation Focus</h4>
              <p className="text-[11px] leading-relaxed text-slate-custom-500">
                {currentQuestion.evaluationFocus || "Assess structure, definitions, clarity, complexity, and metrics."}
              </p>
              <div className="border-t border-slate-custom-100 dark:border-slate-custom-800 pt-3 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-custom-400 uppercase">Follow-up hint</span>
                <p className="text-[11px] italic text-slate-custom-500">"{currentQuestion.followUpHint}"</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 snx-fade-in">
      <PageHeader
        kicker="AI Interview Studio"
        title="Redesigned Adaptive Mock Interview"
        description="Set role, difficulty, skills, and choose between Voice and Text mode to test yourself."
      />

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        
        {/* Setup Workflow */}
        <div className="snx-panel-muted space-y-5">
          <div>
            <span className="snx-kicker">Interview setup</span>
            <h2 className="snx-heading-3 mt-3 text-slate-custom-900">Configure Loop</h2>
          </div>
          <div className="space-y-3">
            {steps.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3.5 text-left transition-all duration-300 cursor-pointer ${
                  step === item.id
                    ? "border-indigo-500 bg-indigo-50/50 text-indigo-900 dark:bg-indigo-950/20 dark:text-indigo-200"
                    : step > item.id
                      ? "border-indigo-200 bg-indigo-50/20 text-indigo-700 dark:bg-indigo-950/10 dark:text-indigo-300"
                      : "border-slate-custom-200 bg-white text-slate-custom-600 hover:border-indigo-250 dark:border-slate-custom-750 dark:bg-slate-custom-800"
                }`}
                onClick={() => setStep(item.id)}
              >
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold ${
                  step === item.id ? "bg-indigo-600 text-white" : step > item.id ? "bg-indigo-600 text-white" : "bg-slate-custom-100 text-slate-custom-700 dark:bg-slate-custom-700 dark:text-slate-custom-150"
                }`}>
                  {step > item.id ? "✓" : item.id}
                </span>
                <span className="font-medium text-xs">{item.title}</span>
              </button>
            ))}
          </div>
          <div className="snx-stat">
            <div className="snx-label">Setup Summary</div>
            <div className="mt-3 space-y-2 snx-body-sm text-slate-custom-600">
              <div><strong>Role:</strong> {config.role}</div>
              <div><strong>Domain:</strong> {config.domain}</div>
              <div><strong>Type:</strong> {config.roundType}</div>
              <div><strong>Difficulty:</strong> {config.difficulty}</div>
              <div><strong>Mode:</strong> {config.mode} Mode</div>
            </div>
          </div>
        </div>

        {/* Steps Forms */}
        <div className="snx-panel-muted space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="snx-kicker">Interactive Setup</span>
              <h2 className="snx-heading-3 mt-3 text-slate-custom-900">Step {step} of 3</h2>
            </div>
            <div className="snx-badge-primary">{config.roundType} Flow</div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="snx-label">Role Category</span>
                  <select
                    className="snx-input"
                    value={config.role}
                    onChange={(e) => setConfig({ ...config, role: e.target.value })}
                  >
                    {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="snx-label">Interview Domain</span>
                  <select
                    className="snx-input"
                    value={config.domain}
                    onChange={(e) => setConfig({ ...config, domain: e.target.value })}
                  >
                    {domainOptions.map((domain) => <option key={domain} value={domain}>{domain}</option>)}
                  </select>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                {experienceOptions.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setConfig({ ...config, experienceLevel: lvl })}
                    className={`p-4 border rounded-xl text-left transition-all duration-300 cursor-pointer ${
                      config.experienceLevel === lvl
                        ? "border-brand-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                        : "border-slate-custom-200 hover:border-indigo-300 dark:border-slate-custom-700"
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-custom-850 dark:text-white">{lvl}</div>
                    <div className="text-[10px] text-slate-custom-500 mt-1">Adjusts assessment metrics and follow-up complexity.</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="snx-label">Difficulty Tier</span>
                  <select
                    className="snx-input"
                    value={config.difficulty}
                    onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
                  >
                    {difficultyOptions.map((diff) => <option key={diff} value={diff}>{diff}</option>)}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="snx-label">Interview Type</span>
                  <select
                    className="snx-input"
                    value={config.roundType}
                    onChange={(e) => setConfig({ ...config, roundType: e.target.value })}
                  >
                    {roundOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                {[
                  { mode: "Text", desc: "Type your answers. Ideal for detailed technical code structures." },
                  { mode: "Voice", desc: "Speak your answers. Leverages speech-to-text to grade communication style." }
                ].map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => setConfig({ ...config, mode: item.mode })}
                    className={`p-4 border rounded-xl text-left transition-all duration-300 cursor-pointer ${
                      config.mode === item.mode
                        ? "border-brand-500 bg-indigo-50/50 dark:bg-indigo-950/20"
                        : "border-slate-custom-200 hover:border-indigo-300 dark:border-slate-custom-700"
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-custom-850 dark:text-white">{item.mode} Interview</div>
                    <div className="text-[10px] text-slate-custom-500 mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="snx-label">Target Company (Context)</span>
                  <select
                    className="snx-input"
                    value={config.company}
                    onChange={(e) => setConfig({ ...config, company: e.target.value })}
                  >
                    {companyOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="snx-label">Question Count</span>
                  <select
                    className="snx-input"
                    value={config.count}
                    onChange={(e) => setConfig({ ...config, count: Number(e.target.value) })}
                  >
                    {[5, 10, 15].map((cnt) => <option key={cnt} value={cnt}>{cnt} Questions</option>)}
                  </select>
                </label>
              </div>

              <div className="bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-200 dark:border-indigo-900/40 p-4 rounded-xl text-xs space-y-2 leading-relaxed">
                <h4 className="font-bold text-slate-custom-900 dark:text-white">AI Generation Ready!</h4>
                <p className="text-slate-custom-600 dark:text-slate-custom-300">We will configure a dynamic mock loop matching {config.role} requirements focusing on {config.domain}. It runs with {config.difficulty} difficulty in {config.mode} mode.</p>
              </div>
            </div>
          )}

          {/* Navigation buttons inside setup */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setStep(s => Math.max(1, s-1))}
              disabled={step === 1}
              className="snx-btn-secondary snx-btn-sm disabled:opacity-50 cursor-pointer"
            >
              Back
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep(s => Math.min(3, s+1))}
                className="snx-btn-primary snx-btn-sm cursor-pointer"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={generateInterview}
                disabled={loading}
                className="snx-btn-primary snx-btn-sm cursor-pointer shrink-0"
              >
                {loading ? "Generating Loop..." : "Generate & Start"}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIInterviewerPage;
