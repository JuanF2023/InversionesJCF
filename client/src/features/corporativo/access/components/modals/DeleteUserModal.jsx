// client/src/features/corporativo/access/components/DeleteUserModal.jsx
import React from "react";
import { Trash2 } from "lucide-react";

export default function DeleteUserModal({
    open,
    onClose,
    onConfirm,
    userName,
    loading,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-xl">

                <h2 className="text-lg font-semibold">
                    Eliminar usuario
                </h2>

                <p className="mt-2 text-sm opacity-70">
                    ?Seguro que deseas eliminar a <b>{userName}</b>?
                    Esta acci¨®n no se puede deshacer.
                </p>

                <div className="mt-6 flex justify-end gap-2">

                    <button
                        onClick={onClose}
                        className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm text-white"
                    >
                        <Trash2 size={14} />
                        {loading ? "Eliminando..." : "Eliminar"}
                    </button>

                </div>

            </div>
        </div>
    );
}
