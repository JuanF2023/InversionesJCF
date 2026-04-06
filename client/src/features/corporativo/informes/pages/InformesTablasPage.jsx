// client/src/features/corporativo/Informes/InformesTablasPage.jsx
import React from "react";

export default function InformesTablasPage() {
  return (
    <div className="neo-card p-4 md:p-5 space-y-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base md:text-lg font-semibold">
            Tablas de detalle
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Aqu¨ª se listar¨¢n tablas consolidadas por pa¨ªs, zona, tipo de activo
            y negocio, listas para exportar o filtrar.
          </p>
        </div>
      </header>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--panel)]/80">
        <table className="min-w-full text-xs md:text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-slate-900/20">
              <th className="py-2.5 px-3 text-left font-semibold">Pa¨ªs</th>
              <th className="py-2.5 px-3 text-left font-semibold">Zona</th>
              <th className="py-2.5 px-3 text-left font-semibold">Activo</th>
              <th className="py-2.5 px-3 text-left font-semibold">Tipo</th>
              <th className="py-2.5 px-3 text-right font-semibold">
                Producci¨®n mensual
              </th>
              <th className="py-2.5 px-3 text-right font-semibold">
                Margen
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Filas dummy: se reemplazar¨¢n con datos reales m¨¢s adelante */}
            <tr className="border-b border-[var(--border)]/70">
              <td className="py-2 px-3">El Salvador</td>
              <td className="py-2 px-3">Lourdes Col¨®n</td>
              <td className="py-2 px-3">APT-001</td>
              <td className="py-2 px-3 text-slate-400">Propiedad</td>
              <td className="py-2 px-3 text-right tabular-nums">$ 0.00</td>
              <td className="py-2 px-3 text-right tabular-nums">0.0 %</td>
            </tr>
            <tr className="border-b border-[var(--border)]/70">
              <td className="py-2 px-3">El Salvador</td>
              <td className="py-2 px-3">Chaparral</td>
              <td className="py-2 px-3">REST-CHAP</td>
              <td className="py-2 px-3 text-slate-400">Restaurante</td>
              <td className="py-2 px-3 text-right tabular-nums">$ 0.00</td>
              <td className="py-2 px-3 text-right tabular-nums">0.0 %</td>
            </tr>
            <tr>
              <td className="py-2 px-3">USA</td>
              <td className="py-2 px-3">Los ¨¢ngeles</td>
              <td className="py-2 px-3">LA-001</td>
              <td className="py-2 px-3 text-slate-400">Propiedad</td>
              <td className="py-2 px-3 text-right tabular-nums">$ 0.00</td>
              <td className="py-2 px-3 text-right tabular-nums">0.0 %</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-xs md:text-sm text-slate-400">
        M¨¢s adelante podr¨¢s conectar este listado con filtros avanzados
        (rango de fechas, tipo de transacci¨®n, negocio) y con el Excel de
        transacciones que ya est¨¢s normalizando.
      </p>
    </div>
  );
}
