import { useState, useMemo } from "react";
import { FiLayers, FiSearch, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import Progress from "../ui/Progress";

export const SkillPerformanceSection = ({
  topicStats = []
}) => {
  const [search, setSearch] = useState("");

  const filteredTopics = useMemo(() => {
    if (!search.trim()) return topicStats;
    const q = search.toLowerCase();
    return topicStats.filter((t) => t.topic.toLowerCase().includes(q));
  }, [topicStats, search]);

  return (
    <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[var(--snx-border-subtle)] dark:border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FiLayers className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Skill & Topic Accuracy</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Success rates based on verified questions and assessments attempted.
          </p>
        </div>

        {topicStats.length > 4 && (
          <div className="w-full sm:w-56">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topic..."
              className="w-full h-8 px-2.5 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredTopics.map((item, idx) => {
            const accuracy = Math.round(item.accuracy || item.score || 0);
            const variant = accuracy >= 75 ? "emerald" : accuracy >= 60 ? "indigo" : "amber";
            const statusLabel = accuracy >= 75 ? "Proficient" : accuracy >= 60 ? "Consistent" : "Needs Review";

            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800/80 space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                    {item.topic}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                      accuracy >= 75
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                        : accuracy >= 60
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                    }`}>
                      {statusLabel}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {accuracy}%
                    </span>
                  </div>
                </div>

                <Progress value={accuracy} size="sm" variant={variant} />

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <span>{item.total ? `${item.correct || 0} / ${item.total} correct` : `${item.count || 1} evaluations`}</span>
                  <Link
                    to={`/questions?topic=${encodeURIComponent(item.topic)}`}
                    className="text-indigo-600 hover:underline dark:text-indigo-400 font-medium inline-flex items-center gap-0.5"
                  >
                    <span>Practice topic</span>
                    <FiArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center rounded-xl border border-dashed border-[var(--snx-border)] text-xs text-slate-400 dark:border-slate-800">
          {topicStats.length === 0
            ? "No topic-level performance data yet. Start solving questions in the Question Bank or take a Mock Test."
            : "No topics match your search query."}
        </div>
      )}
    </div>
  );
};

export default SkillPerformanceSection;
