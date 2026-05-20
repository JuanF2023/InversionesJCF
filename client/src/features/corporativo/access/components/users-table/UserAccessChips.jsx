// client/src/features/corporativo/access/components/users-table/UserAccessChips.jsx
import React from "react";
import { Building2 } from "lucide-react";

import { getUserAccesses } from "./users-table.utils.js";

export default function UserAccessChips({ user }) {
    const accesses = getUserAccesses(user);

    if (!accesses.length) {
        return (
            <div className="flex flex-wrap gap-2">
                <span
                    className={[
                        "rounded-full border px-3 py-1 text-xs font-semibold",
                        "border-[color:color-mix(in_oklab,var(--accent)_34%,var(--border)_66%)]",
                        "bg-[color-mix(in_oklab,var(--panel)_86%,var(--accent)_14%)]",
                        "text-[color:color-mix(in_oklab,var(--accent)_62%,var(--text)_38%)]",
                    ].join(" ")}
                >
                    Sin acceso asignado
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {accesses.map((access, index) => (
                <div
                    key={`${access.tenantNombre}-${access.roleName}-${index}`}
                    className={[
                        "inline-flex w-fit max-w-full items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs",
                        "border-[color:color-mix(in_oklab,var(--accent)_34%,var(--border)_66%)]",
                        "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--panel)_92%,var(--accent)_8%),var(--panel))]",
                        "text-[var(--text)]",
                        "shadow-[0_5px_14px_color-mix(in_oklab,var(--accent)_8%,transparent)]",
                    ].join(" ")}
                >
                    <Building2
                        size={13}
                        className="shrink-0 text-[color:color-mix(in_oklab,var(--accent)_70%,var(--text)_30%)]"
                    />

                    <span className="font-bold">
                        {access.tenantNombre}
                    </span>

                    <span className="opacity-45">/</span>

                    <span className="opacity-75">
                        {access.roleName}
                    </span>
                </div>
            ))}
        </div>
    );
}
