// client/src/features/corporativo/Transacciones/TransaccionesReportesPage.jsx
import React from "react";
import { BarChart3, PieChart, CalendarRange } from "lucide-react";

export default function TransaccionesReportesPage() {
  return (
    <section className="space-y-4">
      <div className="neo-plate neo-plate--soft rounded-2xl p-4 md:p-5 space-y-3">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-[var(--accent-strong)]" />
          <div>
            <h2 className="text-sm md:text-base font-semibold">
              Reportes de transacciones
            </h2>
            <p className="text-xs md:text-sm opacity-75">
              Aqu¨ª podr¨¢s analizar ingresos y costos por negocio, propiedad,
              periodo y tipo de transacci¨®n.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center pt-2">
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <CalendarRange className="w-4 h-4 opacity-70" />
            <span className="opacity-80">
              Filtro de periodo (pendiente implementar)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs md:text-sm">
            <PieChart className="w-4 h-4 opacity-70" />
            <span className="opacity-80">
              Gr¨¢ficos por categor¨ªa, origen y negocio (pendiente).
            </span>
          </div>
        </div>
      </div>

      <div className="neo-plate neo-plate--deep rounded-2xl p-6 text-xs md:text-sm opacity-80">
        Todav¨ªa no hemos conectado estos reportes con la base de datos.
        Primero terminamos el registro de transacciones; luego aqu¨ª
        construiremos:
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Flujos de caja por periodo y negocio.</li>
          <li>Comparaci¨®n de ingresos vs costos por proyecto.</li>
          <li>Detalle de reinversiones y aportes de propietario.</li>
        </ul>
      </div>
    </section>
  );
}
