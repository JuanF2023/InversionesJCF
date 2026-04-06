// client/src/features/corporativo/Negocios/pages/NegociosConfiguracionPage.jsx
import React from "react";
import { Settings, Shield, SlidersHorizontal, Users } from "lucide-react";

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

function Item({ icon: Icon, title, desc }) {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-[var(--border)] p-3">
            <div className="h-9 w-9 rounded-xl grid place-items-center border border-[var(--border)]">
                <Icon size={16} className="opacity-80" />
            </div>
            <div className="min-w-0">
                <div className="font-semibold">{title}</div>
                <div className="text-sm opacity-75">{desc}</div>
            </div>
        </div>
    );
}

export default function NegociosConfiguracionPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Configuraci車n</h2>
                <p className="text-sm opacity-75">
                    Par芍metros del negocio, acceso, permisos y preferencias (enterprise).
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card
                    title="Par芍metros"
                    subtitle="Valores base: estado, zona, pa赤s, etiquetas, etc."
                >
                    <div className="space-y-3">
                        <Item icon={SlidersHorizontal} title="Par芍metros del negocio" desc="Campos editables y validaciones." />
                        <div className="text-sm opacity-75">
                            Placeholder: formulario con ※Modificar / Guardar§ (igual al patr車n de Par芍metros del Restaurante).
                        </div>
                    </div>
                </Card>

                <Card
                    title="Acceso y permisos"
                    subtitle="RBAC / scopes (corporativo vs negocio)."
                >
                    <div className="space-y-3">
                        <Item icon={Shield} title="Permisos" desc="Scopes por rol y restricciones de visibilidad." />
                        <Item icon={Users} title="Usuarios" desc="Asignaci車n de usuarios a negocio (si aplica)." />
                        <div className="text-sm opacity-75">
                            Placeholder: configuraci車n de acceso (cuando actives esta parte).
                        </div>
                    </div>
                </Card>
            </div>

            <Card title="Preferencias" subtitle="Comportamientos del m車dulo y defaults UX.">
                <Item icon={Settings} title="Preferencias" desc="Defaults, formatos, toggles de visualizaci車n." />
            </Card>
        </div>
    );
}
