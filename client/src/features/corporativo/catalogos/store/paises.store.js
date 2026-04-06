// client/src/features/corporativo/catalogos/store/paises.store.js
import { create } from "zustand";

/**
 * Store de países.
 * Catálogo transversal del módulo corporativo.
 */
export const usePaisesStore = create((set) => ({
  items: [],
  loading: false,
  error: null,

  setItems: (items) => set({ items }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));