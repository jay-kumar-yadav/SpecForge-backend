
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (statusCode >= 500) {
    console.error(`[${new Date().toISOString()}]`, err);
  }

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : message,
  });
}

function notFound(req, res) {
  res.status(404).json({ success: false, message: "Route not found." });
}

module.exports = { errorHandler, notFound };
