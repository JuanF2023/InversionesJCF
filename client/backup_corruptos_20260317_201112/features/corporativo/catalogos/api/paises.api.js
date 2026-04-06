// client/src/features/corporativo/access/api/paises.api.js
import http from "@/services/api/HttpClient.js";

/**
 * Catálogo de países
 * Backend esperado: GET /api/catalogs/paises
 * Nota: "http" ya incluye baseURL (/api) en HttpClient.
 */
export async function listPaises(params = {}) {
    return http.get("/catalogs/paises", { params });
}


