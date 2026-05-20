// client/src/features/corporativo/access/components/user-detail/components/UserAuditTab.jsx
import React from "react";
import { BadgeCheck } from "lucide-react";

import { DetailGrid, DetailItem, DetailSection } from "@/core/ui/detail";

import {
    EMPTY_VALUE,
    formatDate,
} from "@/features/corporativo/access/components/user-detail/utils/userDetail.utils.js";

export default function UserAuditTab({ user }) {
    const audit = user?.auditoria || {};

    return (
        <DetailSection
            icon={BadgeCheck}
            title="Auditoría básica"
            description="Información técnica de auditoría."
        >
            <DetailGrid>
                <DetailItem
                    label="Creado por"
                    value={audit?.createdBy || EMPTY_VALUE}
                />

                <DetailItem
                    label="Actualizado por"
                    value={audit?.updatedBy || EMPTY_VALUE}
                />

                <DetailItem
                    label="Fecha creación"
                    value={formatDate(audit?.createdAt)}
                />

                <DetailItem
                    label="Fecha actualización"
                    value={formatDate(audit?.updatedAt)}
                />
            </DetailGrid>
        </DetailSection>
    );
}
