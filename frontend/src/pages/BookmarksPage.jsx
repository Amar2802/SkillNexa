import { useNavigate } from "react-router-dom";

const BookmarksPage = ({ bookmarks = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <div className="hero-panel mb-4">
        <p className="eyebrow mb-2">Bookmarks</p>
        <h1 className="h2 fw-bold mb-2">Saved questions</h1>
        <p className="text-secondary mb-0">Revisit the interview questions you marked for revision and jump back into practice faster.</p>
      </div>
      {bookmarks.length ? (
        <div className="row g-4">
          {bookmarks.map((question) => (
            <div className="col-12 col-lg-6" key={question._id}>
              <div className="glass-card p-4 h-100">
                <div className="d-flex gap-2 flex-wrap mb-3">
                  <span className="badge text-bg-dark">{question.category}</span>
                  <span className="badge text-bg-dark">{question.topic}</span>
                  <span className="badge text-bg-info">{question.type}</span>
                </div>
                <h2 className="h4 mb-2">{question.title.replace(/\s+Practice Variant\s+\d+$/i, "")}</h2>
                <p className="text-secondary mb-3">{String(question.description).replace(/\s*Practice focus\s*\d*:\s*.+$/i, "").trim()}</p>
                <button
                  className="btn btn-outline-light"
                  onClick={() => navigate(`/questions?topic=${encodeURIComponent(question.topic || "")}`)}
                >
                  Open Related Questions
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : <div className="glass-card p-4"><p className="text-secondary mb-0">You have not bookmarked any questions yet.</p></div>}
    </div>
  );
};

export default BookmarksPage;
