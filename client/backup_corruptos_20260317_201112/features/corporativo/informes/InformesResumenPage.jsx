// client/src/features/corporativo/Informes/InformesResumenPage.jsx
import React from "react";

export default function InformesResumenPage() {
  return (
    <div className="neo-card p-4 md:p-5 space-y-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base md:text-lg font-semibold">
            Resumen ejecutivo
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Vista rápida para presentar a socios o bancos: producción,
            rentabilidad y endeudamiento resumidos.
          </p>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <section className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/80 p-3.5 md:p-4 space-y-2">
            <h2 className="text-sm font-semibold">Producción y rentabilidad</h2>
            <p className="text-xs md:text-sm text-slate-400">
              Aquí irá un resumen consolidado con:
            </p>
            <ul className="list-disc list-inside text-xs md:text-sm text-slate-300">
              <li>Producción mensual y anual por país.</li>
              <li>Margen promedio por tipo de activo.</li>
              <li>Top 3 activos más rentables (propiedades / restaurantes).</li>
            </ul>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/80 p-3.5 md:p-4 space-y-2">
            <h2 className="text-sm font-semibold">
              Posición general (para bancos)
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Esta sección puede mapear directamente la información que ya
              usas en cartas de intención: cashflow, deudas, y activos
              productivos en Lourdes Colón, Chaparral y Los Ángeles.
            </p>
          </section>
        </div>

        <aside className="space-y-3 text-xs md:text-sm">
          <h2 className="text-sm font-semibold">Cómo usar este informe</h2>
          <p className="text-slate-400">
            La idea es que desde aquí puedas:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>Descargar un PDF listo para enviar a un banco.</li>
            <li>Ver el consolidado de todos los módulos (Propiedades, Proyectos, Transacciones).</li>
            <li>Identificar rápido si el portafolio está sano antes de una inversión.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
