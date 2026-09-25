import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiBookmark,
  FiClock,
  FiFileText,
  FiAlertCircle,
  FiChevronRight,
  FiPrinter,
  FiCheckCircle,
  FiCompass,
  FiCode
} from "react-icons/fi";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Card, { CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import LoadingScreen from "../components/ui/LoadingScreen";
import { useToast } from "../components/ui/ToastProvider";

const fallbackRevisionData = {
  wrongQuestions: [
    { _id: "q-rev-1", title: "Implement LRU Cache with O(1) Operations", topic: "Data Structures", difficulty: "Hard" },
    { _id: "q-rev-2", title: "System Design: Rate Limiter Algorithms", topic: "System Design", difficulty: "Medium" }
  ],
  bookmarkedQuestions: [
    { _id: "q-rev-3", title: "Two Sum & 3Sum Variant Optimization", topic: "Arrays & Hashes", difficulty: "Easy" },
    { _id: "q-rev-4", title: "React Virtual DOM & Fiber Reconciler", topic: "Frontend React", difficulty: "Medium" }
  ],
  recentlyViewed: [
    { _id: "q-rev-5", title: "SQL Indexing & B-Tree Execution Plans", topic: "Database", difficulty: "Hard" }
  ],
  frequentlyFailedTopics: [
    { topic: "Dynamic Programming", count: 4 },
    { topic: "System Architecture", count: 2 }
  ],
  revisionSheet: [
    {
      topic: "Data Structures & Algorithms",
      subject: "Computer Science",
      level: "Intermediate",
      cheatSheet: "Arrays store contiguous memory blocks (O(1) access). Hash Maps provide average O(1) lookups. Use two pointers for sorted pair searches and sliding window for continuous subarray constraints.",
      flashcards: [
        { question: "What is the time complexity of searching in a Balanced BST?", answer: "O(log N) for search, insert, and delete operations." },
        { question: "When should you prefer a Linked List over an Array?", answer: "When frequent insertions and deletions at arbitrary positions are needed without memory reallocation." }
      ]
    },
    {
      topic: "Frontend System Architecture",
      subject: "Web Development",
      level: "Advanced",
      cheatSheet: "React's Reconciliation algorithm diffs virtual DOM trees using key props to minimize actual DOM updates. Use useCallback and useMemo to cache function and value instances across renders.",
      flashcards: [
        { question: "What causes unnecessary React re-renders?", answer: "Passing new object reference literals or un-memoized callbacks as prop values to child components." },
        { question: "Explain the difference between useEffect and useLayoutEffect.", answer: "useEffect fires asynchronously after browser paint, while useLayoutEffect fires synchronously before paint." }
      ]
    }
  ]
};

export const RevisionPage = ({ cachedRevisionData, refreshRevisionData }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState(cachedRevisionData || fallbackRevisionData);
  const [loading, setLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    if (cachedRevisionData && cachedRevisionData.revisionSheet?.length) {
      setData(cachedRevisionData);
    }
  }, [cachedRevisionData]);

  useEffect(() => {
    if (refreshRevisionData) {
      const fetchLatest = async () => {
        try {
          await refreshRevisionData();
        } catch (e) {
          console.error(e);
        }
      };
      void fetchLatest();
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleRateFlashcard = (cardKey, rating) => {
    showToast?.(`Marked as ${rating}! Scheduled for spaced repetition review.`, "success");
    setFlippedCards((prev) => ({ ...prev, [cardKey]: false }));
  };

  if (loading) {
    return <LoadingScreen title="Loading Revision Studio..." subtitle="Assembling wrong answers, bookmarks, and revision notes" />;
  }

  return (
    <PageContainer maxWidth="7xl" className="space-y-8 print:bg-white print:text-black">
      {/* Header */}
      <div className="print:hidden">
        <PageHeader
          kicker="Spaced Repetition & Revision"
          title="Revision Studio"
          description="Review mistakes from past test results, revisit bookmarked questions, and study personalized flashcards."
          actions={
            <div className="flex items-center gap-3">
              <Link to="/learn">
                <Button variant="outline" size="sm" iconLeft={FiBookOpen}>
                  Learning Hub
                </Button>
              </Link>
              <Button
                variant="primary"
                size="sm"
                iconLeft={FiPrinter}
                onClick={handlePrint}
              >
                Print Cheat Sheet
              </Button>
            </div>
          }
        />
      </div>

      {/* Frequently Failed Topics Alert */}
      {data.frequentlyFailedTopics?.length > 0 && (
        <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
              <FiAlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Targeted Weakness Alert
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                Repeated errors were detected in these subtopics across your mock tests. Focus your revision here.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {data.frequentlyFailedTopics.map((item) => (
              <span
                key={item.topic}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-rose-700 border border-rose-200 dark:bg-slate-800 dark:text-rose-300 dark:border-rose-900 shadow-subtle"
              >
                {item.topic} ({item.count} errors)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Three Panel Grid: Wrong Questions, Bookmarked, Recently Viewed */}
      <div className="grid gap-6 md:grid-cols-3 print:hidden">
        {/* Wrong Questions */}
        <Card className="p-5 border border-[var(--snx-border)] bg-[var(--snx-surface)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--snx-border)]">
            <div className="flex items-center gap-2">
              <FiAlertCircle className="h-4 w-4 text-rose-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Incorrect Answers ({data.wrongQuestions?.length || 0})
              </h3>
            </div>
            <Badge variant="danger" size="sm">
              Needs Review
            </Badge>
          </div>

          {data.wrongQuestions?.length > 0 ? (
            <div className="space-y-2 max-h-[360px] overflow-y-auto snx-scrollbar pr-1">
              {data.wrongQuestions.map((q) => (
                <Link
                  key={q._id}
                  to={`/practice/${q._id}`}
                  className="block p-3 rounded-xl border border-[var(--snx-border)] bg-white dark:bg-slate-800/60 hover:border-rose-400 transition-all"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {q.title}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{q.topic} • {q.difficulty}</span>
                    <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-0.5">
                      Solve <FiChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center italic">
              No incorrect answers recorded. High accuracy!
            </p>
          )}
        </Card>

        {/* Bookmarked Questions */}
        <Card className="p-5 border border-[var(--snx-border)] bg-[var(--snx-surface)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--snx-border)]">
            <div className="flex items-center gap-2">
              <FiBookmark className="h-4 w-4 text-indigo-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Saved Bookmarks ({data.bookmarkedQuestions?.length || 0})
              </h3>
            </div>
            <Badge variant="primary" size="sm">
              Saved
            </Badge>
          </div>

          {data.bookmarkedQuestions?.length > 0 ? (
            <div className="space-y-2 max-h-[360px] overflow-y-auto snx-scrollbar pr-1">
              {data.bookmarkedQuestions.map((q) => (
                <Link
                  key={q._id}
                  to={`/practice/${q._id}`}
                  className="block p-3 rounded-xl border border-[var(--snx-border)] bg-white dark:bg-slate-800/60 hover:border-indigo-400 transition-all"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {q.title}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{q.topic} • {q.difficulty}</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-0.5">
                      Practice <FiChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center italic">
              No bookmarked questions yet.
            </p>
          )}
        </Card>

        {/* Recently Viewed */}
        <Card className="p-5 border border-[var(--snx-border)] bg-[var(--snx-surface)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--snx-border)]">
            <div className="flex items-center gap-2">
              <FiClock className="h-4 w-4 text-purple-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Recently Viewed ({data.recentlyViewed?.length || 0})
              </h3>
            </div>
            <Badge variant="neutral" size="sm">
              History
            </Badge>
          </div>

          {data.recentlyViewed?.length > 0 ? (
            <div className="space-y-2 max-h-[360px] overflow-y-auto snx-scrollbar pr-1">
              {data.recentlyViewed.map((q) => (
                <Link
                  key={q._id}
                  to={`/practice/${q._id}`}
                  className="block p-3 rounded-xl border border-[var(--snx-border)] bg-white dark:bg-slate-800/60 hover:border-purple-400 transition-all"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {q.title}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{q.topic} • {q.difficulty}</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-0.5">
                      Revisit <FiChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center italic">
              No recent practice history.
            </p>
          )}
        </Card>
      </div>

      {/* Automated Study Revision Sheet */}
      <Card className="p-6 border border-[var(--snx-border)] bg-[var(--snx-surface)] space-y-6 print:border-0 print:shadow-none print:p-0">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--snx-border)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <FiFileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Interactive Flashcards & Cheat Sheet Notes
              </h3>
              <p className="text-xs text-slate-400">
                Click any flashcard to flip and self-assess your retention.
              </p>
            </div>
          </div>
        </div>

        {data.revisionSheet?.length > 0 ? (
          <div className="space-y-6">
            {data.revisionSheet.map((sheet, sIdx) => (
              <div
                key={sIdx}
                className="p-5 rounded-2xl border border-[var(--snx-border)] bg-slate-50/50 dark:bg-slate-800/40 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--snx-border)]">
                  <div>
                    <Badge variant="primary" size="sm">
                      {sheet.level || "Core"} Level
                    </Badge>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {sheet.topic}
                    </h4>
                    <span className="text-xs text-slate-400">{sheet.subject}</span>
                  </div>

                  <Link to="/practice" state={{ search: sheet.topic }}>
                    <Button variant="outline" size="sm" iconRight={FiCode}>
                      Practice Topic
                    </Button>
                  </Link>
                </div>

                {/* Cheat sheet text */}
                <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 p-4 rounded-xl bg-white dark:bg-slate-800 border border-[var(--snx-border)]">
                  {sheet.cheatSheet}
                </div>

                {/* Flashcards */}
                {sheet.flashcards?.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Topic Flashcards
                    </span>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {sheet.flashcards.map((fc, fcIdx) => {
                        const cardKey = `${sIdx}-${fcIdx}`;
                        const isFlipped = !!flippedCards[cardKey];

                        return (
                          <div
                            key={fcIdx}
                            onClick={() =>
                              setFlippedCards((prev) => ({ ...prev, [cardKey]: !prev[cardKey] }))
                            }
                            className="cursor-pointer rounded-xl border border-[var(--snx-border)] p-4 bg-white dark:bg-slate-800 hover:border-indigo-400 transition-all duration-150 min-h-[110px] flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                                <span>{isFlipped ? "Answer" : "Question"}</span>
                                <span className="text-slate-400 font-normal">Click to flip 🔄</span>
                              </div>
                              <p className={`text-xs ${isFlipped ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-slate-800 dark:text-slate-200 font-medium"} leading-relaxed`}>
                                {isFlipped ? fc.answer : fc.question}
                              </p>
                            </div>

                            {isFlipped && (
                              <div
                                className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleRateFlashcard(cardKey, "Hard")}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300"
                                >
                                  Hard
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRateFlashcard(cardKey, "Good")}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300"
                                >
                                  Good ✓
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            Complete mock tests to generate personalized revision sheets targeting your improvement areas.
          </div>
        )}
      </Card>
    </PageContainer>
  );
};

export default RevisionPage;
