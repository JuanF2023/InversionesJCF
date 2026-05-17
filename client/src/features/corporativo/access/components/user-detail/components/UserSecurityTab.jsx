// client/src/features/corporativo/access/components/user-detail/components/UserSecurityTab.jsx
import React from "react";
import { LockKeyhole } from "lucide-react";

import { DetailGrid, DetailItem, DetailSection } from "@/core/ui/detail";

import {
    EMPTY_VALUE,
    formatDate,
    yesNo,
} from "@/features/corporativo/access/components/user-detail/utils/userDetail.utils.js";

export default function UserSecurityTab({ user }) {
    const security = user?.security || {};

    return (
        <DetailSection
            icon={LockKeyhole}
            title="Seguridad"
            description="Información básica de seguridad del usuario."
        >
            <DetailGrid>
                <DetailItem
                    label="PIN configurado"
                    value={yesNo(Boolean(security?.hasPin))}
                />

                <DetailItem
                    label="Longitud PIN"
                    value={security?.pinLength || EMPTY_VALUE}
                />

                <DetailItem
                    label="PIN actualizado"
                    value={formatDate(security?.pinChangedAt)}
                />

                <DetailItem
                    label="Intentos fallidos"
                    value={security?.failedPinAttempts ?? 0}
                />

                <DetailItem
                    label="Bloqueado hasta"
                    value={formatDate(security?.lockedUntil)}
                />

                <DetailItem
                    label="Debe cambiar PIN"
                    value={yesNo(Boolean(security?.mustChangePin))}
                />
            </DetailGrid>
        </DetailSection>
    );
}
