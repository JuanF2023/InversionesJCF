// client/src/features/corporativo/access/components/users-table/UsersDesktopTable.jsx
import React from "react";
import { Mail, Eye, Pencil, KeyRound, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import TableActionButton from "@/core/ui/actions/TableActionButton.jsx";
import { DataTable, TableContainer } from "@/core/ui/tables";

import UserAvatar from "./UserAvatar.jsx";
import UserAccessChips from "./UserAccessChips.jsx";
import UserStatusBadge from "./UserStatusBadge.jsx";

export default function UsersDesktopTable({ users = [], onAccess, onDelete }) {
    return (
        <div className="hidden md:block">
            <TableContainer>
                <DataTable>
                    <thead>
                        <tr>
                            <th className="sticky top-0 z-10 bg-[var(--panel)]">
                                Usuario
                            </th>

                            <th className="sticky top-0 z-10 bg-[var(--panel)]">
                                Accesos
                            </th>

                            <th className="sticky top-0 z-10 bg-[var(--panel)]">
                                Estado
                            </th>

                            <th className="sticky top-0 z-10 bg-[var(--panel)] text-right">
                                Acciones
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>
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

                                <td>
                                    <UserAccessChips user={user} />
                                </td>

                                <td>
                                    <UserStatusBadge activo={user.activo} />
                                </td>

                                <td className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <TableActionButton
                                            as={Link}
                                            to={`/corporativo/admin/users/${user.id}`}
                                            icon={Eye}
                                            variant="view"
                                        >
                                            Ver
                                        </TableActionButton>

                                        <TableActionButton
                                            as={Link}
                                            to={`/corporativo/admin/users/${user.id}/edit`}
                                            icon={Pencil}
                                            variant="edit"
                                        >
                                            Editar
                                        </TableActionButton>

                                        <TableActionButton
                                            icon={KeyRound}
                                            variant="edit"
                                            onClick={() => onAccess?.(user)}
                                        >
                                            Gestionar acceso
                                        </TableActionButton>

                                        <TableActionButton
                                            icon={Trash2}
                                            variant="danger"
                                            onClick={() => onDelete?.(user)}
                                        >
                                            Eliminar
                                        </TableActionButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </DataTable>
            </TableContainer>
        </div>
    );
}
