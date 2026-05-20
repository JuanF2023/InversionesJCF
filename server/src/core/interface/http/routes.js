// server/src/core/interface/http/routes.js

/**
 * HTTP Routes Mount Adapter
 * -------------------------------------------------------
 * Este archivo es el único responsable de conectar Express (app)
 * con el router principal del sistema.
 *
 * ❗ No define rutas
 * ❗ No contiene lógica de negocio
 * ✔ Solo monta el router principal
 */

import mainRouter from "./routes/routes.js";

/**
 * Monta todas las rutas del sistema bajo /api
 * @param {import("express").Express} app
 */
export function mountRoutes(app) {
    if (!app) {
        throw new Error("[mountRoutes] app is required");
    }

    // Base API path
    app.use("/api", mainRouter);
}

export default mountRoutes;