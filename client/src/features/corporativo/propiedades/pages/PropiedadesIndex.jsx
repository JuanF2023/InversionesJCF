// src/pages/Corporativo/Propiedades/Index.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/context/ThemeContext.jsx";
import { useCorporativo } from "@/features/corporativo/propiedades/store/corporativoStore.js";
import Datos from "./Detalles/DetallesLayout.jsx";
import AddPropertyModal from "@/features/corporativo/negocios/components/PropertyFormModal.jsx";
import { RefreshCw, Plus, FileSpreadsheet, Info, BarChart3, ListChecks, LayoutGrid } from "lucide-react";

const cx = (...c) => c.filter(Boolean).join(" ");
const money = (n) => new Intl.NumberFormat("es-US", { style: "currency", currency: "USD" }).format(Number(n || 0));

const Tab = ({ label, icon, active }) => (
  <button
    type="button"
    className={cx(
      "flex items-center gap-2 px-4 py-2 rounded-xl transition relative",
      active ? "bg-[var(--card)] shadow ring-1 ring-border" : "hover:bg-[var(--card)]/70"
    )}
  >
    {icon} <span className="font-medium">{label}</span>
  </button>
);

export default function IndexPropiedades() {
  const { theme } = useTheme();

  // Store
  const {
    propiedades = [],
    selectedPropId,
    setSelectedPropId,
    cargarPropiedades,
    agregarPropiedad,
  } = useCorporativo((s) => ({
    propiedades: s.propiedades,
    selectedPropId: s.selectedPropId,
    setSelectedPropId: s.setSelectedPropId,
    cargarPropiedades: s.cargarPropiedades,
    agregarPropiedad: s.agregarPropiedad,
  }));

  // Estado local UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  // Cargar al entrar
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        const lista = await cargarPropiedades?.();
        // Auto-seleccionar la primera propiedad disponible
        if (Array.isArray(lista) && lista.length > 0) {
          const first = lista[0];
          const pid = first?.id ?? first?._id;
          if (pid) setSelectedPropId(String(pid));
        }
      } catch {
        setError("No se pudo cargar la lista.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Propiedad seleccionada (por id global)
  const selected = useMemo(
    () => propiedades?.find((p) => (p?.id ?? p?._id) === selectedPropId) ?? null,
    [propiedades, selectedPropId]
  );

  const onRetry = async () => {
    try {
      setLoading(true);
      setError("");
      await cargarPropiedades?.();
    } catch {
      setError("No se pudo cargar la lista.");
    } finally {
      setLoading(false);
    }
  };

  const onCreate = async (payload) => {
    await agregarPropiedad?.(payload);
    setOpenAdd(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-4" data-theme={theme}>
      {/* Header */}
      <div className="neo-card neo-card--deep neo-card--tinted relative">
        <div className="flex items-start justify-between gap-4">
          <h1 className="h-title">Propiedades</h1>
          <div className="hidden md:flex items-center gap-2">
            <button className="btn-tonal inline-flex items-center gap-2" onClick={onRetry} disabled={loading} title="Recargar">
              <RefreshCw size={16} className={cx(loading && "animate-spin")} /> Recargar
            </button>
            <button className="btn-gradient btn-action btn-shimmer inline-flex items-center gap-2" onClick={() => setOpenAdd(true)} title="Agregar propiedad">
              <Plus size={16} /> Agregar
            </button>
            <button className="btn-tonal inline-flex items-center gap-2" onClick={() => console.log("Exportar")} title="Exportar a Excel">
              <FileSpreadsheet size={16} /> Exportar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Tab active icon={<LayoutGrid size={16} />} label="Panel" />
          <Tab icon={<BarChart3 size={16} />} label="Ingresos" />
          <Tab active icon={<Info size={16} />} label="Detalles" />
          <Tab icon={<ListChecks size={16} />} label="Reportes" />
        </div>
      </div>

      {/* Banner de error */}
      {!!error && (
        <div className="neo-plate ring-1 ring-border flex items-center justify-between px-4 py-3">
          <div className="text-red-600 font-medium">{error}</div>
          <button className="btn-tonal" onClick={onRetry}>Reintentar</button>
        </div>
      )}

      {/* Layout columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-[360px,1fr] gap-4">
        {/* Lista izquierda */}
        <div className="neo-card neo-card--deep neo-card--tinted">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Propiedades</h3>
            <div className="flex md:hidden gap-2">
              <button className="btn-tonal" onClick={onRetry} title="Recargar"><RefreshCw size={16} /></button>
              <button className="btn-gradient btn-action" onClick={() => setOpenAdd(true)} title="Agregar"><Plus size={16} /></button>
              <button className="btn-tonal" onClick={() => console.log("Exportar")} title="Exportar a Excel"><FileSpreadsheet size={16} /></button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-[var(--surface)]/70 animate-pulse" />
              ))}
            </div>
          ) : propiedades?.length === 0 ? (
            <div className="neo-plate ring-1 ring-border p-5 text-center">
              <div className="subtle">No hay propiedades activas. Agrega una para comenzar.</div>
              <button className="btn-gradient btn-action btn-shimmer mt-3 inline-flex items-center gap-2" onClick={() => setOpenAdd(true)}>
                <Plus size={16} /> Agregar propiedad
              </button>
            </div>
          ) : (
            <ul className="space-y-2">
              {propiedades.map((p) => {
                const pid = p?.id ?? p?._id;
                const active = pid === selectedPropId;
                return (
                  <li key={pid}>
                    <button
                      className={cx(
                        "w-full text-left rounded-xl px-3 py-2 transition flex items-center justify-between ring-1",
                        active ? "bg-[var(--card)] shadow ring-border" : "hover:bg-[var(--chip)] ring-transparent"
                      )}
                      onClick={() => setSelectedPropId(pid)}
                    >
                      <div className="min-w-0">
                        <div className="font-medium truncate">{p?.nombre ?? `Propiedad ${pid}`}</div>
                        <div className="text-xs subtle truncate">
                          {p?.ubicacion?.ciudad ?? "??}, {p?.ubicacion?.municipio ?? "??}
                        </div>
                      </div>
                      <div className="text-xs subtle">{money(p?.valores?.valorActual ?? 0)}</div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Panel derecho */}
        <div className="neo-card neo-card--deep neo-card--tinted">
          {!selected ? (
            <div className="neo-plate ring-1 ring-border p-6 text-center">
              <div className="subtle">Selecciona o agrega una propiedad para ver sus detalles.</div>
            </div>
          ) : (
            <Datos propiedad={selected} />
          )}
        </div>
      </div>

      {/* Modal agregar */}
      <AddPropertyModal open={openAdd} onClose={() => setOpenAdd(false)} onConfirm={onCreate} />
    </div>
  );
}



