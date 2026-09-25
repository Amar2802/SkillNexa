import { useState, useEffect } from "react";
import {
  FiVideo,
  FiVolume2,
  FiMic,
  FiMicOff,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiAlertCircle,
  FiZap,
  FiClock,
  FiHelpCircle
} from "react-icons/fi";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import AnswerEvaluationCard from "../evaluation/AnswerEvaluationCard";

export const ActiveInterviewRoom = ({
  config,
  questions = [],
  currentIndex = 0,
  onSelectIndex,
  onPrevQuestion,
  onNextQuestion,
  userAnswer = "",
  onChangeAnswer,
  onEvaluateAnswer,
  evaluating = false,
  evaluation = null,
  evalError = null,
  onFinishInterview,
  finishing = false,
  onOpenEndModal,
  timeLeft = 120,
  isRecording = false,
  onToggleRecording,
  onSpeakQuestion,
  sessionAnswers = {}
}) => {
  const currentQuestion = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const isFinalQuestion = currentIndex === totalQuestions - 1;

  // Determine Timer alert state: Normal, Warning (<= 30s), Critical (<= 10s)
  let timerClasses = "border-[var(--snx-border)] text-slate-700 dark:text-slate-300 bg-[var(--snx-surface)]";
  if (timeLeft <= 10) {
    timerClasses = "border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/40 animate-pulse font-bold";
  } else if (timeLeft <= 30) {
    timerClasses = "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40 font-semibold";
  }

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (!currentQuestion) return null;

  return (
    <div className="space-y-6">
      {/* Top Floating Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--snx-border)]">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
                Live Mock Interview Room
              </span>
              <Badge variant="primary" size="sm">
                {config.mode} Stream
              </Badge>
            </div>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
              {config.role} — {config.domain}
            </h1>
          </div>
        </div>

        {/* Timer & End Action */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono shadow-subtle ${timerClasses}`}>
            <FiClock className="h-3.5 w-3.5" />
            <span>{formatTimer(timeLeft)}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            onClick={onOpenEndModal}
          >
            End Interview
          </Button>
        </div>
      </div>

      {/* Main 2-Column Interview Grid */}
      <div className="grid gap-6 lg:grid-cols-[380px_1fr] items-start">
        {/* Left Column: AI Interviewer Video Presence & Soundwave */}
        <aside className="space-y-6">
          <Card className="p-5 border border-[var(--snx-border)] bg-[var(--snx-surface)] space-y-4">
            {/* Visualizer Simulation Card */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 border border-slate-800 shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2.5 py-1 backdrop-blur-md">
                  <FiVideo className="h-3.5 w-3.5 text-indigo-400" /> AI Interactor v3.5
                </span>
                <span className="rounded-full bg-slate-900/80 px-2.5 py-1 backdrop-blur-md font-mono">
                  Round {currentIndex + 1} of {totalQuestions}
                </span>
              </div>

              {/* Animated AI Waveform Visualizer */}
              <div className="flex flex-col items-center justify-center my-3">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
                  <FiVideo className="h-8 w-8" />
                </div>

                {/* Soundwave Bars */}
                <div className="mt-3 flex items-center justify-center gap-1 h-6">
                  {[10, 20, 14, 24, 16, 28, 18, 12, 22].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full bg-gradient-to-t from-indigo-500 to-cyan-400 ${
                        isRecording ? "animate-pulse" : "opacity-40"
                      }`}
                      style={{
                        height: isRecording ? `${h}px` : "6px",
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Stream Controls: Read Out Loud */}
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <button
                  type="button"
                  onClick={onSpeakQuestion}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600/80 px-3 py-1.5 text-white hover:bg-indigo-600 transition cursor-pointer font-medium"
                >
                  <FiVolume2 className="h-3.5 w-3.5" /> Read Out Loud
                </button>
                <span className="text-[10px] text-slate-400">{config.company} Benchmark</span>
              </div>
            </div>

            {/* Speech Microphone Toggle (Voice Mode) */}
            {config.mode === "Voice" && (
              <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/60 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20 text-center space-y-2.5">
                <button
                  type="button"
                  onClick={onToggleRecording}
                  className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md transition-all cursor-pointer ${
                    isRecording
                      ? "bg-rose-500 animate-pulse shadow-rose-500/40"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-500/30 hover:scale-105"
                  }`}
                  title={isRecording ? "Stop voice recording" : "Start speaking response"}
                >
                  {isRecording ? <FiMicOff className="h-6 w-6" /> : <FiMic className="h-6 w-6" />}
                </button>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {isRecording ? "Transcribing live speech..." : "Click microphone to dictate answer"}
                </div>
              </div>
            )}

            {/* Sequence Rounds Navigation */}
            <div className="pt-3 border-t border-[var(--snx-border)] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Interview Rounds ({totalQuestions})
              </span>
              <div className="grid grid-cols-2 gap-2">
                {questions.map((q, idx) => {
                  const isActive = idx === currentIndex;
                  const isEval = !!sessionAnswers[idx]?.evaluation;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectIndex(idx)}
                      className={`p-2.5 rounded-xl border text-left transition-all text-xs cursor-pointer ${
                        isActive
                          ? "border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold ring-2 ring-indigo-500/20 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-800"
                          : isEval
                          ? "border-emerald-500 bg-emerald-50/50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 font-semibold"
                          : "border-[var(--snx-border)] bg-[var(--snx-surface)] text-slate-600 dark:text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Round {idx + 1}</span>
                        {isEval && <span className="text-[10px] text-emerald-500 font-black">✓</span>}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {q.round}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </aside>

        {/* Right Column: Question Statement & Response Workspace */}
        <main className="space-y-6 min-w-0">
          <Card className="p-6 border border-[var(--snx-border)] bg-[var(--snx-surface)] space-y-5">
            {/* Question Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--snx-border)]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                  {currentQuestion.round}
                </h2>
              </div>
              <Badge
                variant={currentQuestion.difficulty === "Easy" ? "success" : currentQuestion.difficulty === "Medium" ? "warning" : "danger"}
                size="sm"
              >
                {currentQuestion.difficulty}
              </Badge>
            </div>

            {/* Question Statement Card */}
            <div className="p-4 rounded-xl border border-[var(--snx-border)] bg-slate-50 dark:bg-slate-800/60 space-y-2">
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQuestion.question}
              </p>
              {currentQuestion.followUpHint && (
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium italic flex items-center gap-1.5 pt-1">
                  <FiHelpCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{currentQuestion.followUpHint}</span>
                </p>
              )}
            </div>

            {/* Solution Input Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Your Response Solution
                </span>
                <span className="text-[11px] text-slate-400">
                  {userAnswer.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <textarea
                value={userAnswer}
                onChange={(e) => onChangeAnswer(e.target.value)}
                placeholder="Structure your answer clearly. Explain your technical approach, trade-offs, and examples..."
                rows={8}
                className="w-full rounded-xl border border-[var(--snx-border)] bg-white dark:bg-slate-900 p-4 text-xs font-mono leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition"
              />
            </div>

            {/* Bottom Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--snx-border)]">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconLeft={FiChevronLeft}
                  disabled={currentIndex === 0}
                  onClick={onPrevQuestion}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconRight={FiChevronRight}
                  disabled={currentIndex >= totalQuestions - 1}
                  onClick={onNextQuestion}
                >
                  Next
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={evaluating || !userAnswer.trim()}
                  onClick={onEvaluateAnswer}
                  className="font-bold text-indigo-700 dark:text-indigo-300"
                >
                  {evaluating ? "Scoring Answer..." : "Evaluate Answer"}
                </Button>

                {isFinalQuestion && (
                  <Button
                    variant="primary"
                    size="sm"
                    iconRight={FiZap}
                    disabled={finishing}
                    onClick={onFinishInterview}
                    className="font-bold shadow-subtle"
                  >
                    {finishing ? "Compiling Report..." : "Finish Interview"}
                  </Button>
                )}
              </div>
            </div>

            {/* Dynamic AI Answer Evaluation Result */}
            {evaluation && (
              <div className="pt-4 border-t border-[var(--snx-border)]">
                <AnswerEvaluationCard
                  evaluation={evaluation}
                  loading={evaluating}
                  error={evalError}
                  onRetry={onEvaluateAnswer}
                />
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ActiveInterviewRoom;
