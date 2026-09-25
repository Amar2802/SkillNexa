import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiBookOpen,
  FiCompass,
  FiSearch,
  FiCheckCircle,
  FiArrowRight,
  FiFileText,
  FiAward,
  FiLayers,
  FiCode
} from "react-icons/fi";
import api from "../api/client";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Card, { CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Progress from "../components/ui/Progress";
import SearchInput from "../components/ui/SearchInput";
import { useToast } from "../components/ui/ToastProvider";
import { CourseCard, LessonViewer } from "../components/learning";

const DIFFICULTY_FILTERS = [
  { label: "All Levels", value: "all" },
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" }
];

export const LearnPage = ({
  cachedRoadmaps = [],
  cachedCompletedTopics = [],
  cachedOverallCompletion = 0,
  refreshRoadmaps,
  refreshProfile,
  questions = []
}) => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [roadmaps, setRoadmaps] = useState(cachedRoadmaps);
  const [completedTopics, setCompletedTopics] = useState(cachedCompletedTopics);
  const [overallCompletion, setOverallCompletion] = useState(cachedOverallCompletion);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  useEffect(() => {
    if (cachedRoadmaps?.length) {
      setRoadmaps(cachedRoadmaps);
    }
  }, [cachedRoadmaps]);

  useEffect(() => {
    if (cachedCompletedTopics?.length) {
      setCompletedTopics(cachedCompletedTopics);
    }
  }, [cachedCompletedTopics]);

  useEffect(() => {
    if (cachedOverallCompletion !== undefined) {
      setOverallCompletion(cachedOverallCompletion);
    }
  }, [cachedOverallCompletion]);

  // Selected course derived from route or state
  const selectedCourse = useMemo(() => {
    if (!courseId) return null;
    return roadmaps.find((r) => r.id === courseId) || null;
  }, [courseId, roadmaps]);

  // When selectedCourse changes, default to the first incomplete topic or 0
  useEffect(() => {
    if (selectedCourse && selectedCourse.topics?.length) {
      const firstIncompleteIdx = selectedCourse.topics.findIndex(
        (t) => !completedTopics.includes(`${selectedCourse.id}:${t.name}`)
      );
      setActiveTopicIndex(firstIncompleteIdx !== -1 ? firstIncompleteIdx : 0);
    }
  }, [selectedCourse, completedTopics]);

  // Toggle Topic Completion with Backend API
  const handleToggleComplete = async (rId, topicName) => {
    const topicKey = `${rId}:${topicName}`;
    try {
      if (api.post) {
        const { data } = await api.post("/roadmaps/toggle-complete", { topicId: topicKey });
        if (data.completedRoadmapTopics) {
          setCompletedTopics(data.completedRoadmapTopics);
        }
        if (data.overallCompletion !== undefined) {
          setOverallCompletion(data.overallCompletion);
        }
      } else {
        setCompletedTopics((prev) =>
          prev.includes(topicKey) ? prev.filter((id) => id !== topicKey) : [...prev, topicKey]
        );
      }
      showToast?.("Progress updated!", "success");
      if (refreshRoadmaps) refreshRoadmaps();
      if (refreshProfile) refreshProfile();
    } catch (err) {
      // Optimistic fallback
      setCompletedTopics((prev) =>
        prev.includes(topicKey) ? prev.filter((id) => id !== topicKey) : [...prev, topicKey]
      );
      showToast?.("Progress updated offline", "neutral");
    }
  };

  // Find in-progress courses for "Continue Learning"
  const inProgressCourses = useMemo(() => {
    return roadmaps
      .map((r) => {
        const total = r.topics?.length || 0;
        const doneCount = (r.topics || []).filter((t) =>
          completedTopics.includes(`${r.id}:${t.name}`)
        ).length;
        const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;
        const nextTopic = (r.topics || []).find(
          (t) => !completedTopics.includes(`${r.id}:${t.name}`)
        );

        return {
          ...r,
          total,
          doneCount,
          percent,
          nextTopicName: nextTopic?.name || "Completed"
        };
      })
      .filter((r) => r.doneCount > 0 && r.percent < 100)
      .sort((a, b) => b.percent - a.percent);
  }, [roadmaps, completedTopics]);

  // Completed courses
  const completedCourses = useMemo(() => {
    return roadmaps.filter((r) => {
      const total = r.topics?.length || 0;
      if (total === 0) return false;
      const doneCount = (r.topics || []).filter((t) =>
        completedTopics.includes(`${r.id}:${t.name}`)
      ).length;
      return doneCount === total;
    });
  }, [roadmaps, completedTopics]);

  // Filtered Course Catalog
  const filteredCourses = useMemo(() => {
    return roadmaps.filter((course) => {
      const matchesSearch =
        search.trim() === "" ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase()) ||
        (course.topics || []).some((t) =>
          t.name.toLowerCase().includes(search.toLowerCase())
        );

      const matchesDifficulty =
        difficultyFilter === "all" ||
        (course.difficulty || "").toLowerCase() === difficultyFilter.toLowerCase();

      return matchesSearch && matchesDifficulty;
    });
  }, [roadmaps, search, difficultyFilter]);

  // If a course is active, render the focused LessonViewer
  if (selectedCourse) {
    return (
      <PageContainer maxWidth="7xl">
        <LessonViewer
          course={selectedCourse}
          activeTopicIndex={activeTopicIndex}
          completedTopics={completedTopics}
          onSelectTopic={(idx) => setActiveTopicIndex(idx)}
          onToggleComplete={handleToggleComplete}
          onBack={() => navigate("/learn")}
          questions={questions}
        />
      </PageContainer>
    );
  }

  // Otherwise, render the main Learning Hub
  return (
    <PageContainer maxWidth="7xl" className="space-y-8">
      {/* Page Header */}
      <PageHeader
        kicker="Curriculum & Developer Skills"
        title="Learn"
        description="Master core concepts, explore high-yield engineering tracks, and practice matching coding problems."
        actions={
          <div className="flex items-center gap-3">
            <Link to="/roadmaps">
              <Button variant="outline" size="sm" iconLeft={FiCompass}>
                Explore Roadmaps
              </Button>
            </Link>
            <Link to="/revision">
              <Button variant="outline" size="sm" iconLeft={FiFileText}>
                Revision Cards
              </Button>
            </Link>
          </div>
        }
      />

      {/* 1. Continue Learning Hero (Only shown if user has in-progress content) */}
      {inProgressCourses.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Continue Learning
            </h2>
            <span className="text-xs text-slate-400">
              {inProgressCourses.length} active {inProgressCourses.length === 1 ? "track" : "tracks"}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inProgressCourses.slice(0, 3).map((item) => (
              <Card
                key={item.id}
                hover
                className="p-5 flex flex-col justify-between border-l-4 border-l-indigo-600 bg-[var(--snx-surface)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      In Progress
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {item.doneCount}/{item.total} done
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 truncate">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    Up Next: <strong className="text-slate-700 dark:text-slate-200">{item.nextTopicName}</strong>
                  </p>

                  <div className="mt-4">
                    <Progress
                      value={item.percent}
                      max={100}
                      variant="primary"
                      size="sm"
                      showPercentage
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--snx-border)]">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                    iconRight={FiArrowRight}
                    onClick={() => navigate(`/learn/${item.id}`)}
                  >
                    Resume Lesson
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 2. Search & Filter Bar */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              placeholder="Search courses, topics, or technologies..."
            />
          </div>

          {/* Difficulty Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {DIFFICULTY_FILTERS.map((f) => {
              const active = difficultyFilter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setDifficultyFilter(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    active
                      ? "bg-indigo-600 text-white font-semibold shadow-subtle"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Course Catalog Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCourses.map((course) => {
              const total = course.topics?.length || 0;
              const completedCount = (course.topics || []).filter((t) =>
                completedTopics.includes(`${course.id}:${t.name}`)
              ).length;

              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  completedTopicsCount={completedCount}
                  isCompleted={completedCount === total && total > 0}
                  onSelectCourse={(c) => navigate(`/learn/${c.id}`)}
                />
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] space-y-3">
            <FiSearch className="h-8 w-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No matching courses found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any courses matching your search criteria. Try clearing the filter or searching for another topic.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setDifficultyFilter("all");
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </section>

      {/* 4. Connected Learning Resources */}
      <section className="space-y-4 pt-4 border-t border-[var(--snx-border)]">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Learning & Revision Tools
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card hover className="p-5 border border-[var(--snx-border)] bg-[var(--snx-surface)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <FiFileText className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
              Revision Cheat Sheets
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Printable cheat sheets, spaced repetition flashcards, and quick revision summaries.
            </p>
            <Link to="/revision" className="mt-4 inline-block">
              <Button variant="ghost" size="sm" iconRight={FiArrowRight} className="p-0 text-indigo-600 dark:text-indigo-400">
                Open Revision Studio
              </Button>
            </Link>
          </Card>

          <Card hover className="p-5 border border-[var(--snx-border)] bg-[var(--snx-surface)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <FiCompass className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
              Career Roadmaps
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Follow staged step-by-step career tracks from beginner foundation to advanced system design.
            </p>
            <Link to="/roadmaps" className="mt-4 inline-block">
              <Button variant="ghost" size="sm" iconRight={FiArrowRight} className="p-0 text-indigo-600 dark:text-indigo-400">
                View Roadmap Tree
              </Button>
            </Link>
          </Card>

          <Card hover className="p-5 border border-[var(--snx-border)] bg-[var(--snx-surface)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <FiCode className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-3">
              Hands-On Practice IDE
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Apply what you learn in an integrated Monaco code editor with real test cases and executions.
            </p>
            <Link to="/practice" className="mt-4 inline-block">
              <Button variant="ghost" size="sm" iconRight={FiArrowRight} className="p-0 text-indigo-600 dark:text-indigo-400">
                Launch Coding IDE
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* 5. Recently Completed (If any exist) */}
      {completedCourses.length > 0 && (
        <section className="space-y-3 pt-4 border-t border-[var(--snx-border)]">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="h-4 w-4 text-emerald-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Completed Tracks
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {completedCourses.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/10 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {c.title}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    100% Completed
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => navigate(`/learn/${c.id}`)}
                >
                  Review
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}
    </PageContainer>
  );
};

export default LearnPage;
