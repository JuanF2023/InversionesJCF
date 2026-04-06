// client/src/features/corporativo/Negocios/pages/NegociosUnidadesPage.jsx
import React from "react";
import { Layers, Link2, Unlink2, Search } from "lucide-react";

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

export default function NegociosUnidadesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Unidades</h2>
                <p className="text-sm opacity-75">
                    Lista y relaci車n unidades ? negocio (si la relaci車n vive en <code>unit.businessId</code>).
                </p>
            </div>

            <Card
                title="B迆squeda"
                subtitle="Filtra unidades r芍pidamente por c車digo, nombre, estado o negocio."
            >
                <div className="flex flex-col md:flex-row gap-3 md:items-center">
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" />
                        <input
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--panel)_80%,transparent)] outline-none"
                            placeholder="Buscar unidad＃"
                        />
                    </div>

                    <button
                        type="button"
                        className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--accent)] text-black hover:brightness-105 transition"
                    >
                        Aplicar
                    </button>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card
                    title="Unidades asociadas"
                    subtitle="Unidades ya vinculadas a un negocio (vista r芍pida)."
                >
                    <div className="text-sm opacity-75">
                        Placeholder: tabla con acciones r芍pidas.
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            type="button"
                            className="px-3 py-2 rounded-xl border border-[var(--border)] hover:brightness-105 transition"
                        >
                            <span className="inline-flex items-center gap-2 text-sm">
                                <Unlink2 size={16} /> Desasignar
                            </span>
                        </button>
                    </div>
                </Card>

                <Card
                    title="Unidades disponibles"
                    subtitle="Unidades sin negocio asignado (o filtradas)."
                >
                    <div className="text-sm opacity-75">
                        Placeholder: lista para asignaci車n r芍pida sin navegar a otra pantalla.
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <button
                            type="button"
                            className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--accent)] text-black hover:brightness-105 transition"
                        >
                            <span className="inline-flex items-center gap-2 text-sm">
                                <Link2 size={16} /> Asignar
                            </span>
                        </button>
                        <button
                            type="button"
                            className="px-3 py-2 rounded-xl border border-[var(--border)] hover:brightness-105 transition"
                        >
                            <span className="inline-flex items-center gap-2 text-sm">
                                <Layers size={16} /> Ver todo
                            </span>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
