// client/src/features/corporativo/access/users/store/accessSessions.store.js
import { create } from "zustand";

export const useAccessSessionsStore = create(() => ({
    items: [],
    loading: false,
    loaded: false,
}));
