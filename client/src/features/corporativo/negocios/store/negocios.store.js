// client/src/features/corporativo/negocios/store/negocios.store.js
import { create } from "zustand";

import {
  getNegocios,
  getNegocioById,
  createNegocio,
  updateNegocio,
  deleteNegocio,
} from "@/features/corporativo/negocios/api/negocios.api.js";

const getItemsFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getTotalFromResponse = (data, items) => {
  if (Number.isFinite(Number(data?.total))) return Number(data.total);
  if (Number.isFinite(Number(data?.data?.total))) return Number(data.data.total);
  return items.length;
};

export const useNegociosStore = create((set, get) => ({
  items: [],
  negocios: [],
  total: 0,
  loading: false,
  loaded: false,
  error: null,
  selectedNegocio: null,

  async loadNegocios(params = {}) {
    set({ loading: true, error: null });

    try {
      const data = await getNegocios(params);
      const items = getItemsFromResponse(data);

      set({
        items,
        negocios: items,
        total: getTotalFromResponse(data, items),
        loading: false,
        loaded: true,
      });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error?.message || "Error cargando negocios",
      });

      throw error;
    }
  },

  async cargar(params = {}) {
    return get().loadNegocios(params);
  },

  async loadNegocioById(id) {
    set({ loading: true, error: null });

    try {
      const data = await getNegocioById(id);
      const item = data?.item || data?.data?.item || data?.data || data;

      set({
        selectedNegocio: item,
        loading: false,
      });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error?.message || "Error cargando negocio",
      });

      throw error;
    }
  },

  async createNegocio(payload) {
    set({ loading: true, error: null });

    try {
      const data = await createNegocio(payload);
      await get().loadNegocios();
      set({ loading: false });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error?.message || "Error creando negocio",
      });

      throw error;
    }
  },

  async updateNegocio(id, payload) {
    set({ loading: true, error: null });

    try {
      const data = await updateNegocio(id, payload);
      await get().loadNegocios();
      set({ loading: false });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error?.message || "Error actualizando negocio",
      });

      throw error;
    }
  },

  async deleteNegocio(id) {
    set({ loading: true, error: null });

    try {
      await deleteNegocio(id);
      await get().loadNegocios();
      set({ loading: false });

      return { success: true };
    } catch (error) {
      set({
        loading: false,
        error: error?.message || "Error eliminando negocio",
      });

      throw error;
    }
  },

  clearSelected() {
    set({ selectedNegocio: null });
  },

  clearError() {
    set({ error: null });
  },
}));

export default useNegociosStore;
