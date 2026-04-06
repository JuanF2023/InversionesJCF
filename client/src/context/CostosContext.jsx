import React, { createContext, useContext, useMemo, useState } from "react";

const CostosContext = createContext(null);

export function CostosProvider({ children }) {
  const [costos, setCostos] = useState([]);
  const value = useMemo(() => ({ costos, setCostos }), [costos]);
  return <CostosContext.Provider value={value}>{children}</CostosContext.Provider>;
}

export function useCostos() {
  const ctx = useContext(CostosContext);
  if (!ctx) throw new Error("useCostos debe usarse dentro de <CostosProvider>");
  return ctx;
}
