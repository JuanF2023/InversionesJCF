// client/src/features/corporativo/access/pages/UsersPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    Search,
    Users,
    ShieldCheck,
    Mail,
    Building2,
    UserPlus,
    RefreshCcw,
    AlertTriangle,
    KeyRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAccessUsersStore } from "@/features/corporativo/access/store/accessUsers.store.js";
import UsersTable from "@/features/corporativo/access/components/UsersTable.jsx";
import CompleteAccessModal from "@/features/corporativo/access/components/CompleteAccessModal.jsx";

const cx = (...classes) => classes.filter(Boolean).join(" ");

function StatCard({ icon: Icon, label, value, helper, tone = "default" }) {
    return (
        <article className="rounded-[24px] border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-55">
                        {label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
                    {helper ? <p className="mt-1 text-xs opacity-65">{helper}</p> : null}
                </div>

                <div
                    className={cx(
                        "rounded-2xl border border-[var(--border)] p-3",
                        tone === "success" && "bg-emerald-500/10",
                        tone === "warning" && "bg-amber-500/10",
                        tone === "default" && "bg-[var(--chip)]"
                    )}
                >
                    <Icon size={18} className="opacity-80" />
                </div>
            </div>
        </article>
    );
}

function InfoBanner({ missingTenant, missingRole, corruptedRole }) {
    if (!missingTenant && !missingRole && !corruptedRole) return null;

    return (
        <section className="rounded-[24px] border border-amber-500/25 bg-amber-500/10 p-4 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="mt-0.5">
                    <AlertTriangle size={18} className="text-amber-600 dark:text-amber-300" />
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-semibold">Avisos operativos del m��dulo de acceso</p>

                    <div className="mt-2 flex flex-wrap gap-2">
                        {missingTenant ? (
                            <span className="rounded-full border border-amber-500/25 bg-white/50 px-3 py-1 text-xs font-medium dark:bg-black/10">
                                {missingTenant} usuario(s) sin tenant resuelto
                            </span>
                        ) : null}

                        {missingRole ? (
                            <span className="rounded-full border border-amber-500/25 bg-white/50 px-3 py-1 text-xs font-medium dark:bg-black/10">
                                {missingRole} usuario(s) sin rol resuelto
                            </span>
                        ) : null}

                        {corruptedRole ? (
                            <span className="rounded-full border border-amber-500/25 bg-white/50 px-3 py-1 text-xs font-medium dark:bg-black/10">
                                {corruptedRole} rol(es) con texto sospechoso
                            </span>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function UsersPage() {
    const items = useAccessUsersStore((s) => s.items);
    const total = useAccessUsersStore((s) => s.total);
    const loading = useAccessUsersStore((s) => s.loading);
    const error = useAccessUsersStore((s) => s.error);
    const cargar = useAccessUsersStore((s) => s.cargar);

    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [accessModalOpen, setAccessModalOpen] = useState(false);

    useEffect(() => {
        cargar({ page: 1, limit: 50 }).catch(() => {
            toast.error("Error cargando usuarios");
        });
    }, [cargar]);

    const stats = useMemo(() => {
        const activos = items.filter((u) => u.activo === true).length;
        const inactivos = items.filter((u) => u.activo !== true).length;

        const missingTenant = items.filter(
            (u) => !u.tenantNombre || u.tenantNombre === "Sin tenant"
        ).length;

        const missingRole = items.filter(
            (u) => !u.roleName || u.roleName === "Sin rol"
        ).length;

        const corruptedRole = items.filter((u) =>
            /\?/.test(String(u.roleName || ""))
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
        if (!search) return items;

        const term = search.toLowerCase();

        return items.filter((u) =>
            `${u.nombre} ${u.email}`.toLowerCase().includes(term)
        );
    }, [items, search]);

    function reloadUsers() {
        cargar({ page: 1, limit: 50 });
    }

    function openAccessModal(user) {
        setSelectedUser(user);
        setAccessModalOpen(true);
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

    return (
        <>
            <section className="space-y-6">

                <InfoBanner
                    missingTenant={stats.missingTenant}
                    missingRole={stats.missingRole}
                    corruptedRole={stats.corruptedRole}
                />

                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard icon={Users} label="Usuarios" value={stats.total} />
                    <StatCard icon={ShieldCheck} label="Activos" value={stats.activos} tone="success" />
                    <StatCard icon={Mail} label="Inactivos" value={stats.inactivos} tone="warning" />
                </div>

                <section className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-sm">

                    <div className="flex justify-between items-center mb-4">

                        <div className="relative w-full max-w-sm">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-55"
                            />

                            <input
                                type="text"
                                placeholder="Buscar usuario..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] py-3 pl-10 pr-3 text-sm"
                            />
                        </div>

                        <div className="flex gap-2">

                            <button
                                onClick={reloadUsers}
                                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold"
                            >
                                <RefreshCcw size={15} />
                                Actualizar
                            </button>

                            <Link
                                to="/corporativo/admin/users/nuevo"
                                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                            >
                                <UserPlus size={15} />
                                Agregar
                            </Link>

                        </div>

                    </div>

                    <UsersTable users={filteredUsers} onAccess={openAccessModal} />

                </section>

            </section>

            <CompleteAccessModal
                open={accessModalOpen}
                user={selectedUser}
                onClose={closeAccessModal}
                onSaved={handleAccessSaved}
            />
        </>
    );
}


