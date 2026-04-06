// server/constants/movimientos.js
const MOV_LABELS = [
    "Ingresos",
    "Inversión",
    "Pte de liquidar",
    "Re-Inversión",
    "Egreso",
  ];
  
  // Normaliza distintas escrituras al valor canónico.
  // Devuelve null si no reconoce el valor.
  function normalizeMovimiento(v) {
    const raw = String(v || "").trim();
    const s = raw
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .trim();
  
    if (["ingreso","ingresos"].includes(s)) return "Ingresos";
    if (["inversion"].includes(s)) return "Inversión";
    if (["pte de liquidar","pendiente de liquidar","por liquidar","pte"].includes(s)) return "Pte de liquidar";
    if (["re-inversion","reinversion","re inversion"].includes(s)) return "Re-Inversión";
    if (["egreso","egresos","gasto","gastos"].includes(s)) return "Egreso";
  
    return MOV_LABELS.includes(raw) ? raw : null;
  }
  
  export { MOV_LABELS, normalizeMovimiento };

  
