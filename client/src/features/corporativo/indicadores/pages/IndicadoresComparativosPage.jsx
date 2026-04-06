// client/src/features/corporativo/Indicadores/IndicadoresComparativosPage.jsx
import React from "react";

export default function IndicadoresComparativosPage() {
  return (
    <div className="neo-card p-4 md:p-5 space-y-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base md:text-lg font-semibold">
            Comparativos de indicadores
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Comparación por año, país, zona y tipo de activo (propiedades,
            restaurantes, negocios en USA).
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-300">Filtros rápidos:</span>
            <button className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-100 text-xs border border-slate-700">
              últimos 12 meses
            </button>
            <button className="px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 text-xs border border-slate-700/80">
              El Salvador vs USA
            </button>
            <button className="px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 text-xs border border-slate-700/80">
              Propiedades vs Restaurantes
            </button>
          </div>

          <div className="mt-2 h-56 rounded-xl border border-[var(--border)]/80 bg-[var(--panel)]/40 flex items-center justify-center text-xs md:text-sm text-slate-400">
            Aquí irá un gráfico comparativo (líneas / columnas) de producción
            y margen entre países, zonas o tipos de activos.
          </div>
        </div>

        <aside className="space-y-3 text-xs md:text-sm">
          <h2 className="font-semibold text-slate-200">
            Lectura recomendada
          </h2>
          <p className="text-slate-400">
            Usa este panel para responder preguntas como:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            <li>?Cuál zona crece más rápido: Lourdes Colón o Los ángeles?</li>
            <li>
              ?Los restaurantes en Chaparral están mejorando su margen frente a
              las propiedades?
            </li>
            <li>
              ?Qué tan volátil es la producción mensual por negocio o propiedad?
            </li>
          </ul>

          <p className="mt-3 text-slate-400">
            Más adelante, este panel consumirá datos reales desde el módulo de
            <span className="font-semibold"> Transacciones</span> y de
            <span className="font-semibold"> Proyectos</span> para graficar
            tendencias.
          </p>
        </aside>
      </div>
    </div>
  );
}
