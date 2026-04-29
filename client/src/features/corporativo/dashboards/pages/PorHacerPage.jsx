import React from "react";
import { useTheme } from "@/core/theme/ThemeProvider.jsx";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function PorHacer() {
  const { theme } = useTheme();
  const isNeo = theme?.startsWith("neo");

  const tareas = [
    "Registrar ingresos de apartamentos del mes",
    "Registrar ingresos de locales comerciales del mes",
    "Abonar al banco y confirmar abonado",
  ];

  return (
    <section className={cx("p-5 space-y-3", isNeo ? "neo-card neo-card--deep neo-card--tinted" : "card")}>
      <div>
        <h3 className="text-lg font-semibold text-text">Por hacer</h3>
        <p className="text-sm subtle">Pendientes del administrador.</p>
      </div>

      <ul className="space-y-2">
        {tareas.map((t) => (
          <li
            key={t}
            className={cx(
              "flex items-center justify-between rounded-lg px-3 py-2",
              isNeo ? "neo-plate" : "bg-[var(--panel)] border border-[var(--border)]"
            )}
          >
            <span className="text-sm text-text">{t}</span>
            <button className="btn-tonal text-xs">Marcar como hecho</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
