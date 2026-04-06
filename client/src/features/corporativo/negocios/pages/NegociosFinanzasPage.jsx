// client/src/features/corporativo/Negocios/pages/NegociosFinanzasPage.jsx
import React from "react";
import { Landmark, Wallet, Receipt, BarChart3 } from "lucide-react";

const cx = (...c) => c.filter(Boolean).join(" ");

function Card({ title, subtitle, children, className }) {
    return (
        <section className={cx("rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-sm", className)}>
            <div className="p-4 md:p-5">
                <h3 className="font-semibold">{title}</h3>
                {subtitle ? <p className="text-sm opacity-75 mt-0.5">{subtitle}</p> : null}
                <div className="mt-4">{children}</div>
            </div>
        </section>
    );
}

function Row({ icon: Icon, title, desc }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] p-3">
            <div className="h-9 w-9 rounded-xl grid place-items-center border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_80%,transparent)]">
                <Icon size={16} className="opacity-80" />
            </div>
            <div className="min-w-0">
                <div className="font-semibold">{title}</div>
                <div className="text-sm opacity-75">{desc}</div>
            </div>
        </div>
    );
}

export default function NegociosFinanzasPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Finanzas</h2>
                <p className="text-sm opacity-75">
                    Banco ≧ Cuenta ≧ Transacci車n. Esta vista muestra todo en una sola pantalla (enterprise).
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card
                    title="Bancos (Instituciones)"
                    subtitle="Listado de bancos disponibles y su estatus (cat芍logo / BD)."
                >
                    <div className="space-y-3">
                        <Row
                            icon={Landmark}
                            title="Bancos"
                            desc="Instituciones financieras (ej. BAC, Chase, Wells Fargo)."
                        />
                        <div className="text-sm opacity-75">
                            Aqu赤 ir芍 tu tabla/lista real. (Luego conectas a tu store/API.)
                        </div>
                    </div>
                </Card>

                <Card
                    title="Cuentas (Instrumentos)"
                    subtitle="Cuentas corrientes, caja, Stripe, etc."
                >
                    <div className="space-y-3">
                        <Row
                            icon={Wallet}
                            title="Cuentas"
                            desc="Instrumentos vinculados a un banco (o proveedor) + balance."
                        />
                        <div className="text-sm opacity-75">
                            Recomendaci車n: cuenta siempre referencia a banco (cuando aplique) y a negocio.
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card
                    title="Transacciones"
                    subtitle="Movimientos (entradas/salidas), conciliaci車n y auditor赤a."
                >
                    <div className="space-y-3">
                        <Row
                            icon={Receipt}
                            title="Movimientos"
                            desc="Ingreso, egreso, transferencia, ajuste, etc."
                        />
                        <div className="text-sm opacity-75">
                            Placeholder: tabla con filtros por fecha, cuenta, tipo y negocio.
                        </div>
                    </div>
                </Card>

                <Card
                    title="Reportes"
                    subtitle="Cierres, mensual, comparativos, exportaci車n."
                >
                    <div className="space-y-3">
                        <Row
                            icon={BarChart3}
                            title="Informes financieros"
                            desc="Cierre diario, mensual, m芍rgenes, cashflow."
                        />
                        <div className="text-sm opacity-75">
                            Placeholder: KPIs + exportaci車n (PDF/Excel) y auditor赤a.
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
