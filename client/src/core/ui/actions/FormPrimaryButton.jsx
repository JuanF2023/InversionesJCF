// client/src/core/ui/actions/FormPrimaryButton.jsx
import React from "react";
import { Loader2 } from "lucide-react";

function cx(...classes) {
    return classes.filter(Boolean).join(" ");
}

/**
 * Botón primario reutilizable para formularios y modales.
 *
 * Usa variables del tema activo:
 * - --accent
 * - --accent-contrast
 * - --border
 * - --chip
 *
 * Diseño:
 * - Gradiente dinámico basado en el tema.
 * - Estado activo moderno con sombra suave.
 * - Estado deshabilitado claro y consistente.
 */
export default function FormPrimaryButton({
    children,
    type = "button",
    icon: Icon = null,
    loading = false,
    disabled = false,
    title = "",
    disabledTitle = "Completa los campos requeridos para continuar.",
    loadingText = "Guardando...",
    className = "",
    ...props
}) {
    const isDisabled = disabled || loading;

    const enabledStyle = {
        backgroundImage:
            "linear-gradient(135deg, color-mix(in srgb, var(--accent) 92%, white 12%) 0%, var(--accent) 48%, color-mix(in srgb, var(--accent) 82%, black 16%) 100%)",
        borderColor: "color-mix(in srgb, var(--accent) 72%, white 10%)",
        color: "var(--accent-contrast, white)",
        boxShadow:
            "0 14px 30px color-mix(in srgb, var(--accent) 28%, transparent), inset 0 1px 0 color-mix(in srgb, white 32%, transparent)",
    };

    const disabledStyle = {
        backgroundImage:
            "linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, var(--chip)) 0%, color-mix(in srgb, var(--accent) 14%, var(--chip)) 100%)",
        borderColor: "color-mix(in srgb, var(--accent) 22%, var(--border))",
        color: "color-mix(in srgb, var(--accent) 48%, var(--fg, #111827))",
        boxShadow: "none",
    };

    return (
        <button
            type={type}
            disabled={isDisabled}
            title={isDisabled ? disabledTitle : title}
            style={isDisabled ? disabledStyle : enabledStyle}
            className={cx(
                "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl border px-4 py-2.5 text-sm font-bold",
                "transition-all duration-200",
                isDisabled
                    ? "cursor-not-allowed opacity-70"
                    : "hover:-translate-y-0.5 hover:brightness-105 hover:saturate-110 active:translate-y-0 active:scale-[0.98]",
                "focus:outline-none focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--accent)_38%,transparent)] focus:ring-offset-2 focus:ring-offset-transparent",
                className
            )}
            {...props}
        >
            {!isDisabled ? (
                <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 rotate-12 bg-white/20 opacity-0 blur-sm transition-all duration-500 group-hover:left-[115%] group-hover:opacity-100" />
            ) : null}

            <span className="relative z-10 inline-flex items-center gap-2">
                {loading ? (
                    <Loader2 size={16} className="animate-spin opacity-95" />
                ) : Icon ? (
                    <Icon
                        size={16}
                        className={isDisabled ? "opacity-45" : "opacity-95"}
                    />
                ) : null}

                <span>{loading ? loadingText : children}</span>
            </span>
        </button>
    );
}
