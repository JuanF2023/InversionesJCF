// client/src/features/corporativo/propiedades/store/properties.store.js
import { create } from "zustand";

import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "@/features/corporativo/propiedades/api/properties.api.js";

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

export const usePropertiesStore = create((set, get) => ({
  items: [],
  propiedades: [],
  total: 0,
  kpis: {},
  loading: false,
  loaded: false,
  error: null,
  selectedProperty: null,

  async loadProperties(params = {}) {
    set({ loading: true, error: null });

    try {
      const data = await getProperties(params);
      const items = getItemsFromResponse(data);

      set({
        items,
        propiedades: items,
        total: getTotalFromResponse(data, items),
        kpis: data?.kpis || data?.data?.kpis || {},
        loading: false,
        loaded: true,
      });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error?.message || "Error cargando propiedades",
      });

      throw error;
    }
  },

  async cargar(params = {}) {
    return get().loadProperties(params);
  },

  async loadPropertyById(id) {
    set({ loading: true, error: null });

    try {
      const data = await getPropertyById(id);
      const item = data?.item || data?.data?.item || data?.data || data;

      set({
        selectedProperty: item,
        loading: false,
      });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error?.message || "Error cargando propiedad",
      });

      throw error;
    }
  },

  async createProperty(payload) {
    set({ loading: true, error: null });

    try {
      const data = await createProperty(payload);
      await get().loadProperties();
      set({ loading: false });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error?.message || "Error creando propiedad",
      });

      throw error;
    }
  },

  async updateProperty(id, payload) {
    set({ loading: true, error: null });

    try {
      const data = await updateProperty(id, payload);
      await get().loadProperties();
      set({ loading: false });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error?.message || "Error actualizando propiedad",
      });

      throw error;
    }
  },

  async deleteProperty(id) {
    set({ loading: true, error: null });

    try {
      await deleteProperty(id);
      await get().loadProperties();
      set({ loading: false });

      return { success: true };
    } catch (error) {
      set({
        loading: false,
        error: error?.message || "Error eliminando propiedad",
      });

      throw error;
    }
  },

  clearSelected() {
    set({ selectedProperty: null });
  },

  clearError() {
    set({ error: null });
  },
}));

export default usePropertiesStore;
