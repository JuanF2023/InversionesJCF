// server/src/core/interface/http/security.js
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

/**
 * Aplica seguridad HTTP transversal (helmet + cors + rate limit)
 * Nota: No contiene lógica de dominio.
 */
export function applyHttpSecurity(app) {
  /* Seguridad */
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  /* CORS */
  const allowedOrigins = [
    /^http:\/\/localhost:(5173|5174|5175|5176|5177)$/,
    /^http:\/\/127\.0\.0\.1:(5173|5174|5175|5176|5177)$/,
  ];

  if (process.env.WEB_ORIGIN) {
    const esc = process.env.WEB_ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    allowedOrigins.push(new RegExp(`^${esc}$`));
  }

  const corsOpts = {
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      const ok = allowedOrigins.some((re) => re.test(origin));
      if (ok) return cb(null, true);
      console.warn("CORS blocked:", origin);
      return cb(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "x-business-id",
      "x-tenant-id",     // ✅ FIX: habilita multi-tenant
      "x-device-label",
      "x-session-token",
      "x-request-id",    // ✅ opcional, pero recomendado
    ],
    exposedHeaders: ["Content-Disposition", "x-request-id"],
  };

  app.use(cors(corsOpts));
  app.options("*", cors(corsOpts));

  /* Rate limit para /api/auth */
  const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/auth", authLimiter);
}