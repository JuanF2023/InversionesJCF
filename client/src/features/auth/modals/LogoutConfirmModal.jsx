// C:\Users\Administrator\OneDrive\InversionesJCF\InversionesJCF\client\src\features\auth\modals\LogoutConfirmModal.jsx
import React from "react";

import ConfirmModal from "@/shared/ui/modals/ConfirmModal.jsx";

export default function LogoutConfirmModal({
    open,
    loading,
    onCancel,
    onConfirm,
}) {
    return (
        <ConfirmModal
            open={open}
            title="Cerrar sesi¨®n"
            message="?Seguro que deseas cerrar la sesi¨®n actual? Tendr¨¢s que ingresar tu PIN nuevamente para volver a entrar."
            confirmText="S¨ª, cerrar sesi¨®n"
            cancelText="Cancelar"
            loading={loading}
            onCancel={onCancel}
            onConfirm={onConfirm}
        />
    );
}
