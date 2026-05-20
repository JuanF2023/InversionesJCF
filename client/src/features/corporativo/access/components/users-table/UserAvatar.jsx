// client/src/features/corporativo/access/components/users-table/UserAvatar.jsx
import React from "react";

import { initialsFromName } from "./users-table.utils.js";

export default function UserAvatar({ name }) {
  return (
    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--chip)] text-xs font-bold">
      {initialsFromName(name) || "U"}
    </div>
  );
}
