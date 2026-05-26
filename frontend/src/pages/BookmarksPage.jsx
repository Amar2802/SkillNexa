import { useNavigate } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";
import PageHeader from "../components/ui/PageHeader";
import SurfaceCard from "../components/ui/SurfaceCard";

const BookmarksPage = ({ bookmarks = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Bookmarks"
        title="Saved questions for focused revision."
        description="Revisit the interview questions you marked for review and jump back into related practice faster."
      />
      {bookmarks.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {bookmarks.map((question) => (
            <SurfaceCard key={question._id} className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="snx-badge">{question.category}</span>
                <span className="snx-badge">{question.topic}</span>
                <span className="snx-badge">{question.type}</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-950">{question.title.replace(/\s+Practice Variant\s+\d+$/i, "")}</h2>
              <p className="text-sm leading-7 text-slate-600">{String(question.description).replace(/\s*Practice focus\s*\d*:\s*.+$/i, "").trim()}</p>
              <button className="snx-btn-secondary" onClick={() => navigate(`/questions?topic=${encodeURIComponent(question.topic || "")}`)}>
                Open Related Questions
              </button>
            </SurfaceCard>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No bookmarks yet"
          description="Save interview questions from the question bank to build a personal revision shortlist."
        />
      )}
    </div>
  );
};

export default BookmarksPage;
