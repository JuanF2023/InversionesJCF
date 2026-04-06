// client/src/features/corporativo/ui/primitives/AddAction.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function AddAction({ to = "#", children, className = "" }) {
    return (
        <Link
            to={to}
            className={[
                "inline-flex items-center justify-center rounded-xl",
                "bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white",
                "shadow-sm transition hover:bg-emerald-500",
                "focus:outline-none focus:ring-2 focus:ring-emerald-400/60",
                className,
            ].join(" ")}
        >
            {children}
        </Link>
    );
}
