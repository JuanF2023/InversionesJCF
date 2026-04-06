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
            Vista r芍pida para presentar a socios o bancos: producci車n,
            rentabilidad y endeudamiento resumidos.
          </p>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <section className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/80 p-3.5 md:p-4 space-y-2">
            <h2 className="text-sm font-semibold">Producci車n y rentabilidad</h2>
            <p className="text-xs md:text-sm text-slate-400">
              Aqu赤 ir芍 un resumen consolidado con:
            </p>
            <ul className="list-disc list-inside text-xs md:text-sm text-slate-300">
              <li>Producci車n mensual y anual por pa赤s.</li>
              <li>Margen promedio por tipo de activo.</li>
              <li>Top 3 activos m芍s rentables (propiedades / restaurantes).</li>
            </ul>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/80 p-3.5 md:p-4 space-y-2">
            <h2 className="text-sm font-semibold">
              Posici車n general (para bancos)
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Esta secci車n puede mapear directamente la informaci車n que ya
              usas en cartas de intenci車n: cashflow, deudas, y activos
              productivos en Lourdes Col車n, Chaparral y Los 芍ngeles.
            </p>
          </section>
        </div>

        <aside className="space-y-3 text-xs md:text-sm">
          <h2 className="text-sm font-semibold">C車mo usar este informe</h2>
          <p className="text-slate-400">
            La idea es que desde aqu赤 puedas:
          </p>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            <li>Descargar un PDF listo para enviar a un banco.</li>
            <li>Ver el consolidado de todos los m車dulos (Propiedades, Proyectos, Transacciones).</li>
            <li>Identificar r芍pido si el portafolio est芍 sano antes de una inversi車n.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
