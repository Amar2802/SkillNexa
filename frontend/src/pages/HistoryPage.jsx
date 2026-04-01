const HistoryPage = ({ history = [] }) => {
  return (
    <div className="container py-4">
      <p className="eyebrow mb-1">History</p>
      <h1 className="h2 fw-bold mb-2">Past mock tests</h1>
      <p className="text-secondary mb-4">Review your earlier software mock tests and see how your scores change over time.</p>
      {history.length ? (
        <div className="vstack gap-3">
          {history.map((item) => (
            <div className="glass-card p-4" key={item._id}>
              <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                <div>
                  <h2 className="h4 mb-1">{item.test?.title || "Mock Test"}</h2>
                  <p className="text-secondary mb-0">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  <span className="badge text-bg-dark">Score {item.score || 0}</span>
                  <span className="badge text-bg-info">Accuracy {item.accuracy || 0}%</span>
                </div>
              </div>
              <div className="mt-3 text-secondary">Weak Topics: {(item.weakTopics || []).join(", ") || "None"}</div>
            </div>
          ))}
        </div>
      ) : <div className="glass-card p-4"><p className="text-secondary mb-0">No mock test history yet.</p></div>}
    </div>
  );
};

export default HistoryPage;
