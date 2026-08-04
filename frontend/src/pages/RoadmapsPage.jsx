import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBookOpen, FiCheckCircle, FiClock, FiCompass, FiAward, FiX } from "react-icons/fi";
import api from "../api/client";
import PageHeader from "../components/ui/PageHeader";
import LoadingScreen from "../components/ui/LoadingScreen";
import { useToast } from "../components/ui/ToastProvider";

const RoadmapsPage = ({ cachedRoadmaps, cachedCompletedTopics, cachedOverallCompletion, refreshRoadmaps, refreshProfile }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [roadmaps, setRoadmaps] = useState(cachedRoadmaps || []);
  const [completedTopics, setCompletedTopics] = useState(cachedCompletedTopics || []);
  const [overallCompletion, setOverallCompletion] = useState(cachedOverallCompletion || 0);
  const [loading, setLoading] = useState(!cachedRoadmaps || cachedRoadmaps.length === 0);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [selectedMcqAnswers, setSelectedMcqAnswers] = useState({});
  const [submittedMcqs, setSubmittedMcqs] = useState({});
  const [flippedCards, setFlippedCards] = useState({}); // state for 3D flip card toggle

  useEffect(() => {
    if (cachedRoadmaps && cachedRoadmaps.length > 0) {
      setRoadmaps(cachedRoadmaps);
      setCompletedTopics(cachedCompletedTopics);
      setOverallCompletion(cachedOverallCompletion);
      if (!selectedSubject) {
        setSelectedSubject(cachedRoadmaps[0]);
      }
    }
  }, [cachedRoadmaps, cachedCompletedTopics, cachedOverallCompletion]);

  useEffect(() => {
    const fetchLatest = async () => {
      await refreshRoadmaps();
      setLoading(false);
    };
    fetchLatest();
  }, []);

  const toggleTopicComplete = async (roadmapId, topicName) => {
    const topicId = `${roadmapId}:${topicName}`;
    try {
      const { data } = await api.post("/roadmaps/toggle-complete", { topicId });
      setCompletedTopics(data.completedRoadmapTopics);
      setOverallCompletion(data.overallCompletion);
      refreshRoadmaps();
      refreshProfile?.();
      showToast("Progress updated successfully", "success");
    } catch (error) {
      showToast("Error updating progress", "error");
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
        kicker="Structured Learning Roadmaps"
        title="From Zero to Interview Ready"
        description="Follow our curated engineering curriculums. Study cheat sheets, take MCQs, revise notes, and track your progress."
        aside={(
          <div className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-sm-soft dark:border-slate-custom-700 dark:bg-slate-custom-900/60">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-custom-500">Overall Progress</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-custom-900 dark:text-white">{overallCompletion}%</span>
              <span className="text-xs text-slate-custom-500">curriculum completed</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-slate-custom-200 dark:bg-slate-custom-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300"
                style={{ width: `${overallCompletion}%` }}
              />
            </div>
          </div>
        )}
      />

      {/* Subject Selector Tab Grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {roadmaps.map((subject) => {
          const isActive = selectedSubject?.id === subject.id;
          const comp = getSubjectCompletion(subject);
          return (
            <button
              key={subject.id}
              onClick={() => {
                setSelectedSubject(subject);
                setActiveTopic(null);
                setSelectedMcqAnswers({});
                setSubmittedMcqs({});
              }}
              className={`rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer ${
                isActive
                  ? "border-brand-500 bg-brand-50/50 text-brand-900 dark:bg-brand-900/10 dark:text-brand-300 ring-2 ring-brand-500/20"
                  : "border-slate-custom-200 bg-white text-slate-custom-700 hover:border-slate-custom-300 dark:border-slate-custom-700 dark:bg-slate-custom-800 dark:text-slate-custom-300"
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wide truncate">{subject.title}</div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] font-medium text-slate-custom-400">{subject.estimatedTime}</span>
                <span className={`text-[10px] font-semibold ${comp === 100 ? "text-green-600" : "text-brand-600 dark:text-brand-400"}`}>{comp}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Subject Roadmap Tree View */}
      {selectedSubject && (
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-6">
            <div className="snx-panel-muted">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="snx-kicker">{selectedSubject.difficulty} • {selectedSubject.estimatedTime}</span>
                  <h2 className="snx-heading-2 mt-2">{selectedSubject.title}</h2>
                  <p className="mt-1 snx-body-sm text-slate-custom-600">{selectedSubject.description}</p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-brand-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <FiAward className="h-6 w-6" />
                </div>
              </div>

              {/* Roadmap path list grouped by levels */}
              <div className="mt-8 space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-custom-200 dark:before:bg-slate-custom-700">
                {["Beginner", "Intermediate", "Advanced"].map((level) => {
                  const levelTopics = selectedSubject.topics.filter((t) => t.level === level);
                  if (levelTopics.length === 0) return null;

                  return (
                    <div key={level} className="space-y-4 relative">
                      <div className="flex items-center gap-3 ml-12">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-custom-400 bg-slate-custom-100 dark:bg-slate-custom-800 px-3 py-1 rounded-full">
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
                                className={`z-10 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-300 ml-4 ${
                                  done
                                    ? "border-green-500 bg-green-500 text-white"
                                    : "border-slate-custom-300 bg-white hover:border-green-500 dark:border-slate-custom-600 dark:bg-slate-custom-850"
                                }`}
                              >
                                {done && <span className="text-[8px]">✓</span>}
                              </div>

                              {/* Main Topic Node Card */}
                              <div
                                onClick={() => {
                                  setActiveTopic(topic);
                                  setSelectedMcqAnswers({});
                                  setSubmittedMcqs({});
                                }}
                                className={`flex-1 snx-card !p-4 cursor-pointer flex items-center justify-between transition-all duration-200 ${
                                  isActive
                                    ? "border-brand-500 ring-2 ring-brand-500/10"
                                    : "hover:border-slate-custom-300 dark:hover:border-slate-custom-600"
                                }`}
                              >
                                <div>
                                  <div className="font-semibold text-slate-custom-900 dark:text-white">{topic.name}</div>
                                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-custom-500">
                                    <span className="flex items-center gap-1"><FiClock className="h-3.5 w-3.5" /> 2-4 Hours</span>
                                    <span>•</span>
                                    <span>{topic.questions?.length || 0} practice nodes</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {done ? (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-2.5 py-1 rounded-full">
                                      <FiCheckCircle className="h-3.5 w-3.5" /> Completed
                                    </span>
                                  ) : (
                                    <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold">Start Study →</span>
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
            {activeTopic ? (
              <div className="snx-panel-muted space-y-6 sticky top-24 max-h-[82vh] overflow-y-auto snx-scrollbar">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="snx-kicker">{activeTopic.level}</span>
                    <h3 className="snx-heading-3 mt-1.5">{activeTopic.name}</h3>
                  </div>
                  <button
                    onClick={() => setActiveTopic(null)}
                    className="h-8 w-8 rounded-lg border border-slate-custom-200 flex items-center justify-center text-slate-custom-600 hover:bg-slate-custom-50 cursor-pointer dark:border-slate-custom-700"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>

                {/* Progress Toggle */}
                <button
                  onClick={() => toggleTopicComplete(selectedSubject.id, activeTopic.name)}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                    isCompleted(selectedSubject.id, activeTopic.name)
                      ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/20 dark:text-green-300 dark:border-green-900"
                      : "snx-btn-primary"
                  }`}
                >
                  <FiCheckCircle className="h-4 w-4" />
                  {isCompleted(selectedSubject.id, activeTopic.name) ? "Mark Incomplete" : "Mark Topic as Completed"}
                </button>

                {/* Tab: Cheat Sheet */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-custom-250 pb-2 dark:border-slate-custom-700">
                    <FiBookOpen className="h-4 w-4 text-brand-600 dark:text-indigo-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-custom-700 dark:text-white">Cheat Sheet</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-custom-600 dark:text-slate-custom-300 bg-slate-custom-50 dark:bg-slate-custom-850 p-4 rounded-xl">
                    {activeTopic.cheatSheet}
                  </p>
                </div>

                {/* Tab: Quick Revision */}
                {activeTopic.revision && activeTopic.revision.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-custom-250 pb-2 dark:border-slate-custom-700">
                      <FiCompass className="h-4 w-4 text-brand-600 dark:text-indigo-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-custom-700 dark:text-white">Quick Revision</span>
                    </div>
                    <div className="grid gap-3">
                      {activeTopic.revision.map((rev, index) => {
                        const isFlipped = !!flippedCards[index];
                        return (
                          <div
                            key={index}
                            onClick={() => setFlippedCards((c) => ({ ...c, [index]: !c[index] }))}
                            className={`flashcard-container relative w-full min-h-[90px] ${isFlipped ? "flipped" : ""}`}
                          >
                            <div className="flashcard-inner w-full h-full relative min-h-[90px]">
                              {/* FRONT */}
                              <div className="flashcard-front border border-slate-custom-200 bg-white dark:border-slate-custom-700 dark:bg-slate-custom-800 p-4 rounded-xl flex flex-col justify-center shadow-sm hover:border-indigo-400 dark:hover:border-indigo-400 transition-all duration-200">
                                <div className="text-[9px] font-bold uppercase tracking-wider text-brand-650 dark:text-indigo-400 mb-1">Click to Flip</div>
                                <div className="text-xs font-bold text-slate-custom-850 dark:text-white">Q: {rev.question}</div>
                              </div>
                              {/* BACK */}
                              <div className="flashcard-back border border-brand-500 bg-indigo-50/20 dark:bg-indigo-950/20 p-4 rounded-xl flex flex-col justify-center shadow-sm">
                                <div className="text-[9px] font-bold uppercase tracking-wider text-green-600 mb-1">Answer</div>
                                <div className="text-xs text-slate-custom-700 dark:text-slate-custom-300 leading-relaxed font-semibold">{rev.answer}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab: MCQs Mock Quiz */}
                {activeTopic.mcqs && activeTopic.mcqs.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-custom-250 pb-2 dark:border-slate-custom-700">
                      <FiAward className="h-4 w-4 text-brand-600 dark:text-indigo-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-custom-700 dark:text-white">Topic MCQ Test</span>
                    </div>
                    <div className="space-y-4">
                      {activeTopic.mcqs.map((mcq, mIdx) => {
                        const submitted = submittedMcqs[mIdx];
                        const answer = selectedMcqAnswers[mIdx];

                        return (
                          <div key={mIdx} className="space-y-2 border-b border-slate-custom-100 pb-3 dark:border-slate-custom-800 last:border-0 last:pb-0">
                            <div className="text-xs font-semibold text-slate-custom-900 dark:text-white">{mIdx+1}. {mcq.question}</div>
                            <div className="space-y-1.5">
                              {mcq.options.map((opt) => {
                                const isSel = answer === opt;
                                const isCorrect = opt === mcq.correctAnswer;
                                let btnStyle = "border-slate-custom-200 dark:border-slate-custom-700 dark:bg-slate-custom-800 hover:border-indigo-300";
                                if (submitted) {
                                  if (isCorrect) btnStyle = "border-green-500 bg-green-50 text-green-800 dark:bg-green-950/20 dark:text-green-300";
                                  else if (isSel) btnStyle = "border-red-500 bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-300";
                                } else if (isSel) {
                                  btnStyle = "border-brand-500 bg-indigo-50 dark:bg-indigo-950/20";
                                }

                                return (
                                  <button
                                    key={opt}
                                    disabled={submitted}
                                    onClick={() => setSelectedMcqAnswers(c => ({ ...c, [mIdx]: opt }))}
                                    className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition duration-150 ${btnStyle}`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                            {!submitted ? (
                              <button
                                disabled={!answer}
                                onClick={() => setSubmittedMcqs(c => ({ ...c, [mIdx]: true }))}
                                className="snx-btn-secondary snx-btn-sm w-full mt-1.5 cursor-pointer disabled:opacity-50"
                              >
                                Submit Answer
                              </button>
                            ) : (
                              <p className="text-[10px] text-slate-custom-500 italic mt-1 bg-slate-custom-50 dark:bg-slate-custom-850 p-2 rounded-md">
                                <strong>Explanation:</strong> {mcq.explanation}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tab: Curated Questions */}
                {activeTopic.questions && activeTopic.questions.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-slate-custom-250 pb-2 dark:border-slate-custom-700">
                      <FiCompass className="h-4 w-4 text-brand-600 dark:text-indigo-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-custom-700 dark:text-white">Curated Questions</span>
                    </div>
                    <div className="space-y-2">
                      {activeTopic.questions.map((qTitle, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            // Find question in bank or navigate to search
                            navigate(`/questions?search=${encodeURIComponent(qTitle)}`);
                          }}
                          className="w-full text-left snx-card !p-3 cursor-pointer flex items-center justify-between text-xs font-semibold hover:border-brand-500"
                        >
                          <span className="text-slate-custom-800 dark:text-white truncate">{qTitle}</span>
                          <span className="text-brand-600 dark:text-brand-400 shrink-0">Solve →</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="snx-panel-muted h-96 flex flex-col items-center justify-center text-center p-6 space-y-3 sticky top-24">
                <FiCompass className="h-12 w-12 text-slate-custom-300 animate-pulse" />
                <div className="font-semibold text-slate-custom-800 dark:text-white">Select a Topic Node</div>
                <p className="snx-body-sm text-slate-custom-500 max-w-[280px]">
                  Click on any topic node from the roadmap tree to access its cheat sheets, revision flashcards, and MCQ quizzes.
                </p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

export default RoadmapsPage;
