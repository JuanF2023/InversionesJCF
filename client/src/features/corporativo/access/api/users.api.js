// client/src/features/corporativo/access/api/users.api.js
import http from "@/core/http/HttpClient.js";

function normalizeError(error, fallbackMsg = "Error de comunicación con el servidor.") {
    return {
        message:
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            fallbackMsg,
        status: error?.response?.status || error?.status || 500,
        data: error?.response?.data || error?.data || null,
    };
}

/**
 * Users
 */

export async function getAccessUsers(params = {}) {
    try {
        const response = await http.get("/corporativo/users", { params });
        return response.data;
    } catch (error) {
        throw normalizeError(error, "No se pudo obtener la lista de usuarios.");
    }
}

export async function getUsers(params = {}) {
    return getAccessUsers(params);
}

export async function listUsers(params = {}) {
    return getAccessUsers(params);
}

export async function getUserById(userId) {
    try {
        const response = await http.get(`/corporativo/users/${userId}`);
        return response.data;
    } catch (error) {
        throw normalizeError(error, "No se pudo obtener el usuario.");
    }
}

export async function createUser(payload = {}) {
    try {
        const response = await http.post("/corporativo/users", payload);
        return response.data;
    } catch (error) {
        throw normalizeError(error, "No se pudo crear el usuario.");
    }
}

export async function updateUser(userId, payload = {}) {
    try {
        const response = await http.patch(`/corporativo/users/${userId}`, payload);
        return response.data;
    } catch (error) {
        throw normalizeError(error, "No se pudo actualizar el usuario.");
    }
}

export async function deleteUser(userId) {
    try {
        const response = await http.delete(`/corporativo/users/${userId}`);
        return response.data;
    } catch (error) {
        throw normalizeError(error, "No se pudo eliminar el usuario.");
    }
}

/**
 * Access / Memberships
 */

export async function getUserAccessOptions(params = {}) {
    try {
        const response = await http.get("/corporativo/users/access/options", {
            params,
        });

        return response.data;
    } catch (error) {
        throw normalizeError(
            error,
            "No se pudieron obtener las opciones de acceso."
        );
    }
}

export async function updateUserAccess(userId, payload = {}) {
    try {
        const response = await http.patch(
            `/corporativo/users/${userId}/access`,
            payload
        );

        return response.data;
    } catch (error) {
        throw normalizeError(
            error,
            "No se pudo actualizar el acceso del usuario."
        );
    }
}

export async function deleteUserAccess(userId, membershipId) {
    try {
        const response = await http.delete(
            `/corporativo/users/${userId}/access/${membershipId}`
        );

        return response.data;
    } catch (error) {
        throw normalizeError(
            error,
            "No se pudo eliminar el acceso del usuario."
        );
    }
}

/**
 * Legacy membership endpoints.
 * Mantener solo si todavía existen rutas /corporativo/memberships en backend.
 */

export async function createUserMembership(payload = {}) {
    try {
        const response = await http.post("/corporativo/memberships", payload);
        return response.data;
    } catch (error) {
        throw normalizeError(error, "No se pudo crear la membresía.");
    }
}

export async function updateUserMembership(membershipId, payload = {}) {
    try {
        const response = await http.patch(
            `/corporativo/memberships/${membershipId}`,
            payload
        );

        return response.data;
    } catch (error) {
        throw normalizeError(error, "No se pudo actualizar la membresía.");
    }
}

export async function deleteUserMembership(membershipId) {
    try {
        const response = await http.delete(
            `/corporativo/memberships/${membershipId}`
        );

        return response.data;
    } catch (error) {
        throw normalizeError(error, "No se pudo eliminar la membresía.");
    }
}
