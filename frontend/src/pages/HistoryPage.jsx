import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import SurfaceCard from "../components/ui/SurfaceCard";

const HistoryPage = ({ history = [] }) => {
  return (
    <div className="space-y-6">
      <PageHeader
        kicker="History"
        title="Past mock tests and score progression."
        description="Review previous software mock rounds, compare outcomes, and understand how your preparation trend is evolving."
      />
      {history.length ? (
        <div className="space-y-4">
          {history.map((item) => (
            <SurfaceCard key={item._id} className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">{item.test?.title || "Mock Test"}</h2>
                  <p className="mt-2 text-sm text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="snx-badge">Score {item.score || 0}</span>
                  <span className="snx-badge">Accuracy {item.accuracy || 0}%</span>
                </div>
              </div>
              <div className="text-sm text-slate-600">Weak Topics: {(item.weakTopics || []).join(", ") || "None"}</div>
            </SurfaceCard>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No mock test history yet"
          description="Generate and submit your first mock test to start building a visible performance timeline."
        />
      )}
    </div>
  );
};

export default HistoryPage;
