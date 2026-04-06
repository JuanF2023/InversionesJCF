// client/src/features/corporativo/negocios/api/catalogoNegocios.api.js
import http from "@/core/http/HttpClient.js";

/**
 * API de catálogo de negocios.
 */
export async function getCatalogoNegocios() {
  const res = await http.get("/corporativo/catalogos/negocios");
  return res.data;
}