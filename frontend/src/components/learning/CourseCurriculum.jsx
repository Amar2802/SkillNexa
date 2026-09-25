import { FiCheckCircle, FiClock, FiCircle } from "react-icons/fi";
import Badge from "../ui/Badge";

export const CourseCurriculum = ({
  topics = [],
  courseId,
  completedTopics = [],
  activeTopicIndex = 0,
  onSelectTopic
}) => {
  if (!topics || topics.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-500">
        No curriculum modules available.
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {topics.map((topic, index) => {
        const topicId = `${courseId}:${topic.name}`;
        const isCompleted = completedTopics.includes(topicId);
        const isActive = activeTopicIndex === index;
        const indexStr = String(index + 1).padStart(2, "0");

        return (
          <button
            key={topic.name || index}
            type="button"
            onClick={() => onSelectTopic && onSelectTopic(index)}
            className={`w-full text-left p-3 rounded-xl transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
              isActive
                ? "bg-indigo-50/80 text-indigo-950 border border-indigo-200 shadow-sm dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-800/60 font-semibold"
                : "hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/60"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xs font-mono font-bold text-slate-400 shrink-0">
                {indexStr}
              </span>
              <div className="min-w-0">
                <div className="text-xs truncate font-medium">
                  {topic.name}
                </div>
                {topic.level && (
                  <span className="text-[10px] text-slate-400 capitalize">
                    {topic.level}
                  </span>
                )}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1.5">
              {isCompleted ? (
                <FiCheckCircle className="h-4 w-4 text-emerald-500" />
              ) : isActive ? (
                <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
              ) : (
                <FiCircle className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CourseCurriculum;
