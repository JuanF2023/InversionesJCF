// C:\Users\Administrator\OneDrive\InversionesJCF\InversionesJCF\client\src\features\auth\components\LoginActions.jsx
import React from "react";
import { AlertTriangle, Coffee, LogIn, LogOut } from "lucide-react";

function ActionButton({
    children,
    onClick,
    disabled,
    variant = "default",
}) {
    const variants = {
        success: "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/20",
        warning: "bg-yellow-400 hover:bg-yellow-300 text-black border border-yellow-200/20",
        warningActive: "bg-amber-500 hover:bg-amber-400 text-black border border-amber-200/20",
        danger: "bg-red-600 hover:bg-red-500 text-white border border-red-400/20",
        default: "bg-slate-700 hover:bg-slate-600 text-white border border-white/10",
    };

    return (
        <button
            type="button"
            className={[
                "w-full rounded-2xl px-4 py-3.5 text-base font-bold shadow-md transition-all duration-200",
                "flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
            ].join(" ")}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default function LoginActions({
    loadingUi,
    canAttempt,
    onBreak,
    onEntrar,
    onReceso,
    onSalir,
    hasSessionConflict = false,
    sessionConflictMessage = "Ya existe una sesión activa para este usuario. Usa Continuar.",
}) {
    const disableEntrar = loadingUi || !canAttempt || onBreak || hasSessionConflict;

    return (
        <div className="flex flex-col gap-4 mt-2">
            {hasSessionConflict ? (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/15 px-4 py-3 text-sm text-amber-200 shadow-sm">
                    <div className="flex items-start gap-2">
                        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                        <div>
                            <p className="font-semibold">Sesión ya abierta</p>
                            <p className="mt-1 opacity-90">
                                {sessionConflictMessage}
                            </p>
                        </div>
                    </div>
                </div>
            ) : null}

            <ActionButton
                variant="success"
                onClick={onEntrar}
                disabled={disableEntrar}
            >
                <LogIn size={20} />
                Entrar
            </ActionButton>

            <ActionButton
                variant={onBreak ? "warningActive" : "warning"}
                onClick={onReceso}
                disabled={loadingUi}
            >
                <Coffee size={20} />
                {onBreak ? "Terminar receso" : "Receso"}
            </ActionButton>

            <ActionButton
                variant="danger"
                onClick={onSalir}
                disabled={loadingUi}
            >
                <LogOut size={20} />
                Salir
            </ActionButton>
        </div>
    );
}