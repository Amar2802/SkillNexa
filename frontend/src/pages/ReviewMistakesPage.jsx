import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiCalendar, FiCheckCircle, FiFilter, FiRotateCcw, FiCode } from "react-icons/fi";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

export const ReviewMistakesPage = ({ history = [] }) => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const allMistakes = useMemo(
    () => history.flatMap((result) =>
      (result.answers || []).filter((answer) => !answer.isCorrect).map((answer) => ({
        ...answer,
        testTitle: result.test?.title || "Mock Test",
        createdAt: result.createdAt
      }))
    ),
    [history]
  );

  const topics = useMemo(
    () => [...new Set(allMistakes.map((item) => item.question?.topic).filter(Boolean))].sort(),
    [allMistakes]
  );

  const mistakes = useMemo(() => (
    allMistakes.filter((item) => {
      const created = item.createdAt ? new Date(item.createdAt) : null;
      if (topic && item.question?.topic !== topic) return false;
      if (fromDate && created && created < new Date(fromDate)) return false;
      if (toDate && created && created > new Date(`${toDate}T23:59:59`)) return false;
      return true;
    })
  ), [allMistakes, topic, fromDate, toDate]);

  return (
    <PageContainer>
      <PageHeader
        title="Revision Lab & Mistake Review"
        subtitle="Filter incorrect answers from previous test sessions, dissect the reasoning, and turn weak spots into interview strengths."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Mistake Review" }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="md">
              <FiAlertTriangle className="h-3.5 w-3.5 mr-1" />
              <span>{mistakes.length} Item{mistakes.length === 1 ? "" : "s"} to Revise</span>
            </Badge>
            <Badge variant="neutral" size="md">
              <FiCheckCircle className="h-3.5 w-3.5 mr-1" />
              <span>{history.length} Tests</span>
            </Badge>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <Card className="p-4 sm:p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <FiFilter className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Filter Revision Queue
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Narrow mistakes by topic focus or practice timeframe.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Topic
            </label>
            <select
              className="w-full h-10 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] px-3 text-xs font-medium text-slate-900 dark:text-white dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option value="">All Topics</option>
              {topics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              From Date
            </label>
            <div className="relative">
              <FiCalendar className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                className="w-full h-10 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] pl-9 pr-3 text-xs font-medium text-slate-900 dark:text-white dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              To Date
            </label>
            <div className="relative">
              <FiCalendar className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                className="w-full h-10 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] pl-9 pr-3 text-xs font-medium text-slate-900 dark:text-white dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Mistake Items */}
      {mistakes.length ? (
        <div className="space-y-4">
          {mistakes.map((item, index) => (
            <Card
              key={`${item.question?._id || index}-${index}`}
              className="p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="primary" size="sm">
                      {item.testTitle}
                    </Badge>
                    <Badge variant="neutral" size="sm">
                      {item.question?.topic || "General"}
                    </Badge>
                    {item.question?.difficulty && (
                      <Badge variant="warning" size="sm">
                        {item.question.difficulty}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {item.question?.title || "Question"}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.question?.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Submitted vs Correct Comparison */}
              <div className="grid gap-3 sm:grid-cols-2 pt-1">
                <div className="rounded-xl border border-rose-200/80 bg-rose-50/70 p-4 dark:border-rose-900/50 dark:bg-rose-950/20">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
                    Your Submitted Answer
                  </span>
                  <p className="mt-1.5 whitespace-pre-wrap text-xs text-slate-800 dark:text-slate-200 font-mono">
                    {String(item.submittedAnswer || "No answer submitted")}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                    Verified Correct Answer
                  </span>
                  <p className="mt-1.5 whitespace-pre-wrap text-xs text-slate-800 dark:text-slate-200 font-mono">
                    {String(item.question?.correctAnswer || "No answer available")}
                  </p>
                </div>
              </div>

              {/* Explanatory Context Note */}
              <div className="rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-4 dark:border-slate-800/80 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                  Why This Matters & Key Concept
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.question?.explanation || item.feedback || "Revisit the underlying concept and solve similar questions in the Question Bank to solidify your understanding."}
                </p>
              </div>

              <div className="pt-1 flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/questions?topic=${encodeURIComponent(item.question?.topic || "")}`)}
                >
                  More on {item.question?.topic || "this topic"}
                </Button>
                {item.question?.type === "Coding" && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={FiCode}
                    onClick={() => navigate(`/practice/${item.question._id}`)}
                  >
                    Retry in Code IDE
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No mistakes to review"
          description={
            topic || fromDate || toDate
              ? "No incorrect answers match your current filter criteria. Clear filters to see all open revisions."
              : "Great job! As you take timed mock assessments, any questions you miss will appear here automatically."
          }
          action={
            <Button
              variant="primary"
              size="md"
              icon={FiRotateCcw}
              onClick={() => navigate("/mock-tests")}
            >
              Take a Mock Assessment
            </Button>
          }
        />
      )}
    </PageContainer>
  );
};

export default ReviewMistakesPage;
