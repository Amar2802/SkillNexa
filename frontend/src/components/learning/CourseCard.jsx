import { Link } from "react-router-dom";
import { FiClock, FiBookOpen, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Progress from "../ui/Progress";

const difficultyVariantMap = {
  Easy: "success",
  Beginner: "success",
  Medium: "warning",
  Intermediate: "warning",
  Hard: "danger",
  Advanced: "danger"
};

export const CourseCard = ({
  course,
  isCompleted = false,
  completedTopicsCount = 0,
  onSelectCourse
}) => {
  if (!course) return null;

  const totalTopics = course.topics?.length || 0;
  const progressPercent = totalTopics > 0
    ? Math.round((completedTopicsCount / totalTopics) * 100)
    : 0;

  const isStarted = completedTopicsCount > 0;
  const badgeVariant = difficultyVariantMap[course.difficulty] || "primary";

  let ctaLabel = "Start Learning";
  if (progressPercent === 100) {
    ctaLabel = "Review Course";
  } else if (isStarted) {
    ctaLabel = "Continue";
  }

  const handleAction = () => {
    if (onSelectCourse) {
      onSelectCourse(course);
    }
  };

  return (
    <Card
      hover
      className="flex flex-col justify-between p-5 h-full transition-all duration-200 border border-[var(--snx-border)] bg-[var(--snx-surface)]"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <Badge variant={badgeVariant} size="sm">
            {course.difficulty || "All Levels"}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <FiClock className="h-3.5 w-3.5" />
            <span>{course.estimatedTime || "Self-paced"}</span>
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {course.title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Course Meta Info */}
        <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <FiBookOpen className="h-3.5 w-3.5 text-indigo-500" />
            <span>{totalTopics} {totalTopics === 1 ? "lesson" : "lessons"}</span>
          </div>
          {course.relatedTopics && course.relatedTopics.length > 0 && (
            <span className="truncate text-[11px] text-slate-400">
              • {course.relatedTopics.join(", ")}
            </span>
          )}
        </div>

        {/* Progress bar if started */}
        {isStarted && (
          <div className="mt-4 pt-3 border-t border-[var(--snx-border)]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {completedTopicsCount} / {totalTopics} completed
              </span>
              <span className={`text-xs font-bold ${progressPercent === 100 ? "text-emerald-500" : "text-indigo-600 dark:text-indigo-400"}`}>
                {progressPercent}%
              </span>
            </div>
            <Progress
              value={progressPercent}
              max={100}
              variant={progressPercent === 100 ? "success" : "primary"}
              size="sm"
            />
          </div>
        )}
      </div>

      <div className="mt-5 pt-3">
        <Button
          variant={progressPercent === 100 ? "secondary" : isStarted ? "primary" : "outline"}
          size="sm"
          className="w-full justify-center"
          iconRight={FiArrowRight}
          onClick={handleAction}
        >
          {ctaLabel}
        </Button>
      </div>
    </Card>
  );
};

export default CourseCard;
