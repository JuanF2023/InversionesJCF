// client/src/features/corporativo/Indicadores/IndicadoresProyeccionesPage.jsx
import React from "react";

export default function IndicadoresProyeccionesPage() {
  return (
    <div className="neo-card p-4 md:p-5 space-y-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base md:text-lg font-semibold">
            Proyecciones y escenarios
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Proyecciones de producción y flujo de caja para El Salvador (Lourdes Colón,
            Chaparral) y Los Ángeles, con diferentes escenarios.
          </p>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Escenarios */}
        <div className="space-y-3 lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Escenarios de crecimiento
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            <ScenarioCard
              title="Escenario base"
              desc="Producción actual + incremento moderado por ocupación plena y optimización de gastos."
            />
            <ScenarioCard
              title="Escenario optimista"
              desc="Apertura de nuevos locales en Chaparral y aumento de tarifas en propiedades clave."
            />
            <ScenarioCard
              title="Escenario conservador"
              desc="Mantener operación actual asumiendo cierta vacancia y costos altos en USA."
            />
          </div>

          <div className="mt-3 h-52 rounded-xl border border-[var(--border)]/80 bg-[var(--panel)]/40 flex items-center justify-center text-xs md:text-sm text-slate-400">
            Aquí se graficará la proyección mensual de producción y flujo neto
            para cada escenario.
          </div>
        </div>

        {/* Resumen numérico */}
        <aside className="space-y-3 text-xs md:text-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Resumen numérico (futuro)
          </h2>
          <div className="space-y-2">
            <p className="flex justify-between gap-3">
              <span>Producción anual proyectada (base)</span>
              <span className="tabular-nums font-semibold">$ 0.00</span>
            </p>
            <p className="flex justify-between gap-3">
              <span>Producción anual proyectada (optimista)</span>
              <span className="tabular-nums font-semibold">$ 0.00</span>
            </p>
            <p className="flex justify-between gap-3">
              <span>Producción anual proyectada (conservador)</span>
              <span className="tabular-nums font-semibold">$ 0.00</span>
            </p>
          </div>

          <p className="mt-3 text-slate-400">
            Más adelante, este módulo podrá leer tus transacciones históricas y
            aplicar modelos simples (CAGR, medias móviles) para estimar
            crecimiento realista por activo.
          </p>
        </aside>
      </div>
    </div>
  );
}

function ScenarioCard({ title, desc }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/80 p-3.5 shadow-sm">
      <h3 className="text-sm font-semibold mb-1">{title}</h3>
      <p className="text-xs text-slate-400 leading-snug">{desc}</p>
    </div>
  );
}
