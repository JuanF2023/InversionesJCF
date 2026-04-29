// client/src/features/corporativo/negocios/api/businessTypes.api.js
import http from "@/core/http/HttpClient.js";

export function normalizeError(error, fallbackMessage) {
  const status = error?.response?.status;
  const data = error?.response?.data || {};

  const normalizedError = new Error(
    data?.message || data?.error || fallbackMessage
  );

  normalizedError.status = status;
  normalizedError.serverData = data;

  throw normalizedError;
}

export async function listBusinessTypes(params = {}) {
  try {
    const response = await http.get("/business-types", { params });
    return response.data;
  } catch (error) {
    normalizeError(error, "Error listando tipos de negocio");
  }
}

export async function createBusinessType(payload) {
  try {
    const response = await http.post("/business-types", payload);
    return response.data;
  } catch (error) {
    normalizeError(error, "Error creando tipo de negocio");
  }
}

export async function ensureBusinessType(payload) {
  try {
    const response = await http.post("/business-types/ensure", payload);
    return response.data;
  } catch (error) {
    normalizeError(error, "Error asegurando tipo de negocio");
  }
}

export default {
  normalizeError,
  listBusinessTypes,
  createBusinessType,
  ensureBusinessType,
};
