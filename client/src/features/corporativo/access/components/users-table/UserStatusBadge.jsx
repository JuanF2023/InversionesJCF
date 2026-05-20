// client/src/features/corporativo/access/components/users-table/UserStatusBadge.jsx
import React from "react";

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function UserStatusBadge({ activo }) {
    return (
        <span
            className={cx(
                "inline-flex min-w-[64px] items-center justify-center px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.04em]",
                activo
                    ? "text-[color:color-mix(in_oklab,var(--accent)_70%,var(--text)_30%)]"
                    : "text-[color:color-mix(in_oklab,var(--muted)_78%,var(--text)_22%)]"
            )}
            title={activo ? "Usuario activo" : "Usuario inactivo"}
        >
            {activo ? "Activo" : "Inactivo"}
        </span>
    );
}
