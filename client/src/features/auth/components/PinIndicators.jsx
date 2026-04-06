// C:\Users\Administrator\OneDrive\InversionesJCF\InversionesJCF\client\src\features\auth\components\PinIndicators.jsx
import React from "react";

export default function PinIndicators({ pinLength, maxPin }) {
    return (
        <div className="flex justify-center gap-3 mt-6 mb-3 md:mb-4 min-h-5">
            {Array.from({ length: maxPin }).map((_, idx) => (
                <span
                    key={idx}
                    className={`inline-block w-12 h-4 rounded-full ${idx < pinLength ? "bg-green-400" : "bg-gray-500"
                        } transition-all`}
                />
            ))}
        </div>
    );
}
