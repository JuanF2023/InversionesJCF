// client/src/services/api/businessTypes.api.js
import http from "@/core/http/HttpClient.js";

export const listBusinessTypes = (params) =>
  http.get("/api/business-types", { params }).then(r => r.data);

export const createBusinessType = (payload) =>
  http.post("/api/business-types", payload).then(r => r.data);

// (Opcional)
export const getBusinessType = (id) =>
  http.get(`/api/business-types/${id}`).then(r => r.data);

export const updateBusinessType = (id, payload) =>
  http.put(`/api/business-types/${id}`, payload).then(r => r.data);

export const deleteBusinessType = (id) =>
  http.delete(`/api/business-types/${id}`).then(r => r.data);



