import SurfaceCard from "./ui/SurfaceCard";

const AnswerAnalysisSkeleton = () => (
  <SurfaceCard className="mt-4 animate-pulse">
    <div className="space-y-3">
      <div className="h-3 w-32 rounded-full bg-slate-200" />
      <div className="h-4 w-full rounded-full bg-slate-200" />
      <div className="h-4 w-5/6 rounded-full bg-slate-200" />
      <div className="h-4 w-2/3 rounded-full bg-slate-200" />
    </div>
  </SurfaceCard>
);

const AnswerAnalysisBlock = ({ analysis, loading }) => {
  if (loading) return <AnswerAnalysisSkeleton />;
  if (!analysis) return null;

  const isCorrect = String(analysis.verdict || "").toLowerCase() === "correct";

  return (
    <SurfaceCard className="mt-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <span className="snx-kicker">Answer analysis</span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
          isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
        }`}>
          {analysis.verdict}
        </span>
      </div>
      <div className="space-y-4 text-sm leading-6 text-slate-600">
        {analysis.suggestedAnswer ? (
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Suggested answer you can give</div>
            <p className="mt-2">{analysis.suggestedAnswer}</p>
          </div>
        ) : null}
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Why the correct answer is right</div>
          <p className="mt-2">{analysis.whyCorrect}</p>
        </div>
        {!isCorrect && analysis.whyWrong ? (
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Why your answer was wrong</div>
            <p className="mt-2">{analysis.whyWrong}</p>
          </div>
        ) : null}
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Key concept</div>
          <p className="mt-2">{analysis.concept}</p>
        </div>
      </div>
    </SurfaceCard>
  );
};

export default AnswerAnalysisBlock;
