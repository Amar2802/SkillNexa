import { FiCheckCircle, FiClock, FiArrowRight, FiCircle } from "react-icons/fi";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const levelOrder = ["Beginner", "Intermediate", "Advanced"];

export const RoadmapProgressionTree = ({
  roadmap,
  completedTopics = [],
  activeTopicName = null,
  onSelectTopic,
  onToggleComplete
}) => {
  if (!roadmap || !roadmap.topics) return null;

  const isCompleted = (topicName) => {
    return completedTopics.includes(`${roadmap.id}:${topicName}`);
  };

  return (
    <div className="space-y-8 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
      {levelOrder.map((level) => {
        const levelTopics = roadmap.topics.filter((t) => t.level === level);
        if (levelTopics.length === 0) return null;

        return (
          <div key={level} className="space-y-3 relative">
            {/* Level Milestone Badge */}
            <div className="flex items-center gap-3 ml-10">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
                {level} Level
              </span>
            </div>

            {/* Topic Nodes */}
            <div className="space-y-2.5">
              {levelTopics.map((topic) => {
                const done = isCompleted(topic.name);
                const isActive = activeTopicName === topic.name;

                return (
                  <div key={topic.name} className="flex items-center gap-3">
                    {/* Node Checkpoint Circle */}
                    <button
                      type="button"
                      onClick={() => onToggleComplete && onToggleComplete(roadmap.id, topic.name)}
                      className={`z-10 flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200 ml-2 ${
                        done
                          ? "border-emerald-500 bg-emerald-500 text-white shadow-subtle"
                          : "border-slate-300 bg-white hover:border-emerald-500 dark:border-slate-600 dark:bg-slate-800"
                      }`}
                      title={done ? "Mark incomplete" : "Mark completed"}
                    >
                      {done ? (
                        <span className="text-[10px] font-black">✓</span>
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      )}
                    </button>

                    {/* Topic Card */}
                    <div
                      onClick={() => onSelectTopic && onSelectTopic(topic)}
                      className={`flex-1 p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${
                        isActive
                          ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20 shadow-sm"
                          : "border-[var(--snx-border)] bg-[var(--snx-surface)] hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {topic.name}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                          <FiClock className="h-3 w-3" />
                          <span>2-4 Hours</span>
                          {topic.questions && topic.questions.length > 0 && (
                            <>
                              <span>•</span>
                              <span>{topic.questions.length} problems</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {done ? (
                          <Badge variant="success" size="sm">
                            Completed
                          </Badge>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                            iconRight={FiArrowRight}
                          >
                            Explore
                          </Button>
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
  );
};

export default RoadmapProgressionTree;
