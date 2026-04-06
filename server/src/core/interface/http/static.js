// server/src/core/interface/http/static.js
import express from "express";
import { getUploadsDir } from "#modules/corporativo/infrastructure/services/media.service.js";

export function mountStatic(app) {
  const uploadsStatic = express.static(getUploadsDir(), {
    etag: true,
    maxAge: "7d",
    immutable: false,
    fallthrough: true,
    setHeaders(res) {
      res.setHeader("Vary", "Origin");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  });

  app.use("/uploads", uploadsStatic);
  app.use("/api/uploads", uploadsStatic);
}
