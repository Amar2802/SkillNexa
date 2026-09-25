import { FiCheckCircle, FiAlertCircle, FiArrowRight, FiTarget, FiAward } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

export const StrengthsAndWeakAreas = ({
  strengths = [],
  weakAreas = []
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Strengths Card */}
      <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--snx-border-subtle)] dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <FiAward className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Demonstrated Strengths
            </h3>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            {strengths.length} {strengths.length === 1 ? "topic" : "topics"}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Topics where your accuracy consistently exceeds 70% in practice and assessments.
        </p>

        {strengths.length > 0 ? (
          <div className="space-y-2 pt-1">
            {strengths.map((item, idx) => {
              const name = typeof item === "string" ? item : item.topic;
              const accuracy = typeof item === "object" ? item.accuracy || item.score : null;

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-emerald-100 bg-emerald-50/50 dark:border-emerald-950/60 dark:bg-emerald-950/20 text-xs text-emerald-950 dark:text-emerald-200"
                >
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-semibold">{name}</span>
                  </div>
                  {accuracy !== null && (
                    <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      {Math.round(accuracy)}% accuracy
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl border border-dashed border-[var(--snx-border)] text-xs text-slate-400 dark:border-slate-800">
            Complete additional problems and test rounds to establish verified strengths.
          </div>
        )}
      </div>

      {/* Weak Areas / Needs More Practice */}
      <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[var(--snx-border-subtle)] dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <FiTarget className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Needs More Practice
            </h3>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            {weakAreas.length} {weakAreas.length === 1 ? "focus area" : "focus areas"}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Identified priority concepts where targeted practice will yield the highest performance gains.
        </p>

        {weakAreas.length > 0 ? (
          <div className="space-y-2 pt-1">
            {weakAreas.map((item, idx) => {
              const name = typeof item === "string" ? item : item.topic;
              const accuracy = typeof item === "object" ? item.accuracy || item.score : null;

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl border border-amber-100 bg-amber-50/50 dark:border-amber-950/60 dark:bg-amber-950/20 text-xs text-amber-950 dark:text-amber-200"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FiAlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="font-semibold truncate">{name}</span>
                    {accuracy !== null && (
                      <span className="font-mono text-[11px] text-amber-700 dark:text-amber-400">
                        ({Math.round(accuracy)}%)
                      </span>
                    )}
                  </div>

                  <Link to={`/questions?topic=${encodeURIComponent(name)}`}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="!h-6 !text-[11px] !px-2 inline-flex items-center gap-1 shrink-0"
                    >
                      <span>Practice</span>
                      <FiArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl border border-dashed border-[var(--snx-border)] text-xs text-slate-400 dark:border-slate-800">
            No critical weak areas identified yet. As you attempt tests, areas needing improvement will appear here.
          </div>
        )}
      </div>
    </div>
  );
};

export default StrengthsAndWeakAreas;
