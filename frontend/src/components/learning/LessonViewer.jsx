import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiCircle,
  FiBookOpen,
  FiCode,
  FiCompass,
  FiCopy,
  FiCheck,
  FiHelpCircle,
  FiMenu,
  FiX,
  FiExternalLink
} from "react-icons/fi";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Progress from "../ui/Progress";
import CourseCurriculum from "./CourseCurriculum";

export const LessonViewer = ({
  course,
  activeTopicIndex = 0,
  completedTopics = [],
  onSelectTopic,
  onToggleComplete,
  onBack,
  questions = []
}) => {
  const navigate = useNavigate();
  const [copiedCodeIndex, setCopiedCodeIndex] = useState(null);
  const [selectedMcqAnswers, setSelectedMcqAnswers] = useState({});
  const [submittedMcqs, setSubmittedMcqs] = useState({});
  const [flippedCards, setFlippedCards] = useState({});
  const [mobileCurriculumOpen, setMobileCurriculumOpen] = useState(false);

  const topics = course?.topics || [];
  const activeTopic = topics[activeTopicIndex] || topics[0];

  const totalTopics = topics.length;
  const topicId = `${course?.id}:${activeTopic?.name}`;
  const isTopicCompleted = completedTopics.includes(topicId);

  const completedCount = useMemo(() => {
    return topics.filter((t) => completedTopics.includes(`${course?.id}:${t.name}`)).length;
  }, [topics, completedTopics, course?.id]);

  const courseProgressPercent = totalTopics > 0
    ? Math.round((completedCount / totalTopics) * 100)
    : 0;

  const handleCopy = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const handleSelectMcq = (mcqIndex, option) => {
    if (submittedMcqs[mcqIndex]) return; // already submitted
    setSelectedMcqAnswers((prev) => ({ ...prev, [mcqIndex]: option }));
  };

  const handleCheckMcq = (mcqIndex) => {
    setSubmittedMcqs((prev) => ({ ...prev, [mcqIndex]: true }));
  };

  const handlePrevTopic = () => {
    if (activeTopicIndex > 0) {
      onSelectTopic(activeTopicIndex - 1);
      setFlippedCards({});
      setSelectedMcqAnswers({});
      setSubmittedMcqs({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextTopic = () => {
    if (activeTopicIndex < totalTopics - 1) {
      onSelectTopic(activeTopicIndex + 1);
      setFlippedCards({});
      setSelectedMcqAnswers({});
      setSubmittedMcqs({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Find practice problems matching activeTopic.questions
  const practiceProblems = useMemo(() => {
    if (!activeTopic?.questions || !Array.isArray(activeTopic.questions)) return [];
    
    return activeTopic.questions.map((qTitle) => {
      // Look for matching question in questions bank
      const matched = questions.find(
        (q) => q.title.toLowerCase().trim() === qTitle.toLowerCase().trim()
      );
      return {
        title: qTitle,
        id: matched?._id || null,
        difficulty: matched?.difficulty || "Medium",
        topic: matched?.topic || activeTopic.name
      };
    });
  }, [activeTopic, questions]);

  if (!course || !activeTopic) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">Course or lesson not found.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={onBack}>
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--snx-border)]">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            iconLeft={FiArrowLeft}
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            All Courses
          </Button>
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {course.title}
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white truncate">
              {activeTopic.name}
            </h1>
          </div>
        </div>

        {/* Progress Badge & Mobile Curriculum Toggle */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {completedCount} / {totalTopics} Completed
            </span>
            <div className="w-32 mt-1">
              <Progress value={courseProgressPercent} max={100} size="sm" variant="primary" />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            iconLeft={mobileCurriculumOpen ? FiX : FiMenu}
            onClick={() => setMobileCurriculumOpen(!mobileCurriculumOpen)}
          >
            Lessons
          </Button>
        </div>
      </div>

      {/* Main Two-Column Learning Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-6 items-start">
        {/* Left Column: Curriculum Sidebar (Desktop & Mobile Drawer) */}
        <aside
          className={`space-y-4 md:sticky md:top-20 md:block ${
            mobileCurriculumOpen ? "block" : "hidden md:block"
          }`}
        >
          <Card className="p-4 border border-[var(--snx-border)] bg-[var(--snx-surface)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--snx-border)]">
              <div className="flex items-center gap-2">
                <FiBookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Course Modules
                </span>
              </div>
              <Badge variant="neutral" size="sm">
                {topics.length} Lessons
              </Badge>
            </div>

            <div className="mt-3 max-h-[calc(100vh-280px)] overflow-y-auto snx-scrollbar pr-1">
              <CourseCurriculum
                topics={topics}
                courseId={course.id}
                completedTopics={completedTopics}
                activeTopicIndex={activeTopicIndex}
                onSelectTopic={(idx) => {
                  onSelectTopic(idx);
                  setMobileCurriculumOpen(false);
                }}
              />
            </div>
          </Card>
        </aside>

        {/* Right Column: Active Lesson Content */}
        <main className="space-y-6 min-w-0">
          {/* Lesson Header Banner */}
          <Card className="p-6 border border-[var(--snx-border)] bg-[var(--snx-surface)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--snx-border)]">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    {activeTopic.level || "Standard"}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    Lesson {activeTopicIndex + 1} of {totalTopics}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1.5">
                  {activeTopic.name}
                </h2>
              </div>

              {/* Status and Action */}
              <div className="flex items-center gap-2">
                <Button
                  variant={isTopicCompleted ? "secondary" : "outline"}
                  size="sm"
                  iconLeft={FiCheckCircle}
                  className={isTopicCompleted ? "text-emerald-600 dark:text-emerald-400 font-bold" : ""}
                  onClick={() => onToggleComplete(course.id, activeTopic.name)}
                >
                  {isTopicCompleted ? "Completed ✓" : "Mark as Complete"}
                </Button>
              </div>
            </div>

            {/* Conceptual Guide & Notes */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <FiCompass className="h-4 w-4 text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Concept Overview & Cheat Sheet
                </h3>
              </div>

              <div className="rounded-xl p-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 border border-[var(--snx-border)]">
                <p className="whitespace-pre-line">{activeTopic.cheatSheet}</p>
              </div>
            </div>
          </Card>

          {/* Quick Revision Flashcards */}
          {activeTopic.revision && activeTopic.revision.length > 0 && (
            <Card className="p-6 border border-[var(--snx-border)] bg-[var(--snx-surface)]">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <FiBookOpen className="h-4 w-4 text-indigo-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Quick Revision Cards (Click to Reveal Answer)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  {activeTopic.revision.length} {activeTopic.revision.length === 1 ? "card" : "cards"}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {activeTopic.revision.map((item, idx) => {
                  const isFlipped = !!flippedCards[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => setFlippedCards((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                      className="cursor-pointer rounded-xl border border-[var(--snx-border)] p-4 transition-all duration-200 hover:border-indigo-400 bg-white dark:bg-slate-800/80 shadow-subtle min-h-[110px] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5">
                          <span>{isFlipped ? "Answer" : "Question"}</span>
                          <span className="text-slate-400 font-normal">Click to flip 🔄</span>
                        </div>
                        <p className={`text-xs ${isFlipped ? "text-emerald-700 dark:text-emerald-400 font-semibold" : "text-slate-800 dark:text-slate-200 font-medium"} leading-relaxed`}>
                          {isFlipped ? item.answer : item.question}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Check for Understanding: MCQs */}
          {activeTopic.mcqs && activeTopic.mcqs.length > 0 && (
            <Card className="p-6 border border-[var(--snx-border)] bg-[var(--snx-surface)]">
              <div className="flex items-center gap-2 mb-4">
                <FiHelpCircle className="h-4 w-4 text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Check Your Understanding
                </h3>
              </div>

              <div className="space-y-6">
                {activeTopic.mcqs.map((mcq, mcqIdx) => {
                  const isSubmitted = !!submittedMcqs[mcqIdx];
                  const selected = selectedMcqAnswers[mcqIdx];
                  const isCorrect = selected === mcq.correctAnswer;

                  return (
                    <div key={mcqIdx} className="rounded-xl border border-[var(--snx-border)] p-5 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {mcq.question}
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        {mcq.options.map((option, optIdx) => {
                          const isOptionSelected = selected === option;
                          let optionClasses = "border-[var(--snx-border)] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300";

                          if (isSubmitted) {
                            if (option === mcq.correctAnswer) {
                              optionClasses = "border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500";
                            } else if (isOptionSelected && !isCorrect) {
                              optionClasses = "border-rose-500 bg-rose-50 text-rose-950 dark:bg-rose-950/40 dark:text-rose-200 ring-1 ring-rose-500";
                            } else {
                              optionClasses = "opacity-50 border-[var(--snx-border)] bg-white dark:bg-slate-800";
                            }
                          } else if (isOptionSelected) {
                            optionClasses = "border-indigo-600 bg-indigo-50/80 text-indigo-950 dark:bg-indigo-950/60 dark:text-indigo-200 ring-2 ring-indigo-500/20 font-semibold";
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectMcq(mcqIdx, option)}
                              className={`p-3 text-left rounded-xl border text-xs transition-all duration-150 cursor-pointer ${optionClasses}`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {!isSubmitted ? (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={!selected}
                            onClick={() => handleCheckMcq(mcqIdx)}
                          >
                            Check Answer
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            {isCorrect ? (
                              <Badge variant="success" size="sm">
                                Correct ✓
                              </Badge>
                            ) : (
                              <Badge variant="danger" size="sm">
                                Incorrect
                              </Badge>
                            )}
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {mcq.explanation}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Hands-on Practice Connection */}
          {practiceProblems.length > 0 && (
            <Card className="p-6 border border-[var(--snx-border)] bg-[var(--snx-surface)]">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <FiCode className="h-4 w-4 text-indigo-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Practice This Concept
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  {practiceProblems.length} Problems Available
                </span>
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {practiceProblems.map((prob, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--snx-border)] bg-white dark:bg-slate-800/60 hover:border-indigo-400 transition-all"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {prob.title}
                      </div>
                      <Badge
                        variant={prob.difficulty === "Easy" ? "success" : prob.difficulty === "Medium" ? "warning" : "danger"}
                        size="sm"
                        className="mt-1"
                      >
                        {prob.difficulty}
                      </Badge>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      iconRight={FiExternalLink}
                      onClick={() => {
                        if (prob.id) {
                          navigate(`/practice/${prob.id}`);
                        } else {
                          navigate(`/practice`, { state: { search: prob.title } });
                        }
                      }}
                    >
                      Solve
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Topic Assessment / Mock Test Connection */}
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-purple-50/50 p-5 dark:border-indigo-900/40 dark:from-indigo-950/20 dark:to-purple-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Ready to test your understanding?
              </h4>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Put your knowledge of {activeTopic.name} to the test under realistic timed assessment conditions.
              </p>
            </div>
            <Link to="/mock-tests">
              <Button variant="primary" size="sm" iconRight={FiArrowRight} className="shrink-0">
                Take Mock Test
              </Button>
            </Link>
          </div>
        </main>
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <div className="sticky bottom-0 z-20 -mx-4 sm:-mx-6 -mb-6 px-4 sm:px-6 py-4 border-t border-[var(--snx-border)] bg-[var(--snx-surface)]/95 backdrop-blur-md shadow-elevated flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          iconLeft={FiArrowLeft}
          disabled={activeTopicIndex === 0}
          onClick={handlePrevTopic}
        >
          Previous Lesson
        </Button>

        <Button
          variant={isTopicCompleted ? "secondary" : "primary"}
          size="sm"
          iconLeft={FiCheckCircle}
          onClick={() => onToggleComplete(course.id, activeTopic.name)}
        >
          {isTopicCompleted ? "✓ Completed" : "Mark Complete"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          iconRight={FiArrowRight}
          disabled={activeTopicIndex >= totalTopics - 1}
          onClick={handleNextTopic}
        >
          Next Lesson
        </Button>
      </div>
    </div>
  );
};

export default LessonViewer;
