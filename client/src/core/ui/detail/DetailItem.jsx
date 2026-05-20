// client/src/core/ui/detail/DetailItem.jsx
import React from "react";

const EMPTY_VALUE = "N/A";

function renderValue(value) {
    if (value === null || typeof value === "undefined" || value === "") {
        return EMPTY_VALUE;
    }

    if (React.isValidElement(value)) {
        return value;
    }

    if (typeof value === "string" || typeof value === "number") {
        return value;
    }

    if (typeof value === "boolean") {
        return value ? "Sí" : "No";
    }

    if (Array.isArray(value)) {
        return value.length ? value.map(renderValue).join(", ") : EMPTY_VALUE;
    }

    if (typeof value === "object") {
        if (typeof value.label === "string") return value.label;
        if (typeof value.name === "string") return value.name;
        if (typeof value.nombre === "string") return value.nombre;
        if (typeof value.email === "string") return value.email;
        if (typeof value.system === "string") return value.system;

        return JSON.stringify(value);
    }

    return String(value);
}

export default function DetailItem({ label, value, children }) {
    const content = typeof children !== "undefined" ? children : renderValue(value);

    return (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--chip)] px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-55">
                {label}
            </p>

            <div className="mt-1 break-words text-sm font-semibold">
                {content}
            </div>
        </div>
    );
}
