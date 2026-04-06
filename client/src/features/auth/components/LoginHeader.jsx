// C:\Users\Administrator\OneDrive\InversionesJCF\InversionesJCF\client\src\features\auth\components\LoginHeader.jsx
import React from "react";
import { ShieldCheck } from "lucide-react";

export default function LoginHeader({ title, todayText }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 shadow-sm">
                        <ShieldCheck size={22} className="text-emerald-300" />
                    </div>

                    <div className="min-w-0">
                        <h1 className="truncate text-3xl font-bold tracking-tight text-white">
                            {title}
                        </h1>
                        <div className="mt-1 text-sm text-slate-300">{todayText}</div>
                    </div>
                </div>

                <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                    Accede con tu PIN para entrar, continuar una sesi¨®n activa o registrar tus acciones operativas.
                </p>
            </div>
        </div>
    );
}
