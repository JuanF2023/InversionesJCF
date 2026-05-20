// client/src/core/ui/modals/ConfirmModal.jsx
import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
    open,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel,
    loading = false,
    variant = "default",
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div
                className={[
                    "w-full max-w-md rounded-2xl border p-5 shadow-2xl",
                    "border-[color:color-mix(in_oklab,var(--border)_72%,var(--accent)_28%)]",
                    "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--panel)_96%,var(--accent)_4%),var(--panel))]",
                    "text-[var(--text)]",
                ].join(" ")}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div
                            className={[
                                "grid h-10 w-10 shrink-0 place-items-center rounded-2xl border",
                                "border-[color:color-mix(in_oklab,var(--accent)_45%,var(--border)_55%)]",
                                "bg-[color-mix(in_oklab,var(--panel)_82%,var(--accent)_18%)]",
                                "text-[color:color-mix(in_oklab,var(--accent)_82%,var(--text)_18%)]",
                                "shadow-[var(--in)]",
                            ].join(" ")}
                        >
                            <AlertTriangle size={18} />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-base font-bold">
                                {title}
                            </h2>

                            <p className="mt-1 text-sm leading-6 opacity-75">
                                {message}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        aria-label="Cerrar"
                        className={[
                            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition",
                            "border-[var(--border)] bg-[var(--chip)]",
                            "hover:bg-[var(--chip-hover)]",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                        ].join(" ")}
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className={[
                            "rounded-xl border px-4 py-2 text-sm font-semibold transition",
                            "border-[var(--border)] bg-[var(--chip)] text-[var(--text)]",
                            "hover:bg-[var(--chip-hover)]",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                        ].join(" ")}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        data-variant={variant}
                        className={[
                            "rounded-xl border px-4 py-2 text-sm font-bold transition",
                            "border-[color:color-mix(in_oklab,var(--accent)_55%,var(--border)_45%)]",
                            "bg-[color-mix(in_oklab,var(--panel)_76%,var(--accent)_24%)]",
                            "text-[color:color-mix(in_oklab,var(--accent)_55%,var(--text)_45%)]",
                            "shadow-[0_8px_22px_color-mix(in_oklab,var(--accent)_22%,transparent)]",
                            "hover:bg-[color-mix(in_oklab,var(--panel)_68%,var(--accent)_32%)]",
                            "hover:text-[var(--text)]",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                        ].join(" ")}
                    >
                        {loading ? "Procesando..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
