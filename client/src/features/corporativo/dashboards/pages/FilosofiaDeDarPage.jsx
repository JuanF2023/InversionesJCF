import React from "react";
import { useTheme } from "@/context/ThemeContext.jsx";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function FilosofiaDeDar() {
  const { theme } = useTheme();
  const isNeo = theme?.startsWith("neo");

  return (
    <section className="space-y-3">
      <div className={cx("p-5", isNeo ? "neo-card neo-card--deep neo-card--tinted" : "card")}>
        <h3 className="text-lg font-semibold text-text">Filosof¨ªa de Dar</h3>
        <p className="text-sm subtle">
          (Mock) Informaci¨®n basada en las ¨²ltimas dos p¨¢ginas del PDF ¡°Indicadores de Inversi¨®n JULIO 2025¡±.
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm space-y-1 text-text">
          <li>Principios y fundamentos</li>
          <li>Beneficios y compromisos</li>
          <li>Ejemplos pr¨¢cticos de dar</li>
        </ul>
      </div>
      <div className="text-xs subtle">
        * Cuando me digas, lo llenamos con el contenido real del documento.
      </div>
    </section>
  );
}
