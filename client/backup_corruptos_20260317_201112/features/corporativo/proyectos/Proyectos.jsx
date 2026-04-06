import React from "react";
import { KanbanSquare, Plus, Filter, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export default function Proyectos() {
  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl grid place-items-center border border-[var(--border)] bg-[var(--panel)]">
            <KanbanSquare size={18} className="opacity-80" />
          </div>
          <div>
            <h1 className="text-xl font-semibold leading-tight">Proyectos</h1>
            <p className="text-sm opacity-70">Panel de proyectos del corporativo</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-10 px-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] hover:bg-[color-mix(in_srgb,var(--panel)_80%,var(--text)_4%)]">
            <RefreshCw size={16} className="inline -mt-0.5" /> <span className="ml-1">Refrescar</span>
          </button>
          <button className="h-10 px-3 rounded-xl border border-[var(--border)] bg-[var(--panel)] hover:bg-[color-mix(in_srgb,var(--panel)_80%,var(--text)_4%)]">
            <Filter size={16} className="inline -mt-0.5" /> <span className="ml-1">Filtros</span>
          </button>
          <Link
            to="nuevo"
            className="h-10 px-3 rounded-xl bg-[var(--accent)] text-white hover:opacity-95"
            title="Crear proyecto"
          >
            <Plus size={16} className="inline -mt-0.5" /> <span className="ml-1">Nuevo</span>
          </Link>
        </div>
      </div>

      {/* Contenido placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((k) => (
          <div
            key={k}
            className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-sm"
          >
            <div className="text-sm font-semibold">Proyecto #{k}</div>
            <div className="text-sm opacity-70 mt-1">
              Aquí verás tarjetas de proyectos, estados y responsables.
            </div>
            <div className="mt-3 h-2 rounded-full bg-[color-mix(in_srgb,var(--panel)_70%,var(--text)_8%)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
