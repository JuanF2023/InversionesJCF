// client/src/features/corporativo/Indicadores/IndicadoresPanelPage.jsx
import React from "react";
// import useIndicadoresData from "./hooks/useIndicadoresData"; // luego

export default function IndicadoresPanelPage() {
  // const { resumen, loading, error } = useIndicadoresData(); // integraci車n futura

  return (
    <div className="grid gap-6 xl:grid-cols-[2fr_1.2fr]">
      {/* Bloque izquierdo: KPIs principales y desglose por pa赤s/zona */}
      <div className="space-y-6">
        {/* KPIs principales */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KpiCard
            title="Producci車n mensual total"
            value="$ 0.00"
            hint="Incluye El Salvador + USA"
          />
          <KpiCard
            title="Margen promedio"
            value="0.0 %"
            hint="Sobre ventas consolidadas"
          />
          <KpiCard
            title="Cashflow neto"
            value="$ 0.00"
            hint="Ingresos - egresos recurrentes"
          />
        </div>

        {/* Distribuci車n por pa赤s / zona */}
        <div className="neo-card p-4 md:p-5 space-y-4">
          <header className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base md:text-lg font-semibold">
                Distribuci車n por pa赤s y zona
              </h2>
              <p className="text-xs md:text-sm text-slate-400">
                C車mo se reparte la producci車n entre El Salvador (Lourdes Col車n, Chaparral)
                y Los 芍ngeles (USA).
              </p>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                El Salvador
              </h3>
              <SegRow
                label="Lourdes Col車n 每 Propiedades"
                value="$ 0.00"
                pct="0 %"
              />
              <SegRow
                label="Chaparral 每 Restaurantes"
                value="$ 0.00"
                pct="0 %"
              />
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                USA
              </h3>
              <SegRow
                label="Los 芍ngeles 每 Propiedades / negocios"
                value="$ 0.00"
                pct="0 %"
              />
            </div>
          </div>
        </div>

        {/* Top propiedades / negocios por producci車n */}
        <div className="neo-card p-4 md:p-5 space-y-4">
          <header className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base md:text-lg font-semibold">
                Top propiedades y negocios
              </h2>
              <p className="text-xs md:text-sm text-slate-400">
                Ranking por producci車n mensual para detectar qu谷 activos empujan m芍s
                el resultado consolidado.
              </p>
            </div>
          </header>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs md:text-sm">
              <thead>
                <tr className="text-left text-slate-400 border-b border-[var(--border)]">
                  <th className="py-2 pr-3 font-semibold">Activo</th>
                  <th className="py-2 px-3 font-semibold">Tipo</th>
                  <th className="py-2 px-3 font-semibold text-right">
                    Producci車n mensual
                  </th>
                  <th className="py-2 pl-3 font-semibold text-right">Margen</th>
                </tr>
              </thead>
              <tbody>
                {/* filas de ejemplo; luego se reemplazan con datos reales */}
                <tr className="border-b border-[var(--border)]/60">
                  <td className="py-2 pr-3 text-sm">
                    APT-001 每 Apartamento Lourdes
                  </td>
                  <td className="py-2 px-3 text-slate-400">Propiedad</td>
                  <td className="py-2 px-3 text-right tabular-nums">$ 0.00</td>
                  <td className="py-2 pl-3 text-right tabular-nums">0.0 %</td>
                </tr>
                <tr className="border-b border-[var(--border)]/60">
                  <td className="py-2 pr-3 text-sm">
                    REST-CHAP 每 Local Chaparral
                  </td>
                  <td className="py-2 px-3 text-slate-400">Restaurante</td>
                  <td className="py-2 px-3 text-right tabular-nums">$ 0.00</td>
                  <td className="py-2 pl-3 text-right tabular-nums">0.0 %</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 text-sm">
                    LA-001 每 Propiedad Los 芍ngeles
                  </td>
                  <td className="py-2 px-3 text-slate-400">Propiedad</td>
                  <td className="py-2 px-3 text-right tabular-nums">$ 0.00</td>
                  <td className="py-2 pl-3 text-right tabular-nums">0.0 %</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bloque derecho: resumen r芍pido + checklist de salud */}
      <aside className="space-y-6">
        <div className="neo-card p-4 md:p-5 space-y-3">
          <h2 className="text-base md:text-lg font-semibold">
            Salud del portafolio
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Resumen r芍pido de ocupaci車n, liquidez y endeudamiento.
          </p>

          <ul className="mt-2 space-y-2 text-xs md:text-sm">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
              <div>
                <span className="font-semibold">Ocupaci車n consolidada</span>
                <span className="block text-slate-400 text-xs">
                  (Propiedades + Restaurantes)
                </span>
              </div>
              <span className="ml-auto tabular-nums text-sm font-semibold">
                0.0 %
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-sky-400" />
              <div>
                <span className="font-semibold">Liquidez bancos</span>
                <span className="block text-slate-400 text-xs">
                  Saldo disponible para inversiones y gastos.
                </span>
              </div>
              <span className="ml-auto tabular-nums text-sm font-semibold">
                $ 0.00
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
              <div>
                <span className="font-semibold">Deuda / Producci車n</span>
                <span className="block text-slate-400 text-xs">
                  Relaci車n entre obligaciones y flujo mensual.
                </span>
              </div>
              <span className="ml-auto tabular-nums text-sm font-semibold">
                0.0 x
              </span>
            </li>
          </ul>
        </div>

        <div className="neo-card p-4 md:p-5 space-y-3">
          <h2 className="text-base md:text-lg font-semibold">
            Alertas y observaciones
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Aqu赤 se mostrar芍n alertas generadas desde reglas de negocio
            (propiedades sin producci車n, restaurantes con ca赤da fuerte, etc.).
          </p>

          <ul className="mt-2 space-y-2 text-xs md:text-sm text-slate-300">
            <li className="rounded-lg bg-red-500/10 border border-red-500/40 px-3 py-2">
              No hay datos cargados a迆n. Importa transacciones y producciones
              para activar este panel.
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

/* Componentes internos simples */

function KpiCard({ title, value, hint }) {
  return (
    <div className="neo-card p-3.5 md:p-4 flex flex-col gap-1.5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h3>
      <div className="text-xl md:text-2xl font-semibold tabular-nums">{value}</div>
      {hint && (
        <p className="text-[11px] md:text-xs text-slate-400 leading-snug">
          {hint}
        </p>
      )}
    </div>
  );
}

function SegRow({ label, value, pct }) {
  return (
    <div className="flex items-center gap-3 text-xs md:text-sm">
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium">{label}</span>
          <span className="tabular-nums text-xs opacity-75">{pct}</span>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-slate-900/50 overflow-hidden">
          <div className="h-full w-0 bg-[var(--accent)] transition-all" />
        </div>
      </div>
      <span className="tabular-nums text-xs md:text-sm font-semibold min-w-[70px] text-right">
        {value}
      </span>
    </div>
  );
}
