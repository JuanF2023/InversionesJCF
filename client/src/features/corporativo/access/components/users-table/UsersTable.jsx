// client/src/features/corporativo/access/components/users-table/UsersTable.jsx
import React from "react";

import { TableEmpty } from "@/core/ui/tables";

import UsersDesktopTable from "./UsersDesktopTable.jsx";
import UsersMobileCards from "./UsersMobileCards.jsx";

export default function UsersTable({ users = [], onAccess, onDelete }) {
  if (!users.length) {
    return (
      <TableEmpty
        title="No hay usuarios"
        description="Cuando existan usuarios registrados, aparecerán en esta tabla."
      />
    );
  }

  return (
    <>
      <UsersMobileCards
        users={users}
        onAccess={onAccess}
        onDelete={onDelete}
      />

      <UsersDesktopTable
        users={users}
        onAccess={onAccess}
        onDelete={onDelete}
      />
    </>
  );
}
