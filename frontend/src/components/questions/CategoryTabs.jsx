import { FiGrid, FiCode, FiLayers, FiCheckSquare, FiUsers } from "react-icons/fi";

const CATEGORIES = [
  { id: "", label: "All Categories", icon: FiGrid },
  { id: "DSA", label: "DSA & Algorithms", icon: FiCode },
  { id: "Core Subjects", label: "Core CS & Systems", icon: FiLayers },
  { id: "Aptitude", label: "Aptitude & Logic", icon: FiCheckSquare },
  { id: "HR", label: "Behavioral & HR", icon: FiUsers }
];

export const CategoryTabs = ({
  activeCategory = "",
  onSelectCategory,
  categoryCounts = {}
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 snx-scrollbar">
      {CATEGORIES.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeCategory === tab.id;
        const count = tab.id === "" 
          ? Object.values(categoryCounts).reduce((a, b) => a + (Number(b) || 0), 0)
          : categoryCounts[tab.id] || 0;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectCategory(tab.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
              isActive
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 dark:bg-indigo-500"
                : "bg-[var(--snx-surface)] text-slate-600 border border-[var(--snx-border)] hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-white"
            }`}
          >
            <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
            <span>{tab.label}</span>
            {count > 0 && (
              <span
                className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-medium ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
