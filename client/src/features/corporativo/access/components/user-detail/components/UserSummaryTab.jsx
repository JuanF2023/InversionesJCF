// client/src/features/corporativo/access/components/user-detail/components/UserSummaryTab.jsx
import React from "react";
import { ShieldCheck, UserRound } from "lucide-react";

import { DetailGrid, DetailItem, DetailSection } from "@/core/ui/detail";

import {
    EMPTY_VALUE,
    formatStatusLabel,
    formatSystemLabel,
} from "@/features/corporativo/access/components/user-detail/utils/userDetail.utils.js";

export default function UserSummaryTab({ user }) {
    const mainAccess = user?.accesoPrincipal || {};

    return (
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <DetailSection
            icon={UserRound}
            title="Información general"
            description="Información principal del usuario."
        >
            <DetailGrid>
                <DetailItem
                    label="Nombre"
                    value={user?.nombre || EMPTY_VALUE}
                />

                <DetailItem
                    label="Email"
                    value={user?.email || EMPTY_VALUE}
                />

                <DetailItem
                    label="Estado"
                    value={formatStatusLabel(user?.estado)}
                />

                <DetailItem
                    label="ID técnico"
                    value={user?.id || EMPTY_VALUE}
                />
            </DetailGrid>
        </DetailSection>

        <DetailSection
            icon={ShieldCheck}
            title="Acceso principal"
            description="Tenant y rol principal asignado."
        >
            <DetailGrid>
                <DetailItem
                    label="Tenant"
                    value={mainAccess?.tenantNombre || EMPTY_VALUE}
                />

                <DetailItem
                    label="Tipo tenant"
                    value={formatSystemLabel(mainAccess?.tenantTipo)}
                />

                <DetailItem
                    label="Rol"
                    value={mainAccess?.roleName || EMPTY_VALUE}
                />

                <DetailItem
                    label="Estado membership"
                    value={formatStatusLabel(mainAccess?.membershipStatus)}
                />
            </DetailGrid>
        </DetailSection>
    </div>
    );
}
