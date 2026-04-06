// client/src/features/corporativo/negocios/api/businessesSummary.api.js
import http from "@/core/http/HttpClient.js";

/**
 * API de resumen de negocios.
 */
export async function getBusinessesSummary() {
  const res = await http.get("/corporativo/businesses/summary");
  return res.data;
}