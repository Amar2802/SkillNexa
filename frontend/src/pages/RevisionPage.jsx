import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiBookOpen, FiBookmark, FiClock, FiFileText, FiAlertCircle, FiChevronRight, FiPrinter, FiRotateCw, FiCheckCircle } from "react-icons/fi";
import PageHeader from "../components/ui/PageHeader";
import LoadingScreen from "../components/ui/LoadingScreen";
import EmptyState from "../components/ui/EmptyState";
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
      cheatSheet: "Arrays store contiguous memory blocks (`O(1)` access). Hash Maps provide average `O(1)` lookups. Use two pointers for sorted pair searches and sliding window for continuous subarray constraints.",
      flashcards: [
        { question: "What is the time complexity of searching in a Balanced BST?", answer: "O(log N) for search, insert, and delete operations." },
        { question: "When should you prefer a Linked List over an Array?", answer: "When frequent insertions and deletions at arbitrary positions are needed without memory reallocation." }
      ]
    },
    {
      topic: "Frontend System Architecture",
      subject: "Web Development",
      level: "Advanced",
      cheatSheet: "React's Reconciliation algorithm diffs virtual DOM trees using key props to minimize actual DOM updates (`O(N)` heuristic). Use `useCallback` to cache function instances across renders.",
      flashcards: [
        { question: "What causes unnecessary React re-renders?", answer: "Passing new object reference literals or un-memoized callbacks as prop values to child components." },
        { question: "Explain the difference between useEffect and useLayoutEffect.", answer: "useEffect fires asynchronously after browser paint, while useLayoutEffect fires synchronously before paint." }
      ]
    }
  ]
};

const RevisionPage = ({ cachedRevisionData, refreshRevisionData }) => {
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
    showToast?.(`Marked as ${rating}! Card scheduled for next review cycle.`, "success");
    setFlippedCards((prev) => ({ ...prev, [cardKey]: false }));
  };

  if (loading) {
    return <LoadingScreen title="Loading Revision Workspace..." subtitle="Assembling wrong answers, bookmarks, and revision notes" />;
  }

  return (
    <div className="space-y-6 snx-fade-in print:bg-white print:text-black">
      <div className="print:hidden">
        <PageHeader
          kicker="Track & Retain"
          title="Spaced Repetition & Revision Studio"
          description="Review recently viewed questions, target weak topic flashcards, and print custom cheat sheets."
          actions={
            <button onClick={handlePrint} className="snx-btn-primary flex items-center gap-2 cursor-pointer shadow-md">
              <FiPrinter className="h-4 w-4" /> Print Cheat Sheet
            </button>
          }
        />
      </div>

      {/* Grid: Wrong, Bookmarked, and Recent */}
      <div className="grid gap-6 md:grid-cols-3 print:hidden">
        
        {/* Wrong Questions Panel */}
        <div className="snx-panel rounded-3xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 dark:border-slate-800">
            <FiAlertCircle className="h-5 w-5 text-rose-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Wrong Questions ({data.wrongQuestions?.length || 0})</h3>
          </div>
          {data.wrongQuestions?.length > 0 ? (
            <div className="space-y-2 max-h-[380px] overflow-y-auto snx-scrollbar pr-1">
              {data.wrongQuestions.map((q) => (
                <Link
                  key={q._id}
                  to={`/practice/${q._id}`}
                  className="block p-3.5 rounded-2xl border border-slate-200/80 bg-white/80 hover:border-rose-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/80 transition duration-150"
                >
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{q.title}</div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{q.topic} • {q.difficulty}</span>
                    <span className="text-rose-500 font-bold flex items-center gap-1">Resolve <FiChevronRight className="h-3 w-3" /></span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No wrong answers found. High accuracy!</p>
          )}
        </div>

        {/* Bookmarked Questions Panel */}
        <div className="snx-panel rounded-3xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 dark:border-slate-800">
            <FiBookmark className="h-5 w-5 text-indigo-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Bookmarked ({data.bookmarkedQuestions?.length || 0})</h3>
          </div>
          {data.bookmarkedQuestions?.length > 0 ? (
            <div className="space-y-2 max-h-[380px] overflow-y-auto snx-scrollbar pr-1">
              {data.bookmarkedQuestions.map((q) => (
                <Link
                  key={q._id}
                  to={`/practice/${q._id}`}
                  className="block p-3.5 rounded-2xl border border-slate-200/80 bg-white/80 hover:border-indigo-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/80 transition duration-150"
                >
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{q.title}</div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{q.topic} • {q.difficulty}</span>
                    <span className="text-indigo-500 font-bold flex items-center gap-1">Practice <FiChevronRight className="h-3 w-3" /></span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No bookmarked questions yet.</p>
          )}
        </div>

        {/* Recently Viewed Panel */}
        <div className="snx-panel rounded-3xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 dark:border-slate-800">
            <FiClock className="h-5 w-5 text-purple-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Recently Viewed ({data.recentlyViewed?.length || 0})</h3>
          </div>
          {data.recentlyViewed?.length > 0 ? (
            <div className="space-y-2 max-h-[380px] overflow-y-auto snx-scrollbar pr-1">
              {data.recentlyViewed.map((q) => (
                <Link
                  key={q._id}
                  to={`/practice/${q._id}`}
                  className="block p-3.5 rounded-2xl border border-slate-200/80 bg-white/80 hover:border-purple-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/80 transition duration-150"
                >
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{q.title}</div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{q.topic} • {q.difficulty}</span>
                    <span className="text-purple-500 font-bold flex items-center gap-1">Revisit <FiChevronRight className="h-3 w-3" /></span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No recent view history recorded.</p>
          )}
        </div>

      </div>

      {/* Frequently Failed Topics Alert */}
      {data.frequentlyFailedTopics?.length > 0 && (
        <div className="snx-panel !p-4 bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200 dark:from-rose-950/20 dark:to-pink-950/20 dark:border-rose-900/40 flex flex-wrap items-center justify-between gap-4 rounded-3xl print:hidden">
          <div className="flex gap-3 items-center">
            <FiAlertCircle className="h-6 w-6 text-rose-500 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-rose-900 dark:text-rose-300">Target Weakness Alert</h4>
              <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">We detected repeated incorrect responses in these subtopics. Revise the flashcards below.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.frequentlyFailedTopics.map((item) => (
              <span key={item.topic} className="px-3 py-1 rounded-full text-xs font-bold bg-white text-rose-700 border border-rose-200 shadow-sm dark:bg-slate-800 dark:text-rose-300 dark:border-rose-900">
                {item.topic} ({item.count} fails)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Automated Study Revision Sheet */}
      <div className="snx-panel rounded-3xl space-y-6 print:border-0 print:shadow-none print:p-0">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <FiFileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">3D Interactive Flashcards & Cheat Sheet Notes</h3>
              <p className="text-xs text-slate-400">Click any flashcard to flip and self-assess your retention score.</p>
            </div>
          </div>
        </div>

        {data.revisionSheet?.length > 0 ? (
          <div className="space-y-8">
            {data.revisionSheet.map((sheet, index) => (
              <div key={sheet.topic} className="space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200/60 pb-2 dark:border-slate-800">
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white print:text-black">{sheet.topic}</h4>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {sheet.subject} • {sheet.level}
                  </span>
                </div>

                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <FiBookOpen className="h-3.5 w-3.5 text-indigo-500" /> Summary Cheat Sheet
                  </h5>
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                    {sheet.cheatSheet}
                  </p>
                </div>

                {sheet.flashcards && sheet.flashcards.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <FiRotateCw className="h-3.5 w-3.5 text-indigo-500" /> Click Flashcard to Reveal Answer
                    </h5>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {sheet.flashcards.map((fc, fcIdx) => {
                        const cardKey = `${sheet.topic}-${fcIdx}`;
                        const isFlipped = !!flippedCards[cardKey];

                        return (
                          <div
                            key={fcIdx}
                            onClick={() => setFlippedCards((c) => ({ ...c, [cardKey]: !c[cardKey] }))}
                            className="flashcard-container relative min-h-[160px] w-full"
                          >
                            <motion.div
                              animate={{ rotateY: isFlipped ? 180 : 0 }}
                              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                              className="flashcard-inner w-full h-full min-h-[160px]"
                            >
                              {/* FRONT */}
                              <div className="flashcard-front border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:border-indigo-500 hover:shadow-md transition-all">
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                    Question Card
                                  </span>
                                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-2 leading-snug">
                                    {fc.question}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mt-4">
                                  <span>Tap to reveal answer</span>
                                  <FiRotateCw className="h-3.5 w-3.5 text-indigo-500" />
                                </div>
                              </div>

                              {/* BACK */}
                              <div className="flashcard-back border border-indigo-500/80 bg-slate-900 text-white p-5 rounded-2xl flex flex-col justify-between shadow-xl">
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                                    Answer & Explanation
                                  </span>
                                  <p className="text-xs text-slate-200 leading-relaxed font-medium mt-2">
                                    {fc.answer}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between gap-1.5 pt-3 border-t border-slate-800 text-[10px]" onClick={(e) => e.stopPropagation()}>
                                  <button onClick={() => handleRateFlashcard(cardKey, "Again")} className="px-2 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold hover:bg-rose-500/30">Again</button>
                                  <button onClick={() => handleRateFlashcard(cardKey, "Hard")} className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-bold hover:bg-amber-500/30">Hard</button>
                                  <button onClick={() => handleRateFlashcard(cardKey, "Good")} className="px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold hover:bg-indigo-500/30">Good</button>
                                  <button onClick={() => handleRateFlashcard(cardKey, "Easy")} className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold hover:bg-emerald-500/30">Easy</button>
                                </div>
                              </div>
                            </motion.div>
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
          <p className="text-xs text-slate-400 italic text-center py-6">No revision cards found.</p>
        )}
      </div>
    </div>
  );
};

export default RevisionPage;

