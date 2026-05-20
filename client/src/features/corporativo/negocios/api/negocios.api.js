// client/src/features/corporativo/negocios/api/negocios.api.js
import http from "@/core/http/HttpClient.js";

function normalizeError(error, fallbackMessage) {
  const status = error?.response?.status;
  const data = error?.response?.data || {};

  const normalizedError = new Error(
    data?.message || data?.error || fallbackMessage
  );

  normalizedError.status = status;
  normalizedError.serverData = data;

  throw normalizedError;
}

function normalizeId(id) {
  return String(id || "").trim();
}

export async function getNegocios(params = {}) {
  try {
    const response = await http.get("/corporativo/negocios", { params });
    return response.data;
  } catch (error) {
    normalizeError(error, "Error cargando negocios");
  }
}

export async function getNegocioById(id) {
  try {
    const safeId = normalizeId(id);
    const response = await http.get(`/corporativo/negocios/${safeId}`);
    return response.data;
  } catch (error) {
    normalizeError(error, "Error cargando negocio");
  }
}

export async function createNegocio(payload) {
  try {
    const response = await http.post("/corporativo/negocios", payload);
    return response.data;
  } catch (error) {
    normalizeError(error, "Error creando negocio");
  }
}

export async function updateNegocio(id, payload) {
  try {
    const safeId = normalizeId(id);
    const response = await http.patch(`/corporativo/negocios/${safeId}`, payload);
    return response.data;
  } catch (error) {
    normalizeError(error, "Error actualizando negocio");
  }
}

export async function deleteNegocio(id) {
  try {
    const safeId = normalizeId(id);
    const response = await http.delete(`/corporativo/negocios/${safeId}`);
    return response.data;
  } catch (error) {
    normalizeError(error, "Error eliminando negocio");
  }
}
