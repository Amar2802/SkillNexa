import { FiArrowUpRight } from "react-icons/fi";

const DEFAULT_PROMPTS = [
  { label: "Explain binary search simply", mode: "general" },
  { label: "Give me a progressive hint for Two Sum", mode: "hint" },
  { label: "Debug this JavaScript memory leak or loop bug", mode: "debug" },
  { label: "Conduct a 5-minute React & Hooks mock interview", mode: "interview" },
  { label: "Create a 30-day DSA study roadmap for interviews", mode: "plan" },
  { label: "Explain Time and Space Complexity with Big-O examples", mode: "general" }
];

export const SuggestedPrompts = ({ onSelectPrompt, customPrompts }) => {
  const prompts = customPrompts || DEFAULT_PROMPTS;

  return (
    <div className="space-y-2">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        Suggested Developer Prompts
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(p.label, p.mode)}
            className="flex items-center justify-between p-3 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] hover:border-indigo-400 hover:shadow-subtle transition-all text-left text-xs font-medium text-slate-700 dark:text-slate-300 group cursor-pointer"
          >
            <span className="line-clamp-2 pr-2">{p.label}</span>
            <FiArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPrompts;
