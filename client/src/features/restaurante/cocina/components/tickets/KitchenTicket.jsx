import React, { useMemo } from "react";
import { buildKitchenSummary } from "../../../utils/aggregateKitchen.js";


export default function KitchenTicket({
  orden = [],
  meta = { restaurante: "Mi Restaurante", mesero: "¡ª", tipoOrden: "comerAqui", mesa: null, orderNumber: null },
  onClose = () => {},
  compact = true, // puedes cambiar a false si prefieres tipograf¨ªa normal
}) {
  // Fecha/hora local
  const now = useMemo(() => new Date(), []);
  const fecha = now.toLocaleDateString();
  const hora = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Res¨²menes (platos + componentes)
  const { resumenPlatos, resumenComponentes } = buildKitchenSummary(orden);

  // Detalle por persona
  const porPersona = useMemo(() => {
    const res = {};
    orden.forEach((item) => {
      const p = item.persona || 1;
      if (!res[p]) res[p] = [];
      res[p].push(item);
    });
    return Object.entries(res).sort(([a], [b]) => Number(a) - Number(b));
  }, [orden]);

  const handlePrint = () => window.print();

  return (
    <>
      {/* Regla: imprimir solo el ticket */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #kitchen-ticket, #kitchen-ticket * { visibility: visible; }
          #kitchen-ticket { position: absolute; left: 0; top: 0; width: 100%; }
          .person-block { break-inside: avoid; page-break-inside: avoid; }
          .ticket-compact { font-size: 12px; line-height: 1.25; }
        }
      `}</style>

      <div className={compact ? "ticket-compact space-y-3" : "space-y-3"}>
        {/* Encabezado */}
        <div className="flex items-start justify-between">
          <div>
            <div className="text-white text-lg font-semibold">{meta.restaurante}</div>
            {meta.orderNumber ? (
              <div className="text-white font-bold">Orden #{meta.orderNumber}</div>
            ) : null}
            <div className="text-slate-300 text-xs">
              {fecha} ¡¤ {hora} ¡ª Mesero: <span className="font-medium">{meta.mesero}</span>
            </div>
            <div className="text-slate-300 text-xs">
              Tipo: {meta.tipoOrden}
              {meta.tipoOrden === "comerAqui" && meta.mesa ? ` ¡¤ Mesa ${meta.mesa}` : ""}
            </div>
          </div>
          <div className="text-right text-slate-300 text-xs">
            <div>Ticket de cocina</div>
            <div>Items: {orden.length}</div>
          </div>
        </div>

        {/* Resumen global (para arrancar cocina) */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-3">
          <div className="text-yellow-400 font-semibold text-sm mb-2">Resumen (totales)</div>
          {resumenPlatos.length === 0 ? (
            <div className="text-slate-400 text-sm">Sin productos.</div>
          ) : (
            <ul className="space-y-1">
              {resumenPlatos.map((r, idx) => (
                <li key={idx} className="text-slate-100 text-sm flex">
                  <span className="w-10 font-bold text-green-400">{r.count}¡Á</span>
                  <div>
                    <div className="font-medium">{r.nombre}</div>
                    {r.mods && <div className="text-xs text-slate-300">{r.mods}</div>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sumatoria de componentes / porciones */}
        {resumenComponentes.length > 0 && (
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-3">
            <div className="text-yellow-400 font-semibold text-sm mb-2">Sumatoria de componentes</div>
            <ul className="grid grid-cols-2 gap-y-1 text-slate-100 text-sm">
              {resumenComponentes.map((c, i) => (
                <li key={i} className="flex justify-between">
                  <span>{c.nombre}</span>
                  <span className="font-bold">{c.count}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Detalle por persona */}
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-3">
          <div className="text-yellow-400 font-semibold text-sm mb-2">Detalle por persona</div>
          <div className="space-y-2">
            {porPersona.map(([persona, items]) => (
              <div key={persona} className="person-block bg-slate-900/60 rounded p-2 border border-slate-700">
                <div className="text-sky-300 text-xs font-semibold mb-1">Persona {persona}</div>
                <ul className="space-y-1">
                  {items.map((it, i) => (
                    <li key={i} className="text-slate-100 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {it.cantidad && it.cantidad > 1 ? `${it.cantidad}¡Á ` : ""}
                          {it.nombre}
                        </span>
                      </div>
                      {/* Si m¨¢s adelante quieres mostrar un resumen corto por persona,
                          puedes traer una l¨ªnea con sus mods aqu¨ª */}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer acciones (no se imprime) */}
        <div className="flex justify-end gap-2 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-600 text-slate-200 bg-slate-800"
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Imprimir
          </button>
        </div>
      </div>
    </>
  );
}
