// client/src/components/layouts/UserMenu.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Users, ShieldHalf, LockKeyhole, UserPlus2 } from "lucide-react";
import RouteTabs from "@/components/ui/navigation/RouteTabs.jsx";

const TABS = [
    { to: ".", label: "Usuarios", icon: Users, index: true },
    { to: "roles", label: "Roles", icon: ShieldHalf },
    { to: "permisos", label: "Permisos", icon: LockKeyhole },
    { to: "nuevo", label: "Nuevo usuario", icon: UserPlus2 },
];

export default function UserMenu() {
    return (
        <section className="w-full">
            <RouteTabs items={TABS} ariaLabel="Gestión de usuarios" />
            <div className="pt-6">
                <Outlet />
            </div>
        </section>
    );
}
