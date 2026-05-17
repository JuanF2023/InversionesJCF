// client/src/features/corporativo/access/components/access-modal/hooks/useCompleteAccessModal.js
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { useAccessMembershipsStore } from "@/features/corporativo/access/store/accessMemberships.store.js";

import {
    buildAssignedTenantIds,
    filterAvailableTenants,
    filterRolesByTenantType,
    getUserMemberships,
} from "@/features/corporativo/access/components/access-modal/utils/accessModal.utils.js";

export default function useCompleteAccessModal({
    open,
    user,
    onSaved,
}) {
    const tenants = useAccessMembershipsStore((state) => state.tenants);
    const roles = useAccessMembershipsStore((state) => state.roles);
    const loadingOptions = useAccessMembershipsStore(
        (state) => state.loadingOptions
    );
    const deletingAccessId = useAccessMembershipsStore(
        (state) => state.deletingAccessId
    );
    const cargarOpciones = useAccessMembershipsStore(
        (state) => state.cargarOpciones
    );
    const cargarRolesPorTenant = useAccessMembershipsStore(
        (state) => state.cargarRolesPorTenant
    );
    const guardarAccesoUsuario = useAccessMembershipsStore(
        (state) => state.guardarAccesoUsuario
    );
    const eliminarAccesoUsuario = useAccessMembershipsStore(
        (state) => state.eliminarAccesoUsuario
    );

    const [tenantId, setTenantId] = useState("");
    const [roleId, setRoleId] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
        open: false,
        membership: null,
    });

    const memberships = useMemo(() => getUserMemberships(user), [user]);

    const assignedTenantIds = useMemo(
        () => buildAssignedTenantIds(memberships),
        [memberships]
    );

    const availableTenants = useMemo(
        () => filterAvailableTenants(tenants, assignedTenantIds),
        [tenants, assignedTenantIds]
    );

    const selectedTenant = useMemo(() => {
        return (
            availableTenants.find((tenant) => tenant.id === tenantId) ||
            null
        );
    }, [availableTenants, tenantId]);

    const filteredRoles = useMemo(
        () => filterRolesByTenantType(roles, selectedTenant),
        [roles, selectedTenant]
    );

    const selectedRole = useMemo(() => {
        return filteredRoles.find((role) => role.id === roleId) || null;
    }, [filteredRoles, roleId]);

    const disabled = loadingOptions || saving;
    const hasAvailableTenants = availableTenants.length > 0;

    const canSubmit =
        Boolean(tenantId && roleId) &&
        !disabled &&
        hasAvailableTenants;

    useEffect(() => {
        if (!open || !user?.id) {
            return;
        }

        cargarOpciones().catch(() => {
            toast.error("Error cargando opciones de acceso.");
        });
    }, [open, user?.id, cargarOpciones]);

    useEffect(() => {
        if (!open || !user) {
            return;
        }

        setTenantId("");
        setRoleId("");
        setSaving(false);
        setDeleteModal({
            open: false,
            membership: null,
        });
    }, [open, user]);

    useEffect(() => {
        if (!tenantId) {
            return;
        }

        const tenantStillAvailable = availableTenants.some(
            (tenant) => tenant.id === tenantId
        );

        if (!tenantStillAvailable) {
            setTenantId("");
            setRoleId("");
        }
    }, [availableTenants, tenantId]);

    async function refreshAfterChange() {
        if (typeof onSaved === "function") {
            await onSaved();
        }
    }

    async function handleTenantChange(event) {
        const nextTenantId = event.target.value;

        setTenantId(nextTenantId);
        setRoleId("");

        if (!nextTenantId) {
            return;
        }

        try {
            await cargarRolesPorTenant(nextTenantId);
        } catch {
            toast.error("No se pudieron cargar los roles para este tenant.");
        }
    }

    function handleRoleChange(event) {
        setRoleId(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!hasAvailableTenants) {
            toast.error(
                "Este usuario ya tiene acceso a todos los tenants disponibles."
            );
            return;
        }

        if (!tenantId || !roleId) {
            toast.error("Debes seleccionar tenant y rol.");
            return;
        }

        if (assignedTenantIds.has(tenantId)) {
            toast.error("Este usuario ya tiene acceso a ese tenant.");
            return;
        }

        try {
            setSaving(true);

            await guardarAccesoUsuario(user.id, {
                tenantId,
                roleId,
                status: "active",
                confirmReplace: false,
            });

            await refreshAfterChange();

            setTenantId("");
            setRoleId("");

            toast.success("Acceso agregado correctamente.");
        } catch (error) {
            toast.error(error?.message || "Error guardando acceso.");
        } finally {
            setSaving(false);
        }
    }

    function openDeleteModal(membership) {
        setDeleteModal({
            open: true,
            membership,
        });
    }

    function closeDeleteModal() {
        setDeleteModal({
            open: false,
            membership: null,
        });
    }

    async function confirmDeleteAccess() {
        const membership = deleteModal.membership;
        const membershipId = membership?.membershipId;

        if (!membershipId) {
            toast.error("No se pudo identificar el acceso.");
            return;
        }

        try {
            await eliminarAccesoUsuario(user.id, membershipId);
            await refreshAfterChange();

            closeDeleteModal();

            toast.success("Acceso desactivado correctamente.");
        } catch (error) {
            toast.error(error?.message || "Error eliminando acceso.");
        }
    }

    return {
        tenantId,
        roleId,
        saving,
        disabled,
        canSubmit,
        deleteModal,
        memberships,
        availableTenants,
        filteredRoles,
        selectedTenant,
        selectedRole,
        hasAvailableTenants,
        deletingAccessId,
        handleTenantChange,
        handleRoleChange,
        handleSubmit,
        openDeleteModal,
        closeDeleteModal,
        confirmDeleteAccess,
    };
}
