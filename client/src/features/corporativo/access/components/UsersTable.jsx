// client/src/features/corporativo/access/users/components/UsersTable.jsx
import React from "react";
import { Mail, Eye, Pencil, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";

const cx = (...classes) => classes.filter(Boolean).join(" ");

function initialsFromName(name) {
    return String(name || "")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

function UserAvatar({ name }) {
    return (
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--chip)] text-xs font-bold">
            {initialsFromName(name) || "U"}
        </div>
    );
}

function StatusBadge({ activo }) {
    return (
        <span
            className={cx(
                "inline-flex min-w-[92px] justify-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                activo
                    ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-700"
                    : "border-slate-500/35 bg-slate-500/10 text-slate-700"
            )}
        >
            {activo ? "Activo" : "Inactivo"}
        </span>
    );
}

export default function UsersTable({ users = [], onAccess }) {
    if (!users.length) {
        return (
            <div className="text-center py-14">
                <p className="font-semibold">No hay usuarios</p>
            </div>
        );
    }

    return (
        <table className="min-w-full border-collapse text-sm">

            <thead>
                <tr className="text-left">
                    <th className="py-3">Usuario</th>
                    <th>Rol</th>
                    <th>Tenant</th>
                    <th>Estado</th>
                    <th className="text-right">Acciones</th>
                </tr>
            </thead>

            <tbody>

                {users.map((user) => {

                    const missingAccess =
                        !user?.tenantNombre ||
                        !user?.roleName ||
                        user?.tenantNombre === "Sin tenant" ||
                        user?.roleName === "Sin rol";

                    return (
                        <tr key={user.id} className="border-t border-[var(--border)]">

                            <td className="py-4">

                                <div className="flex gap-3">

                                    <UserAvatar name={user.nombre} />

                                    <div>
                                        <Link
                                            to={`/corporativo/admin/users/${user.id}`}
                                            className="font-semibold hover:underline"
                                        >
                                            {user.nombre}
                                        </Link>

                                        <div className="flex items-center gap-2 text-xs opacity-70">
                                            <Mail size={13} />
                                            {user.email}
                                        </div>

                                    </div>

                                </div>

                            </td>

                            <td>{user.roleName || "Sin rol"}</td>
                            <td>{user.tenantNombre || "Sin tenant"}</td>
                            <td><StatusBadge activo={user.activo} /></td>

                            <td className="text-right">

                                <div className="flex justify-end gap-2">

                                    <Link
                                        to={`/corporativo/admin/users/${user.id}`}
                                        className="inline-flex items-center gap-1 border px-3 py-2 rounded-xl text-xs"
                                    >
                                        <Eye size={14} />
                                        Ver
                                    </Link>

                                    <Link
                                        to={`/corporativo/admin/users/${user.id}/editar`}
                                        className="inline-flex items-center gap-1 border px-3 py-2 rounded-xl text-xs"
                                    >
                                        <Pencil size={14} />
                                        Editar
                                    </Link>

                                    <button
                                        onClick={() => onAccess(user)}
                                        className={cx(
                                            "inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs",
                                            missingAccess
                                                ? "bg-amber-500 text-white"
                                                : "border border-[var(--border)]"
                                        )}
                                    >
                                        <KeyRound size={14} />
                                        Acceso
                                    </button>

                                </div>

                            </td>

                        </tr>
                    );
                })}

            </tbody>

        </table>
    );
}
