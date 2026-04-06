// client/src/features/corporativo/negocios/api/businesses.api.js
import http from "@/core/http/HttpClient.js";

/**
 * API de negocios.
 */
export async function getBusinesses(params = {}) {
  const res = await http.get("/corporativo/businesses", { params });
  return res.data;
}

export async function getBusinessById(id) {
  const res = await http.get(`/corporativo/businesses/${id}`);
  return res.data;
}

export async function createBusiness(payload) {
  const res = await http.post("/corporativo/businesses", payload);
  return res.data;
}

export async function updateBusiness(id, payload) {
  const res = await http.patch(`/corporativo/businesses/${id}`, payload);
  return res.data;
}

export async function deleteBusiness(id) {
  const res = await http.delete(`/corporativo/businesses/${id}`);
  return res.data;
}