// client/src/features/corporativo/access/components/user-detail/components/UserDetailFooterActions.jsx
import React from "react";
import { Link } from "react-router-dom";

import TableActionButton from "@/core/ui/actions/TableActionButton.jsx";

export default function UserDetailFooterActions({
    userId,
    onManageAccess,
    showBack = true,
    editLabel = "Editar usuario",
    accessLabel = "Gestionar acceso",
    backLabel = "Volver a usuarios",
}) {
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <TableActionButton
                as={Link}
                to={`/corporativo/admin/users/${userId}/edit`}
                variant="edit"
            >
                {editLabel}
            </TableActionButton>

            <TableActionButton variant="access" onClick={onManageAccess}>
                {accessLabel}
            </TableActionButton>

            {showBack ? (
                <TableActionButton
                    as={Link}
                    to="/corporativo/admin/users"
                    variant="neutral"
                >
                    {backLabel}
                </TableActionButton>
            ) : null}
        </div>
    );
}
