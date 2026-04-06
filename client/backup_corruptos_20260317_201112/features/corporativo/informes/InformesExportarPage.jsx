// client/src/features/corporativo/Informes/InformesExportarPage.jsx
import React from "react";

export default function InformesExportarPage() {
  return (
    <div className="neo-card p-4 md:p-5 space-y-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-base md:text-lg font-semibold">
            Exportar informes
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            Centro de exportación para enviar información a bancos, socios o
            contabilidad (PDF, Excel, CSV).
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <ExportCard
          title="Resumen ejecutivo PDF"
          desc="Producción, rentabilidad y posición general. Ideal para cartas de intención."
          actionLabel="Descargar PDF"
        />
        <ExportCard
          title="Detalle de transacciones"
          desc="Todas las transacciones normalizadas, filtrables por país, negocio y fecha."
          actionLabel="Exportar Excel"
        />
        <ExportCard
          title="Producción por activo"
          desc="Tabla con producción mensual por propiedad y restaurante (El Salvador + USA)."
          actionLabel="Exportar CSV"
        />
      </div>

      <p className="text-xs md:text-sm text-slate-400">
        Más adelante, estos botones podrán llamar endpoints de tu API
        corporativa para generar archivos en tiempo real a partir de los datos
        de <strong>Transacciones</strong>, <strong>Proyectos</strong> y{" "}
        <strong>Propiedades</strong>.
      </p>
    </div>
  );
}

function ExportCard({ title, desc, actionLabel }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)]/80 p-3.5 md:p-4 flex flex-col gap-3 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold mb-1">{title}</h2>
        <p className="text-xs md:text-sm text-slate-400 leading-snug">{desc}</p>
      </div>
      <button
        type="button"
        className="mt-auto inline-flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs md:text-sm font-semibold px-3 py-2 transition-colors"
      >
        {actionLabel}
      </button>
    </div>
  );
}
