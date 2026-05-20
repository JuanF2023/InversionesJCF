// client/src/features/corporativo/access/components/access-modal/components/AccessSummaryPanel.jsx
import React from "react";
import { KeyRound } from "lucide-react";

import { DetailGrid, DetailItem } from "@/core/ui/detail";
import PanelSurface from "@/core/ui/surfaces/PanelSurface.jsx";

export default function AccessSummaryPanel({ selectedTenant, selectedRole }) {
    return (
        <PanelSurface padding="md" variant="soft">
            <div className="mb-3 flex items-center gap-2">
                <KeyRound size={15} className="opacity-65" />

                <p className="text-sm font-bold">
                    Resumen antes de guardar
                </p>
            </div>

            <DetailGrid columns={1} gap="sm">
                <DetailItem
                    label="Tenant"
                    value={selectedTenant?.nombre || "Pendiente"}
                />

                <DetailItem
                    label="Rol"
                    value={selectedRole?.nombre || "Pendiente"}
                />

                <DetailItem label="Estado" value="active" />
            </DetailGrid>
        </PanelSurface>
    );
}
