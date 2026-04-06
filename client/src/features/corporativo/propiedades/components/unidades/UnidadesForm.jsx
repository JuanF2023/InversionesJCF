// client/src/features/corporativo/Propiedades/Unidades/UnidadesForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Home, DollarSign, FileText, Loader2, Layers } from "lucide-react";
import toast from "react-hot-toast";

import BaseFormPage from "@/shared/components/ui/layout/BaseFormPage.jsx";
import FormSectionCard from "@/shared/components/ui/layout/FormSectionCard.jsx";
import FormFooter from "@/shared/components/ui/layout/FormFooter.jsx";
import Field, { fieldControlClass } from "@/shared/components/ui/forms/Field.jsx";
import SecondaryButton from "@/shared/components/ui/primitives/SecondaryButton.jsx";

import { usePropertiesStore } from "@/features/corporativo/propiedades/store/properties.store.js";
import { useNegociosStore } from "@/features/corporativo/negocios/store/negocios.store.js";
import { useUnitsStore } from "@/features/corporativo/propiedades/store/units.store.js";

const cx = (...c) => c.filter(Boolean).join(" ");

const FORM_DEFAULTS = {
    propertyId: "",
    businessId: "",
    name: "",
    code: "",
    state: "Disponible",

    unitType: "Apartamento",
    levelLabel: "",
    levelsCount: "1",
    roomsCount: "",
    bathsCount: "",
    builtAreaM2: "",

    baseRentAmount: "",
    currency: "USD",

    publicDescription: "",
    notesInternal: "",

    // ??creación múltiple
    quantity: "1",
    baseName: "",
    baseCode: "",
};

function sanitizeText(v) {
    return String(v ?? "").trim();
}

function toNumberOrNull(v) {
    const s = String(v ?? "").trim();
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
}

function pad2(n) {
    const x = Number(n);
    if (!Number.isFinite(x)) return "00";
    return String(x).padStart(2, "0");
}

export default function UnidadesForm({ mode }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = mode === "edit" || Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ ...FORM_DEFAULTS });
    const [errors, setErrors] = useState({});

    // Stores
    const propsLoading = usePropertiesStore((s) => s.loading);
    const propsLoaded = usePropertiesStore((s) => s.loaded);
    const propiedades = usePropertiesStore((s) => s.propiedades);
    const cargarProps = usePropertiesStore((s) => s.cargar);

    const negLoading = useNegociosStore((s) => s.loading);
    const negLoaded = useNegociosStore((s) => s.loaded);
    const negocios = useNegociosStore((s) => s.negocios);
    const cargarNegocios = useNegociosStore((s) => s.cargar);

    const fetchById = useUnitsStore((s) => s.fetchById);
    const create = useUnitsStore((s) => s.create);
    const createMany = useUnitsStore((s) => s.createMany); // ??nuevo (patch store abajo)
    const update = useUnitsStore((s) => s.update);

    const goBack = () => navigate(-1);

    const setField = (field) => (e) => {
        const value = e?.target?.type === "checkbox" ? e.target.checked : e.target.value;
        setForm((p) => ({ ...p, [field]: value }));
    };

    const setNumberField = (field) => (e) => {
        const raw = e.target.value;
        if (raw === "") return setForm((p) => ({ ...p, [field]: "" }));
        if (!Number.isNaN(Number(raw))) setForm((p) => ({ ...p, [field]: raw }));
    };

    // Prefetch catálogos
    useEffect(() => {
        if (!propsLoaded && !propsLoading) cargarProps();
        if (!negLoaded && !negLoading) cargarNegocios();
    }, [propsLoaded, propsLoading, cargarProps, negLoaded, negLoading, cargarNegocios]);

    // UX: preseleccionar propiedad
    useEffect(() => {
        if (isEdit) return;
        if (form.propertyId) return;

        const list = Array.isArray(propiedades) ? propiedades : [];
        if (list.length > 0) {
            const firstId = String(list[0]?.id ?? list[0]?._id ?? "").trim();
            if (firstId) setForm((p) => ({ ...p, propertyId: firstId }));
        }
    }, [isEdit, form.propertyId, propiedades]);

    // Carga modo edición
    useEffect(() => {
        if (!isEdit) return;

        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                const data = await fetchById(id);
                if (cancelled) return;

                setForm({
                    ...FORM_DEFAULTS,
                    propertyId: String(data?.propertyId ?? data?.propiedadId ?? ""),
                    businessId: String(data?.businessId ?? data?.negocioId ?? ""),
                    name: data?.name ?? data?.nombre ?? "",
                    code: data?.code ?? data?.codigo ?? "",
                    state: data?.state ?? data?.estado ?? "Disponible",

                    unitType: data?.unitType ?? data?.tipo ?? "Apartamento",
                    levelLabel: data?.levelLabel ?? data?.piso ?? data?.nivel ?? "",
                    levelsCount:
                        (data?.levelsCount ?? data?.niveles ?? data?.levels ?? "") !== null &&
                            (data?.levelsCount ?? data?.niveles ?? data?.levels ?? "") !== undefined
                            ? String(data?.levelsCount ?? data?.niveles ?? data?.levels ?? "")
                            : "1",
                    roomsCount:
                        (data?.roomsCount ?? data?.cuartos ?? data?.rooms ?? "") !== null &&
                            (data?.roomsCount ?? data?.cuartos ?? data?.rooms ?? "") !== undefined
                            ? String(data?.roomsCount ?? data?.cuartos ?? data?.rooms ?? "")
                            : "",
                    bathsCount:
                        (data?.bathsCount ?? data?.banos ?? data?.baños ?? data?.baths ?? "") !== null &&
                            (data?.bathsCount ?? data?.banos ?? data?.baños ?? data?.baths ?? "") !== undefined
                            ? String(data?.bathsCount ?? data?.banos ?? data?.baños ?? data?.baths ?? "")
                            : "",
                    builtAreaM2:
                        typeof data?.builtAreaM2 === "number"
                            ? String(data.builtAreaM2)
                            : String(data?.builtAreaM2 ?? data?.areaM2 ?? ""),

                    baseRentAmount:
                        typeof data?.baseRent?.amount === "number"
                            ? String(data.baseRent.amount)
                            : String(data?.baseRentAmount ?? ""),
                    currency: data?.baseRent?.currency ?? data?.currency ?? "USD",

                    publicDescription: data?.publicDescription ?? data?.descripcionPublica ?? data?.descripcion ?? "",
                    notesInternal: data?.notesInternal ?? data?.notasInternas ?? "",

                    // edición no usa creación múltiple
                    quantity: "1",
                    baseName: "",
                    baseCode: "",
                });
            } catch (err) {
                console.error("[UnidadesForm] error cargando unidad", err);
                toast.error("No se pudo cargar la unidad.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [isEdit, id, fetchById]);

    // Options
    const propOptions = useMemo(() => {
        const list = Array.isArray(propiedades) ? propiedades : [];
        return list
            .map((p) => {
                const idOpt = String(p?.id ?? p?._id ?? "").trim();
                if (!idOpt) return null;
                const codigo = String(p?.codigo ?? "").trim();
                const nombre = String(p?.nombre ?? "Propiedad").trim();
                return { id: idOpt, label: `${codigo ? `${codigo} · ` : ""}${nombre}` };
            })
            .filter(Boolean);
    }, [propiedades]);

    const negocioOptions = useMemo(() => {
        const list = Array.isArray(negocios) ? negocios : [];
        return list
            .map((n) => {
                const idOpt = String(n?.id ?? n?._id ?? "").trim();
                if (!idOpt) return null;
                const nombre = String(n?.nombre ?? n?.alias ?? "Negocio").trim();
                return { id: idOpt, label: nombre };
            })
            .filter(Boolean);
    }, [negocios]);

    // ??Preview de unidades a crear
    const qty = useMemo(() => {
        const n = Number(form.quantity);
        if (!Number.isFinite(n)) return 1;
        return Math.max(1, Math.min(50, Math.floor(n))); // límite UI razonable
    }, [form.quantity]);

    const willCreateMany = !isEdit && qty > 1;

    const generatedPreview = useMemo(() => {
        if (!willCreateMany) return [];
        const bn = sanitizeText(form.baseName) || sanitizeText(form.name);
        const bc = sanitizeText(form.baseCode) || sanitizeText(form.code);
        if (!bn || !bc) return [];
        return Array.from({ length: qty }).map((_, i) => ({
            name: `${bn} ${pad2(i + 1)}`,
            code: `${bc}-${pad2(i + 1)}`,
        }));
    }, [willCreateMany, form.baseName, form.baseCode, form.name, form.code, qty]);

    // Validación
    const validate = () => {
        const next = {};
        if (!sanitizeText(form.propertyId)) next.propertyId = "Selecciona una propiedad.";

        // ??En múltiple: baseName/baseCode obligatorios
        if (willCreateMany) {
            if (!sanitizeText(form.baseName) && !sanitizeText(form.name)) next.baseName = "Nombre base requerido.";
            if (!sanitizeText(form.baseCode) && !sanitizeText(form.code)) next.baseCode = "Código base requerido.";
        } else {
            if (!sanitizeText(form.name)) next.name = "Nombre requerido.";
            if (!sanitizeText(form.code)) next.code = "Código requerido.";
        }

        if (form.builtAreaM2 !== "" && Number(form.builtAreaM2) < 0) next.builtAreaM2 = "El área debe ser ??0.";
        if (form.roomsCount !== "" && Number(form.roomsCount) < 0) next.roomsCount = "Los cuartos deben ser ??0.";
        if (form.bathsCount !== "" && Number(form.bathsCount) < 0) next.bathsCount = "Los baños deben ser ??0.";
        if (form.levelsCount !== "" && Number(form.levelsCount) < 1) next.levelsCount = "Los niveles deben ser ??1.";
        if (form.baseRentAmount !== "" && Number(form.baseRentAmount) < 0) next.baseRentAmount = "La renta debe ser ??0.";
        if (!isEdit && (form.quantity === "" || Number(form.quantity) < 1)) next.quantity = "Cantidad debe ser ??1.";

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const canSubmit = useMemo(() => {
        if (!sanitizeText(form.propertyId)) return false;
        if (isEdit) return Boolean(sanitizeText(form.name) && sanitizeText(form.code));
        if (willCreateMany) {
            const bn = sanitizeText(form.baseName) || sanitizeText(form.name);
            const bc = sanitizeText(form.baseCode) || sanitizeText(form.code);
            return Boolean(bn && bc && qty >= 1);
        }
        return Boolean(sanitizeText(form.name) && sanitizeText(form.code));
    }, [form.propertyId, form.name, form.code, form.baseName, form.baseCode, isEdit, willCreateMany, qty]);

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;

        if (!validate()) {
            toast.error("Revisa los campos marcados antes de guardar.");
            return;
        }

        const basePayload = {
            propertyId: String(form.propertyId),
            businessId: form.businessId ? String(form.businessId) : null,

            state: form.state,
            unitType: sanitizeText(form.unitType),
            levelLabel: sanitizeText(form.levelLabel),

            levelsCount: toNumberOrNull(form.levelsCount),
            roomsCount: toNumberOrNull(form.roomsCount),
            bathsCount: toNumberOrNull(form.bathsCount),
            builtAreaM2: toNumberOrNull(form.builtAreaM2),

            baseRent:
                form.baseRentAmount === ""
                    ? undefined
                    : { amount: Number(form.baseRentAmount), currency: form.currency },

            publicDescription: sanitizeText(form.publicDescription),
            notesInternal: sanitizeText(form.notesInternal),
        };

        try {
            setSaving(true);

            if (isEdit) {
                const payload = {
                    ...basePayload,
                    name: sanitizeText(form.name),
                    code: sanitizeText(form.code),
                };
                await update(id, payload);
                toast.success("Unidad actualizada.");
                goBack();
                return;
            }

            // ??creación múltiple
            if (willCreateMany) {
                const bn = sanitizeText(form.baseName) || sanitizeText(form.name);
                const bc = sanitizeText(form.baseCode) || sanitizeText(form.code);

                const items = Array.from({ length: qty }).map((_, i) => ({
                    ...basePayload,
                    name: `${bn} ${pad2(i + 1)}`,
                    code: `${bc}-${pad2(i + 1)}`,
                }));

                if (typeof createMany === "function") {
                    await createMany(items);
                } else {
                    // fallback: crear una por una
                    for (const it of items) {
                        // eslint-disable-next-line no-await-in-loop
                        await create(it);
                    }
                }

                toast.success(`${qty} unidades creadas.`);
                goBack();
                return;
            }

            // ??creación simple
            const payload = {
                ...basePayload,
                name: sanitizeText(form.name),
                code: sanitizeText(form.code),
            };

            await create(payload);
            toast.success("Unidad creada.");
            goBack();
        } catch (err) {
            console.error("[UnidadesForm] error al guardar", err);
            toast.error("Error al guardar la unidad.");
        } finally {
            setSaving(false);
        }
    };

    const title = isEdit ? "Editar unidad" : "Nueva unidad";
    const description = "Activo inmobiliario rentable asociado a una propiedad.";
    const isCatalogLoading = (!propsLoaded && propsLoading) || (!negLoaded && negLoading);

    return (
        <BaseFormPage
            icon={Home}
            title={title}
            description={description}
            onBack={goBack}
            rightSlot={
                <SecondaryButton type="button" onClick={goBack} disabled={saving}>
                    Volver
                </SecondaryButton>
            }
        >
            {loading || isCatalogLoading ? (
                <div className="neo-plate neo-plate--tinted p-4 md:p-5 rounded-2xl text-xs subtle flex items-center gap-2">
                    <Loader2 className={cx("w-4 h-4 opacity-70", loading || isCatalogLoading ? "animate-spin" : "")} />
                    Cargando??
                </div>
            ) : (
                <form
                    id="unidad-form"
                    onSubmit={handleSubmit}
                    className="neo-card neo-card--deep neo-card--tinted no-clip w-full rounded-2xl p-4 md:p-6 space-y-6"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* IZQUIERDA */}
                        <div className="space-y-6">
                            <FormSectionCard title="Identidad de la unidad" description="Asocia la unidad a una propiedad y define sus identificadores.">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field label="Propiedad" required error={errors.propertyId}>
                                        <select
                                            value={form.propertyId}
                                            onChange={setField("propertyId")}
                                            disabled={saving}
                                            className={cx("neo-select w-full", fieldControlClass({ error: !!errors.propertyId, ok: canSubmit }))}
                                        >
                                            <option value="">Selecciona</option>
                                            {propOptions.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.label}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>

                                    <Field label="Negocio administrador" hint="Opcional">
                                        <select
                                            value={form.businessId || ""}
                                            onChange={setField("businessId")}
                                            disabled={saving}
                                            className={cx("neo-select w-full", fieldControlClass())}
                                        >
                                            <option value="">Sin negocio</option>
                                            {negocioOptions.map((n) => (
                                                <option key={n.id} value={n.id}>
                                                    {n.label}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>

                                    {/* ??Solo crear: cantidad */}
                                    {!isEdit && (
                                        <Field label="Cantidad" required error={errors.quantity} hint="Crea varias unidades con correlativo automático (01, 02...).">
                                            <input
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={form.quantity}
                                                onChange={setNumberField("quantity")}
                                                disabled={saving}
                                                className={cx(fieldControlClass({ error: !!errors.quantity }), "max-w-[180px]")}
                                            />
                                        </Field>
                                    )}

                                    {/* Modo simple (cantidad=1) */}
                                    {!willCreateMany ? (
                                        <>
                                            <Field label="Nombre" required error={errors.name}>
                                                <input
                                                    type="text"
                                                    value={form.name}
                                                    onChange={setField("name")}
                                                    disabled={saving}
                                                    placeholder="Ej. Apartamento 01"
                                                    className={fieldControlClass({ error: !!errors.name, ok: canSubmit })}
                                                />
                                            </Field>

                                            <Field label="Código" required error={errors.code}>
                                                <input
                                                    type="text"
                                                    value={form.code}
                                                    onChange={setField("code")}
                                                    disabled={saving}
                                                    placeholder="Ej. PROP-04-APT-01"
                                                    className={fieldControlClass({ error: !!errors.code, ok: canSubmit })}
                                                />
                                            </Field>
                                        </>
                                    ) : (
                                        <>
                                            {/* ??Modo múltiple */}
                                            <Field label="Nombre base" required error={errors.baseName}>
                                                <input
                                                    type="text"
                                                    value={form.baseName}
                                                    onChange={setField("baseName")}
                                                    disabled={saving}
                                                    placeholder="Ej. Apartamento"
                                                    className={fieldControlClass({ error: !!errors.baseName, ok: canSubmit })}
                                                />
                                            </Field>

                                            <Field label="Código base" required error={errors.baseCode}>
                                                <input
                                                    type="text"
                                                    value={form.baseCode}
                                                    onChange={setField("baseCode")}
                                                    disabled={saving}
                                                    placeholder="Ej. PROP-04-APT"
                                                    className={fieldControlClass({ error: !!errors.baseCode, ok: canSubmit })}
                                                />
                                            </Field>

                                            <div className="md:col-span-2 neo-plate neo-plate--soft p-3 rounded-xl text-xs">
                                                <div className="flex items-center gap-2 mb-2 opacity-80">
                                                    <Layers className="w-4 h-4" />
                                                    Vista previa (primeros 6)
                                                </div>
                                                {generatedPreview.length === 0 ? (
                                                    <div className="opacity-70">Completa Nombre base y Código base para ver el correlativo.</div>
                                                ) : (
                                                    <ul className="space-y-1">
                                                        {generatedPreview.slice(0, 6).map((x) => (
                                                            <li key={x.code} className="flex items-center justify-between gap-2">
                                                                <span className="truncate">{x.name}</span>
                                                                <span className="font-mono opacity-80">{x.code}</span>
                                                            </li>
                                                        ))}
                                                        {generatedPreview.length > 6 ? <li className="opacity-70">??y más</li> : null}
                                                    </ul>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </FormSectionCard>

                            <FormSectionCard
                                icon={DollarSign}
                                title="Características y renta"
                                description="Características físicas clave para métricas y proyecciones."
                            >
                                <div className="grid gap-4 md:grid-cols-3">
                                    <Field label="Tipo de unidad" hint="Ej. Apartamento, Local, Bodega">
                                        <input
                                            type="text"
                                            value={form.unitType}
                                            onChange={setField("unitType")}
                                            disabled={saving}
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <Field label="Piso / Nivel" hint="Ej. Planta baja, 2">
                                        <input
                                            type="text"
                                            value={form.levelLabel}
                                            onChange={setField("levelLabel")}
                                            disabled={saving}
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <Field label="Niveles" error={errors.levelsCount}>
                                        <input
                                            type="number"
                                            min="1"
                                            step="1"
                                            value={form.levelsCount}
                                            onChange={setNumberField("levelsCount")}
                                            disabled={saving}
                                            className={fieldControlClass({ error: !!errors.levelsCount })}
                                        />
                                    </Field>

                                    <Field label="Cuartos" error={errors.roomsCount} hint={!errors.roomsCount ? "Opcional" : undefined}>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={form.roomsCount}
                                            onChange={setNumberField("roomsCount")}
                                            disabled={saving}
                                            className={fieldControlClass({ error: !!errors.roomsCount })}
                                        />
                                    </Field>

                                    <Field label="Baños" error={errors.bathsCount} hint={!errors.bathsCount ? "Opcional" : undefined}>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={form.bathsCount}
                                            onChange={setNumberField("bathsCount")}
                                            disabled={saving}
                                            className={fieldControlClass({ error: !!errors.bathsCount })}
                                        />
                                    </Field>

                                    <Field label="área (m2)" error={errors.builtAreaM2} hint={!errors.builtAreaM2 ? "Opcional" : undefined}>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.builtAreaM2}
                                            onChange={setNumberField("builtAreaM2")}
                                            disabled={saving}
                                            className={fieldControlClass({ error: !!errors.builtAreaM2 })}
                                        />
                                    </Field>

                                    <Field label="Renta base" error={errors.baseRentAmount} hint={!errors.baseRentAmount ? "Opcional" : undefined}>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.baseRentAmount}
                                            onChange={setNumberField("baseRentAmount")}
                                            disabled={saving}
                                            placeholder="0.00"
                                            className={fieldControlClass({ error: !!errors.baseRentAmount })}
                                        />
                                    </Field>

                                    <Field label="Moneda">
                                        <select
                                            value={form.currency}
                                            onChange={setField("currency")}
                                            disabled={saving}
                                            className={cx("neo-select w-full", fieldControlClass())}
                                        >
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                        </select>
                                    </Field>

                                    <Field label="Estado">
                                        <select
                                            value={form.state}
                                            onChange={setField("state")}
                                            disabled={saving}
                                            className={cx("neo-select w-full", fieldControlClass())}
                                        >
                                            <option value="Disponible">Disponible</option>
                                            <option value="Ocupada">Ocupada</option>
                                            <option value="Mantenimiento">Mantenimiento</option>
                                            <option value="Reservada">Reservada</option>
                                        </select>
                                    </Field>
                                </div>
                            </FormSectionCard>
                        </div>

                        {/* DERECHA */}
                        <div className="space-y-6">
                            <FormSectionCard
                                icon={FileText}
                                title="Descripción y notas"
                                description="Descripción pública (para listados) y notas internas (administración)."
                            >
                                <div className="grid gap-4">
                                    <Field label="Descripción pública" hint="Opcional (ej. 2 cuartos, 1 baño, incluye agua...)">
                                        <textarea
                                            value={form.publicDescription}
                                            onChange={setField("publicDescription")}
                                            disabled={saving}
                                            placeholder="Ej. 2 cuartos, 1 baño, sala/comedor, incluye agua."
                                            className={cx("neo-textarea", fieldControlClass())}
                                            rows={6}
                                        />
                                    </Field>

                                    <Field label="Notas internas" hint="Opcional (solo administración)">
                                        <textarea
                                            value={form.notesInternal}
                                            onChange={setField("notesInternal")}
                                            disabled={saving}
                                            placeholder="Ej. Pintura pendiente, contrato vence en..."
                                            className={cx("neo-textarea", fieldControlClass())}
                                            rows={6}
                                        />
                                    </Field>

                                    <div className="flex items-center gap-2 opacity-80 text-xs">
                                        <FileText className="w-3.5 h-3.5" />
                                        Las notas internas no se muestran al cliente.
                                    </div>
                                </div>
                            </FormSectionCard>
                        </div>
                    </div>

                    <FormFooter
                        onCancel={goBack}
                        isSubmitting={saving}
                        canSubmit={canSubmit}
                        submitLabel={isEdit ? "Guardar cambios" : willCreateMany ? `Crear ${qty} unidades` : "Guardar unidad"}
                        submitIcon={isEdit ? "save" : "plus"}
                        leftHint={
                            !canSubmit
                                ? willCreateMany
                                    ? "Completa: Propiedad, Nombre base y Código base."
                                    : "Completa: Propiedad, Nombre y Código."
                                : ""
                        }
                    />
                </form>
            )}
        </BaseFormPage>
    );
}


