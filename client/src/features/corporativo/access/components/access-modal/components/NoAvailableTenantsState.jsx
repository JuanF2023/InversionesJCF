// client/src/features/corporativo/access/components/access-modal/components/NoAvailableTenantsState.jsx
import React from "react";
import { Info } from "lucide-react";

export default function NoAvailableTenantsState() {
    return (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4">
            <div className="flex gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--chip)]">
                    <Info size={16} className="opacity-70" />
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-bold">
                        No hay tenants disponibles para asignar.
                    </p>

                    <p className="mt-1 text-xs leading-5 opacity-70">
                        Este usuario ya tiene acceso a todos los tenants
                        disponibles. Para cambiar un rol, primero quita el acceso
                        actual y luego crea una nueva asignación.
                    </p>
                </div>
            </div>
        </div>
    );
}
