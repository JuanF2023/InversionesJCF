// client/src/features/corporativo/access/components/access-modal/components/AccessCard.jsx
import React from "react";
import { Building2, ShieldCheck, Trash2 } from "lucide-react";

import { EMPTY_VALUE } from "@/features/corporativo/access/components/access-modal/utils/accessModal.utils.js";

export default function AccessCard({ membership, deleting, onDelete }) {
    const canDelete = Boolean(membership?.membershipId) && !deleting;

    return (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--chip)] p-3">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <Building2 size={15} className="shrink-0 opacity-65" />

                        <p className="truncate text-sm font-bold">
                            {membership?.tenantNombre || "Sin tenant"}
                        </p>
                    </div>

                    <p className="mt-1 text-xs opacity-65">
                        {membership?.tenantTipo || EMPTY_VALUE}
                    </p>
                </div>

                <span className="shrink-0 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
                    {membership?.membershipStatus || "active"}
                </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                    <ShieldCheck size={14} className="shrink-0 opacity-65" />

                    <span className="truncate text-xs font-semibold">
                        {membership?.roleName || "Sin rol"}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => onDelete(membership)}
                    disabled={!canDelete}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-rose-500/25 bg-rose-500/10 px-2 py-1 text-[11px] font-bold text-rose-600 transition hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Quitar acceso"
                >
                    <Trash2 size={12} />
                    {deleting ? "Quitando..." : "Quitar"}
                </button>
            </div>
        </div>
    );
}
