// client/src/features/corporativo/access/components/CompleteAccessModal.jsx
import React from "react";
import { CheckCircle2, UserRound, X } from "lucide-react";

import FormPrimaryButton from "@/core/ui/actions/FormPrimaryButton.jsx";
import ConfirmModal from "@/core/ui/modals/ConfirmModal.jsx";
import PanelSurface from "@/core/ui/surfaces/PanelSurface.jsx";

import {
    AccessSummaryPanel,
    CurrentAccessPanel,
    NewAccessForm,
    useCompleteAccessModal,
} from "@/features/corporativo/access/components/access-modal";

import { EMPTY_VALUE } from "@/features/corporativo/access/components/access-modal/utils/accessModal.utils.js";

export default function CompleteAccessModal({
    open,
    onClose,
    user,
    onSaved,
}) {
    const modal = useCompleteAccessModal({
        open,
        user,
        onSaved,
    });

    if (!open || !user) {
        return null;
    }

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-end justify-center overflow-x-hidden bg-black/45 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-6"
                role="presentation"
            >
                <PanelSurface
                    variant="glass"
                    padding="lg"
                    className="max-h-[92vh] w-full max-w-5xl overflow-y-auto border-[color:color-mix(in_srgb,var(--accent)_28%,var(--border))] shadow-2xl"
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="complete-access-title"
                        className="space-y-5"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <h3
                                    id="complete-access-title"
                                    className="text-lg font-bold tracking-tight"
                                >
                                    Gestionar accesos
                                </h3>

                                <p className="mt-1 text-sm opacity-65">
                                    Asigna tenant y rol al usuario seleccionado.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                disabled={modal.saving}
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--chip)] transition hover:bg-[var(--chip-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Cerrar modal"
                                title="Cerrar"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--chip)] p-3">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
                                <UserRound size={18} className="opacity-70" />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold">
                                    {user.nombre || EMPTY_VALUE}
                                </p>

                                <p className="truncate text-xs opacity-65">
                                    {user.email || EMPTY_VALUE}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]">
                            <CurrentAccessPanel
                                memberships={modal.memberships}
                                deletingAccessId={modal.deletingAccessId}
                                onDelete={modal.openDeleteModal}
                            />

                            <form
                                onSubmit={modal.handleSubmit}
                                className="space-y-4"
                            >
                                <NewAccessForm
                                    tenantId={modal.tenantId}
                                    roleId={modal.roleId}
                                    availableTenants={modal.availableTenants}
                                    filteredRoles={modal.filteredRoles}
                                    disabled={modal.disabled}
                                    hasAvailableTenants={
                                        modal.hasAvailableTenants
                                    }
                                    onTenantChange={modal.handleTenantChange}
                                    onRoleChange={modal.handleRoleChange}
                                />

                                <AccessSummaryPanel
                                    selectedTenant={modal.selectedTenant}
                                    selectedRole={modal.selectedRole}
                                />

                                <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={modal.saving}
                                        className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--chip)] px-4 py-2.5 text-sm font-semibold transition hover:bg-[var(--chip-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Cerrar
                                    </button>

                                    <FormPrimaryButton
                                        type="submit"
                                        icon={CheckCircle2}
                                        loading={modal.saving}
                                        disabled={!modal.canSubmit}
                                        title="Agregar acceso"
                                        disabledTitle="Selecciona tenant y rol para habilitar esta acción."
                                        loadingText="Guardando..."
                                    >
                                        Agregar acceso
                                    </FormPrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </PanelSurface>
            </div>

            <ConfirmModal
                open={modal.deleteModal.open}
                title="Quitar acceso"
                message={`¿Seguro que deseas quitar el acceso "${modal.deleteModal.membership?.roleName || "Sin rol"}" del tenant "${modal.deleteModal.membership?.tenantNombre || "Sin tenant"}"?`}
                confirmText="Sí, quitar acceso"
                cancelText="Cancelar"
                loading={
                    modal.deletingAccessId ===
                    modal.deleteModal.membership?.membershipId
                }
                variant="danger"
                onCancel={modal.closeDeleteModal}
                onConfirm={modal.confirmDeleteAccess}
            />
        </>
    );
}