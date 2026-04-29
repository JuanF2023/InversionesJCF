// client/src/features/corporativo/transacciones/pages/TransaccionesListaPage.jsx
import React from "react";
import { CalendarDays, Filter, Search } from "lucide-react";

export default function TransaccionesListaPage() {
  return (
    <section className="space-y-4">
      <div className="neo-plate neo-plate--soft space-y-3 rounded-2xl p-3 md:p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)]">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70" />
              <input
                type="text"
                className="neo-input w-full rounded-xl py-2 pl-9 pr-3"
                placeholder="Buscar por concepto, referencia, propiedad o negocio"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 opacity-70" />
            <input type="month" className="neo-input flex-1" />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 opacity-70" />
            <select className="neo-input flex-1">
              <option value="">Todos los tipos</option>
              <option value="ingreso">Ingresos</option>
              <option value="costo">Costos</option>
            </select>
          </div>
        </div>
      </div>

      <div className="neo-plate neo-plate--deep rounded-2xl p-3 md:p-4">
        <div className="overflow-auto rounded-xl ring-1 ring-border/70">
          <table className="w-full text-sm">
            <thead className="bg-[var(--chip)]/70">
              <tr>
                <th className="px-3 py-2 text-left">Fecha</th>
                <th className="px-3 py-2 text-left">Tipo</th>
                <th className="px-3 py-2 text-left">Subtipo</th>
                <th className="px-3 py-2 text-left">Negocio / Propiedad</th>
                <th className="px-3 py-2 text-left">Concepto</th>
                <th className="px-3 py-2 text-right">Monto (USD)</th>
                <th className="px-3 py-2 text-left">Origen de fondos</th>
                <th className="px-3 py-2 text-left">Medio / Ref.</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan={8} className="px-3 py-4 text-center text-xs subtle">
                  Aquí aparecerán las transacciones registradas. Usa el botón{" "}
                  <strong>Agregar transacción</strong> para crear el primer movimiento.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
