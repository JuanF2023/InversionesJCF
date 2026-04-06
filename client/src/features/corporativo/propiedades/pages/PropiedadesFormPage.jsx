// client/src/features/corporativo/Propiedades/PropiedadesFormPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Home as HomeIcon, Upload, Trash2, Loader2 } from "lucide-react";

import BaseFormPage from "@/shared/components/ui/layout/BaseFormPage.jsx";
import FormSectionCard from "@/shared/components/ui/layout/FormSectionCard.jsx";
import FormFooter from "@/shared/components/ui/layout/FormFooter.jsx";
import Field, { fieldControlClass } from "@/shared/components/ui/forms/Field.jsx";
import SecondaryButton from "@/shared/components/ui/primitives/SecondaryButton.jsx";

import { usePropertiesStore } from "@/features/corporativo/propiedades/store/properties.store.js";

const cx = (...c) => c.filter(Boolean).join(" ");
const todayISO = () => new Date().toISOString().slice(0, 10);

/**
 * Estado inicial del formulario de propiedad
 * Nota: strings en campos num谷ricos para que los inputs controlados funcionen bien.
 *
 * Convenci車n:
 * - form.id = id can車nico de API (mongoId/_id)
 */
const initialForm = {
    id: null,
    codigo: "",
    nombre: "",
    estado: "ACTIVA",
    tipo: "",
    descripcionActual: "",
    notas: "",
    ubicacion: {
        pais: "",
        departamento: "",
        ciudad: "",
        municipio: "",
        direccion: "",
        bandera: "",
    },
    historia: {
        fechaCompra: todayISO(),
        descripcionCompra: "",
        precioCompra: "",
    },
    valores: {
        valorCompra: "",
        valorActual: "",
        costoTotalActual: "",
        ingresoMensualActual: "",
    },
    dimensiones: {
        medidasDeclaradas: "",
        areaM2: "",
        areaV2: "",
        norte: "",
        sur: "",
        este: "",
        oeste: "",
        acceso: "",
    },
    media: [],
};

/** Id can車nico para API */
function getApiId(p) {
    const v = p?.mongoId ?? p?._id ?? p?.id ?? null;
    return v ? String(v).trim() : "";
}

/** Mapea una propiedad del store al estado del formulario */
function buildFormFromProp(raw) {
    if (!raw) return { ...initialForm };

    const ubic = raw.ubicacion || {};
    const vals = raw.valores || {};
    const dims = raw.dimensiones || {};
    const hist = raw.historia || {};

    const lastHist =
        Array.isArray(raw.valorHistorico) && raw.valorHistorico.length > 0
            ? raw.valorHistorico[raw.valorHistorico.length - 1]
            : null;

    return {
        ...initialForm,
        // ??form.id = id can車nico (mongoId/_id) para UPDATE
        id: getApiId(raw) || null,

        codigo: raw.codigo || "",
        nombre: raw.nombre || "",
        estado: raw.estado || "ACTIVA",
        tipo: raw.tipo || raw.categoria || "",
        descripcionActual: raw.descripcionActual || raw.descripcion || "",
        notas: raw.notas || "",
        ubicacion: {
            ...initialForm.ubicacion,
            pais: ubic.pais || "",
            departamento: ubic.departamento || ubic.estado || "",
            ciudad: ubic.ciudad || "",
            municipio: ubic.municipio || "",
            direccion: ubic.direccion || ubic.direccionExacta || "",
            bandera: ubic.bandera || "",
        },
        historia: {
            ...initialForm.historia,
            fechaCompra: hist.fechaCompra || raw.fechaCompra || initialForm.historia.fechaCompra,
            descripcionCompra: hist.descripcionCompra || "",
            precioCompra:
                (hist.precioCompra ?? vals.valorCompra ?? raw.valorCompra ?? raw.precioCompra ?? "") !== null
                    ? String(hist.precioCompra ?? vals.valorCompra ?? raw.valorCompra ?? raw.precioCompra ?? "")
                    : "",
        },
        valores: {
            ...initialForm.valores,
            valorCompra:
                (vals.valorCompra ?? raw.valorCompra ?? raw.precioCompra ?? raw.precio_compra ?? "") !== null
                    ? String(vals.valorCompra ?? raw.valorCompra ?? raw.precioCompra ?? raw.precio_compra ?? "")
                    : "",
            valorActual:
                (vals.valorActual ?? raw.valorActual ?? lastHist?.valor ?? "") !== null
                    ? String(vals.valorActual ?? raw.valorActual ?? lastHist?.valor ?? "")
                    : "",
            costoTotalActual:
                (vals.costoTotalActual ?? raw.costoTotalActual ?? "") !== null
                    ? String(vals.costoTotalActual ?? raw.costoTotalActual ?? "")
                    : "",
            ingresoMensualActual:
                (vals.ingresoMensualActual ?? raw.ingresoMensualActual ?? "") !== null
                    ? String(vals.ingresoMensualActual ?? raw.ingresoMensualActual ?? "")
                    : "",
        },
        dimensiones: {
            ...initialForm.dimensiones,
            medidasDeclaradas: dims.medidasDeclaradas || "",
            areaM2: typeof dims.areaM2 === "number" ? String(dims.areaM2) : dims.areaM2 || "",
            areaV2: typeof dims.areaV2 === "number" ? String(dims.areaV2) : dims.areaV2 || "",
            norte: dims.norte || "",
            sur: dims.sur || "",
            este: dims.este || "",
            oeste: dims.oeste || "",
            acceso: dims.acceso || "",
        },
        media: Array.isArray(raw.media) ? raw.media : [],
    };
}

function pickEditKey(params) {
    const id = String(params.id || "").trim();
    const codigo = String(params.codigo || "").trim();
    return id || codigo || "";
}

function matchesProperty(p, editKey) {
    const pid = String(p?.mongoId ?? p?._id ?? p?.id ?? "").trim();
    const codigo = String(p?.codigo ?? "").trim();
    return (pid && pid === editKey) || (codigo && codigo === editKey);
}

function toNumberOrNull(v) {
    const s = String(v ?? "").trim();
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
}

export default function PropiedadesFormPage() {
    const navigate = useNavigate();
    const params = useParams();

    const editKey = pickEditKey(params);
    const isEditing = Boolean(editKey);

    const { propiedades, cargar, guardarPropiedad, saving, loading } = usePropertiesStore((s) => ({
        propiedades: Array.isArray(s.propiedades) ? s.propiedades : [],
        cargar: s.cargar,
        guardarPropiedad: s.guardarPropiedad,
        saving: Boolean(s.saving || s.loadingSave),
        loading: Boolean(s.loading),
    }));

    const [form, setForm] = useState({ ...initialForm });
    const [errors, setErrors] = useState({});
    const [prefilled, setPrefilled] = useState(false);

    useEffect(() => {
        setPrefilled(false);
    }, [editKey]);

    /* ---------- Buscar propiedad cuando es edici車n ---------- */
    useEffect(() => {
        let cancelled = false;

        const loadForEdit = async () => {
            if (!isEditing || prefilled) return;

            // 1) buscar en store actual
            const existing = (propiedades || []).find((p) => matchesProperty(p, editKey)) || null;
            if (existing) {
                if (!cancelled) {
                    setForm(buildFormFromProp(existing));
                    setPrefilled(true);
                }
                return;
            }

            // 2) cargar lista y reintentar
            try {
                if (typeof cargar === "function") {
                    await cargar();
                }
                if (cancelled) return;

                const st = usePropertiesStore.getState();
                const list = Array.isArray(st?.propiedades) ? st.propiedades : [];
                const afterLoad = list.find((p) => matchesProperty(p, editKey)) || null;

                if (afterLoad && !cancelled) {
                    setForm(buildFormFromProp(afterLoad));
                }
            } catch (err) {
                // eslint-disable-next-line no-console
                console.error("[PropiedadesFormPage] Error cargando propiedad para edici車n:", err);
            } finally {
                if (!cancelled) setPrefilled(true);
            }
        };

        loadForEdit();
        return () => {
            cancelled = true;
        };
    }, [isEditing, editKey, propiedades, cargar, prefilled]);

    /* ---------- Handlers ---------- */
    const setField = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
    const setNestedField = (section, field) => (e) =>
        setForm((p) => ({ ...p, [section]: { ...p[section], [field]: e.target.value } }));

    const handleMediaChange = (updater) => {
        setForm((p) => ({ ...p, media: updater(p.media || []) }));
    };

    /* ---------- Multimedia: drag & drop ---------- */
    const fileInputRef = useRef(null);

    function filesToMedia(files) {
        const list = [];
        for (const f of files) {
            if (!f) continue;
            const url = URL.createObjectURL(f);
            const kind = /^video\//.test(f.type) ? "video" : "image";
            list.push({ kind, url, file: f, name: f.name, size: f.size, type: f.type });
        }
        return list;
    }

    function onFilesPicked(e) {
        const files = e.target.files || [];
        const items = filesToMedia(files);
        handleMediaChange((prev) => [...prev, ...items]);

        // ??Permite volver a seleccionar el mismo archivo
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function onDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer?.files || [];
        const items = filesToMedia(files);
        handleMediaChange((prev) => [...prev, ...items]);
    }

    function onDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function removeMedia(i) {
        handleMediaChange((prev) => {
            const copy = [...prev];
            const m = copy[i];
            if (m?.url?.startsWith("blob:")) URL.revokeObjectURL(m.url);
            copy.splice(i, 1);
            return copy;
        });
    }

    // ??Cleanup blobs al desmontar (evita leaks)
    useEffect(() => {
        return () => {
            try {
                const items = Array.isArray(form?.media) ? form.media : [];
                for (const m of items) {
                    if (m?.url?.startsWith("blob:")) URL.revokeObjectURL(m.url);
                }
            } catch {
                // noop
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ---------- Validaci車n m赤nima ---------- */
    const validate = () => {
        const next = {};
        if (!String(form.nombre || "").trim()) next.nombre = "El nombre de la propiedad es obligatorio.";
        if (!String(form.codigo || "").trim()) next.codigo = "El c車digo de propiedad es obligatorio.";
        if (!String(form.ubicacion?.pais || "").trim()) next["ubicacion.pais"] = "Indica al menos el pa赤s.";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const canSubmit = useMemo(() => {
        return (
            String(form.codigo || "").trim().length > 0 &&
            String(form.nombre || "").trim().length > 0 &&
            String(form.ubicacion?.pais || "").trim().length > 0
        );
    }, [form.codigo, form.nombre, form.ubicacion?.pais]);

    /* ---------- Submit ---------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        if (!validate()) return;

        const payload = {
            ...form,

            // ??Canonical para API (update)
            mongoId: form.id || undefined,

            // Si alguien usa _id en backend, tambi谷n lo mandamos sin romper
            _id: form.id || undefined,

            historia: {
                ...form.historia,
                fechaCompra: form.historia.fechaCompra || null,
                precioCompra: toNumberOrNull(form.historia.precioCompra),
            },
            valores: {
                ...form.valores,
                valorCompra: toNumberOrNull(form.valores.valorCompra),
                valorActual: toNumberOrNull(form.valores.valorActual),
                costoTotalActual: toNumberOrNull(form.valores.costoTotalActual),
                ingresoMensualActual: toNumberOrNull(form.valores.ingresoMensualActual),
            },
            dimensiones: {
                ...form.dimensiones,
                areaM2: toNumberOrNull(form.dimensiones.areaM2),
                areaV2: toNumberOrNull(form.dimensiones.areaV2),
            },
        };

        try {
            if (typeof guardarPropiedad !== "function") {
                // eslint-disable-next-line no-console
                console.warn("[PropiedadesFormPage] Falta guardarPropiedad() en properties.store.js");
                return;
            }
            await guardarPropiedad(payload);
            navigate(-1);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error("[PropiedadesFormPage] Error al guardar propiedad:", err);
        }
    };

    // ??Mostrar ※cargando edici車n??de forma determinista mientras resolvemos el prefill
    const loadingEdit = isEditing && !prefilled;

    const title = isEditing ? "Editar propiedad" : "Nueva propiedad";
    const description = isEditing
        ? "Actualiza informaci車n principal, ubicaci車n, valores, dimensiones y multimedia."
        : "Registra una propiedad con ubicaci車n, valores, dimensiones y multimedia.";

    return (
        <BaseFormPage
            icon={HomeIcon}
            title={title}
            description={description}
            onBack={() => navigate(-1)}
            rightSlot={
                <SecondaryButton type="button" onClick={() => navigate(-1)} disabled={saving}>
                    Volver
                </SecondaryButton>
            }
        >
            {loadingEdit ? (
                <div className="neo-plate neo-plate--tinted p-4 md:p-5 rounded-2xl text-xs subtle flex items-center gap-2">
                    <Loader2 className={cx("w-4 h-4 opacity-70", loading ? "animate-spin" : "")} />
                    {loading ? "Cargando datos de la propiedad?? : "Preparando edici車n??}
                </div>
            ) : (
                <form
                    id="propiedad-form"
                    onSubmit={handleSubmit}
                    className="neo-card neo-card--deep neo-card--tinted no-clip w-full rounded-2xl p-4 md:p-6 space-y-6"
                >
                    {/* Layout 2 columnas en desktop */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* IZQUIERDA */}
                        <div className="space-y-6">
                            <FormSectionCard title="Administraci車n" description="Identificadores principales de la propiedad, estado y tipo.">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field label="C車digo" required error={errors.codigo}>
                                        <input
                                            type="text"
                                            value={form.codigo}
                                            onChange={setField("codigo")}
                                            disabled={saving}
                                            placeholder="Ej. PROP-001"
                                            className={fieldControlClass({ error: !!errors.codigo, ok: canSubmit })}
                                        />
                                    </Field>

                                    <Field label="Estado">
                                        <select
                                            value={form.estado}
                                            onChange={setField("estado")}
                                            disabled={saving}
                                            className={cx("neo-select w-full", fieldControlClass())}
                                        >
                                            <option value="ACTIVA">ACTIVA</option>
                                            <option value="INACTIVA">INACTIVA</option>
                                            <option value="VENDIDA">VENDIDA</option>
                                            <option value="PLANIFICADA">PLANIFICADA</option>
                                        </select>
                                    </Field>

                                    <div className="md:col-span-2">
                                        <Field label="Nombre de la propiedad" required error={errors.nombre}>
                                            <input
                                                type="text"
                                                value={form.nombre}
                                                onChange={setField("nombre")}
                                                disabled={saving}
                                                placeholder="Ej. Locales Comerciales 01"
                                                className={fieldControlClass({ error: !!errors.nombre, ok: canSubmit })}
                                            />
                                        </Field>
                                    </div>

                                    <div className="md:col-span-2">
                                        <Field label="Tipo de propiedad" hint="Opcional (Locales, Apartamentos, Terreno...)">
                                            <input
                                                type="text"
                                                value={form.tipo}
                                                onChange={setField("tipo")}
                                                disabled={saving}
                                                placeholder="Ej. Locales, Apartamentos, Terreno..."
                                                className={fieldControlClass()}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </FormSectionCard>

                            <FormSectionCard title="Compra y valor" description="Datos de compra, valor actual y desempe?o econ車mico.">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field label="Fecha de compra" hint="Opcional">
                                        <input
                                            type="date"
                                            max={todayISO()}
                                            value={form.historia.fechaCompra}
                                            onChange={setNestedField("historia", "fechaCompra")}
                                            disabled={saving}
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <Field label="Precio de compra (USD)" hint="Opcional">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.historia.precioCompra}
                                            onChange={setNestedField("historia", "precioCompra")}
                                            disabled={saving}
                                            placeholder="0.00"
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <Field label="Valor de compra base (USD)" hint="Opcional">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.valores.valorCompra}
                                            onChange={setNestedField("valores", "valorCompra")}
                                            disabled={saving}
                                            placeholder="0.00"
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <Field label="Valor actual estimado (USD)" hint="Opcional">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.valores.valorActual}
                                            onChange={setNestedField("valores", "valorActual")}
                                            disabled={saving}
                                            placeholder="0.00"
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <Field label="Costo total actual (USD)" hint="Opcional">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.valores.costoTotalActual}
                                            onChange={setNestedField("valores", "costoTotalActual")}
                                            disabled={saving}
                                            placeholder="0.00"
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <Field label="Ingreso mensual actual (USD)" hint="Opcional">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.valores.ingresoMensualActual}
                                            onChange={setNestedField("valores", "ingresoMensualActual")}
                                            disabled={saving}
                                            placeholder="0.00"
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <div className="md:col-span-2">
                                        <Field label="Descripci車n de compra" hint="Opcional (condiciones, cr谷dito, acuerdos...)">
                                            <textarea
                                                value={form.historia.descripcionCompra}
                                                onChange={setNestedField("historia", "descripcionCompra")}
                                                disabled={saving}
                                                placeholder="Detalle de la compra, condiciones, cr谷ditos, etc."
                                                className={cx("neo-textarea", fieldControlClass())}
                                                rows={4}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </FormSectionCard>

                            <FormSectionCard title="Ubicaci車n" description="Datos geogr芍ficos y direcci車n f赤sica de la propiedad.">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field label="Pa赤s" required error={errors["ubicacion.pais"]}>
                                        <input
                                            type="text"
                                            value={form.ubicacion.pais}
                                            onChange={setNestedField("ubicacion", "pais")}
                                            disabled={saving}
                                            placeholder="Ej. El Salvador, Estados Unidos"
                                            className={fieldControlClass({
                                                error: !!errors["ubicacion.pais"],
                                                ok: canSubmit,
                                            })}
                                        />
                                    </Field>

                                    <Field label="Bandera (URL)" hint="Opcional">
                                        <input
                                            type="text"
                                            value={form.ubicacion.bandera}
                                            onChange={setNestedField("ubicacion", "bandera")}
                                            disabled={saving}
                                            placeholder="https://flagcdn.com/sv.svg"
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <Field label="Departamento / Estado" hint="Opcional">
                                        <input
                                            type="text"
                                            value={form.ubicacion.departamento}
                                            onChange={setNestedField("ubicacion", "departamento")}
                                            disabled={saving}
                                            placeholder="Ej. La Libertad, California"
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <Field label="Municipio / Condado" hint="Opcional">
                                        <input
                                            type="text"
                                            value={form.ubicacion.municipio}
                                            onChange={setNestedField("ubicacion", "municipio")}
                                            disabled={saving}
                                            placeholder="Ej. Col車n, Los 芍ngeles County"
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <div className="md:col-span-2">
                                        <Field label="Ciudad" hint="Opcional">
                                            <input
                                                type="text"
                                                value={form.ubicacion.ciudad}
                                                onChange={setNestedField("ubicacion", "ciudad")}
                                                disabled={saving}
                                                placeholder="Ej. Lourdes Col車n, Los 芍ngeles"
                                                className={fieldControlClass()}
                                            />
                                        </Field>
                                    </div>

                                    <div className="md:col-span-2">
                                        <Field label="Direcci車n detallada" hint="Opcional">
                                            <input
                                                type="text"
                                                value={form.ubicacion.direccion}
                                                onChange={setNestedField("ubicacion", "direccion")}
                                                disabled={saving}
                                                placeholder="Ej. Pol赤gono 33B, Calle Nacional #28, Cant車n El Capul赤n..."
                                                className={fieldControlClass()}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </FormSectionCard>
                        </div>

                        {/* DERECHA */}
                        <div className="space-y-6">
                            <FormSectionCard title="Dimensiones" description="Medidas declaradas, 芍rea y colindancias.">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <Field label="Medidas declaradas" hint="Opcional (ej. 11x15x15)">
                                            <input
                                                type="text"
                                                value={form.dimensiones.medidasDeclaradas}
                                                onChange={setNestedField("dimensiones", "medidasDeclaradas")}
                                                disabled={saving}
                                                placeholder="Ej. 11x15x15"
                                                className={fieldControlClass()}
                                            />
                                        </Field>
                                    </div>

                                    <Field label="芍rea (m2)" hint="Opcional">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.dimensiones.areaM2}
                                            onChange={setNestedField("dimensiones", "areaM2")}
                                            disabled={saving}
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <Field label="芍rea (v2)" hint="Opcional">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={form.dimensiones.areaV2}
                                            onChange={setNestedField("dimensiones", "areaV2")}
                                            disabled={saving}
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <Field label="Norte" hint="Opcional">
                                        <input
                                            type="text"
                                            value={form.dimensiones.norte}
                                            onChange={setNestedField("dimensiones", "norte")}
                                            disabled={saving}
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <Field label="Sur" hint="Opcional">
                                        <input
                                            type="text"
                                            value={form.dimensiones.sur}
                                            onChange={setNestedField("dimensiones", "sur")}
                                            disabled={saving}
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <Field label="Este / Oriente" hint="Opcional">
                                        <input
                                            type="text"
                                            value={form.dimensiones.este}
                                            onChange={setNestedField("dimensiones", "este")}
                                            disabled={saving}
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <Field label="Oeste / Poniente" hint="Opcional">
                                        <input
                                            type="text"
                                            value={form.dimensiones.oeste}
                                            onChange={setNestedField("dimensiones", "oeste")}
                                            disabled={saving}
                                            className={fieldControlClass()}
                                        />
                                    </Field>

                                    <div className="md:col-span-2">
                                        <Field label="Acceso" hint="Opcional">
                                            <input
                                                type="text"
                                                value={form.dimensiones.acceso}
                                                onChange={setNestedField("dimensiones", "acceso")}
                                                disabled={saving}
                                                placeholder="Ej. Calle principal, pasaje, servidumbre??
                                                className={fieldControlClass()}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </FormSectionCard>

                            <FormSectionCard title="Multimedia" description="Im芍genes y videos de la propiedad (fachada, planos, entorno).">
                                <div
                                    onDrop={onDrop}
                                    onDragOver={onDragOver}
                                    className="rounded-lg border-2 border-dashed border-[var(--border)] p-4 grid place-items-center text-center mb-3 bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]/20"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-center gap-2 text-sm">
                                            <Upload size={16} /> Arrastra im芍genes o videos aqu赤
                                        </div>

                                        <label className="inline-flex items-center gap-2 btn-gradient btn-action control-md btn-shimmer cursor-pointer">
                                            <Upload size={16} />
                                            <span>Seleccionar archivos</span>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*,video/*"
                                                multiple
                                                className="hidden"
                                                onChange={onFilesPicked}
                                            />
                                        </label>

                                        <div className="text-xs subtle">PNG, JPG, MP4</div>
                                    </div>
                                </div>

                                {!form.media || form.media.length === 0 ? (
                                    <div className="text-xs subtle">Sin archivos seleccionados.</div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {form.media.map((m, i) => (
                                            <div
                                                key={m.url || m.name || i}
                                                className="relative group rounded-lg overflow-hidden ring-1 ring-border"
                                            >
                                                {m.kind === "video" ? (
                                                    <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
                                                        <video src={m.url} className="absolute inset-0 w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={m.url}
                                                        alt={m.name || ""}
                                                        className="w-full h-full object-cover"
                                                        style={{ aspectRatio: "16 / 9" }}
                                                    />
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => removeMedia(i)}
                                                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 text-white grid place-items-center ring-1 ring-white/30 opacity-0 group-hover:opacity-100 transition"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </FormSectionCard>
                        </div>
                    </div>

                    <FormSectionCard title="Descripci車n actual y notas" description="Resumen de la situaci車n actual, planes y comentarios.">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field label="Descripci車n actual" hint="Opcional">
                                <textarea
                                    value={form.descripcionActual}
                                    onChange={setField("descripcionActual")}
                                    disabled={saving}
                                    placeholder="Ej. Propiedad destinada a locales en planta baja..."
                                    className={cx("neo-textarea", fieldControlClass())}
                                    rows={4}
                                />
                            </Field>

                            <Field label="Notas adicionales" hint="Opcional">
                                <textarea
                                    value={form.notas}
                                    onChange={setField("notas")}
                                    disabled={saving}
                                    placeholder="Acuerdos, pendientes, ideas..."
                                    className={cx("neo-textarea", fieldControlClass())}
                                    rows={4}
                                />
                            </Field>
                        </div>
                    </FormSectionCard>

                    <FormFooter
                        onCancel={() => navigate(-1)}
                        isSubmitting={saving || loadingEdit}
                        canSubmit={canSubmit}
                        submitLabel={isEditing ? "Guardar cambios" : "Guardar propiedad"}
                        submitIcon={isEditing ? "save" : "plus"}
                        leftHint={!canSubmit ? "Completa: C車digo, Nombre y Pa赤s." : ""}
                    />
                </form>
            )}
        </BaseFormPage>
    );
}


