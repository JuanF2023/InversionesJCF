// client/src/features/corporativo/access/users/components/CompleteAccessModal.jsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import { useAccessMembershipsStore } from "@/features/corporativo/access/store/accessMemberships.store.js";

export default function CompleteAccessModal({ open, onClose, user, onSaved }) {

    const tenants = useAccessMembershipsStore((s) => s.tenants);
    const roles = useAccessMembershipsStore((s) => s.roles);
    const cargarOpciones = useAccessMembershipsStore((s) => s.cargarOpciones);
    const guardarAccesoUsuario = useAccessMembershipsStore((s) => s.guardarAccesoUsuario);

    const [tenantId, setTenantId] = useState("");
    const [roleId, setRoleId] = useState("");

    useEffect(() => {
        if (!open) return;

        cargarOpciones().catch(() => {
            toast.error("Error cargando opciones");
        });

    }, [open]);

    useEffect(() => {

        if (!open || !user) return;

        setTenantId(user.tenantId || "");
        setRoleId(user.rolId || "");

    }, [open, user]);

    if (!open || !user) return null;

    async function handleSubmit(e) {

        e.preventDefault();

        if (!tenantId || !roleId) {
            toast.error("Debes seleccionar tenant y rol");
            return;
        }

        try {

            await guardarAccesoUsuario(user.id, {
                tenantId,
                roleId,
                status: "active"
            });

            await onSaved();

        } catch {
            toast.error("Error guardando acceso");
        }

    }

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-lg p-6">

                <div className="flex justify-between items-center mb-6">

                    <h3 className="text-lg font-semibold">
                        Completar acceso
                    </h3>

                    <button onClick={onClose}>
                        <X size={18} />
                    </button>

                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="text-sm font-semibold">Tenant</label>

                        <select
                            value={tenantId}
                            onChange={(e) => setTenantId(e.target.value)}
                            className="w-full border rounded-xl p-3"
                        >

                            <option value="">Seleccione tenant</option>

                            {tenants.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.nombre}
                                </option>
                            ))}

                        </select>

                    </div>

                    <div>
                        <label className="text-sm font-semibold">Rol</label>

                        <select
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                            className="w-full border rounded-xl p-3"
                        >

                            <option value="">Seleccione rol</option>

                            {roles.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.nombre}
                                </option>
                            ))}

                        </select>

                    </div>

                    <div className="flex justify-end gap-2 pt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="border px-4 py-2 rounded-xl"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="bg-emerald-500 text-white px-4 py-2 rounded-xl"
                        >
                            Guardar acceso
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

