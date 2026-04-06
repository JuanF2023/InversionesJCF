// client/src/features/corporativo/access/users/store/accessRoles.store.js
import { create } from "zustand";
import { getUserAccessOptions } from "@/features/corporativo/access/api/users.api.js";

const asArray = (v) => (Array.isArray(v) ? v : []);

function normalizeRole(item = {}) {
    return {
        id: String(item.id ?? item._id ?? ""),
        key: String(item.key ?? ""),
        nombre: String(item.nombre ?? item.name ?? item.label ?? ""),
        tenantType: String(item.tenantType ?? ""),
    };
}

export const useAccessRolesStore = create((set) => ({
    items: [],
    loading: false,
    error: null,

    async cargar() {
        set({ loading: true });

        try {
            const data = await getUserAccessOptions();

            set({
                items: asArray(data?.roles).map(normalizeRole),
                loading: false,
            });
        } catch (error) {
            set({
                loading: false,
                error: error?.message,
            });
            throw error;
        }
    },
}));
