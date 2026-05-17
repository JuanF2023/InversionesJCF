// client/src/features/corporativo/access/components/user-detail/components/UserAccessTab.jsx
import React from "react";
import { KeyRound, Layers3 } from "lucide-react";

import PanelSurface from "@/core/ui/surfaces/PanelSurface.jsx";
import { DetailSection } from "@/core/ui/detail";
import TableActionButton from "@/core/ui/actions/TableActionButton.jsx";

import MembershipCard from "@/features/corporativo/access/components/user-detail/components/MembershipCard.jsx";

import { getMembershipKey } from "@/features/corporativo/access/components/user-detail/utils/userDetail.utils.js";

export default function UserAccessTab({ memberships, onManageAccess }) {
    return (
        <DetailSection
            icon={Layers3}
            title="Accesos asignados"
            description="Lista completa de memberships activos del usuario."
            actions={
                <TableActionButton
                    icon={KeyRound}
                    variant="access"
                    onClick={onManageAccess}
                >
                    Gestionar acceso
                </TableActionButton>
            }
        >
            {memberships.length === 0 ? (
                <PanelSurface variant="soft" padding="md">
                    <p className="text-sm opacity-70">
                        No hay accesos asignados.
                    </p>
                </PanelSurface>
            ) : (
                <div className="grid gap-4">
                    {memberships.map((membership, index) => (
                        <MembershipCard
                            key={getMembershipKey(membership, index)}
                            membership={membership}
                        />
                    ))}
                </div>
            )}
        </DetailSection>
    );
}
