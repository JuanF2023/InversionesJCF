// client/src/features/corporativo/access/components/users-table/UsersMobileCards.jsx
import React from "react";
import { Mail, Eye, Pencil, KeyRound, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import TableActionButton from "@/core/ui/actions/TableActionButton.jsx";
import PanelSurface from "@/core/ui/surfaces/PanelSurface.jsx";

import UserAvatar from "./UserAvatar.jsx";
import UserAccessChips from "./UserAccessChips.jsx";
import UserStatusBadge from "./UserStatusBadge.jsx";

export default function UsersMobileCards({ users = [], onAccess, onDelete }) {
    return (
        <div className="grid gap-5 md:hidden">
            {users.map((user) => (
                <PanelSurface
                    key={user.id}
                    padding="md"
                    variant="soft"
                    className="relative overflow-hidden border-2 border-[color:color-mix(in_srgb,var(--accent)_62%,var(--border))] bg-[color:color-mix(in_srgb,var(--panel)_94%,transparent)] shadow-[0_14px_34px_rgba(0,0,0,0.08)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-white/5 after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-[3px] after:bg-[color:var(--accent)] after:opacity-80"
                >
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <UserAvatar name={user.nombre} />

                            <div className="min-w-0 flex-1">
                                <Link
                                    to={`/corporativo/admin/users/${user.id}`}
                                    className="block truncate text-[15px] font-semibold tracking-[-0.01em] hover:underline"
                                >
                                    {user.nombre}
                                </Link>

                                <div className="mt-1 flex min-w-0 items-center gap-2 text-xs opacity-70">
                                    <Mail size={13} className="shrink-0" />

                                    <span className="truncate">
                                        {user.email}
                                    </span>
                                </div>
                            </div>

                            <UserStatusBadge activo={user.activo} />
                        </div>

                        <div className="space-y-2">
                            <p className="text-[11px] font-bold uppercase tracking-[0.16em] opacity-55">
                                Accesos
                            </p>

                            <UserAccessChips user={user} />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <TableActionButton
                                as={Link}
                                to={`/corporativo/admin/users/${user.id}`}
                                icon={Eye}
                                variant="view"
                                className="w-full"
                            >
                                Ver
                            </TableActionButton>

                            <TableActionButton
                                as={Link}
                                to={`/corporativo/admin/users/${user.id}/edit`}
                                icon={Pencil}
                                variant="edit"
                                className="w-full"
                            >
                                Editar
                            </TableActionButton>

                            <TableActionButton
                                icon={KeyRound}
                                variant="edit"
                                onClick={() => onAccess?.(user)}
                                className="w-full"
                            >
                                Gestionar acceso
                            </TableActionButton>

                            <TableActionButton
                                icon={Trash2}
                                variant="danger"
                                onClick={() => onDelete?.(user)}
                                className="w-full"
                            >
                                Eliminar
                            </TableActionButton>
                        </div>
                    </div>
                </PanelSurface>
            ))}
        </div>
    );
}
