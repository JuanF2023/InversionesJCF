// client/src/services/api/properties.api.js
import { api } from "./api.js";

// Tu backend expone: /api/properties
export const listProperties = (params = {}) =>
  api.get("/properties", params);

export const getProperty = (id) =>
  api.get(`/properties/${id}`);

export const createProperty = (payload) =>
  api.post("/properties", payload);

export const updateProperty = (id, payload) =>
  api.put(`/properties/${id}`, payload);

export const deleteProperty = (id) =>
  api.delete(`/properties/${id}`);
