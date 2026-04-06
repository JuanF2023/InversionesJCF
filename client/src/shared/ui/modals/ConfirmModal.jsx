import React from "react";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-slate-900 rounded-xl p-6 w-[420px] max-w-[90%] shadow-xl border border-white/10">
        
        <h2 className="text-lg font-bold mb-2">{title}</h2>

        <p className="text-sm text-gray-300 mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition disabled:opacity-60"
          >
            {loading ? "Procesando..." : confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}
