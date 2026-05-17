// client/src/features/corporativo/access/components/access-modal/components/CurrentAccessPanel.jsx
import React from "react";

import PanelSurface from "@/core/ui/surfaces/PanelSurface.jsx";

import AccessCard from "@/features/corporativo/access/components/access-modal/components/AccessCard.jsx";
import EmptyAccessState from "@/features/corporativo/access/components/access-modal/components/EmptyAccessState.jsx";

export default function CurrentAccessPanel({
    memberships,
    deletingAccessId,
    onDelete,
}) {
    return (
        <PanelSurface padding="md" variant="soft">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-bold">Accesos actuales</p>

                    <p className="mt-1 text-xs opacity-65">
                        Memberships asignados actualmente.
                    </p>
                </div>

                <span className="rounded-full border border-[var(--border)] bg-[var(--chip)] px-3 py-1 text-xs font-bold">
                    {memberships.length}
                </span>
            </div>

            {memberships.length ? (
                <div className="grid gap-3">
                    {memberships.map((membership, index) => (
                        <AccessCard
                            key={
                                membership.membershipId ||
                                `${membership.tenantId || "tenant"}-${membership.roleId || "role"}-${index}`
                            }
                            membership={membership}
                            deleting={
                                deletingAccessId === membership.membershipId
                            }
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            ) : (
                <EmptyAccessState />
            )}
        </PanelSurface>
    );
}
