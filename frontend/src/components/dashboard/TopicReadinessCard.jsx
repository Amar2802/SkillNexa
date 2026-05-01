const TopicReadinessCard = ({ label, score, status }) => (
  <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
    <div className="mb-3 flex items-center justify-between gap-3">
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <span className="text-sm font-semibold text-brand-600">{score}%</span>
    </div>
    <div className="h-2 rounded-full bg-slate-200">
      <div className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-emerald-500" style={{ width: `${score}%` }} />
    </div>
    <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">{status}</p>
  </div>
);

export default TopicReadinessCard;
