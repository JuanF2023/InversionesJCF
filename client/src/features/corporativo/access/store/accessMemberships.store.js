// client/src/features/corporativo/access/users/store/accessMemberships.store.js
import { create } from "zustand";
import {
    getUserAccessOptions,
    updateUserAccess,
} from "@/features/corporativo/access/api/users.api.js";

import { useAccessUsersStore } from "./accessUsers.store.js";

const asArray = (v) => (Array.isArray(v) ? v : []);

function normalizeOption(item = {}) {
    return {
        id: String(item.id ?? item._id ?? ""),
        key: String(item.key ?? ""),
        nombre: String(item.nombre ?? item.name ?? item.label ?? ""),
        tipo: String(item.tipo ?? item.type ?? ""),
        tenantType: String(item.tenantType ?? ""),
    };
}

export const useAccessMembershipsStore = create((set, get) => ({
    tenants: [],
    roles: [],
    loadingOptions: false,
    saving: false,
    error: null,
    loaded: false,

    async cargarOpciones() {
        set({ loadingOptions: true });

        try {
            const data = await getUserAccessOptions();

            set({
                tenants: asArray(data?.tenants).map(normalizeOption),
                roles: asArray(data?.roles).map(normalizeOption),
                loadingOptions: false,
                loaded: true,
            });
        } catch (error) {
            set({
                loadingOptions: false,
                error: error?.message,
            });
            throw error;
        }
    },

    async guardarAccesoUsuario(userId, payload = {}) {
        set({ saving: true });

        try {
            const data = await updateUserAccess(userId, payload);
            const item = data?.item || data;

            set({ saving: false });

            if (item?.id) {
                useAccessUsersStore.setState((state) => ({
                    items: state.items.map((u) =>
                        u.id === item.id ? { ...u, ...item } : u
                    ),
                }));
            }

            return item;
        } catch (error) {
            set({
                saving: false,
                error: error?.message,
            });
            throw error;
        }
    },
}));
