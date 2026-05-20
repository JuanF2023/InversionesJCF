// client/src/features/corporativo/access/components/user-detail/hooks/useUserDetailPage.js
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useAccessUsersStore } from "@/features/corporativo/access/store/accessUsers.store.js";

import { getUserMemberships } from "@/features/corporativo/access/components/user-detail/utils/userDetail.utils.js";

export default function useUserDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [accessModalOpen, setAccessModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("summary");

    const obtenerPorId = useAccessUsersStore((state) => state.obtenerPorId);
    const user = useAccessUsersStore((state) => state.currentItem);
    const loading = useAccessUsersStore((state) => state.loading);

    useEffect(() => {
        if (!id) return;

        obtenerPorId(id).catch((error) => {
            toast.error(error?.message || "Error cargando usuario");
        });
    }, [id, obtenerPorId]);

    const memberships = useMemo(() => getUserMemberships(user), [user]);

    function goBackToUsers() {
        navigate("/corporativo/admin/users");
    }

    function openAccessModal() {
        setAccessModalOpen(true);
    }

    function closeAccessModal() {
        setAccessModalOpen(false);
    }

    async function refreshUserAfterAccessChange() {
        closeAccessModal();

        try {
            await obtenerPorId(id);
            toast.success("Acceso actualizado correctamente.");
        } catch (error) {
            toast.error(error?.message || "No se pudo refrescar el usuario.");
        }
    }

    return {
        id,
        user,
        loading,
        activeTab,
        accessModalOpen,
        memberships,
        setActiveTab,
        goBackToUsers,
        openAccessModal,
        closeAccessModal,
        refreshUserAfterAccessChange,
    };
}
