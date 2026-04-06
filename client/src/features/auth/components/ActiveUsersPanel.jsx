// client/src/features/auth/components/ActiveUsersPanel.jsx
import React from "react";
import { Clock3, RefreshCw, UserRound, Users, WifiOff } from "lucide-react";

import { formatDurationSince, formatTimeLeft } from "@/core/utils/timefmt";

function getStateInfo(user) {
    const state = String(user?.state || "").toUpperCase();

    if (user?.orphan) {
        return {
            label: "Huérfano",
            className:
                "bg-amber-500/15 text-amber-300 border border-amber-400/20",
        };
    }

    if (state === "BREAK") {
        return {
            label: "Receso",
            className:
                "bg-yellow-500/15 text-yellow-300 border border-yellow-400/20",
        };
    }

    if (state === "ACTIVE") {
        return {
            label: "Activo",
            className:
                "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20",
        };
    }

    return {
        label: "Cerrado",
        className: "bg-slate-500/15 text-slate-300 border border-slate-400/20",
    };
}

function buildSessionTimes(user) {
    const twelveHoursMs = 12 * 60 * 60 * 1000;

    const startedAtMs =
        typeof user?.startedAt === "number"
            ? user.startedAt
            : user?.startedAt
                ? new Date(user.startedAt).getTime()
                : null;

    const expiresAtMsRaw =
        typeof user?.expiresAt === "number"
            ? user.expiresAt
            : user?.expiresAt
                ? new Date(user.expiresAt).getTime()
                : null;

    const effectiveExpiresAtMs = Number.isFinite(expiresAtMsRaw)
        ? expiresAtMsRaw
        : startedAtMs
            ? startedAtMs + twelveHoursMs
            : null;

    return {
        tiempoActiva: startedAtMs ? formatDurationSince(startedAtMs) : "-",
        tiempoRestante: effectiveExpiresAtMs
            ? formatTimeLeft(effectiveExpiresAtMs)
            : "-",
    };
}

function PanelStatusBadge({ status }) {
    const normalized = String(status || "idle").toLowerCase();

    if (normalized === "loading") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/20 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold text-sky-300">
                <RefreshCw size={11} className="animate-spin" />
                Actualizando
            </span>
        );
    }

    if (normalized === "offline") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold text-red-300">
                <WifiOff size={11} />
                Sin conexión
            </span>
        );
    }

    if (normalized === "empty") {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-400/20 bg-slate-500/10 px-2.5 py-1 text-[10px] font-semibold text-slate-300">
                <Users size={11} />
                Sin usuarios
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
            <Users size={11} />
            En línea
        </span>
    );
}

function ActiveSessionRow({ user, index }) {
    const displayName = String(user?.nombre || "Usuario").trim() || "Usuario";
    const rol =
        String(user?.rol || user?.roleName || "").trim() || "Rol no disponible";
    const stateInfo = getStateInfo(user);
    const { tiempoActiva, tiempoRestante } = buildSessionTimes(user);

    const initials = displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");

    return (
        <div
            key={`${user?.userId || user?._id || "user"}-${index}`}
            className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 transition-all duration-300 hover:bg-white/[0.05]"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-slate-100">
                        {initials || <UserRound size={16} className="text-slate-200" />}
                    </div>

                    <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">
                            {displayName}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-300">
                            <span>{rol}</span>
                            <span className="opacity-40">•</span>
                            <span>Activo {tiempoActiva}</span>
                            <span className="opacity-40">•</span>
                            <span>Vence en {tiempoRestante}</span>
                        </div>
                    </div>
                </div>

                <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${stateInfo.className}`}
                >
                    {stateInfo.label}
                </span>
            </div>
        </div>
    );
}

function SkeletonRow() {
    return (
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex flex-1 items-start gap-3">
                    <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl border border-white/10 bg-white/10" />
                    <div className="min-w-0 flex-1">
                        <div className="h-4 w-32 animate-pulse rounded-md bg-white/10" />
                        <div className="mt-2 h-3 w-48 animate-pulse rounded-md bg-white/5" />
                        <div className="mt-2 h-3 w-36 animate-pulse rounded-md bg-white/5" />
                    </div>
                </div>

                <div className="h-6 w-16 shrink-0 animate-pulse rounded-full bg-white/10" />
            </div>
        </div>
    );
}

function StateCard({ icon: Icon, title, description, tone = "default" }) {
    const toneClasses =
        tone === "danger"
            ? "border-red-500/20 bg-red-500/10 text-red-300"
            : "border-white/10 bg-white/[0.02] text-slate-300";

    return (
        <div className={`rounded-2xl border px-4 py-5 ${toneClasses}`}>
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <Icon size={17} />
                </div>

                <div className="min-w-0">
                    <div className="text-sm font-semibold">{title}</div>
                    <div className="mt-1 text-sm opacity-90">{description}</div>
                </div>
            </div>
        </div>
    );
}

function isRealVisibleUser(user) {
    const userId = String(user?.userId || user?._id || "").trim();
    return Boolean(userId);
}

export default function ActiveUsersPanel({ active }) {
    const status = String(active?.status || "idle").toLowerCase();
    const items = Array.isArray(active?.items) ? active.items : [];

    const refreshedText = active?.refreshedAt
        ? new Date(active.refreshedAt).toLocaleTimeString("es-SV", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
        })
        : "--:--:--";

    const visibleItems = items.filter(isRealVisibleUser);
    const effectiveStatus =
        status === "online" && visibleItems.length === 0 ? "empty" : status;

    const showRows = effectiveStatus === "online" && visibleItems.length > 0;

    return (
        <section className="w-full rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white">Usuarios activos</h2>
                        <PanelStatusBadge status={effectiveStatus} />
                    </div>

                    <p className="mt-1 text-xs text-slate-300">
                        Monitorea sesiones abiertas y su tiempo restante.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <Clock3 size={13} />
                    <span>{refreshedText}</span>
                </div>
            </div>

            <div className="mt-4 border-t border-white/10" />

            <div className="mt-4 max-h-[320px] space-y-2 overflow-y-auto pr-1 transition-all duration-300">
                {effectiveStatus === "idle" || effectiveStatus === "loading" ? (
                    <>
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                    </>
                ) : null}

                {effectiveStatus === "offline" ? (
                    <StateCard
                        icon={WifiOff}
                        title="No se puede acceder al servidor"
                        description="No fue posible consultar la lista de usuarios activos en este momento."
                        tone="danger"
                    />
                ) : null}

                {effectiveStatus === "empty" ? (
                    <StateCard
                        icon={Users}
                        title="No hay usuarios activos"
                        description="En este momento no hay sesiones abiertas para mostrar."
                    />
                ) : null}

                {showRows
                    ? visibleItems.map((user, index) => (
                        <ActiveSessionRow
                            key={`${user?.userId || user?._id || "user"}-${index}`}
                            user={user}
                            index={index}
                        />
                    ))
                    : null}

                {!["idle", "loading", "offline", "empty", "online"].includes(
                    effectiveStatus
                ) ? (
                    <StateCard
                        icon={WifiOff}
                        title="Estado no reconocido"
                        description="El panel recibió un estado no esperado."
                    />
                ) : null}
            </div>

            <div className="mt-4 text-xs text-slate-400">
                Ingresa tu PIN para acceder o continuar una sesión existente.
            </div>
        </section>
    );
}