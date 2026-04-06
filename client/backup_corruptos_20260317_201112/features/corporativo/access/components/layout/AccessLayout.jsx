// client/src/features/corporativo/access/components/layout/AccessLayout.jsx
import React, { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
    Users,
    ShieldCheck,
    KeyRound,
    UserPlus,
    PlusCircle,
    Layers3,
} from "lucide-react";

import RouteTabs from "@/components/ui/navigation/RouteTabs.jsx";
import AddAction from "@/components/ui/primitives/AddAction.jsx";

const TABS = [
    { to: "", label: "Usuarios", icon: Users, end: true, index: true },
    { to: "roles", label: "Roles", icon: ShieldCheck },
    { to: "permisos", label: "Permisos", icon: KeyRound },
];

export default function AccessLayout() {
    const location = useLocation();

    const actionConfig = useMemo(() => {
        if (location.pathname.includes("/permisos")) {
            return {
                to: "/corporativo/admin/users/permisos",
                label: "Nuevo permiso",
                icon: Layers3,
            };
        }

        if (location.pathname.includes("/roles")) {
            return {
                to: "/corporativo/admin/users/roles",
                label: "Crear rol",
                icon: PlusCircle,
            };
        }

        return {
            to: "/corporativo/admin/users/nuevo",
            label: "Agregar usuario",
            icon: UserPlus,
        };
    }, [location.pathname]);

    const ActionIcon = actionConfig.icon;

    return (
        <section className="w-full space-y-6">
            <RouteTabs
                items={TABS}
                ariaLabel="Módulo de accesos"
                action={
                    <AddAction to={actionConfig.to}>
                        <span className="inline-flex items-center gap-2">
                            <ActionIcon size={16} />
                            {actionConfig.label}
                        </span>
                    </AddAction>
                }
            />

            <div className="grid gap-6">
                <div className="overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--panel)] shadow-sm">
                    <div className="flex flex-col gap-6 p-5 md:p-6 xl:flex-row xl:items-end xl:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-55">
                                Accesos
                            </p>
                            <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                                Usuarios, roles y permisos
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 opacity-75">
                                Administra identidad, acceso por tenant, jerarquía funcional y
                                gobierno de permisos del sistema desde un solo panel operativo.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-[var(--border)] bg-[var(--chip)] px-3 py-1.5 text-xs font-semibold">
                                Multi-tenant
                            </span>
                            <span className="rounded-full border border-[var(--border)] bg-[var(--chip)] px-3 py-1.5 text-xs font-semibold">
                                RBAC
                            </span>
                            <span className="rounded-full border border-[var(--border)] bg-[var(--chip)] px-3 py-1.5 text-xs font-semibold">
                                Auditoría futura
                            </span>
                        </div>
                    </div>
                </div>

                <Outlet />
            </div>
        </section>
    );
}
