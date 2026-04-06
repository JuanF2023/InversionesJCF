// C:\Users\Administrator\OneDrive\InversionesJCF\InversionesJCF\client\src\features\auth\components\PinPad.jsx
import React from "react";
import { Delete, Trash2 } from "lucide-react";

function KeyButton({ children, onClick, disabled, className = "" }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={[
                "rounded-2xl py-5 font-bold shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                "border border-blue-400/20 bg-blue-600 hover:bg-blue-500 active:scale-[0.98]",
                "text-white text-2xl",
                className,
            ].join(" ")}
        >
            {children}
        </button>
    );
}

export default function PinPad({ loading, onDigit, onClear, onBackspace }) {
    return (
        <div className="grid grid-cols-3 gap-4 mt-4 mb-6 w-full max-w-[420px] mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <KeyButton
                    key={n}
                    onClick={() => onDigit(n)}
                    disabled={loading}
                >
                    {n}
                </KeyButton>
            ))}

            <KeyButton
                onClick={onClear}
                disabled={loading}
                className="text-base flex items-center justify-center gap-2"
            >
                <Trash2 size={20} />
                Limpiar
            </KeyButton>

            <KeyButton
                onClick={() => onDigit(0)}
                disabled={loading}
            >
                0
            </KeyButton>

            <KeyButton
                onClick={onBackspace}
                disabled={loading}
                className="flex items-center justify-center"
            >
                <Delete size={22} />
            </KeyButton>
        </div>
    );
}
