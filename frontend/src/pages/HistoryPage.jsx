import { useNavigate } from "react-router-dom";

const HistoryPage = ({ history = [] }) => {
  const navigate = useNavigate();

  const openHistoryItem = (result) => {
    const firstWeakTopic = result?.weakTopics?.[0];
    if (firstWeakTopic) {
      const params = new URLSearchParams({ topic: firstWeakTopic });
      navigate(`/questions?${params.toString()}`);
      return;
    }

    navigate("/mock-tests");
  };

  return (
    <div className="container py-4">
      <p className="eyebrow mb-1">Attempt History</p>
      <h1 className="h2 fw-bold mb-4">Past tests and evaluations</h1>
      {history.length ? (
        <div className="vstack gap-3">
          {history.map((r) => (
            <button type="button" className="card glass-card history-link-card" key={r._id} onClick={() => openHistoryItem(r)}>
              <div className="card-body text-start">
                <div className="d-flex justify-content-between flex-wrap gap-2">
                  <div>
                    <h2 className="h5 mb-1">{r.test?.title || "Practice Session"}</h2>
                    <p className="mb-0 text-secondary">Accuracy: {r.accuracy}% | Score: {r.score}</p>
                  </div>
                  <span className="badge text-bg-info align-self-start">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-3"><strong>Weak topics:</strong> {r.weakTopics?.length ? r.weakTopics.join(", ") : "None"}</div>
                <p className="mt-3 mb-0 text-secondary">Click to review the most relevant topic from this attempt.</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="card glass-card">
          <div className="card-body">
            <p className="text-secondary mb-0">No past tests are showing yet. Complete one mock test and it will appear here automatically.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
