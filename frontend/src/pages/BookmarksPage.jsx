const BookmarksPage = ({ bookmarks }) => (
  <div className="container py-4">
    <p className="eyebrow mb-1">Saved Library</p>
    <h1 className="h2 fw-bold mb-4">Bookmarked questions</h1>
    <div className="row g-3">
      {bookmarks.map((q) => (
        <div className="col-lg-6" key={q._id}>
          <div className="card glass-card h-100"><div className="card-body"><h2 className="h5">{q.title}</h2><p className="text-secondary">{q.description}</p><div className="d-flex gap-2 flex-wrap"><span className="badge text-bg-dark">{q.topic}</span><span className="badge text-bg-secondary">{q.company}</span></div></div></div>
        </div>
      ))}
    </div>
  </div>
);

export default BookmarksPage;
