// client/src/features/corporativo/access/components/access-modal/components/NewAccessForm.jsx
import React from "react";

import { FormField, SelectInput } from "@/core/ui/forms";
import PanelSurface from "@/core/ui/surfaces/PanelSurface.jsx";

import NoAvailableTenantsState from "@/features/corporativo/access/components/access-modal/components/NoAvailableTenantsState.jsx";

export default function NewAccessForm({
    tenantId,
    roleId,
    availableTenants,
    filteredRoles,
    disabled,
    hasAvailableTenants,
    onTenantChange,
    onRoleChange,
}) {
    return (
        <PanelSurface padding="md" variant="soft">
            <div className="mb-4">
                <p className="text-sm font-bold">Nuevo acceso</p>

                <p className="mt-1 text-xs opacity-65">
                    La relación se guardará como usuario, tenant y rol.
                </p>
            </div>

            {!hasAvailableTenants ? (
                <NoAvailableTenantsState />
            ) : (
                <div className="space-y-4">
                    <FormField label="Tenant" required>
                        <SelectInput
                            value={tenantId}
                            onChange={onTenantChange}
                            disabled={disabled}
                        >
                            <option value="">Seleccione tenant</option>

                            {availableTenants.map((tenant) => (
                                <option key={tenant.id} value={tenant.id}>
                                    {tenant.nombre}
                                </option>
                            ))}
                        </SelectInput>
                    </FormField>

                    <FormField label="Rol" required>
                        <SelectInput
                            value={roleId}
                            onChange={onRoleChange}
                            disabled={
                                disabled ||
                                !tenantId ||
                                !filteredRoles.length
                            }
                        >
                            <option value="">
                                {tenantId && !filteredRoles.length
                                    ? "No hay roles disponibles"
                                    : "Seleccione rol"}
                            </option>

                            {filteredRoles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.nombre}
                                </option>
                            ))}
                        </SelectInput>
                    </FormField>
                </div>
            )}
        </PanelSurface>
    );
}
