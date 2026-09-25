import { FiTarget, FiArrowRight, FiCheckCircle, FiCompass, FiZap, FiBarChart2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

export const RecommendedActionsSection = ({
  weakAreas = [],
  testsCount = 0,
  interviewsCount = 0,
  roadmapCompletion = 0
}) => {
  const recommendations = [];

  // 1. Weak topic action
  if (weakAreas.length > 0) {
    const topWeak = typeof weakAreas[0] === "string" ? weakAreas[0] : weakAreas[0].topic;
    recommendations.push({
      title: `Practice ${topWeak}`,
      description: `Target your verified focus area with curated practice problems and instant feedback.`,
      actionText: `Practice ${topWeak}`,
      link: `/questions?topic=${encodeURIComponent(topWeak)}`,
      icon: FiTarget,
      badge: "Highest Priority",
      variant: "amber"
    });
  }

  // 2. Mock Test Action
  if (testsCount < 3) {
    recommendations.push({
      title: "Take a Full Mock Assessment",
      description: "Measure your timed problem-solving under real exam conditions to establish a baseline.",
      actionText: "Start Mock Test",
      link: "/mock-tests",
      icon: FiBarChart2,
      badge: "Assessment",
      variant: "sky"
    });
  }

  // 3. Interview Action
  if (interviewsCount === 0) {
    recommendations.push({
      title: "Run Your First AI Mock Interview",
      description: "Experience realistic technical and behavioral questions with instant rubric evaluation.",
      actionText: "Start Interview",
      link: "/ai-interviewer",
      icon: FiZap,
      badge: "Interview Prep",
      variant: "purple"
    });
  }

  // 4. Roadmap Action
  if (roadmapCompletion < 100) {
    recommendations.push({
      title: "Advance Your Learning Roadmap",
      description: "Complete modular topics in Data Structures, Algorithms, or System Design.",
      actionText: "Open Roadmaps",
      link: "/roadmaps",
      icon: FiCompass,
      badge: "Curriculum",
      variant: "emerald"
    });
  }

  // Ensure at least 2 recommendations
  const activeRecommendations = recommendations.slice(0, 3);

  return (
    <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--snx-border-subtle)] dark:border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiTarget className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Recommended Next Actions</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Data-backed steps to target your highest-leverage preparation priorities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
        {activeRecommendations.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.variant === "amber" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300" :
                    item.variant === "sky" ? "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300" :
                    item.variant === "purple" ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300" :
                    "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  }`}>
                    {item.badge}
                  </span>
                  <Icon className="h-4 w-4 text-slate-400" />
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2">
                <Link to={item.link}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full !h-8 !text-xs inline-flex items-center justify-center gap-1.5"
                  >
                    <span>{item.actionText}</span>
                    <FiArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedActionsSection;
