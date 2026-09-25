import { Link, useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiPrinter,
  FiRotateCcw,
  FiCode,
  FiBookOpen,
  FiCpu,
  FiAward,
  FiArrowRight
} from "react-icons/fi";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Progress from "../ui/Progress";

export const InterviewResultsView = ({
  sessionReport,
  onStartNewInterview
}) => {
  const navigate = useNavigate();

  if (!sessionReport) return null;

  const overallScore = sessionReport.overallScore || 0;
  const questionsList = sessionReport.questions || [];

  const handlePrint = () => {
    window.print();
  };

  const handleAskMentor = (questionText, userAns, feedbackText) => {
    navigate("/ai-mentor", {
      state: {
        mode: "interview",
        context: {
          type: "interview",
          title: `Interview Follow-up: ${sessionReport.role}`,
          topic: sessionReport.domain || "General",
          cheatSheet: `Question: ${questionText}\nCandidate Answer: ${userAns}\nFeedback: ${feedbackText}`
        }
      }
    });
  };

  return (
    <div className="space-y-8 print:bg-white print:text-black">
      {/* Top Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--snx-border)] print:hidden">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Consolidated Evaluation
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            Interview Loop Report: {sessionReport.role}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Standard: {sessionReport.company || "General"} • {sessionReport.difficulty || "Medium"} • {sessionReport.mode || "Text"} Mode
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            iconLeft={FiPrinter}
            onClick={handlePrint}
          >
            Print Report
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconLeft={FiRotateCcw}
            onClick={onStartNewInterview}
            className="shadow-subtle"
          >
            Start New Interview
          </Button>
        </div>
      </div>

      {/* Hero Performance Score Banner */}
      <Card className="p-6 border border-[var(--snx-border)] bg-[var(--snx-surface)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Overall Candidate Score
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400">
                {overallScore}%
              </span>
              <Badge
                variant={overallScore >= 75 ? "success" : overallScore >= 50 ? "warning" : "danger"}
                size="md"
              >
                {overallScore >= 75 ? "Interview Ready" : overallScore >= 50 ? "Approaching Ready" : "Needs Revision"}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              Score derived from clarity, technical accuracy, trade-off explanations, and question-specific depth.
            </p>
          </div>

          {/* Key Evaluation Dimensions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
            <div className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-slate-50/60 dark:bg-slate-800/40 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Technical Depth</span>
              <div className="text-xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {sessionReport.technicalScore > 10 ? sessionReport.technicalScore : `${sessionReport.technicalScore}/10`}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-slate-50/60 dark:bg-slate-800/40 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Communication</span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {sessionReport.communicationScore > 10 ? sessionReport.communicationScore : `${sessionReport.communicationScore}/10`}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-slate-50/60 dark:bg-slate-800/40 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Confidence</span>
              <div className="text-xl font-black text-amber-500 mt-1">
                {sessionReport.confidenceScore > 10 ? sessionReport.confidenceScore : `${sessionReport.confidenceScore}/10`}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2-Column: Demonstrated Strengths & Core Weaknesses */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Strengths */}
        <Card className="p-5 border border-[var(--snx-border)] bg-[var(--snx-surface)] space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--snx-border)]">
            <FiCheckCircle className="h-4 w-4 text-emerald-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Demonstrated Strengths
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {sessionReport.strengths && sessionReport.strengths.length > 0 ? (
              sessionReport.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>{s}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">No specific strengths recorded.</li>
            )}
          </ul>
        </Card>

        {/* Weaknesses */}
        <Card className="p-5 border border-[var(--snx-border)] bg-[var(--snx-surface)] space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[var(--snx-border)]">
            <FiAlertCircle className="h-4 w-4 text-rose-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Areas to Improve
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {sessionReport.weaknesses && sessionReport.weaknesses.length > 0 ? (
              sessionReport.weaknesses.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold shrink-0">•</span>
                  <span>{w}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">No major weaknesses identified.</li>
            )}
          </ul>
        </Card>
      </div>

      {/* Evaluated Response Transcript */}
      <Card className="p-6 border border-[var(--snx-border)] bg-[var(--snx-surface)] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--snx-border)]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Question-by-Question Evaluation Transcript
          </h3>
          <span className="text-xs text-slate-400">
            {questionsList.length} Questions Evaluated
          </span>
        </div>

        <div className="space-y-6 divide-y divide-[var(--snx-border)]">
          {questionsList.map((q, idx) => (
            <div key={idx} className="pt-6 first:pt-0 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    Round {idx + 1}
                  </span>
                  <Badge variant="neutral" size="sm">
                    {q.round}
                  </Badge>
                </div>
                <Badge
                  variant={q.score >= 70 ? "success" : q.score >= 50 ? "warning" : "danger"}
                  size="sm"
                >
                  Score: {q.score}%
                </Badge>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                "{q.question}"
              </h4>

              <div className="p-4 rounded-xl border border-[var(--snx-border)] bg-slate-50/50 dark:bg-slate-800/40 text-xs leading-relaxed font-mono text-slate-800 dark:text-slate-200">
                <span className="text-slate-400 block mb-1 font-sans font-bold text-[10px] uppercase">Your Submitted Response:</span>
                <p className="whitespace-pre-wrap">{q.userAnswer || "No answer submitted."}</p>
              </div>

              {q.feedback && (
                <div className="p-3.5 rounded-xl border border-indigo-200/60 bg-indigo-50/40 dark:border-indigo-900/40 dark:bg-indigo-950/20 text-xs text-slate-700 dark:text-slate-300">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold block mb-1">Recruiter Evaluation:</span>
                  <p>{q.feedback}</p>
                </div>
              )}

              {/* Action: Ask AI Mentor for follow-up */}
              <div className="flex justify-end pt-1 print:hidden">
                <button
                  type="button"
                  onClick={() => handleAskMentor(q.question, q.userAnswer, q.feedback)}
                  className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                >
                  <FiCpu className="h-3.5 w-3.5" />
                  <span>Ask AI Mentor to clarify this feedback</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommended Next Steps */}
      <section className="space-y-4 pt-4 border-t border-[var(--snx-border)] print:hidden">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Recommended Next Steps
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card hover className="p-5 border border-[var(--snx-border)] bg-[var(--snx-surface)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <FiCode className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
              Practice Coding Weak Spots
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Solve matching technical interview questions in our Monaco Coding IDE.
            </p>
            <Link to="/practice" className="mt-4 inline-block">
              <Button variant="ghost" size="sm" iconRight={FiArrowRight} className="p-0 text-indigo-600 dark:text-indigo-400">
                Open Coding IDE
              </Button>
            </Link>
          </Card>

          <Card hover className="p-5 border border-[var(--snx-border)] bg-[var(--snx-surface)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <FiBookOpen className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
              Review Learning Tracks
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Study curated cheat sheets and revision flashcards in our Learning Hub.
            </p>
            <Link to="/learn" className="mt-4 inline-block">
              <Button variant="ghost" size="sm" iconRight={FiArrowRight} className="p-0 text-indigo-600 dark:text-indigo-400">
                Go to Learning Hub
              </Button>
            </Link>
          </Card>

          <Card hover className="p-5 border border-[var(--snx-border)] bg-[var(--snx-surface)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <FiCpu className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
              Consult AI Developer Mentor
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Get personalized coaching, code review, and Progressive DSA hints.
            </p>
            <Link to="/ai-mentor" className="mt-4 inline-block">
              <Button variant="ghost" size="sm" iconRight={FiArrowRight} className="p-0 text-indigo-600 dark:text-indigo-400">
                Open AI Mentor
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default InterviewResultsView;
