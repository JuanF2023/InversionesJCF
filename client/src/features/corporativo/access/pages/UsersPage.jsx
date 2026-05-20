// client/src/features/corporativo/access/pages/UsersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Users,
    ShieldCheck,
    Mail,
    RefreshCcw,
    AlertTriangle,
} from "lucide-react";

import toast from "react-hot-toast";

import { SearchInput } from "@/core/ui/forms";
import ConfirmModal from "@/core/ui/modals/ConfirmModal.jsx";

import {
    PageSurface,
    PanelSurface,
} from "@/core/ui/surfaces";

import { useAccessUsersStore } from "@/features/corporativo/access/store/accessUsers.store.js";
import UsersTable from "@/features/corporativo/access/components/users-table";
import CompleteAccessModal from "@/features/corporativo/access/components/CompleteAccessModal.jsx";

const STATUS_FILTERS = [
    { key: "all", label: "Todos" },
    { key: "active", label: "Activos" },
    { key: "inactive", label: "Inactivos" },
];

function InfoBanner({ missingTenant, missingRole, corruptedRole }) {
    if (!missingTenant && !missingRole && !corruptedRole) {
        return null;
    }

    return (
        <PanelSurface
            className="border-[color:color-mix(in_oklab,var(--accent)_28%,var(--border)_72%)] bg-[color-mix(in_oklab,var(--panel)_90%,var(--accent)_10%)]"
            variant="soft"
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5 text-[color:color-mix(in_oklab,var(--accent)_70%,var(--text)_30%)]">
                    <AlertTriangle size={18} />
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-semibold">
                        Avisos operativos del módulo de acceso
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                        {missingTenant ? (
                            <span className="rounded-full border border-[color:color-mix(in_oklab,var(--accent)_30%,var(--border)_70%)] bg-[color-mix(in_oklab,var(--panel)_88%,var(--accent)_12%)] px-3 py-1 text-xs font-medium">
                                {missingTenant} usuario(s) sin tenant resuelto
                            </span>
                        ) : null}

                        {missingRole ? (
                            <span className="rounded-full border border-[color:color-mix(in_oklab,var(--accent)_30%,var(--border)_70%)] bg-[color-mix(in_oklab,var(--panel)_88%,var(--accent)_12%)] px-3 py-1 text-xs font-medium">
                                {missingRole} usuario(s) sin rol resuelto
                            </span>
                        ) : null}

                        {corruptedRole ? (
                            <span className="rounded-full border border-[color:color-mix(in_oklab,var(--accent)_30%,var(--border)_70%)] bg-[color-mix(in_oklab,var(--panel)_88%,var(--accent)_12%)] px-3 py-1 text-xs font-medium">
                                {corruptedRole} rol(es) con texto sospechoso
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
        </PanelSurface>
    );
}

function CompactStat({ icon: Icon, label, value, tone = "default" }) {
    return (
        <div
            className={[
                "relative overflow-hidden rounded-2xl border px-4 py-3 shadow-sm",
                "border-[color:color-mix(in_oklab,var(--accent)_30%,var(--border)_70%)]",
                "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--panel)_94%,var(--accent)_6%),var(--panel))]",
                "before:absolute before:left-0 before:right-0 before:top-0 before:h-[3px]",
                "before:bg-[color:color-mix(in_oklab,var(--accent)_72%,var(--border)_28%)]",
            ].join(" ")}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-55">
                        {label}
                    </p>

                    <p className="mt-1 text-xl font-black leading-none tracking-tight">
                        {value}
                    </p>
                </div>

                <div
                    className={[
                        "grid h-9 w-9 shrink-0 place-items-center rounded-2xl border",
                        "border-[color:color-mix(in_oklab,var(--accent)_45%,var(--border)_55%)]",
                        "bg-[color-mix(in_oklab,var(--panel)_80%,var(--accent)_20%)]",
                        "text-[color:color-mix(in_oklab,var(--accent)_82%,var(--text)_18%)]",
                        "shadow-[var(--in)]",
                    ].join(" ")}
                    data-tone={tone}
                >
                    <Icon size={16} />
                </div>
            </div>
        </div>
    );
}

function StatusSegmentedFilter({ value, onChange }) {
    return (
        <div
            className={[
                "inline-flex w-full items-center gap-1 rounded-2xl border p-1 sm:w-auto",
                "border-[color:color-mix(in_oklab,var(--accent)_22%,var(--border)_78%)]",
                "bg-[color-mix(in_oklab,var(--panel)_94%,var(--accent)_6%)]",
                "shadow-[inset_0_1px_2px_color-mix(in_oklab,var(--accent)_8%,transparent)]",
            ].join(" ")}
            role="group"
            aria-label="Filtrar usuarios por estado"
        >
            {STATUS_FILTERS.map((filter) => {
                const active = value === filter.key;

                return (
                    <button
                        key={filter.key}
                        type="button"
                        onClick={() => onChange(filter.key)}
                        className={[
                            "h-8 flex-1 rounded-xl px-3 text-xs font-black transition sm:flex-none",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklab,var(--accent)_28%,transparent)]",
                            active
                                ? [
                                      "border border-[color:color-mix(in_oklab,var(--accent)_34%,var(--border)_66%)]",
                                      "bg-[color-mix(in_oklab,var(--panel)_88%,var(--accent)_12%)]",
                                      "text-[color:color-mix(in_oklab,var(--accent)_68%,var(--text)_32%)]",
                                      "shadow-[0_4px_12px_color-mix(in_oklab,var(--accent)_8%,transparent)]",
                                  ].join(" ")
                                : [
                                      "border border-transparent",
                                      "text-[color:color-mix(in_oklab,var(--muted)_74%,var(--text)_26%)]",
                                      "hover:bg-[color-mix(in_oklab,var(--panel)_88%,var(--accent)_12%)]",
                                      "hover:text-[color:color-mix(in_oklab,var(--accent)_58%,var(--text)_42%)]",
                                  ].join(" "),
                        ].join(" ")}
                        aria-pressed={active}
                    >
                        {filter.label}
                    </button>
                );
            })}
        </div>
    );
}
function isActiveMembership(membership) {
    return String(membership?.membershipStatus || membership?.status || "")
        .trim()
        .toLowerCase() === "active";
}

function hasResolvedTenant(user) {
    const memberships = Array.isArray(user?.memberships)
        ? user.memberships
        : [];

    return memberships.some((membership) => {
        const tenantName = String(membership?.tenantNombre || "").trim();

        return (
            isActiveMembership(membership) &&
            tenantName &&
            tenantName !== "Sin tenant"
        );
    });
}

function hasResolvedRole(user) {
    const memberships = Array.isArray(user?.memberships)
        ? user.memberships
        : [];

    return memberships.some((membership) => {
        const roleName = String(membership?.roleName || "").trim();

        return (
            isActiveMembership(membership) &&
            roleName &&
            roleName !== "Sin rol"
        );
    });
}

function hasSuspiciousRole(user) {
    const memberships = Array.isArray(user?.memberships)
        ? user.memberships
        : [];

    return memberships.some((membership) =>
        /\?/.test(String(membership?.roleName || ""))
    );
}

function matchesStatusFilter(user, statusFilter) {
    if (statusFilter === "active") {
        return user?.activo === true;
    }

    if (statusFilter === "inactive") {
        return user?.activo !== true;
    }

    return true;
}

function buildUserSearchText(user) {
    const membershipText = Array.isArray(user?.memberships)
        ? user.memberships
              .map((membership) =>
                  [
                      membership?.tenantNombre,
                      membership?.roleName,
                      membership?.tenantKey,
                      membership?.roleKey,
                  ]
                      .filter(Boolean)
                      .join(" ")
              )
              .join(" ")
        : "";

    return [
        user?.nombre,
        user?.email,
        user?.tenantNombre,
        user?.roleName,
        membershipText,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}

function buildDeleteUserMessage(user) {
    const userName = user?.nombre || "este usuario";
    const userEmail = user?.email || "sin email";

    return `Estás a punto de eliminar permanentemente a ${userName} (${userEmail}) de la base de datos. También se eliminarán sus accesos y sesiones relacionadas. ¿Deseas continuar?`;
}

export default function UsersPage() {
    const items = useAccessUsersStore((state) => state.items);
    const total = useAccessUsersStore((state) => state.total);
    const loading = useAccessUsersStore((state) => state.loading);
    const saving = useAccessUsersStore((state) => state.saving);
    const error = useAccessUsersStore((state) => state.error);
    const cargar = useAccessUsersStore((state) => state.cargar);
    const obtenerPorId = useAccessUsersStore((state) => state.obtenerPorId);
    const eliminar = useAccessUsersStore((state) => state.eliminar);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedUser, setSelectedUser] = useState(null);
    const [accessModalOpen, setAccessModalOpen] = useState(false);
    const [openingAccessUserId, setOpeningAccessUserId] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        open: false,
        user: null,
    });

    useEffect(() => {
        cargar({ page: 1, limit: 50 }).catch(() => {
            toast.error("Error cargando usuarios");
        });
    }, [cargar]);

    const stats = useMemo(() => {
        const activos = items.filter((user) => user.activo === true).length;
        const inactivos = items.filter((user) => user.activo !== true).length;

        const missingTenant = items.filter(
            (user) => !hasResolvedTenant(user)
        ).length;

        const missingRole = items.filter(
            (user) => !hasResolvedRole(user)
        ).length;

        const corruptedRole = items.filter((user) =>
            hasSuspiciousRole(user)
        ).length;

        return {
            total: Number(total || items.length || 0),
            activos,
            inactivos,
            missingTenant,
            missingRole,
            corruptedRole,
        };
    }, [items, total]);

    const filteredUsers = useMemo(() => {
        const term = search.trim().toLowerCase();

        return items.filter((user) => {
            if (!matchesStatusFilter(user, statusFilter)) {
                return false;
            }

            if (!term) {
                return true;
            }

            return buildUserSearchText(user).includes(term);
        });
    }, [items, search, statusFilter]);

    async function reloadUsers() {
        try {
            await cargar({ page: 1, limit: 50 });
            toast.success("Usuarios actualizados");
        } catch {
            toast.error("No se pudo actualizar la lista de usuarios");
        }
    }

    async function openAccessModal(user) {
        if (!user?.id) {
            toast.error("No se pudo identificar el usuario.");
            return;
        }

        setOpeningAccessUserId(user.id);

        try {
            const fullUser = await obtenerPorId(user.id);

            setSelectedUser(fullUser || user);
            setAccessModalOpen(true);
        } catch {
            toast.error("No se pudo cargar el detalle completo del usuario.");
        } finally {
            setOpeningAccessUserId(null);
        }
    }

    function closeAccessModal() {
        setAccessModalOpen(false);
        setSelectedUser(null);
    }

    async function handleAccessSaved() {
        await reloadUsers();
        closeAccessModal();
        toast.success("Acceso actualizado");
    }

    function openDeleteModal(user) {
        if (!user?.id) {
            toast.error("No se pudo identificar el usuario.");
            return;
        }

        setDeleteModal({
            open: true,
            user,
        });
    }

    function closeDeleteModal() {
        if (saving) {
            return;
        }

        setDeleteModal({
            open: false,
            user: null,
        });
    }

    async function confirmDeleteUser() {
        const userId = deleteModal.user?.id;

        if (!userId) {
            toast.error("No se pudo identificar el usuario.");
            return;
        }

        try {
            await eliminar(userId);

            setDeleteModal({
                open: false,
                user: null,
            });

            toast.success("Usuario eliminado correctamente.");
        } catch (deleteError) {
            toast.error(deleteError?.message || "No se pudo eliminar el usuario.");
        }
    }

    return (
        <>
            <PageSurface className="space-y-4">
                <InfoBanner
                    missingTenant={stats.missingTenant}
                    missingRole={stats.missingRole}
                    corruptedRole={stats.corruptedRole}
                />

                <section className="grid grid-cols-3 gap-2 xl:hidden">
                    <CompactStat
                        icon={Users}
                        label="Usuarios"
                        value={stats.total}
                    />

                    <CompactStat
                        icon={ShieldCheck}
                        label="Activos"
                        value={stats.activos}
                        tone="success"
                    />

                    <CompactStat
                        icon={Mail}
                        label="Inactivos"
                        value={stats.inactivos}
                        tone="warning"
                    />
                </section>

                <PanelSurface className="space-y-4">
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
                        <div className="min-w-0 space-y-4">
                            <div className="grid gap-3 lg:grid-cols-[minmax(240px,360px)_auto_max-content] lg:items-center">
                                <SearchInput
                                    placeholder="Buscar usuario..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                />

                                <StatusSegmentedFilter
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                />

                                <button
                                    type="button"
                                    onClick={reloadUsers}
                                    disabled={loading}
                                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 text-sm font-semibold text-[var(--text)] transition-all duration-200 hover:-translate-y-[1px] hover:border-[var(--accent)] hover:bg-[var(--chip)] disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto lg:min-w-[120px]"
                                >
                                    <RefreshCcw
                                        size={15}
                                        className={loading ? "animate-spin" : ""}
                                    />

                                    {loading ? "Actualizando..." : "Actualizar"}
                                </button>
                            </div>

                            {openingAccessUserId ? (
                                <div className="rounded-2xl border border-[var(--border)] bg-[var(--chip)] px-4 py-3 text-sm font-medium">
                                    Cargando detalle completo del usuario...
                                </div>
                            ) : null}

                            {error ? (
                                <div className="rounded-2xl border border-[color:color-mix(in_oklab,#b91c1c_32%,var(--border)_68%)] bg-[color-mix(in_oklab,var(--panel)_88%,#b91c1c_12%)] px-4 py-3 text-sm font-medium text-[color:color-mix(in_oklab,#b91c1c_70%,var(--text)_30%)]">
                                    {error?.message ||
                                        "No se pudo cargar la lista de usuarios."}
                                </div>
                            ) : null}

                            <PanelSurface
                                variant="soft"
                                padding="sm"
                                className={[
                                    "space-y-2 border",
                                    "border-[color:color-mix(in_oklab,var(--accent)_34%,var(--border)_66%)]",
                                    "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--panel)_96%,var(--accent)_4%),var(--panel))]",
                                    "shadow-[0_18px_38px_color-mix(in_oklab,var(--accent)_12%,transparent)]",
                                ].join(" ")}
                            >
                                <div className="p-2 md:max-h-[62vh] md:overflow-y-auto md:p-5">
                                    <UsersTable
                                        users={filteredUsers}
                                        onAccess={openAccessModal}
                                        onDelete={openDeleteModal}
                                    />
                                </div>
                            </PanelSurface>
                        </div>

                        <aside className="hidden xl:block">
                            <div className="sticky top-24">
                                <PanelSurface
                                    variant="soft"
                                    padding="sm"
                                    className={[
                                        "space-y-2 border",
                                        "border-[color:color-mix(in_oklab,var(--accent)_34%,var(--border)_66%)]",
                                        "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--panel)_96%,var(--accent)_4%),var(--panel))]",
                                        "shadow-[0_18px_38px_color-mix(in_oklab,var(--accent)_12%,transparent)]",
                                    ].join(" ")}
                                >
                                    <div className="px-1 pt-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-55">
                                            Resumen
                                        </p>

                                        <p className="mt-1 text-xs leading-5 opacity-65">
                                            Indicadores rápidos del módulo.
                                        </p>
                                    </div>

                                    <CompactStat
                                        icon={Users}
                                        label="Usuarios"
                                        value={stats.total}
                                    />

                                    <CompactStat
                                        icon={ShieldCheck}
                                        label="Activos"
                                        value={stats.activos}
                                        tone="success"
                                    />

                                    <CompactStat
                                        icon={Mail}
                                        label="Inactivos"
                                        value={stats.inactivos}
                                        tone="warning"
                                    />
                                </PanelSurface>
                            </div>
                        </aside>
                    </div>
                </PanelSurface>
            </PageSurface>

            <CompleteAccessModal
                open={accessModalOpen}
                user={selectedUser}
                onClose={closeAccessModal}
                onSaved={handleAccessSaved}
            />

            <ConfirmModal
                open={deleteModal.open}
                title="Eliminar usuario"
                message={buildDeleteUserMessage(deleteModal.user)}
                confirmText="Sí, eliminar usuario"
                cancelText="Cancelar"
                loading={saving}
                variant="danger"
                onCancel={closeDeleteModal}
                onConfirm={confirmDeleteUser}
            />
        </>
    );
}
