// client/src/features/corporativo/Negocios/components/KPIStripGlobal.jsx
import React, { useEffect, useState } from "react";
import { useCorporativo } from "@/features/corporativo/negocios/store/corporativoStore.js";

// Formateador de dinero
const money = new Intl.NumberFormat("es-SV", {
    style: "currency",
    currency: "USD",
});

/**
 * ?? Stub temporal:
 * Por ahora devolvemos totales en 0.
 * Cuando tengamos el endpoint real de resumen de negocios,
 * aqu¨ª solo cambiamos esta funci¨®n.
 */
async function fetchStubSummary({ ids, range }) {
    // ids y range quedan para uso futuro
    return {
        totals: {
            incomes: 0,
            costs: 0,
            margin: 0,
            monthlyProduction: 0,
        },
    };
}

export default function KPIStripGlobal() {
    // Tomamos los IDs seleccionados desde corporativoStore (o array vac¨ªo)
    const selectedIds = useCorporativo((s) => s.selectedBusinessIds || []);

    const [data, setData] = useState({
        totals: {
            incomes: 0,
            costs: 0,
            margin: 0,
            monthlyProduction: 0,
        },
    });

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const summary = await fetchStubSummary({
                    ids: selectedIds,
                    range: "month",
                });
                if (!cancelled) {
                    setData(summary || {});
                }
            } catch (err) {
                if (!cancelled) {
                    console.error("[KPIStripGlobal] Error obteniendo resumen:", err);
                    // En caso de error dejamos los valores en 0 para no romper la UI
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [selectedIds]);

    const t = data.totals || {
        incomes: 0,
        costs: 0,
        margin: 0,
        monthlyProduction: 0,
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPI label="Ingresos (mes)" value={t.incomes} />
            <KPI label="Costos (mes)" value={t.costs} />
            <KPI label="Margen (mes)" value={t.margin} />
            <KPI label="Prod. planificada" value={t.monthlyProduction} />
        </div>
    );
}

function KPI({ label, value }) {
    return (
        <div className="neo-plate neo-plate--tinted p-3 rounded-xl">
            <div className="text-xs subtle">{label}</div>
            <div className="text-2xl font-bold">{money.format(value ?? 0)}</div>
        </div>
    );
}

