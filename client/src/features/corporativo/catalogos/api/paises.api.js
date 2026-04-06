// client/src/features/corporativo/access/api/paises.api.js import http from "@/core/http/HttpClient.js"; /** * Cat谩logo de pa铆ses * Backend esperado: GET /api/catalogs/paises * Nota: "http" ya incluye baseURL (/api) en HttpClient. */ export async function listPaises(params = {}) { return http.get("/catalogs/paises", { params }); } 

