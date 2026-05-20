// client/src/features/corporativo/access/components/user-detail/components/MembershipCard.jsx
import React from "react";
import { Building2 } from "lucide-react";

import { DetailGrid, DetailItem } from "@/core/ui/detail";

import {
    EMPTY_VALUE,
    formatDate,
    formatStatusLabel,
    formatSystemLabel,
} from "@/features/corporativo/access/components/user-detail/utils/userDetail.utils.js";

function MembershipStatusBadge({ status = "unknown" }) {
    return (
        <span
            className="rounded-full border px-3 py-1 text-xs font-semibold"
            style={{
                borderColor:
                    "color-mix(in srgb, var(--accent) 28%, var(--border))",
                backgroundColor:
                    "color-mix(in srgb, var(--accent) 10%, var(--chip))",
                color: "var(--accent)",
            }}
        >
            {formatStatusLabel(status)}
        </span>
    );
}

export default function MembershipCard({ membership }) {
    return (
        <article className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <Building2 size={16} className="opacity-70" />

                        <h4 className="truncate text-sm font-semibold">
                            {membership?.tenantNombre || "Sin tenant"}
                        </h4>
                    </div>

                    <p className="mt-1 text-xs opacity-70">
                        {formatSystemLabel(membership?.tenantTipo)}
                    </p>
                </div>

                <MembershipStatusBadge
                    status={membership?.membershipStatus || "unknown"}
                />
            </div>

            <DetailGrid gap="sm" className="mt-4">
                <DetailItem
                    label="Rol"
                    value={membership?.roleName || EMPTY_VALUE}
                />

                <DetailItem
                    label="Role key"
                    value={membership?.roleKey || EMPTY_VALUE}
                />

                <DetailItem
                    label="Asignado"
                    value={formatDate(membership?.assignedAt)}
                />

                <DetailItem
                    label="Actualizado"
                    value={formatDate(membership?.updatedAt)}
                />

                <DetailItem
                    label="Expira"
                    value={formatDate(membership?.expiresAt)}
                />

                <DetailItem
                    label="Tenant key"
                    value={membership?.tenantKey || EMPTY_VALUE}
                />
            </DetailGrid>
        </article>
    );
}
