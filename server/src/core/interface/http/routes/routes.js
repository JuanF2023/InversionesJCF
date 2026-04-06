// server/src/core/interface/http/routes.js
import authRoutes from "#modules/auth/interface/http/routes/auth.routes.js";
import sessionsRoutes from "#modules/auth/interface/http/routes/sessions.routes.js";

export function mountRoutes(app) {
    app.use("/api/auth", authRoutes);
    app.use("/api/sessions", sessionsRoutes);
}

export default mountRoutes;