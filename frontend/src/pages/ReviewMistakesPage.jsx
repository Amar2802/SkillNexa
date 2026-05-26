import { useMemo, useState } from "react";
import { FiAlertTriangle, FiCalendar, FiCheckCircle, FiFilter } from "react-icons/fi";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import SurfaceCard from "../components/ui/SurfaceCard";

const ReviewMistakesPage = ({ history = [] }) => {
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
    <div className="space-y-8">
      <PageHeader
        kicker="Revision Lab"
        title="Review every miss until it becomes a strength."
        description="Filter your incorrect answers, revisit the exact prompt, and understand where your reasoning broke down before your next mock round."
        actions={(
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            <span className="snx-badge">
              <FiAlertTriangle className="h-4 w-4" />
              {mistakes.length} open revisions
            </span>
            <span className="snx-badge">
              <FiCheckCircle className="h-4 w-4" />
              {history.length} tests reviewed
            </span>
          </div>
        )}
      />

      <SurfaceCard className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600">
            <FiFilter className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Filter your revision queue</h2>
            <p className="text-sm text-slate-500">Narrow mistakes by topic or practice window.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Topic</span>
            <select className="snx-select" value={topic} onChange={(event) => setTopic(event.target.value)}>
              <option value="">All topics</option>
              {topics.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">From date</span>
            <div className="relative">
              <FiCalendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="date" className="snx-input pl-11" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">To date</span>
            <div className="relative">
              <FiCalendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="date" className="snx-input pl-11" value={toDate} onChange={(event) => setToDate(event.target.value)} />
            </div>
          </label>
        </div>
      </SurfaceCard>

      {mistakes.length ? (
        <div className="space-y-5">
          {mistakes.map((item, index) => (
            <SurfaceCard key={`${item.question?._id || index}-${index}`} className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="snx-kicker">{item.testTitle}</p>
                  <h2 className="text-2xl font-semibold text-slate-950">
                    {item.question?.title || "Question"}
                  </h2>
                  <p className="max-w-3xl text-sm leading-7 text-slate-600">
                    {item.question?.description || "No description provided."}
                  </p>
                </div>
                <span className="snx-badge">
                  <FiAlertTriangle className="h-4 w-4" />
                  {item.question?.topic || "General"}
                </span>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-[1.5rem] border border-rose-200/70 bg-rose-50/90 p-5 shadow-sm shadow-rose-100/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">Your answer</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {String(item.submittedAnswer || "No answer submitted")}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-emerald-200/70 bg-emerald-50/90 p-5 shadow-sm shadow-emerald-100/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">Correct answer</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {String(item.question?.correctAnswer || "No answer available")}
                  </p>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-5 shadow-sm shadow-slate-200/60">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Why this matters</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  Right answer: {String(item.question?.correctAnswer || "")}. {item.question?.explanation || item.feedback || "Revisit the concept and retry the question from scratch."}
                </p>
              </div>
            </SurfaceCard>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No mistakes to review yet"
          description="Take a mock test or solve a few practice questions. Your incorrect answers will show up here with the right explanation."
          icon={FiCheckCircle}
        />
      )}
    </div>
  );
};

export default ReviewMistakesPage;
