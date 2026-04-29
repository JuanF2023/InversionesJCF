// client/src/features/corporativo/access/components/UsersTable.jsx
import React from "react";
import { Mail, Eye, Pencil, KeyRound, Trash2, Building2 } from "lucide-react";
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

function getUserAccesses(user) {
  const memberships = Array.isArray(user?.memberships) ? user.memberships : [];

  const validMemberships = memberships.filter(
    (m) =>
      m &&
      m.tenantNombre &&
      m.tenantNombre !== "Sin tenant" &&
      m.roleName &&
      m.roleName !== "Sin rol"
  );

  if (validMemberships.length) return validMemberships;

  if (
    user?.tenantNombre &&
    user?.tenantNombre !== "Sin tenant" &&
    user?.roleName &&
    user?.roleName !== "Sin rol"
  ) {
    return [
      {
        tenantNombre: user.tenantNombre,
        roleName: user.roleName,
        membershipStatus: user.membershipStatus || "active",
      },
    ];
  }

  return [];
}

function AccessChips({ user }) {
  const accesses = getUserAccesses(user);

  if (!accesses.length) {
    return (
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700">
          Sin acceso asignado
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {accesses.map((access, index) => (
        <div
          key={`${access.membershipId || access.tenantId || access.tenantNombre}-${access.roleName}-${index}`}
          className="inline-flex w-fit items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs"
        >
          <Building2 size={13} className="opacity-70" />
          <span className="font-semibold">{access.tenantNombre}</span>
          <span className="opacity-50">/</span>
          <span className="opacity-80">{access.roleName}</span>
        </div>
      ))}
    </div>
  );
}

export default function UsersTable({ users = [], onAccess, onDelete }) {
  if (!users.length) {
    return (
      <div className="py-14 text-center">
        <p className="font-semibold">No hay usuarios</p>
      </div>
    );
  }

  return (
    <table className="min-w-full border-collapse text-sm">
      <thead>
        <tr className="text-left">
          <th className="py-3">Usuario</th>
          <th>Accesos</th>
          <th>Estado</th>
          <th className="text-right">Acciones</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => {
          const accesses = getUserAccesses(user);
          const missingAccess = accesses.length === 0;

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

              <td className="py-4">
                <AccessChips user={user} />
              </td>

              <td>
                <StatusBadge activo={user.activo} />
              </td>

              <td className="text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    to={`/corporativo/admin/users/${user.id}`}
                    className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs"
                  >
                    <Eye size={14} />
                    Ver
                  </Link>

                  <Link
                    to={`/corporativo/admin/users/${user.id}/edit`}
                    className="inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-xs"
                  >
                    <Pencil size={14} />
                    Editar
                  </Link>

                  <button
                    type="button"
                    onClick={() => onAccess?.(user)}
                    className={cx(
                      "inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs",
                      missingAccess
                        ? "bg-amber-500 text-white"
                        : "border border-[var(--border)]"
                    )}
                  >
                    <KeyRound size={14} />
                    Acceso
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete?.(user)}
                    className="inline-flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={14} />
                    Eliminar
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
