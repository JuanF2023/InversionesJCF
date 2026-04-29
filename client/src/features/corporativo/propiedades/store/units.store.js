// client/src/features/corporativo/propiedades/store/units.store.js
import { create } from "zustand";

import {
  getUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
} from "@/features/corporativo/propiedades/api/units.api.js";

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

export const useUnitsStore = create((set, get) => ({
  items: [],
  unidades: [],
  total: 0,
  loading: false,
  loaded: false,
  error: null,
  selectedUnit: null,

  async loadUnits(params = {}) {
    set({ loading: true, error: null });

    try {
      const data = await getUnits(params);
      const items = getItemsFromResponse(data);

      set({
        items,
        unidades: items,
        total: getTotalFromResponse(data, items),
        loading: false,
        loaded: true,
      });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error?.message || "Error cargando unidades",
      });

      throw error;
    }
  },

  async cargar(params = {}) {
    return get().loadUnits(params);
  },

  async loadUnitById(id) {
    set({ loading: true, error: null });

    try {
      const data = await getUnitById(id);
      const item = data?.item || data?.data?.item || data?.data || data;

      set({
        selectedUnit: item,
        loading: false,
      });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error?.message || "Error cargando unidad",
      });

      throw error;
    }
  },

  async createUnit(payload) {
    set({ loading: true, error: null });

    try {
      const data = await createUnit(payload);
      await get().loadUnits();
      set({ loading: false });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error?.message || "Error creando unidad",
      });

      throw error;
    }
  },

  async updateUnit(id, payload) {
    set({ loading: true, error: null });

    try {
      const data = await updateUnit(id, payload);
      await get().loadUnits();
      set({ loading: false });

      return data;
    } catch (error) {
      set({
        loading: false,
        error: error?.message || "Error actualizando unidad",
      });

      throw error;
    }
  },

  async deleteUnit(id) {
    set({ loading: true, error: null });

    try {
      await deleteUnit(id);
      await get().loadUnits();
      set({ loading: false });

      return { success: true };
    } catch (error) {
      set({
        loading: false,
        error: error?.message || "Error eliminando unidad",
      });

      throw error;
    }
  },

  clearSelected() {
    set({ selectedUnit: null });
  },

  clearError() {
    set({ error: null });
  },
}));

export default useUnitsStore;
