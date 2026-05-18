// client/src/features/corporativo/access/pages/UserCreatePage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    Save,
    UserPlus,
    UserRound,
    ShieldCheck,
    ToggleRight,
} from "lucide-react";

import { PageSurface, PanelSurface } from "@/core/ui/surfaces";
import {
    DetailGrid,
    DetailItem,
    DetailPageHeader,
    DetailSection,
} from "@/core/ui/detail";
import { FormField, TextInput } from "@/core/ui/forms";
import TableActionButton from "@/core/ui/actions/TableActionButton.jsx";

import { useAccessUsersStore } from "@/features/corporativo/access/store/accessUsers.store.js";

const EMPTY_VALUE = "N/A";

const initialForm = {
    nombre: "",
    email: "",
    pin: "",
    activo: true,
};

function normalizePin(value) {
    return String(value || "").replace(/\D/g, "").slice(0, 6);
}

export default function UserCreatePage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const crear = useAccessUsersStore((state) => state.crear);
    const actualizar = useAccessUsersStore((state) => state.actualizar);
    const obtenerPorId = useAccessUsersStore((state) => state.obtenerPorId);
    const limpiarActual = useAccessUsersStore((state) => state.limpiarActual);
    const currentItem = useAccessUsersStore((state) => state.currentItem);
    const loading = useAccessUsersStore((state) => state.loading);
    const saving = useAccessUsersStore((state) => state.saving);

    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        document.title = isEdit ? "Editar usuario" : "Nuevo usuario";
    }, [isEdit]);

    useEffect(() => {
        if (!isEdit) {
            limpiarActual();
            setForm(initialForm);
            return;
        }

        obtenerPorId(id).catch((error) => {
            toast.error(error?.message || "Error cargando usuario.");
        });
    }, [id, isEdit, obtenerPorId, limpiarActual]);

    useEffect(() => {
        if (!isEdit || !currentItem) return;

        setForm({
            nombre: currentItem.nombre || "",
            email: currentItem.email || "",
            pin: "",
            activo: currentItem.activo ?? true,
        });
    }, [currentItem, isEdit]);

    const title = isEdit ? "Editar usuario" : "Nuevo usuario";

    const subtitle = isEdit
        ? "Actualiza la información principal del usuario. El PIN solo cambia si escribes uno nuevo."
        : "Registra un usuario nuevo con su información principal y PIN inicial.";

    const pinHelper = useMemo(() => {
        if (isEdit) return "Déjalo vacío para conservar el PIN actual.";
        return "Usa solo números. Recomendado: 4 o 6 dígitos.";
    }, [isEdit]);

    function updateField(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const nombre = form.nombre.trim();
        const email = form.email.trim().toLowerCase();
        const pin = normalizePin(form.pin);

        if (!nombre) {
            toast.error("El nombre es obligatorio.");
            return;
        }

        if (!email) {
            toast.error("El email es obligatorio.");
            return;
        }

        if (!isEdit && !pin) {
            toast.error("El PIN es obligatorio para crear usuarios.");
            return;
        }

        if (pin && ![4, 6].includes(pin.length)) {
            toast.error("El PIN debe tener 4 o 6 dígitos.");
            return;
        }

        const payload = {
            nombre,
            email,
            activo: Boolean(form.activo),
        };

        if (pin) {
            payload.pin = pin;
        }

        try {
            if (isEdit) {
                await actualizar(id, payload);
                toast.success("Usuario actualizado correctamente.");
            } else {
                await crear(payload);
                toast.success("Usuario creado correctamente.");
            }

            navigate("/corporativo/admin/users");
        } catch (error) {
            toast.error(error?.message || "Error guardando usuario.");
        }
    }

    if (isEdit && loading) {
        return (
            <PageSurface>
                <PanelSurface>
                    <p className="text-sm opacity-70">Cargando usuario...</p>
                </PanelSurface>
            </PageSurface>
        );
    }

    return (
        <PageSurface>
            <div>
                <TableActionButton
                    icon={ArrowLeft}
                    variant="neutral"
                    onClick={() => navigate("/corporativo/admin/users")}
                >
                    Volver
                </TableActionButton>
            </div>

            <DetailPageHeader
                eyebrow={isEdit ? "Administración de usuario" : "Alta de usuario"}
                title={title}
                subtitle={subtitle}
                avatar={
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--chip)]">
                        {isEdit ? <UserRound size={20} /> : <UserPlus size={20} />}
                    </div>
                }
                status={
                    <span className="rounded-full border border-[var(--border)] bg-[var(--chip)] px-3 py-1 text-xs font-bold">
                        {isEdit ? "Modo edición" : "Nuevo registro"}
                    </span>
                }
            />

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
                    <DetailSection
                        icon={UserRound}
                        title="Información del usuario"
                        description="Datos principales para identificar al usuario dentro del sistema."
                    >
                        <DetailGrid>
                            <FormField label="Nombre completo" required>
                                <TextInput
                                    value={form.nombre}
                                    onChange={(event) =>
                                        updateField("nombre", event.target.value)
                                    }
                                    placeholder="Ej. Ana Palacios"
                                    disabled={saving}
                                />
                            </FormField>

                            <FormField label="Email" required>
                                <TextInput
                                    type="email"
                                    value={form.email}
                                    onChange={(event) =>
                                        updateField("email", event.target.value)
                                    }
                                    placeholder="usuario@empresa.com"
                                    disabled={saving}
                                />
                            </FormField>

                            <FormField
                                label={isEdit ? "Nuevo PIN" : "PIN inicial"}
                                required={!isEdit}
                                helper={pinHelper}
                            >
                                <TextInput
                                    inputMode="numeric"
                                    value={form.pin}
                                    onChange={(event) =>
                                        updateField(
                                            "pin",
                                            normalizePin(event.target.value)
                                        )
                                    }
                                    placeholder={isEdit ? "Opcional" : "0000"}
                                    disabled={saving}
                                />
                            </FormField>

                            <FormField label="Estado">
                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => updateField("activo", !form.activo)}
                                    className="flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--chip)] px-4 py-3 text-sm font-bold transition hover:bg-[var(--chip-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <span>{form.activo ? "Activo" : "Inactivo"}</span>
                                    <ToggleRight
                                        size={20}
                                        className={
                                            form.activo
                                                ? "text-emerald-600"
                                                : "opacity-45"
                                        }
                                    />
                                </button>
                            </FormField>
                        </DetailGrid>
                    </DetailSection>

                    <DetailSection
                        icon={ShieldCheck}
                        title="Resumen"
                        description="Vista rápida antes de guardar."
                    >
                        <DetailGrid columns={1}>
                            <DetailItem
                                label="Nombre"
                                value={form.nombre || EMPTY_VALUE}
                            />

                            <DetailItem
                                label="Email"
                                value={form.email || EMPTY_VALUE}
                            />

                            <DetailItem
                                label="Estado"
                                value={form.activo ? "Activo" : "Inactivo"}
                            />

                            <DetailItem
                                label="PIN"
                                value={
                                    form.pin
                                        ? `${form.pin.length} dígitos configurados`
                                        : isEdit
                                          ? "Sin cambios"
                                          : "Pendiente"
                                }
                            />
                        </DetailGrid>
                    </DetailSection>
                </div>

                <PanelSurface padding="md" variant="soft">
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <TableActionButton
                            type="button"
                            variant="neutral"
                            onClick={() => navigate("/corporativo/admin/users")}
                        >
                            Cancelar
                        </TableActionButton>

                        <TableActionButton
                            type="submit"
                            icon={Save}
                            variant="access"
                            disabled={saving}
                        >
                            {saving ? "Guardando..." : "Guardar cambios"}
                        </TableActionButton>
                    </div>
                </PanelSurface>
            </form>
        </PageSurface>
    );
}
