// client/src/features/corporativo/access/users/store/accessPermissions.store.js
import { create } from "zustand";

export const useAccessPermissionsStore = create(() => ({
    items: [],
    loading: false,
    loaded: false,
}));
