// client/src/features/corporativo/negocios/pages/NegociosResumenPage.jsx
import React, { useMemo } from "react";
import { Activity, Building2, TrendingUp } from "lucide-react";

const cx = (...classes) => classes.filter(Boolean).join(" ");

function Card({ title, subtitle, children, className = "" }) {
  return (
    <section
      className={cx(
        "rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-sm",
        className
      )}
    >
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold">{title}</h3>
            {subtitle ? (
              <p className="mt-0.5 text-sm opacity-75">{subtitle}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </section>
  );
}

function Kpi({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_80%,transparent)] p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_70%,transparent)]">
          <Icon size={18} className="opacity-80" />
        </div>

        <div className="min-w-0">
          <div className="text-sm opacity-75">{label}</div>
          <div className="text-xl font-semibold leading-tight">{value}</div>
          {hint ? <div className="mt-0.5 text-xs opacity-70">{hint}</div> : null}
        </div>
      </div>
    </div>
  );
}

export default function NegociosResumenPage() {
  const kpis = useMemo(
    () => [
      {
        icon: Building2,
        label: "Negocios activos",
        value: "—",
        hint: "Desde catálogo/BD",
      },
      {
        icon: TrendingUp,
        label: "Producción mensual",
        value: "—",
        hint: "Sumatoria de activos",
      },
      {
        icon: Activity,
        label: "Alertas",
        value: "—",
        hint: "Reglas y umbrales",
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Resumen</h2>
        <p className="text-sm opacity-75">
          Vista general del módulo: KPIs, actividad y alertas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {kpis.map((kpi) => (
          <Kpi key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card
          title="Actividad reciente"
          subtitle="Eventos y movimientos recientes del módulo."
        >
          <div className="text-sm opacity-75">
            Sin datos aún. Aquí irán eventos como: negocio creado, unidad asignada,
            banco agregado, etc.
          </div>

          <div className="mt-4 rounded-xl border border-[var(--border)] p-3 text-sm opacity-75">
            Tip: conecta esto al store de Zustand y a tu API cuando esté listo.
          </div>
        </Card>

        <Card title="Alertas" subtitle="Reglas enterprise y pendientes.">
          <div className="text-sm opacity-75">
            Sin alertas configuradas. Ejemplos: producción menor al mínimo,
            unidades sin negocio, cuentas sin banco, etc.
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--border)] p-3 text-sm">
              <div className="font-semibold">Regla sugerida</div>
              <div className="opacity-75">Unidades activas sin businessId.</div>
            </div>

            <div className="rounded-xl border border-[var(--border)] p-3 text-sm">
              <div className="font-semibold">Regla sugerida</div>
              <div className="opacity-75">Negocios activos sin cuentas.</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
