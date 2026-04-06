// client/src/features/auth/modals/TenantPickerModal.jsx
import React from "react";
import { Building2, CheckCircle2 } from "lucide-react";

function resolveTenantId(tenant) {
    return (
        tenant?.id ||
        tenant?._id ||
        tenant?.tenantId ||
        tenant?.value ||
        tenant?.key ||
        null
    );
}

function resolveTenantName(tenant) {
    return (
        tenant?.nombre ||
        tenant?.name ||
        tenant?.label ||
        tenant?.title ||
        tenant?.key ||
        "Tenant"
    );
}

function resolveTenantType(tenant) {
    return tenant?.tipo || tenant?.type || tenant?.tenantTipo || "";
}

function resolveTenantKey(tenant) {
    return tenant?.key || tenant?.slug || tenant?.codigo || "";
}

export default function TenantPickerModal({
    open,
    title,
    tenants = [],
    selectedTenantId,
    onSelect,
    onCancel,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={onCancel} />

            <div className="relative w-[720px] max-w-[95vw] rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
                <div className="border-b border-white/10 p-5 md:p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/15">
                            <Building2 className="text-emerald-300" size={20} />
                        </div>

                        <div className="min-w-0">
                            <div className="text-lg font-bold">
                                {title || "Selecciona un tenant"}
                            </div>
                            <div className="mt-0.5 text-sm text-slate-300">
                                Selecciona el tenant con el que deseas iniciar sesi¨®n. La sesi¨®n
                                quedar¨¢ asociada a ese tenant.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 md:p-6">
                    <div className="grid gap-3">
                        {tenants.map((tenant, index) => {
                            const tenantId = resolveTenantId(tenant);
                            const tenantName = resolveTenantName(tenant);
                            const tenantType = resolveTenantType(tenant);
                            const tenantKey = resolveTenantKey(tenant);

                            const active =
                                String(tenantId ?? "") === String(selectedTenantId ?? "");

                            return (
                                <button
                                    key={tenantId || `tenant-${index}`}
                                    type="button"
                                    onClick={() => onSelect(tenantId)}
                                    disabled={!tenantId}
                                    className={[
                                        "flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-4 text-left transition-all",
                                        active
                                            ? "border-emerald-500/40 bg-emerald-500/10"
                                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8",
                                        !tenantId ? "cursor-not-allowed opacity-50" : "",
                                    ].join(" ")}
                                >
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <div className="truncate font-semibold">{tenantName}</div>

                                            {tenantType ? (
                                                <span className="rounded-full border border-white/10 bg-white/10 px-2 py-[2px] text-[11px] text-slate-200/90">
                                                    {tenantType}
                                                </span>
                                            ) : null}
                                        </div>

                                        <div className="mt-1 text-xs text-slate-300">
                                            {tenantKey ? (
                                                <span className="opacity-90">Key: {tenantKey}</span>
                                            ) : null}
                                        </div>
                                    </div>

                                    {active ? (
                                        <div className="flex shrink-0 items-center gap-2 font-semibold text-emerald-300">
                                            <CheckCircle2 size={18} />
                                            Seleccionado
                                        </div>
                                    ) : (
                                        <div className="shrink-0 text-xs text-slate-300">
                                            Elegir
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-5 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-semibold text-slate-200 hover:bg-white/10"
                            onClick={onCancel}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
