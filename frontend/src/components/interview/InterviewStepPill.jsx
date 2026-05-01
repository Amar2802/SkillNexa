const InterviewStepPill = ({ index, title, active, complete }) => (
  <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
    active
      ? "border-brand-200 bg-brand-50"
      : complete
        ? "border-emerald-200 bg-emerald-50"
        : "border-slate-200 bg-white"
  }`}>
    <div className={`flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-semibold ${
      complete ? "bg-emerald-500 text-white" : active ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-500"
    }`}>
      {complete ? "✓" : index}
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="text-xs text-slate-500">{active ? "Current step" : complete ? "Completed" : "Pending"}</p>
    </div>
  </div>
);

export default InterviewStepPill;
