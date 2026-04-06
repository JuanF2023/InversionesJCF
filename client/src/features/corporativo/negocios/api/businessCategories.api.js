// client/src/features/corporativo/negocios/api/businessCategories.api.js
import http from "@/core/http/HttpClient.js";

/**
 * API de categorías de negocio.
 */
export async function getBusinessCategories() {
  const res = await http.get("/corporativo/catalogos/negocios");
  return res.data;
}