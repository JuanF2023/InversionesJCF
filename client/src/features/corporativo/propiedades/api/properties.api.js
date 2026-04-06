// client/src/features/corporativo/propiedades/api/properties.api.js
import http from "@/core/http/HttpClient.js";

function normalizeError(error, fallbackMsg) {
    const status = error?.response?.status;
    const data = error?.response?.data || {};
    const err = new Error(data?.message || data?.error || fallbackMsg);
    err.status = status;
    err.serverData = data;
    throw err;
}

export async function getProperties(params = {}) {
    try {
        const res = await http.get("/corporativo/propiedades", { params });
        return res.data;
    } catch (error) {
        normalizeError(error, "Error cargando propiedades");
    }
}

export async function getPropertyById(id) {
    try {
        const safeId = String(id || "").trim();
        const res = await http.get(`/corporativo/propiedades/${safeId}`);
        return res.data;
    } catch (error) {
        normalizeError(error, "Error cargando propiedad");
    }
}

export async function createProperty(payload) {
    try {
        const res = await http.post("/corporativo/propiedades", payload);
        return res.data;
    } catch (error) {
        normalizeError(error, "Error creando propiedad");
    }
}

export async function updateProperty(id, payload) {
    try {
        const safeId = String(id || "").trim();
        const res = await http.patch(`/corporativo/propiedades/${safeId}`, payload);
        return res.data;
    } catch (error) {
        normalizeError(error, "Error actualizando propiedad");
    }
}

export async function deleteProperty(id) {
    try {
        const safeId = String(id || "").trim();
        const res = await http.delete(`/corporativo/propiedades/${safeId}`);
        return res.data;
    } catch (error) {
        normalizeError(error, "Error eliminando propiedad");
    }
}

export default { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty };

