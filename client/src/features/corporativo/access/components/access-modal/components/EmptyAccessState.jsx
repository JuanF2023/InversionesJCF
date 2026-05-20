// client/src/features/corporativo/access/components/access-modal/components/EmptyAccessState.jsx
import React from "react";

export default function EmptyAccessState() {
    return (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--panel)] p-4">
            <p className="text-sm font-semibold">Sin accesos asignados.</p>

            <p className="mt-1 text-xs opacity-65">
                Selecciona tenant y rol para crear el primer acceso.
            </p>
        </div>
    );
}
