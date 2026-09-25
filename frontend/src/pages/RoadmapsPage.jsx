import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiCompass,
  FiAward,
  FiX,
  FiArrowRight,
  FiExternalLink,
  FiCode
} from "react-icons/fi";
import api from "../api/client";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Card, { CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Progress from "../components/ui/Progress";
import LoadingScreen from "../components/ui/LoadingScreen";
import { useToast } from "../components/ui/ToastProvider";
import { RoadmapProgressionTree } from "../components/learning/RoadmapProgressionTree";

const fallbackRoadmaps = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    estimatedTime: "80 Hours",
    difficulty: "Hard",
    description: "Master problem solving, algorithms, and key data structures from arrays to dynamic programming.",
    topics: [
      {
        name: "Arrays & Sorting",
        level: "Beginner",
        cheatSheet: "Arrays are contiguous memory blocks. Access O(1), Search O(n). Two-pointer technique and sliding window reduce time complexities from O(n^2) to O(n).",
        revision: [
          { question: "What is Kadane's algorithm used for?", answer: "Finding the maximum sum contiguous subarray in O(n) time." },
          { question: "What is the time complexity of Merge Sort?", answer: "O(n log n) in all cases (best, average, worst)." }
        ],
        questions: ["Two Sum", "Best Time to Buy and Sell Stock"]
      }
    ]
  }
];

export const RoadmapsPage = ({
  cachedRoadmaps,
  cachedCompletedTopics,
  cachedOverallCompletion,
  refreshRoadmaps,
  refreshProfile
}) => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [roadmaps, setRoadmaps] = useState(
    cachedRoadmaps?.length ? cachedRoadmaps : fallbackRoadmaps
  );
  const [completedTopics, setCompletedTopics] = useState(cachedCompletedTopics || []);
  const [overallCompletion, setOverallCompletion] = useState(cachedOverallCompletion || 0);
  const [loading, setLoading] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState(roadmaps[0]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});

  useEffect(() => {
    if (cachedRoadmaps?.length) {
      setRoadmaps(cachedRoadmaps);
      if (!selectedSubject) setSelectedSubject(cachedRoadmaps[0]);
    }
  }, [cachedRoadmaps]);

  useEffect(() => {
    if (cachedCompletedTopics) {
      setCompletedTopics(cachedCompletedTopics);
    }
  }, [cachedCompletedTopics]);

  useEffect(() => {
    if (cachedOverallCompletion !== undefined) {
      setOverallCompletion(cachedOverallCompletion);
    }
  }, [cachedOverallCompletion]);

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
      if (refreshProfile) refreshProfile();
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
    const total = roadmap.topics?.length || 0;
    const completed = (roadmap.topics || []).filter((t) => isCompleted(roadmap.id, t.name)).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const handleSelectTopic = (topic) => {
    setActiveTopic(topic);
    setFlippedCards({});

    setTimeout(() => {
      const drawerEl = document.getElementById("roadmap-topic-details");
      if (drawerEl) {
        drawerEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 50);
  };

  const handleStartPractice = (topicName) => {
    navigate("/practice", { state: { search: topicName } });
  };

  if (loading) {
    return <LoadingScreen title="Loading Learning Roadmaps..." subtitle="Building your interview preparation paths" />;
  }

  return (
    <PageContainer maxWidth="7xl" className="space-y-8">
      <PageHeader
        kicker="Structured Engineering Curriculums"
        title="Learning Roadmaps"
        description="Follow curated pathways designed by industry tech leads. Trace each stage from foundational principles to advanced interview readiness."
        actions={
          <div className="flex items-center gap-3">
            <Link to="/learn">
              <Button variant="outline" size="sm" iconLeft={FiBookOpen}>
                Learning Hub
              </Button>
            </Link>
            <Link to="/revision">
              <Button variant="outline" size="sm" iconLeft={FiAward}>
                Revision Cards
              </Button>
            </Link>
          </div>
        }
      />

      {/* Curriculum Overall Progress Banner */}
      <Card className="p-6 border border-[var(--snx-border)] bg-[var(--snx-surface)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <FiCompass className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Global Curriculum Progress
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Track your cumulative technical milestones across all engineering specializations.
            </p>
          </div>

          <div className="min-w-[220px]">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-500">Overall Completed</span>
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                {overallCompletion}%
              </span>
            </div>
            <Progress
              value={overallCompletion}
              max={100}
              variant="primary"
              size="md"
            />
          </div>
        </div>
      </Card>

      {/* Roadmap Subject Selection Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Select Engineering Track
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {roadmaps.map((subject) => {
            const isActive = selectedSubject?.id === subject.id;
            const comp = getSubjectCompletion(subject);

            return (
              <button
                key={subject.id}
                type="button"
                onClick={() => {
                  setSelectedSubject(subject);
                  setActiveTopic(null);
                }}
                className={`rounded-xl border p-3.5 text-left transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "border-indigo-600 bg-indigo-50/60 text-indigo-950 ring-2 ring-indigo-500/20 shadow-sm dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-800"
                    : "border-[var(--snx-border)] bg-[var(--snx-surface)] text-slate-700 hover:border-slate-300 dark:text-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="text-xs font-bold truncate">
                  {subject.title}
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{subject.estimatedTime || "Self-paced"}</span>
                  <span className={`font-bold ${comp === 100 ? "text-emerald-500" : "text-indigo-600 dark:text-indigo-400"}`}>
                    {comp}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Subject Roadmap Tree & Detail Drawer */}
      {selectedSubject && (
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] items-start">
          {/* Left Column: Subject Header & Progression Nodes */}
          <div className="space-y-6">
            <Card className="p-6 border border-[var(--snx-border)] bg-[var(--snx-surface)]">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--snx-border)]">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="primary" size="sm">
                      {selectedSubject.difficulty || "All Levels"}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {selectedSubject.estimatedTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1.5">
                    {selectedSubject.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {selectedSubject.description}
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  <FiAward className="h-6 w-6" />
                </div>
              </div>

              {/* Connected Progression Stages */}
              <div className="mt-6">
                <RoadmapProgressionTree
                  roadmap={selectedSubject}
                  completedTopics={completedTopics}
                  activeTopicName={activeTopic?.name}
                  onSelectTopic={handleSelectTopic}
                  onToggleComplete={toggleTopicComplete}
                />
              </div>
            </Card>
          </div>

          {/* Right Column: Topic Detail Drawer */}
          <aside className="space-y-6 sticky top-20" id="roadmap-topic-details">
            {activeTopic ? (
              <Card className="p-6 border border-[var(--snx-border)] bg-[var(--snx-surface)] space-y-5">
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[var(--snx-border)]">
                  <div>
                    <Badge variant="neutral" size="sm">
                      {activeTopic.level} Level
                    </Badge>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {activeTopic.name}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setActiveTopic(null)}
                  >
                    <FiX className="h-4 w-4" />
                  </Button>
                </div>

                {/* Actions Bar */}
                <div className="grid grid-cols-2 gap-2.5">
                  <Button
                    variant={isCompleted(selectedSubject.id, activeTopic.name) ? "secondary" : "outline"}
                    size="sm"
                    iconLeft={FiCheckCircle}
                    onClick={() => toggleTopicComplete(selectedSubject.id, activeTopic.name)}
                    className="justify-center"
                  >
                    {isCompleted(selectedSubject.id, activeTopic.name) ? "Completed ✓" : "Mark Done"}
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    iconRight={FiArrowRight}
                    onClick={() => handleStartPractice(activeTopic.name)}
                    className="justify-center"
                  >
                    Practice in IDE
                  </Button>
                </div>

                {/* Cheat Sheet Concept Summary */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiBookOpen className="h-4 w-4 text-indigo-500" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Cheat Sheet Notes
                    </span>
                  </div>
                  <div className="p-4 rounded-xl text-xs leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-[var(--snx-border)]">
                    {activeTopic.cheatSheet}
                  </div>
                </div>

                {/* Quick Revision Flashcards */}
                {activeTopic.revision && activeTopic.revision.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Revision Flashcards
                      </span>
                      <span className="text-[10px] text-slate-400">Click to flip 🔄</span>
                    </div>

                    <div className="space-y-2.5">
                      {activeTopic.revision.map((rev, idx) => {
                        const isFlipped = !!flippedCards[idx];
                        return (
                          <div
                            key={idx}
                            onClick={() => setFlippedCards((c) => ({ ...c, [idx]: !c[idx] }))}
                            className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-white dark:bg-slate-800/70 hover:border-indigo-400 cursor-pointer transition-all duration-150"
                          >
                            <div className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                              {isFlipped ? "Answer" : "Question"}
                            </div>
                            <div className={`text-xs ${isFlipped ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-slate-800 dark:text-slate-200 font-medium"}`}>
                              {isFlipped ? rev.answer : rev.question}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Direct Link to Focused Course Lesson */}
                <div className="pt-2 border-t border-[var(--snx-border)]">
                  <Link to={`/learn/${selectedSubject.id}`}>
                    <Button variant="ghost" size="sm" iconRight={FiExternalLink} className="w-full justify-center text-xs text-indigo-600 dark:text-indigo-400">
                      Open in Full Lesson Studio
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <Card className="p-8 border border-[var(--snx-border)] bg-[var(--snx-surface)] text-center space-y-3">
                <FiCompass className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto animate-pulse" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Select a Topic Node
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[260px] mx-auto">
                  Click on any checkpoint in the progression tree to view cheat sheets, flashcards, and practice IDE links.
                </p>
              </Card>
            )}
          </aside>
        </div>
      )}
    </PageContainer>
  );
};

export default RoadmapsPage;
