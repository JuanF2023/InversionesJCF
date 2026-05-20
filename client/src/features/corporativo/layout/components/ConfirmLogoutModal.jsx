// client/src/features/corporativo/layout/components/ConfirmLogoutModal.jsx

import React from "react";

export default function ConfirmLogoutModal({
    open,
    onCancel,
    onConfirm,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onCancel}
            />

            <div className="relative w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl">
                <h3 className="text-lg font-semibold">
                    Cerrar sesión
                </h3>

                <p className="mt-2 text-sm opacity-80">
                    ¿Seguro que deseas cerrar la sesión?
                </p>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="rounded-xl border border-red-500/30 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-500"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
}
