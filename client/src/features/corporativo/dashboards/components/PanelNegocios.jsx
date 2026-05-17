// client/src/features/corporativo/dashboards/components/PanelNegocios.jsx
import React from "react";
import {
  Building2,
  LineChart,
  Wallet,
  Banknote,
  AlertTriangle,
  Factory,
  Home,
  Store,
} from "lucide-react";

/**
 * Datos mock para el dashboard corporativo.
 * Luego se puede conectar a la API real.
 */
const SUMMARY_KPIS = {
  ingresosDia: 1820.5,
  ingresosMes: 42890.75,
  margenMes: 0.34,
  negociosActivos: 6,
  flujoDisponible: 15230.12,
};

const VARIACIONES = {
  ingresosDiaVsAyer: 0.12,
  ingresosMesVsAnterior: 0.08,
  margenVsAnterior: -0.03,
};

const INGRESOS_7_DIAS = [
  { label: "L", total: 1650 },
  { label: "M", total: 1720 },
  { label: "X", total: 1580 },
  { label: "J", total: 1810 },
  { label: "V", total: 1940 },
  { label: "S", total: 2100 },
  { label: "D", total: 1820 },
];

const BANCOS = [
  { nombre: "Banco Agrícola", saldo: 6200.5 },
  { nombre: "Banco Cuscatlán", saldo: 4800 },
  { nombre: "Banco de América Central", saldo: 3450.25 },
  { nombre: "Efectivo caja chica", saldo: 780 },
];

const NEGOCIOS_TOP = [
  {
    nombre: "Restaurante Chaparral",
    tipo: "Restaurante",
    codigo: "REST01",
    ingresoDia: 620,
    ingresoMes: 12450,
    variacion: 0.12,
    estado: "Abierto",
  },
  {
    nombre: "Locales Polígono 33-B",
    tipo: "Propiedades",
    codigo: "LOC01",
    ingresoDia: 300,
    ingresoMes: 8200,
    variacion: 0.03,
    estado: "Ocupado",
  },
  {
    nombre: "Food Truck #1",
    tipo: "Restaurante",
    codigo: "FOOD01",
    ingresoDia: 450,
    ingresoMes: 9100,
    variacion: -0.04,
    estado: "Operando",
  },
  {
    nombre: "Apartamentos APT-04",
    tipo: "Propiedades",
    codigo: "APT04",
    ingresoDia: 220,
    ingresoMes: 6400,
    variacion: 0.02,
    estado: "Ocupado",
  },
];

const ALERTAS = [
  {
    tipo: "contrato",
    mensaje: "Contrato de alquiler APT-04 vence en 12 días.",
    severidad: "media",
  },
  {
    tipo: "mantenimiento",
    mensaje: "Revisión de gas propano en Restaurante Chaparral pendiente.",
    severidad: "alta",
  },
  {
    tipo: "cobro",
    mensaje: "Hay 2 rentas vencidas en Polígono 33-B.",
    severidad: "alta",
  },
  {
    tipo: "proyecto",
    mensaje: "Proyecto de ampliación de locales en El Salvador está al 65%.",
    severidad: "baja",
  },
];

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("es-SV", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

function formatPercent(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

export default function PanelNegocios() {
  const date = new Date();
  const monthShort = date.toLocaleString("es-ES", { month: "short" });

  const todayText = `${date.getDate()} ${
    monthShort.charAt(0).toUpperCase() + monthShort.slice(1)
  } ${date.getFullYear()}`;

  const totalIngresosReferencia = Math.max(
    ...INGRESOS_7_DIAS.map((day) => day.total)
  );

  const totalBancos = BANCOS.reduce((acc, banco) => acc + banco.saldo, 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold md:text-3xl">
            <Building2 className="h-6 w-6 text-[var(--accent)]" />
            Dashboard corporativo de negocios
          </h1>

          <p className="subtle mt-1 text-sm">
            Visión consolidada de Inversiones JCF: restaurantes, propiedades,
            locales y proyectos.
          </p>
        </div>

        <div className="subtle text-right text-xs sm:text-sm">
          <div className="font-semibold text-[var(--text)]">
            Resumen al {todayText}
          </div>

          <div>
            Sesiones, transacciones y producción actualizadas en tiempo real.
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="neo-card flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <span className="subtle text-xs font-semibold uppercase tracking-wide">
              Ingresos del día
            </span>

            <span className="kpi-chip kpi-chipup inline-flex items-center gap-1 text-xs font-semibold">
              <LineChart className="h-3 w-3" />
              {formatPercent(VARIACIONES.ingresosDiaVsAyer)}
            </span>
          </div>

          <div className="text-2xl font-semibold tabular-nums">
            {formatCurrency(SUMMARY_KPIS.ingresosDia)}
          </div>

          <p className="subtle text-xs">
            Comparado con ayer, la producción global muestra una variación positiva.
          </p>
        </div>

        <div className="neo-card flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <span className="subtle text-xs font-semibold uppercase tracking-wide">
              Ingresos del mes
            </span>

            <span className="kpi-chip kpi-chipup inline-flex items-center gap-1 text-xs font-semibold">
              <LineChart className="h-3 w-3" />
              {formatPercent(VARIACIONES.ingresosMesVsAnterior)}
            </span>
          </div>

          <div className="text-2xl font-semibold tabular-nums">
            {formatCurrency(SUMMARY_KPIS.ingresosMes)}
          </div>

          <p className="subtle text-xs">
            Incluye restaurantes, alquileres de propiedades y otros negocios activos.
          </p>
        </div>

        <div className="neo-card flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <span className="subtle text-xs font-semibold uppercase tracking-wide">
              Margen de rentabilidad
            </span>

            <span
              className={`kpi-chip inline-flex items-center gap-1 text-xs font-semibold ${
                VARIACIONES.margenVsAnterior >= 0 ? "kpi-chipup" : "kpi-chipdown"
              }`}
            >
              <LineChart className="h-3 w-3" />
              {formatPercent(VARIACIONES.margenVsAnterior)}
            </span>
          </div>

          <div className="text-2xl font-semibold tabular-nums">
            {formatPercent(SUMMARY_KPIS.margenMes)}
          </div>

          <p className="subtle text-xs">
            Margen estimado usando transacciones de ingresos y gastos registrados.
          </p>
        </div>

        <div className="neo-card flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <span className="subtle text-xs font-semibold uppercase tracking-wide">
              Negocios activos
            </span>

            <Wallet className="h-4 w-4 text-[var(--accent)]" />
          </div>

          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-2xl font-semibold tabular-nums">
                {SUMMARY_KPIS.negociosActivos}
              </div>

              <p className="subtle text-xs">
                Restaurantes, propiedades y otras unidades operando hoy.
              </p>
            </div>

            <div className="text-right">
              <div className="subtle mb-1 text-[11px]">Flujo disponible</div>

              <div className="text-sm font-semibold tabular-nums">
                {formatCurrency(SUMMARY_KPIS.flujoDisponible)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-split gap-4">
        <div className="neo-card production-card flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <LineChart className="h-4 w-4 text-[var(--accent)]" />
                Ingresos últimos 7 días
              </h2>

              <p className="subtle text-xs">
                Vista consolidada de la producción diaria por todos los negocios.
              </p>
            </div>

            <div className="subtle text-right text-xs">
              Base de referencia:{" "}
              <span className="font-semibold tabular-nums">
                {formatCurrency(totalIngresosReferencia)}
              </span>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-7 items-end gap-2">
            {INGRESOS_7_DIAS.map((day) => {
              const heightPct = (day.total / (totalIngresosReferencia || 1)) * 100;

              return (
                <div key={day.label} className="flex flex-col items-center gap-1">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-full bg-gradient-to-t from-[color-mix(in_oklab,var(--accent)_40%,black_15%)] to-[var(--accent)] shadow-sm"
                      style={{ height: `${Math.max(heightPct, 8)}%` }}
                    />
                  </div>

                  <div className="subtle text-[11px] font-medium">
                    {day.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px]">
            <div className="metric-row">
              <span className="dot dotactivos" />
              <span>Barra más alta = día con mayor ingreso consolidado.</span>
            </div>

            <div className="metric-row">
              <span className="dot dotconst" />
              <span>Este gráfico podrá conectarse a transacciones reales.</span>
            </div>
          </div>
        </div>

        <div className="neo-card flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Banknote className="h-4 w-4 text-[var(--accent)]" />
                Flujo de caja por banco
              </h2>

              <p className="subtle text-xs">
                Saldos agregados por cuenta bancaria y efectivo.
              </p>
            </div>

            <div className="subtle text-right text-xs">
              Total en bancos

              <div className="font-semibold tabular-nums">
                {formatCurrency(totalBancos)}
              </div>
            </div>
          </div>

          <div className="mt-1 space-y-1.5">
            {BANCOS.map((banco) => {
              const pct = (banco.saldo / (totalBancos || 1)) * 100;
              const siglas = banco.nombre
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 3)
                .toUpperCase();

              return (
                <div key={banco.nombre} className="bank-row">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="bank-chip">{siglas}</div>

                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold">
                        {banco.nombre}
                      </div>

                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--panel)_80%,var(--border)_20%)]">
                        <div
                          className="bank-bar h-full"
                          style={{ width: `${pct.toFixed(1)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="ml-2 text-right text-xs font-semibold tabular-nums">
                    {formatCurrency(banco.saldo)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="neo-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Store className="h-4 w-4 text-[var(--accent)]" />
              Negocios con mayor producción hoy
            </h2>

            <span className="subtle text-[11px]">
              Basado en ingresos diarios estimados.
            </span>
          </div>

          <div className="-mx-2 overflow-x-auto px-2">
            <table className="table-lined w-full table-auto text-left text-xs">
              <thead className="bg-[color-mix(in_oklab,var(--panel)_94%,var(--accent)_6%)]">
                <tr>
                  <th className="px-2 py-2 font-semibold">Negocio</th>
                  <th className="px-2 py-2 font-semibold">Tipo</th>

                  <th className="px-2 py-2 text-right font-semibold">
                    Ingreso día
                  </th>

                  <th className="px-2 py-2 text-right font-semibold">
                    Ingreso mes
                  </th>

                  <th className="px-2 py-2 text-right font-semibold">
                    Var.
                  </th>

                  <th className="px-2 py-2 text-center font-semibold">
                    Estado
                  </th>
                </tr>
              </thead>

              <tbody>
                {NEGOCIOS_TOP.map((negocio, index) => {
                  const positive = negocio.variacion >= 0;

                  return (
                    <tr key={negocio.codigo || index}>
                      <td className="px-2 py-1.5">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold">
                            {negocio.nombre}
                          </span>

                          <span className="subtle text-[11px]">
                            Código {negocio.codigo}
                          </span>
                        </div>
                      </td>

                      <td className="px-2 py-1.5">
                        <div className="flex items-center gap-1 text-[11px]">
                          {negocio.tipo === "Propiedades" ? (
                            <Home className="subtle h-3 w-3" />
                          ) : (
                            <Factory className="subtle h-3 w-3" />
                          )}

                          <span>{negocio.tipo}</span>
                        </div>
                      </td>

                      <td className="px-2 py-1.5 text-right tabular-nums">
                        {formatCurrency(negocio.ingresoDia)}
                      </td>

                      <td className="px-2 py-1.5 text-right tabular-nums">
                        {formatCurrency(negocio.ingresoMes)}
                      </td>

                      <td
                        className={`px-2 py-1.5 text-right tabular-nums ${
                          positive ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {positive ? "?" : "?"}{" "}
                        {formatPercent(Math.abs(negocio.variacion))}
                      </td>

                      <td className="px-2 py-1.5 text-center">
                        <span
                          className={`inline-flex items-center justify-center rounded-full px-2 py-[2px] text-[11px] font-semibold ${
                            negocio.estado === "Abierto" ||
                            negocio.estado === "Operando"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-slate-500/20 text-slate-200"
                          }`}
                        >
                          {negocio.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="subtle mt-2 text-[11px]">
            Más adelante puedes filtrar por tipo de negocio, país o módulo.
          </p>
        </div>

        <div className="neo-card flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Alertas y próximos eventos
            </h2>

            <span className="subtle text-[11px]">
              Contratos, mantenimientos, cobros y proyectos.
            </span>
          </div>

          <div className="space-y-2 text-[13px]">
            {ALERTAS.map((alerta, index) => {
              let colorClasses = "border-slate-500/40 bg-slate-700/10";

              if (alerta.severidad === "alta") {
                colorClasses = "border-rose-500/50 bg-rose-500/10";
              } else if (alerta.severidad === "media") {
                colorClasses = "border-amber-500/50 bg-amber-500/10";
              }

              return (
                <div
                  key={`${alerta.tipo}-${index}`}
                  className={`flex items-start gap-2 rounded-lg border px-3 py-2 ${colorClasses}`}
                >
                  <div className="pt-[2px]">
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </div>

                  <div className="flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wide">
                      {alerta.tipo}
                    </div>

                    <div className="text-[13px] leading-snug">
                      {alerta.mensaje}
                    </div>
                  </div>

                  <span className="subtle text-[10px] capitalize">
                    {alerta.severidad}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="subtle mt-1 text-[11px]">
            Estas alertas pueden alimentarse de transacciones, contratos,
            proyectos y del módulo de restaurante.
          </p>
        </div>
      </section>
    </div>
  );
}
