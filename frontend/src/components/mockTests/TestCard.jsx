import { FiClock, FiHelpCircle, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export const TestCard = ({
  test,
  onStart,
  loading = false,
  isRecommended = false
}) => {
  const questionsCount = test.sections
    ? test.sections.flatMap((s) => s.questions).length
    : test.questionsCount || 30;

  const durationMinutes = test.duration || 30;
  const categories = test.sections
    ? [...new Set(test.sections.map((s) => s.category).filter(Boolean))]
    : ["DSA", "Core CS", "Aptitude"];

  return (
    <Card
      className={`p-5 flex flex-col justify-between transition-all duration-150 ${
        isRecommended
          ? "border-indigo-500/40 bg-gradient-to-b from-[var(--snx-surface-card)] to-indigo-50/25 dark:to-indigo-950/15 shadow-card-hover"
          : "hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          {isRecommended ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              Recommended for You
            </span>
          ) : (
            <Badge variant="neutral" size="sm">
              Full Round
            </Badge>
          )}

          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-mono">
            <FiClock className="h-3.5 w-3.5" />
            <span>{durationMinutes} mins</span>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
            {test.title || "Software Interview Mock Test"}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            {test.description || "Comprehensive timed evaluation across algorithms, core CS, and aptitude."}
          </p>
        </div>

        {/* Categories / Topics */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <span
              key={cat}
              className="text-[11px] px-2 py-0.5 rounded bg-[var(--snx-surface-subtle)] border border-[var(--snx-border)] text-slate-600 dark:border-slate-800 dark:text-slate-300"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-[var(--snx-border-subtle)] dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600 dark:text-slate-400">
          {questionsCount} Questions
        </span>

        <Button
          variant={isRecommended ? "primary" : "secondary"}
          size="sm"
          onClick={() => onStart(test)}
          loading={loading}
          iconRight={FiArrowRight}
        >
          Take Test
        </Button>
      </div>
    </Card>
  );
};

export default TestCard;
