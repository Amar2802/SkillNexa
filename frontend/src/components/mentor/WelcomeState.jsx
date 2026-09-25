import { FiBookOpen, FiCode, FiHelpCircle, FiZap, FiCalendar, FiCpu } from "react-icons/fi";
import Card from "../ui/Card";
import SuggestedPrompts from "./SuggestedPrompts";

const CAPABILITIES = [
  {
    title: "Learn Concepts",
    description: "Deep dive into algorithms, system design, and language runtimes with clear mental models.",
    icon: FiBookOpen,
    mode: "general",
    color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60"
  },
  {
    title: "Debug Code",
    description: "Analyze tricky error messages, memory leaks, and off-by-one boundary failures.",
    icon: FiCode,
    mode: "debug",
    color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60"
  },
  {
    title: "Progressive Hints",
    description: "Get layered DSA guidance that leads you to the answer without spoiling the code.",
    icon: FiHelpCircle,
    mode: "hint",
    color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60"
  },
  {
    title: "Interview Prep",
    description: "Practice answering behavioral and technical questions under realistic evaluation criteria.",
    icon: FiZap,
    mode: "interview",
    color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60"
  },
  {
    title: "Study Plans",
    description: "Generate structured timelines with milestone targets and recommended problem sets.",
    icon: FiCalendar,
    mode: "plan",
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60"
  }
];

export const WelcomeState = ({ onSelectPrompt, onSelectMode }) => {
  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto">
      {/* Hero Welcome Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md mx-auto mb-2">
          <FiCpu className="h-6 w-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          What are you working on today?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Your personal engineering mentor for understanding complex concepts, progressive DSA hints, code debugging, and interview preparation.
        </p>
      </div>

      {/* Capability Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((cap) => {
          const Icon = cap.icon;
          return (
            <Card
              key={cap.title}
              hover
              onClick={() => onSelectMode && onSelectMode(cap.mode)}
              className="p-4 border border-[var(--snx-border)] bg-[var(--snx-surface)] cursor-pointer transition-all duration-150 flex flex-col justify-between"
            >
              <div>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cap.color} mb-3`}>
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {cap.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Suggested Prompts */}
      <div className="pt-4 border-t border-[var(--snx-border)]">
        <SuggestedPrompts onSelectPrompt={onSelectPrompt} />
      </div>
    </div>
  );
};

export default WelcomeState;
