// client/src/features/corporativo/access/pages/RolesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    ShieldCheck,
    Users,
    KeyRound,
    Search,
    Layers3,
    ChevronRight,
} from "lucide-react";

const ROLES = [
    {
        id: "owner",
        name: "Owner",
        description:
            "Control total del tenant, usuarios, configuraci車n y gobierno operativo.",
        members: 2,
        permissions: 24,
        level: 100,
        color: "violet",
    },
    {
        id: "manager",
        name: "Manager",
        description:
            "Administra operaci車n, supervisa equipos y consulta reportes clave.",
        members: 4,
        permissions: 16,
        level: 80,
        color: "sky",
    },
    {
        id: "editor",
        name: "Editor",
        description:
            "Puede crear y modificar registros dentro de m車dulos permitidos.",
        members: 6,
        permissions: 10,
        level: 50,
        color: "amber",
    },
    {
        id: "viewer",
        name: "Viewer",
        description: "Acceso de solo lectura para consulta y seguimiento.",
        members: 8,
        permissions: 4,
        level: 10,
        color: "slate",
    },
];

const cx = (...classes) => classes.filter(Boolean).join(" ");

function getRoleTone(color) {
    const map = {
        violet: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
        sky: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
        amber: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        slate: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300",
    };

    return map[color] || map.slate;
}

export default function RolesPage() {
    const [search, setSearch] = useState("");

    const filteredRoles = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return ROLES;

        return ROLES.filter((role) => {
            return (
                role.name.toLowerCase().includes(q) ||
                role.description.toLowerCase().includes(q)
            );
        });
    }, [search]);

    useEffect(() => {
        document.title = "Roles | Accesos";
    }, []);

    return (
        <section className="space-y-6">
            <section className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-sm md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-55">
                            Cat芍logo de roles
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                            Jerarqu赤a funcional del sistema
                        </h2>
                        <p className="mt-2 text-sm leading-6 opacity-75">
                            Define niveles de acceso, cantidad de miembros y alcance de
                            permisos por rol para controlar la operaci車n del tenant.
                        </p>
                    </div>

                    <div className="relative min-w-[260px] lg:min-w-[320px]">
                        <Search
                            size={16}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-55"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar rol..."
                            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[var(--accent,#7c3aed)]"
                        />
                    </div>
                </div>
            </section>

            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {filteredRoles.map((role) => (
                    <article
                        key={role.id}
                        className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)] p-5 shadow-sm transition hover:shadow-md"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-55">
                                    Rol
                                </p>
                                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                                    {role.name}
                                </h3>
                            </div>

                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--chip)] p-3 opacity-80">
                                <ShieldCheck size={18} />
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <span
                                className={cx(
                                    "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                                    getRoleTone(role.color)
                                )}
                            >
                                Nivel {role.level}
                            </span>

                            <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--chip)] px-2.5 py-1 text-xs font-semibold">
                                {role.permissions} permisos
                            </span>
                        </div>

                        <p className="mt-4 text-sm leading-6 opacity-80">{role.description}</p>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] opacity-55">
                                    <Users size={13} />
                                    Miembros
                                </div>
                                <div className="mt-3 text-3xl font-semibold tracking-tight">
                                    {role.members}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] opacity-55">
                                    <KeyRound size={13} />
                                    Permisos
                                </div>
                                <div className="mt-3 text-3xl font-semibold tracking-tight">
                                    {role.permissions}
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-3">
                            <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs font-semibold opacity-70">
                                <Layers3 size={14} />
                                Membership ready
                            </div>

                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--chip)] px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                            >
                                Administrar rol
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            {filteredRoles.length === 0 && (
                <div className="rounded-[28px] border border-dashed border-[var(--border)] bg-[var(--panel)] p-10 text-center">
                    <p className="text-base font-semibold">No se encontraron roles</p>
                    <p className="mt-2 text-sm opacity-70">
                        Ajusta el criterio de b迆squeda para visualizar resultados.
                    </p>
                </div>
            )}
        </section>
    );
}
