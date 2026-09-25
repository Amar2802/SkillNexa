import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiXCircle, FiClock, FiTarget, FiArrowRight, FiRotateCcw, FiFilter } from "react-icons/fi";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import AnswerEvaluationCard from "../evaluation/AnswerEvaluationCard";

const formatSpentTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export const TestResultsView = ({
  result,
  evaluationByQuestionId = {},
  evaluationLoadingByQuestionId = {},
  onRetakeTest
}) => {
  const [reviewFilter, setReviewFilter] = useState("all"); // 'all' | 'incorrect' | 'correct'

  if (!result) return null;

  const totalQuestions = result.answers?.length || 0;
  const correctCount = result.score || result.answers?.filter((a) => a.isCorrect).length || 0;
  const incorrectCount = Math.max(0, totalQuestions - correctCount);
  const accuracy = result.accuracy ?? (totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0);
  const weakTopics = result.weakTopics || [];
  const strengths = result.strengths || [];

  const filteredAnswers = useMemo(() => {
    if (!result.answers) return [];
    if (reviewFilter === "incorrect") return result.answers.filter((a) => !a.isCorrect);
    if (reviewFilter === "correct") return result.answers.filter((a) => a.isCorrect);
    return result.answers;
  }, [result.answers, reviewFilter]);

  return (
    <div className="space-y-6">
      {/* 1. Results Score Hero */}
      <Card className="p-6 bg-gradient-to-b from-[var(--snx-surface-card)] to-indigo-50/20 dark:to-indigo-950/10 border-indigo-500/30">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Assessment Completed
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {result.test?.title || "Software Interview Mock Test"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {result.autoSubmitted ? "Test auto-submitted when session timer ended." : "Submitted and evaluated."}
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase text-slate-400 block">Score</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                {correctCount} / {totalQuestions}
              </span>
            </div>

            <div className="h-10 w-px bg-[var(--snx-border)] dark:bg-slate-800" />

            <div className="text-center">
              <span className="text-xs font-semibold uppercase text-slate-400 block">Accuracy</span>
              <span
                className={`text-2xl sm:text-3xl font-extrabold mt-0.5 block ${
                  accuracy >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400"
                }`}
              >
                {accuracy}%
              </span>
            </div>

            <div className="h-10 w-px bg-[var(--snx-border)] dark:bg-slate-800" />

            <div className="text-center">
              <span className="text-xs font-semibold uppercase text-slate-400 block">Time</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5 block">
                {formatSpentTime(result.totalTimeSpent || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Topic Strengths and Weaknesses */}
        <div className="mt-6 pt-5 border-t border-[var(--snx-border-subtle)] dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
              <FiCheckCircle className="h-3.5 w-3.5" />
              <span>Strong Areas</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {strengths.length > 0 ? (
                strengths.map((topic) => (
                  <span
                    key={topic}
                    className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
                  >
                    {topic}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Keep practicing to identify key strengths</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
              <FiTarget className="h-3.5 w-3.5" />
              <span>Needs More Practice</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {weakTopics.length > 0 ? (
                weakTopics.map((topic) => (
                  <Link
                    key={topic}
                    to={`/questions?topic=${encodeURIComponent(topic)}`}
                    className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 hover:border-amber-400 transition dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300"
                  >
                    Practice {topic} →
                  </Link>
                ))
              ) : (
                <span className="text-xs text-slate-400">No major weaknesses flagged</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 pt-4 border-t border-[var(--snx-border-subtle)] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {weakTopics[0] && (
              <Link to={`/questions?topic=${encodeURIComponent(weakTopics[0])}`}>
                <Button variant="primary" size="sm" iconRight={FiArrowRight}>
                  Target {weakTopics[0]} in Explorer
                </Button>
              </Link>
            )}
          </div>

          {onRetakeTest && (
            <Button variant="secondary" size="sm" onClick={onRetakeTest} icon={FiRotateCcw}>
              Take Another Mock Round
            </Button>
          )}
        </div>
      </Card>

      {/* 3. Detailed Question Review Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Question Review ({filteredAnswers.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspect your submitted responses, correct answers, and AI evaluations
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-0.5 text-xs dark:border-slate-800">
            <button
              type="button"
              onClick={() => setReviewFilter("all")}
              className={`px-3 py-1 rounded-md font-medium transition ${
                reviewFilter === "all"
                  ? "bg-[var(--snx-surface)] text-slate-900 shadow-subtle dark:text-white font-semibold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All ({totalQuestions})
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter("incorrect")}
              className={`px-3 py-1 rounded-md font-medium transition ${
                reviewFilter === "incorrect"
                  ? "bg-[var(--snx-surface)] text-rose-600 shadow-subtle dark:text-rose-400 font-semibold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Incorrect ({incorrectCount})
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter("correct")}
              className={`px-3 py-1 rounded-md font-medium transition ${
                reviewFilter === "correct"
                  ? "bg-[var(--snx-surface)] text-emerald-600 shadow-subtle dark:text-emerald-400 font-semibold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Correct ({correctCount})
            </button>
          </div>
        </div>

        {/* Question Cards */}
        <div className="space-y-4">
          {filteredAnswers.map((entry, index) => {
            const question = entry?.question;
            if (!question || typeof question !== "object") return null;
            const isCorrect = entry.isCorrect;

            return (
              <Card key={question._id || index} className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        Q{index + 1}
                      </span>
                      {question.difficulty && (
                        <Badge difficulty={question.difficulty} size="sm" />
                      )}
                      {question.topic && (
                        <span className="text-xs font-mono text-slate-500">
                          {question.topic}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {question.title.replace(/\s+Practice Variant\s+\d+$/i, "")}
                    </h4>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      isCorrect
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
                        : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300"
                    }`}
                  >
                    {isCorrect ? <FiCheckCircle className="h-3.5 w-3.5" /> : <FiXCircle className="h-3.5 w-3.5" />}
                    <span>{isCorrect ? "Correct" : "Incorrect"}</span>
                  </span>
                </div>

                {/* Submitted vs Correct Answer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Your Answer
                    </span>
                    <p className="font-mono text-slate-800 dark:text-slate-200 whitespace-pre-line">
                      {String(entry.submittedAnswer || "No answer submitted")}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1">
                      Correct Answer
                    </span>
                    <p className="font-mono text-emerald-900 dark:text-emerald-200 font-semibold whitespace-pre-line">
                      {String(question.correctAnswer || "Refer to explanation")}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                {question.explanation && (
                  <div className="p-3 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface)] text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white font-semibold block mb-1">
                      Explanation:
                    </strong>
                    <p>{question.explanation}</p>
                  </div>
                )}

                {/* AI Evaluation Panel */}
                <AnswerEvaluationCard
                  evaluation={evaluationByQuestionId[question._id]}
                  loading={evaluationLoadingByQuestionId[question._id]}
                />
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestResultsView;
