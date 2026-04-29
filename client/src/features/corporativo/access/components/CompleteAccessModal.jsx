// client/src/features/corporativo/access/components/CompleteAccessModal.jsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import { useAccessMembershipsStore } from "@/features/corporativo/access/store/accessMemberships.store.js";

export default function CompleteAccessModal({ open, onClose, user, onSaved }) {
  const tenants = useAccessMembershipsStore((state) => state.tenants);
  const roles = useAccessMembershipsStore((state) => state.roles);
  const cargarOpciones = useAccessMembershipsStore((state) => state.cargarOpciones);
  const guardarAccesoUsuario = useAccessMembershipsStore(
    (state) => state.guardarAccesoUsuario
  );

  const [tenantId, setTenantId] = useState("");
  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    if (!open || !user?.id) return;

    cargarOpciones(user.id).catch(() => {
      toast.error("Error cargando opciones");
    });
  }, [open, user?.id, cargarOpciones]);

  useEffect(() => {
    if (!open || !user) return;

    setTenantId("");
    setRoleId("");
  }, [open, user]);

  if (!open || !user) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!tenantId || !roleId) {
      toast.error("Debes seleccionar tenant y rol");
      return;
    }

    try {
      await guardarAccesoUsuario(user.id, {
        tenantId,
        roleId,
        status: "active",
      });

      toast.success("Acceso agregado");

      if (typeof onSaved === "function") {
        await onSaved();
      }

      setTenantId("");
      setRoleId("");
    } catch {
      toast.error("Error guardando acceso");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Gestionar accesos</h3>
            <p className="text-xs opacity-60">
              Puedes asignar múltiples accesos al usuario
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 transition hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 rounded-xl bg-gray-100 p-3 text-sm dark:bg-neutral-800">
          <strong>{user.nombre}</strong>
          <div className="text-xs opacity-70">{user.email}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">Tenant</label>
            <select
              value={tenantId}
              onChange={(event) => setTenantId(event.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option value="">Seleccione tenant</option>

              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">Rol</label>
            <select
              value={roleId}
              onChange={(event) => setRoleId(event.target.value)}
              className="w-full rounded-xl border p-3"
            >
              <option value="">Seleccione rol</option>

              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-4 py-2"
            >
              Cerrar
            </button>

            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-4 py-2 text-white"
            >
              Agregar acceso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
