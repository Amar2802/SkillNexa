import { useState, useMemo } from "react";
import { 
  FiAward, 
  FiCheckCircle, 
  FiLock, 
  FiCode, 
  FiBarChart2, 
  FiZap, 
  FiCompass, 
  FiTrendingUp,
  FiX
} from "react-icons/fi";
import Modal from "../ui/Modal";
import Progress from "../ui/Progress";
import Button from "../ui/Button";

const DEFINITIONS = [
  {
    id: "first_problem",
    title: "First Problem Solved",
    description: "Successfully solved your first programming or descriptive question on SkillNexa.",
    category: "Practice",
    icon: FiCode,
    target: 1,
    metric: "problems"
  },
  {
    id: "ten_problems",
    title: "Problem Solver (10+)",
    description: "Solved at least 10 technical questions across various difficulty levels.",
    category: "Practice",
    icon: FiCode,
    target: 10,
    metric: "problems"
  },
  {
    id: "fifty_problems",
    title: "Algorithm Centurion (50+)",
    description: "Solved 50 practice problems, building deep muscle memory across data structures.",
    category: "Practice",
    icon: FiCode,
    target: 50,
    metric: "problems"
  },
  {
    id: "first_test",
    title: "Exam Grounding",
    description: "Completed your first timed mock assessment under real test constraints.",
    category: "Testing",
    icon: FiBarChart2,
    target: 1,
    metric: "tests"
  },
  {
    id: "five_tests",
    title: "Assessment Veteran (5+)",
    description: "Completed 5 full-length mock exams to evaluate your score progression.",
    category: "Testing",
    icon: FiBarChart2,
    target: 5,
    metric: "tests"
  },
  {
    id: "first_interview",
    title: "AI Interviewee",
    description: "Completed a simulated technical and behavioral mock interview session.",
    category: "Interview",
    icon: FiZap,
    target: 1,
    metric: "interviews"
  },
  {
    id: "streak_7",
    title: "Weekly Consistency",
    description: "Maintained a continuous 7-day preparation streak on the platform.",
    category: "Learning",
    icon: FiTrendingUp,
    target: 7,
    metric: "streak"
  },
  {
    id: "roadmap_topics",
    title: "Curriculum Explorer",
    description: "Mastered at least 5 structured roadmap topics in algorithms or web technologies.",
    category: "Learning",
    icon: FiCompass,
    target: 5,
    metric: "topics"
  }
];

export const AchievementsSection = ({
  problemsSolved = 0,
  testsCompleted = 0,
  interviewsCompleted = 0,
  streakCount = 0,
  topicsCompleted = 0
}) => {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");

  const achievements = useMemo(() => {
    return DEFINITIONS.map((def) => {
      let current = 0;
      if (def.metric === "problems") current = problemsSolved;
      if (def.metric === "tests") current = testsCompleted;
      if (def.metric === "interviews") current = interviewsCompleted;
      if (def.metric === "streak") current = streakCount;
      if (def.metric === "topics") current = topicsCompleted;

      const isUnlocked = current >= def.target;
      const progressPct = Math.min(100, Math.round((current / def.target) * 100));

      return {
        ...def,
        current,
        isUnlocked,
        progressPct
      };
    });
  }, [problemsSolved, testsCompleted, interviewsCompleted, streakCount, topicsCompleted]);

  const filteredAchievements = useMemo(() => {
    if (categoryFilter === "all") return achievements;
    return achievements.filter((a) => a.category.toLowerCase() === categoryFilter.toLowerCase());
  }, [achievements, categoryFilter]);

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--snx-border-subtle)] dark:border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiAward className="h-4 w-4 text-amber-500" />
            <span>Developer Badges & Achievements</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Earned through verified problem practice, mock rounds, and consistent habits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:border-amber-900 dark:text-amber-400">
            {unlockedCount} of {achievements.length} Unlocked
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 snx-scrollbar">
        {["all", "Practice", "Testing", "Interview", "Learning"].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              categoryFilter === cat
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-[var(--snx-surface-subtle)] text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-[var(--snx-border)] dark:border-slate-800"
            }`}
          >
            {cat === "all" ? "All Badges" : cat}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
        {filteredAchievements.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedAchievement(item)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-3 transition duration-150 cursor-pointer ${
                item.isUnlocked
                  ? "border-amber-200 bg-amber-50/40 hover:border-amber-300 dark:border-amber-900/40 dark:bg-amber-950/20"
                  : "border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 opacity-80"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    item.isUnlocked
                      ? "bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-300"
                      : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.isUnlocked
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  }`}>
                    {item.isUnlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar for Locked */}
              {!item.isUnlocked && (
                <div className="space-y-1 pt-1 border-t border-[var(--snx-border-subtle)] dark:border-slate-800">
                  <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    <span>Progress</span>
                    <span className="font-mono">{item.current} / {item.target}</span>
                  </div>
                  <Progress value={item.progressPct} size="xs" variant="amber" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <Modal
          isOpen={Boolean(selectedAchievement)}
          onClose={() => setSelectedAchievement(null)}
          maxWidth="max-w-md"
          title={
            <div className="flex items-center gap-2">
              <FiAward className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Achievement Details
              </span>
            </div>
          }
          footer={
            <div className="flex justify-end w-full">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedAchievement(null)}
              >
                Close
              </Button>
            </div>
          }
        >
          <div className="text-center py-2 space-y-4">
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
              selectedAchievement.isUnlocked
                ? "bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-300"
                : "bg-slate-100 text-slate-400 dark:bg-slate-800"
            }`}>
              <selectedAchievement.icon className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {selectedAchievement.category} Milestone
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {selectedAchievement.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                {selectedAchievement.description}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status:</span>
                <span className={`font-bold ${selectedAchievement.isUnlocked ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                  {selectedAchievement.isUnlocked ? "Accomplished" : "In Progress"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Requirement:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {selectedAchievement.current} of {selectedAchievement.target} {selectedAchievement.metric}
                </span>
              </div>
              <Progress value={selectedAchievement.progressPct} size="sm" variant={selectedAchievement.isUnlocked ? "emerald" : "amber"} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AchievementsSection;
