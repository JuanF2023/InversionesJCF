// server/src/core/interface/http/errors.js
export function mountErrors(app) {
  app.use((req, res) => {
    return res.status(404).json({ ok: false, message: "Not Found", path: req.originalUrl });
  });

  app.use((err, _req, res, _next) => {
    const status =
      err.status ||
      err.statusCode ||
      (String(err.message || "").includes("CORS") ? 403 : 500);

    if (status >= 500) console.error("?? Error:", err);

    return res.status(status).json({
      ok: false,
      message: err.message || "Server error",
      status,
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
  });
}
