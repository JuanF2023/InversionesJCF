export default function errorHandler(err, _req, res, _next) {
  console.error("‚ù?API Error:", err);
  const status = err.status || 500;
  res.status(status).json({ ok: false, error: err.message || "Internal Server Error" });
}
