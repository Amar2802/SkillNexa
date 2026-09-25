import { Link } from "react-router-dom";
import { FiCheckCircle, FiAlertTriangle, FiArrowRight, FiShield } from "react-icons/fi";
import Card from "../ui/Card";
import Progress from "../ui/Progress";
import Button from "../ui/Button";

export const InterviewReadinessCard = ({
  score = 65,
  strongTopics = ["Data Structures", "Algorithms"],
  weakTopics = [],
  testsCount = 0
}) => {
  const readinessScore = Math.max(10, Math.min(100, Math.round(score)));

  let statusTone = "primary";
  let statusText = "Developing";
  if (readinessScore >= 80) {
    statusTone = "success";
    statusText = "Interview Ready";
  } else if (readinessScore >= 60) {
    statusTone = "primary";
    statusText = "Solid Progress";
  } else {
    statusTone = "warning";
    statusText = "Needs Practice";
  }

  const primaryWeakTopic = weakTopics[0] || (strongTopics[1] ? `Advanced ${strongTopics[0]}` : "System Design");

  return (
    <Card className="p-5 flex flex-col justify-between space-y-4 border-indigo-500/20 bg-gradient-to-b from-[var(--snx-surface-card)] to-indigo-50/20 dark:to-indigo-950/10">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <FiShield className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Interview Readiness
            </span>
          </div>
          <span className="rounded-full border border-indigo-200 bg-white px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-300">
            {statusText}
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {readinessScore}%
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {testsCount > 0 ? `Grounded in ${testsCount} test sessions` : "Baseline assessment"}
          </span>
        </div>

        <div className="mt-2">
          <Progress value={readinessScore} max={100} size="md" variant={statusTone} />
        </div>

        {/* Diagnosis Note */}
        <div className="mt-4 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface)] p-3 text-xs space-y-1.5 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
            <FiCheckCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Strong in: {strongTopics.slice(0, 2).join(", ") || "General Foundations"}</span>
          </div>
          {weakTopics.length > 0 ? (
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-medium">
              <FiAlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>Needs focus: {weakTopics.slice(0, 2).join(", ")}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <FiCheckCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Continue weekly mock tests to detect edge cases</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-1">
        <Link to={`/questions?topic=${encodeURIComponent(primaryWeakTopic)}`}>
          <Button variant="secondary" size="sm" className="w-full" iconRight={FiArrowRight}>
            Practice Focus: {primaryWeakTopic}
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default InterviewReadinessCard;
