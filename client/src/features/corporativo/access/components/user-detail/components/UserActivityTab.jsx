// client/src/features/corporativo/access/components/user-detail/components/UserActivityTab.jsx
import React from "react";
import { Activity } from "lucide-react";

import { DetailGrid, DetailItem, DetailSection } from "@/core/ui/detail";

import {
    EMPTY_VALUE,
    formatDate,
} from "@/features/corporativo/access/components/user-detail/utils/userDetail.utils.js";

export default function UserActivityTab({ user }) {
    const activity = user?.actividad || {};

    return (
        <DetailSection
            icon={Activity}
            title="Actividad"
            description="Actividad reciente del usuario."
        >
            <DetailGrid>
                <DetailItem
                    label="Último acceso"
                    value={formatDate(activity?.ultimoAcceso)}
                />

                <DetailItem
                    label="Última IP"
                    value={activity?.ultimaIp || EMPTY_VALUE}
                />

                <DetailItem
                    label="Último dispositivo"
                    value={activity?.ultimoDispositivo || EMPTY_VALUE}
                />

                <DetailItem
                    label="Creado"
                    value={formatDate(activity?.createdAt)}
                />

                <DetailItem
                    label="Actualizado"
                    value={formatDate(activity?.updatedAt)}
                />
            </DetailGrid>
        </DetailSection>
    );
}
