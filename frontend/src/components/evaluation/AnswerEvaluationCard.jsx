import { useState } from "react";
import { FiChevronDown, FiRefreshCw } from "react-icons/fi";
import SurfaceCard from "../ui/SurfaceCard";

const SCORE_FIELDS = [
  { key: "technicalScore", label: "Technical Accuracy" },
  { key: "communicationScore", label: "Communication" },
  { key: "clarityScore", label: "Clarity" },
  { key: "problemSolvingScore", label: "Problem Solving" },
  { key: "confidenceScore", label: "Confidence" },
  { key: "completenessScore", label: "Completeness" },
  { key: "industryReadinessScore", label: "Industry Readiness" }
];

const ScoreRing = ({ score = 0 }) => {
  const safe = Math.max(0, Math.min(100, Number(score) || 0));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safe / 100) * circumference;

  return (
    <div className="relative mx-auto h-32 w-32">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden>
        <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-custom-200 dark:text-slate-custom-700" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-custom-900 dark:text-white">{safe}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-custom-500">/ 100</span>
      </div>
    </div>
  );
};

const ListSection = ({ title, items = [], tone = "neutral" }) => {
  if (!items.length) return null;
  const toneClass =
    tone === "green"
      ? "border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10"
        : tone === "red"
          ? "border-rose-200 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10"
          : "border-slate-custom-200 bg-slate-custom-50 dark:border-slate-custom-600 dark:bg-slate-custom-800";

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-custom-600 dark:text-slate-custom-300">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-slate-custom-700 dark:text-slate-custom-200">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-brand-500">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const AnswerEvaluationSkeleton = () => (
  <SurfaceCard className="animate-pulse space-y-4">
    <div className="mx-auto h-32 w-32 rounded-full bg-slate-custom-200 dark:bg-slate-custom-700" />
    <div className="space-y-2">
      <div className="h-3 w-full rounded bg-slate-custom-200 dark:bg-slate-custom-700" />
      <div className="h-3 w-5/6 rounded bg-slate-custom-200 dark:bg-slate-custom-700" />
      <div className="h-3 w-2/3 rounded bg-slate-custom-200 dark:bg-slate-custom-700" />
    </div>
  </SurfaceCard>
);

const AnswerEvaluationCard = ({ evaluation, loading, error, onRetry, className = "" }) => {
  const [idealOpen, setIdealOpen] = useState(false);

  if (loading) return <AnswerEvaluationSkeleton />;
  if (!evaluation && !error) return null;

  if (error && !evaluation) {
    return (
      <SurfaceCard className={`space-y-3 ${className}`.trim()}>
        <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
        {onRetry ? (
          <button type="button" className="snx-btn-secondary snx-btn-sm" onClick={onRetry}>
            <FiRefreshCw className="h-4 w-4" />
            Retry evaluation
          </button>
        ) : null}
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className={`space-y-6 snx-fade-in ${className}`.trim()}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="snx-kicker">AI evaluation</span>
          <h3 className="snx-heading-3 mt-1">Recruiter-style feedback</h3>
        </div>
        {onRetry ? (
          <button type="button" className="snx-btn-secondary snx-btn-sm" onClick={onRetry}>
            <FiRefreshCw className="h-4 w-4" />
            Re-evaluate
          </button>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
        <div className="text-center">
          <ScoreRing score={evaluation.score} />
          <p className="mt-2 text-sm font-semibold text-slate-custom-900 dark:text-white">Overall Score</p>
        </div>
        <div className="space-y-3">
          {SCORE_FIELDS.map(({ key, label }) => {
            const value = evaluation[key] ?? 0;
            return (
              <div key={key}>
                <div className="mb-1 flex justify-between text-xs font-medium text-slate-custom-600 dark:text-slate-custom-300">
                  <span>{label}</span>
                  <span>{value}/10</span>
                </div>
                <div className="h-2 rounded-full bg-slate-custom-100 dark:bg-slate-custom-700">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, value * 10)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ListSection title="Strengths" items={evaluation.strengths} tone="green" />
        <ListSection title="Weaknesses" items={evaluation.weaknesses} tone="amber" />
        <ListSection title="Missed concepts" items={evaluation.missedConcepts} tone="red" />
      </div>

      {evaluation.suggestions?.length ? (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-500/30 dark:bg-indigo-500/10">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-200">Improvement suggestions</h4>
          <ul className="mt-3 space-y-2 text-sm text-indigo-900 dark:text-indigo-100">
            {evaluation.suggestions.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {evaluation.recruiterFeedback ? (
        <div className="rounded-xl border border-slate-custom-200 bg-white p-4 dark:border-slate-custom-600 dark:bg-slate-custom-800">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-custom-500">Recruiter feedback</h4>
          <p className="mt-2 text-sm italic text-slate-custom-700 dark:text-slate-custom-200">&ldquo;{evaluation.recruiterFeedback}&rdquo;</p>
        </div>
      ) : null}

      <div className="rounded-xl border border-slate-custom-200 dark:border-slate-custom-600">
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-custom-900 dark:text-white"
          onClick={() => setIdealOpen((open) => !open)}
        >
          Ideal interview answer
          <FiChevronDown className={`h-4 w-4 transition ${idealOpen ? "rotate-180" : ""}`} />
        </button>
        {idealOpen ? (
          <div className="border-t border-slate-custom-200 px-4 py-3 text-sm leading-relaxed text-slate-custom-600 dark:border-slate-custom-600 dark:text-slate-custom-300">
            {evaluation.idealAnswer}
          </div>
        ) : null}
      </div>

      {evaluation.followUpQuestions?.length ? (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-custom-500">Follow-up questions</h4>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-custom-700 dark:text-slate-custom-200">
            {evaluation.followUpQuestions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      ) : null}
    </SurfaceCard>
  );
};

export default AnswerEvaluationCard;
