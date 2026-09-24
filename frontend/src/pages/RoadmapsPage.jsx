import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiBookOpen, FiCheckCircle, FiClock, FiCompass, FiAward, FiX, FiArrowRight } from "react-icons/fi";
import api from "../api/client";
import PageHeader from "../components/ui/PageHeader";
import LoadingScreen from "../components/ui/LoadingScreen";
import { useToast } from "../components/ui/ToastProvider";

const fallbackRoadmaps = [
  {
    id: "roadmap-fullstack",
    title: "Full-Stack Software Engineer",
    estimatedTime: "8-10 Weeks",
    difficulty: "Intermediate",
    description: "Master modern full-stack web application development, API architecture, databases, and system design.",
    topics: [
      {
        name: "HTML5, CSS3 & Modern JavaScript ES6+",
        level: "Beginner",
        cheatSheet: "JavaScript utilizes asynchronous event loops with microtask queues (Promises) and macrotask queues (setTimeout). ES6 features like destructing, spread operators, and closures form core reactive patterns.",
        revision: [
          { question: "What is a closure in JavaScript?", answer: "A function bundled together with references to its surrounding state (lexical environment)." },
          { question: "Difference between let, const, and var?", answer: "let & const are block-scoped and non-hoisted in TDZ, whereas var is function-scoped." }
        ]
      },
      {
        name: "React.js Framework & Hooks",
        level: "Intermediate",
        cheatSheet: "React virtual DOM reconciliation compares tree snapshots using keys. Custom hooks promote modular state encapsulation across UI components.",
        revision: [
          { question: "What problem does useMemo solve?", answer: "Memoizes expensive computed values across re-renders." }
        ]
      },
      {
        name: "Node.js & Express API Backend",
        level: "Intermediate",
        cheatSheet: "Node.js runs single-threaded non-blocking I/O using libuv thread pool for disk/network operations.",
        revision: [
          { question: "What is middleware in Express?", answer: "Functions with access to request object (req), response object (res), and next middleware function." }
        ]
      },
      {
        name: "Databases: PostgreSQL & MongoDB",
        level: "Advanced",
        cheatSheet: "Use B-Tree indexing on high-cardinality columns to speed up SELECT queries. ACID properties ensure relational database transaction reliability.",
        revision: [
          { question: "What does ACID stand for?", answer: "Atomicity, Consistency, Isolation, Durability." }
        ]
      }
    ]
  },
  {
    id: "roadmap-dsa",
    title: "Data Structures & Algorithms",
    estimatedTime: "6-8 Weeks",
    difficulty: "Advanced",
    description: "Ace technical coding rounds with rigorous practice on Arrays, Trees, Graphs, Dynamic Programming, and System Design.",
    topics: [
      {
        name: "Arrays, Strings & Two Pointers",
        level: "Beginner",
        cheatSheet: "Two pointers technique reduces time complexity from O(N^2) to O(N) when operating on sorted sequence ranges.",
        revision: [
          { question: "When to use Sliding Window?", answer: "When solving array or string contiguous subarray problems involving min/max bounds." }
        ]
      },
      {
        name: "Trees, Binary Search & Graph Algorithms",
        level: "Intermediate",
        cheatSheet: "BFS uses a Queue for shortest-path unweighted graph traversals; DFS uses recursion/stack for deep path exploration.",
        revision: [
          { question: "Time complexity of BFS?", answer: "O(V + E) where V is vertices and E is edges." }
        ]
      }
    ]
  }
];

const RoadmapsPage = ({ cachedRoadmaps, cachedCompletedTopics, cachedOverallCompletion, refreshRoadmaps, refreshProfile }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [roadmaps, setRoadmaps] = useState(cachedRoadmaps?.length ? cachedRoadmaps : fallbackRoadmaps);
  const [completedTopics, setCompletedTopics] = useState(cachedCompletedTopics || []);
  const [overallCompletion, setOverallCompletion] = useState(cachedOverallCompletion || 25);
  const [loading, setLoading] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState(roadmaps[0]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [selectedMcqAnswers, setSelectedMcqAnswers] = useState({});
  const [submittedMcqs, setSubmittedMcqs] = useState({});
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    if (cachedRoadmaps?.length) {
      setRoadmaps(cachedRoadmaps);
      if (!selectedSubject) setSelectedSubject(cachedRoadmaps[0]);
    }
  }, [cachedRoadmaps]);

  useEffect(() => {
    if (refreshRoadmaps) {
      const fetchLatest = async () => {
        try {
          await refreshRoadmaps();
        } catch (e) {
          console.error(e);
        }
      };
      void fetchLatest();
    }
  }, []);

  const toggleTopicComplete = async (roadmapId, topicName) => {
    const topicId = `${roadmapId}:${topicName}`;
    try {
      if (api.post) {
        const { data } = await api.post("/roadmaps/toggle-complete", { topicId });
        if (data.completedRoadmapTopics) setCompletedTopics(data.completedRoadmapTopics);
        if (data.overallCompletion !== undefined) setOverallCompletion(data.overallCompletion);
      } else {
        setCompletedTopics((prev) =>
          prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
        );
      }
      showToast?.("Roadmap progress updated!", "success");
    } catch (error) {
      setCompletedTopics((prev) =>
        prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
      );
      showToast?.("Topic completion updated!", "success");
    }
  };

  const isCompleted = (roadmapId, topicName) => {
    return completedTopics.includes(`${roadmapId}:${topicName}`);
  };

  const getSubjectCompletion = (roadmap) => {
    const total = roadmap.topics.length;
    const completed = roadmap.topics.filter((t) => isCompleted(roadmap.id, t.name)).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  if (loading) {
    return <LoadingScreen title="Loading Learning Roadmaps..." subtitle="Building your interview preparation paths" />;
  }

  return (
    <div className="space-y-6 snx-fade-in">
      <PageHeader
        kicker="Structured Curriculums"
        title="Engineering Career Roadmaps"
        description="Follow curated pathways designed by tech leads. Study cheat sheets, flip quick flashcards, and mark node completion."
        aside={(
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-800/90 min-w-[220px]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Curriculum Progress</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{overallCompletion}%</span>
              <span className="text-xs font-semibold text-slate-500">completed</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallCompletion}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              />
            </div>
          </div>
        )}
      />

      {/* Subject Selector Tab Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {roadmaps.map((subject) => {
          const isActive = selectedSubject?.id === subject.id;
          const comp = getSubjectCompletion(subject);
          return (
            <button
              key={subject.id}
              onClick={() => {
                setSelectedSubject(subject);
                setActiveTopic(null);
              }}
              className={`rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? "border-indigo-500 bg-indigo-50/50 text-indigo-950 dark:bg-indigo-950/20 dark:text-indigo-200 ring-2 ring-indigo-500/20 shadow-md"
                  : "border-slate-200/80 bg-white/80 text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300"
              }`}
            >
              <div className="text-xs font-extrabold tracking-wide truncate">{subject.title}</div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">{subject.estimatedTime}</span>
                <span className={`text-[10px] font-extrabold ${comp === 100 ? "text-emerald-500" : "text-indigo-600 dark:text-indigo-400"}`}>{comp}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Subject Roadmap Tree View */}
      {selectedSubject && (
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <div className="snx-panel rounded-3xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="snx-kicker">{selectedSubject.difficulty} • {selectedSubject.estimatedTime}</span>
                  <h2 className="snx-heading-2 mt-2">{selectedSubject.title}</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{selectedSubject.description}</p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 shadow-inner">
                  <FiAward className="h-6 w-6" />
                </div>
              </div>

              {/* Roadmap path list grouped by levels */}
              <div className="mt-8 space-y-8 relative before:absolute before:left-6 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-100 dark:before:bg-slate-800">
                {["Beginner", "Intermediate", "Advanced"].map((level) => {
                  const levelTopics = selectedSubject.topics.filter((t) => t.level === level);
                  if (levelTopics.length === 0) return null;

                  return (
                    <div key={level} className="space-y-4 relative">
                      <div className="flex items-center gap-3 ml-12">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-200/50 dark:border-indigo-800/40">
                          {level} Level
                        </span>
                      </div>

                      <div className="space-y-3">
                        {levelTopics.map((topic) => {
                          const done = isCompleted(selectedSubject.id, topic.name);
                          const isActive = activeTopic?.name === topic.name;

                          return (
                            <div key={topic.name} className="flex gap-4 items-center">
                              {/* Connector Indicator */}
                              <div
                                onClick={() => toggleTopicComplete(selectedSubject.id, topic.name)}
                                className={`z-10 flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-300 ml-3.5 ${
                                  done
                                    ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                    : "border-slate-300 bg-white hover:border-emerald-500 dark:border-slate-700 dark:bg-slate-800"
                                }`}
                              >
                                {done && <span className="text-[10px] font-extrabold">✓</span>}
                              </div>

                              {/* Main Topic Node Card */}
                              <div
                                onClick={() => {
                                  setActiveTopic(topic);
                                  setSelectedMcqAnswers({});
                                  setSubmittedMcqs({});
                                }}
                                className={`flex-1 snx-panel !p-4 cursor-pointer flex items-center justify-between transition-all duration-200 rounded-2xl ${
                                  isActive
                                    ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-md"
                                    : "hover:border-slate-300 dark:hover:border-slate-700"
                                }`}
                              >
                                <div>
                                  <div className="font-bold text-sm text-slate-900 dark:text-white">{topic.name}</div>
                                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                                    <span className="flex items-center gap-1 font-medium"><FiClock className="h-3.5 w-3.5" /> 2-4 Hours</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {done ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
                                      <FiCheckCircle className="h-3.5 w-3.5" /> Completed
                                    </span>
                                  ) : (
                                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">Study <FiArrowRight className="h-3.5 w-3.5" /></span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Topic Details Sidebar Drawer */}
          <aside className="space-y-6">
            <AnimatePresence mode="wait">
              {activeTopic ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="snx-panel rounded-3xl space-y-6 sticky top-24 max-h-[82vh] overflow-y-auto snx-scrollbar"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="snx-kicker">{activeTopic.level}</span>
                      <h3 className="snx-heading-3 mt-1.5">{activeTopic.name}</h3>
                    </div>
                    <button
                      onClick={() => setActiveTopic(null)}
                      className="h-8 w-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Progress Toggle */}
                  <button
                    onClick={() => toggleTopicComplete(selectedSubject.id, activeTopic.name)}
                    className={`w-full py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                      isCompleted(selectedSubject.id, activeTopic.name)
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900"
                        : "snx-btn-primary"
                    }`}
                  >
                    <FiCheckCircle className="h-4 w-4" />
                    {isCompleted(selectedSubject.id, activeTopic.name) ? "Mark Incomplete" : "Mark Node as Completed"}
                  </button>

                  {/* Tab: Cheat Sheet */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 dark:border-slate-800">
                      <FiBookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Cheat Sheet Notes</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                      {activeTopic.cheatSheet}
                    </p>
                  </div>

                  {/* Tab: Quick Revision */}
                  {activeTopic.revision && activeTopic.revision.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 dark:border-slate-800">
                        <FiCompass className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Quick Revision Cards</span>
                      </div>
                      <div className="grid gap-3">
                        {activeTopic.revision.map((rev, index) => {
                          const isFlipped = !!flippedCards[index];
                          return (
                            <div
                              key={index}
                              onClick={() => setFlippedCards((c) => ({ ...c, [index]: !c[index] }))}
                              className="flashcard-container relative w-full min-h-[90px]"
                            >
                              <div className="flashcard-inner w-full h-full relative min-h-[90px]">
                                {/* FRONT */}
                                <div className="flashcard-front border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-800 p-4 rounded-2xl flex flex-col justify-center shadow-sm hover:border-indigo-500 transition-all">
                                  <div className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">Question</div>
                                  <div className="text-xs font-bold text-slate-900 dark:text-white">{rev.question}</div>
                                </div>
                                {/* BACK */}
                                <div className="flashcard-back border border-indigo-500/80 bg-slate-900 text-white p-4 rounded-2xl flex flex-col justify-center shadow-md">
                                  <div className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-400 mb-1">Answer</div>
                                  <div className="text-xs text-slate-200 leading-relaxed font-semibold">{rev.answer}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="snx-panel rounded-3xl h-96 flex flex-col items-center justify-center text-center p-6 space-y-3 sticky top-24">
                  <FiCompass className="h-12 w-12 text-slate-300 dark:text-slate-700 animate-pulse" />
                  <div className="font-bold text-sm text-slate-900 dark:text-white">Select a Topic Node</div>
                  <p className="text-xs text-slate-500 max-w-[280px]">
                    Click on any node in the roadmap to view detailed cheat sheets and quick revision questions.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </aside>
        </div>
      )}
    </div>
  );
};

export default RoadmapsPage;

