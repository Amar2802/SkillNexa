export const notFound = (req, res) => {
  res.status(404).json({ message: `Not found: ${req.originalUrl}`, code: "NOT_FOUND" });
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || err.status || 500;
  const code = err.code || "SERVER_ERROR";
  res.status(statusCode).json({ message: err.message || "Server error", code });
};
