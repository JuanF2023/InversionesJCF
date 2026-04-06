// client/src/features/corporativo/negocios/pages/BusinessFormPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Store, Loader2, MapPin, Building2, X } from "lucide-react";
import toast from "react-hot-toast";

import BaseFormPage from "@/shared/components/ui/layout/BaseFormPage.jsx";
import FormSectionCard from "@/shared/components/ui/layout/FormSectionCard.jsx";
import FormFooter from "@/shared/components/ui/layout/FormFooter.jsx";
import Field, { fieldControlClass } from "@/shared/components/ui/forms/Field.jsx";
import SecondaryButton from "@/shared/components/ui/primitives/SecondaryButton.jsx";

import { usenegociosStore } from "@/features/corporativo/negocios/store/negocios.store.js";
import { useUnitsStore } from "@/features/corporativo/propiedades/store/units.store.js";
import { usePropertiesStore } from "@/features/corporativo/propiedades/store/properties.store.js";
import { usecatalogo-negociosStore } from "@/features/corporativo/negocios/store/catalogo-negocios.store.js";

import ClasificacionCards from "@/features/corporativo/catalogos/components/ClasificacionCards.jsx";

const cx = (...c) => c.filter(Boolean).join(" ");
const DASH = "??;

/* -----------------------------
   Defaults (enterprise)
----------------------------- */
const FORM_DEFAULTS = {
    codigo: "",
    nombre: "",
    descripcion: "",
    categoryId: "",
    subcategoryId: "",
    typeId: "",
    estadoOperacion: "ACTIVO",

    // Relaci車n propiedad
    perteneceAPropiedad: "NO", // "SI" | "NO"
    propiedadId: "",

    // Ubicaci車n (solo si NO pertenece a propiedad)
    ubicacion: {
        pais: "",
        departamento: "",
        municipio: "",
        ciudad: "",
        direccion: "",
        referencia: "",
        observaciones: "",
    },
};

function sanitizeText(v) {
    return String(v ?? "").trim();
}
function str(v) {
    return String(v ?? "").trim();
}
function getId(x) {
    const v = x?.mongoId ?? x?._id ?? x?.id ?? x?.codigo ?? null;
    return v ? String(v).trim() : "";
}
function getPropLabel(p) {
    const nombre = str(p?.nombre);
    if (nombre) return nombre;
    const codigo = str(p?.codigo ?? p?.id);
    if (codigo) return `Propiedad ${codigo}`;
    const pid = getId(p);
    return pid ? `Propiedad ${pid.slice(-6)}` : "Propiedad";
}

function isPropActiva(p) {
    const v = String(p?.estado ?? p?.estadoOperacion ?? p?.status ?? "").toUpperCase().trim();
    if (v === "ACTIVA" || v === "ACTIVO") return true;
    if (v.includes("OPERAT")) return true;
    if (v.includes("RENT")) return true;
    if (v.includes("VEND")) return false;
    return false;
}

/**
 * Ubicaci車n "efectiva" para UI:
 * - si hay propiedad: toma de prop
 * - si no: toma del form
 */
function buildUbicacionForUI({ prop, form }) {
    const p = prop || {};
    const ubicP = p?.ubicacion || {};
    const ubicF = form?.ubicacion || {};
    const isFromProp = Boolean(prop);

    const referenciaCompat = p?.referencia ?? p?.calleAcceso ?? p?.dimensiones?.acceso ?? "";
    const observacionesCompat = p?.observaciones ?? p?.notas ?? "";

    return {
        source: isFromProp ? "propiedad" : "manual",
        pais: str(ubicP?.pais || p?.pais || ubicF?.pais) || DASH,
        departamento: str(ubicP?.departamento || p?.departamento || ubicF?.departamento) || DASH,
        municipio: str(ubicP?.municipio || p?.municipio || ubicF?.municipio) || DASH,
        ciudad: str(ubicP?.ciudad || p?.ciudad || ubicF?.ciudad) || DASH,
        direccion: str(ubicP?.direccion || p?.direccion || ubicF?.direccion) || DASH,
        referencia: str(ubicP?.referencia || referenciaCompat || ubicF?.referencia) || DASH,
        observaciones: str(ubicP?.observaciones || observacionesCompat || ubicF?.observaciones) || DASH,
    };
}

function LocationReadonlyCard({ title = "Ubicaci車n", data }) {
    const rows = [
        { k: "Pa赤s", v: data.pais },
        { k: "Departamento", v: data.departamento },
        { k: "Municipio", v: data.municipio },
        { k: "Ciudad", v: data.ciudad },
        { k: "Direcci車n", v: data.direccion },
        { k: "Referencia", v: data.referencia },
        { k: "Observaciones", v: data.observaciones },
    ];

    return (
        <div className="neo-plate neo-plate--soft p-3 rounded-xl">
            <div className="flex items-center justify-between gap-2 mb-2">
                <div className="text-sm font-semibold inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4 opacity-80" />
                    {title}
                </div>
                <div className="text-[11px] subtle">
                    Fuente: <span className="font-medium">{data.source === "propiedad" ? "Propiedad" : "Manual"}</span>
                </div>
            </div>

            <div className="rounded-xl overflow-hidden ring-1 ring-border/60">
                <table className="w-full text-sm">
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.k} className="border-t border-[var(--border)]/60 first:border-t-0">
                                <td className="p-2 w-[180px] opacity-80">{r.k}</td>
                                <td className="p-2 font-medium">{r.v}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* -----------------------------
   Modal (enterprise)
----------------------------- */
function CatalogManageModal({ open, title, subtitle, mode, initialName = "", disabled, onClose, onSubmit }) {
    const [name, setName] = useState("");

    useEffect(() => {
        if (!open) {
            setName("");
            return;
        }
        setName(String(initialName ?? "").trim());
    }, [open, initialName]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] grid place-items-center p-4 bg-black/40">
            <div className="neo-card neo-card--deep neo-card--tinted w-full max-w-xl rounded-2xl p-4 md:p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                        <div className="text-base font-semibold">{title}</div>
                        {subtitle ? <div className="text-xs subtle mt-1">{subtitle}</div> : null}
                    </div>
                    <button
                        type="button"
                        className="neo-btn px-2 py-2 rounded-lg"
                        onClick={onClose}
                        disabled={disabled}
                        aria-label="Cerrar"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid gap-3">
                    <Field label="Nombre" required>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={fieldControlClass()}
                            disabled={disabled}
                            placeholder="Ej. Inmobiliario"
                        />
                    </Field>

                    <div className="text-xs subtle">{subtitle || "Conecta este modal a endpoints POST/PATCH para crear/editar cat芍logo."}</div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button type="button" className="neo-btn px-4 py-2 rounded-xl" onClick={onClose}>
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="btn-gradient btn-action btn-shimmer px-4 py-2 rounded-xl"
                            disabled={disabled || !sanitizeText(name)}
                            onClick={() => onSubmit?.({ name, mode })}
                        >
                            {mode === "edit" ? "Guardar" : "Crear"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* -----------------------------
   Helpers cat芍logo (robustos)
----------------------------- */
function normLevel(x) {
    return String(x?.level ?? x?.nivel ?? x?.typeLevel ?? "").trim().toLowerCase();
}
function normKey(x) {
    const v = x?.key ?? x?.id ?? x?._id ?? x?.mongoId ?? x?.codigo ?? "";
    return String(v ?? "").trim();
}
function normParentKey(x) {
    const v = x?.parentKey ?? x?.parent_key ?? x?.parent ?? x?.parentId ?? x?.parent_id ?? "";
    return String(v ?? "").trim();
}
function normLabel(x) {
    const v = x?.label ?? x?.nombre ?? x?.name ?? x?.titulo ?? "";
    return String(v ?? "").trim();
}
function isActivoCatalog(x) {
    if (x == null) return false;
    if (x.activo === false) return false;
    if (String(x.estado ?? "").toUpperCase() === "INACTIVO") return false;
    return true;
}

/* -----------------------------
   Page
----------------------------- */
export default function BusinessFormPage() {
    const navigate = useNavigate();
    const { businessId } = useParams();
    const isEdit = Boolean(businessId);

    const [form, setForm] = useState({ ...FORM_DEFAULTS });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(isEdit);
    const [errors, setErrors] = useState({});
    const [catModal, setCatModal] = useState({ open: false, level: "", mode: "create" });

    /* =========================
       Stores: propiedades / negocios / Unidades
    ========================= */
    const cargarProps = usePropertiesStore((s) => s.cargar);
    const propsLoaded = usePropertiesStore((s) => s.loaded);
    const propsLoading = usePropertiesStore((s) => s.loading);
    const props = usePropertiesStore((s) => (Array.isArray(s.propiedades) ? s.propiedades : []));

    const cargarnegocios = usenegociosStore((s) => s.cargar);
    const negociosLoaded = usenegociosStore((s) => s.loaded);
    const negociosLoading = usenegociosStore((s) => s.loading);

    const fetchBusinessById = usenegociosStore((s) => s.fetchById);
    const createBusiness = usenegociosStore((s) => s.create);
    const updateBusiness = usenegociosStore((s) => s.update);

    const cargarUnidades = useUnitsStore((s) => s.cargar);
    const unitsLoaded = useUnitsStore((s) => s.loaded);
    const unitsLoading = useUnitsStore((s) => s.loading);

    /* =========================
       Store: Cat芍logo negocios
    ========================= */
    const cargarCatalogo = usecatalogo-negociosStore((s) => s.cargar);
    const catalogLoading = usecatalogo-negociosStore((s) => s.loading);
    const catalogLoaded = usecatalogo-negociosStore((s) => s.loaded);
    const catalogError = usecatalogo-negociosStore((s) => s.error);
    const catalogErrorCode = usecatalogo-negociosStore((s) => s.errorCode);

    const crearCategoria = usecatalogo-negociosStore((s) => s.crearCategoria);
    const editarCategoria = usecatalogo-negociosStore((s) => s.editarCategoria);
    const crearSubcategoria = usecatalogo-negociosStore((s) => s.crearSubcategoria);
    const editarSubcategoria = usecatalogo-negociosStore((s) => s.editarSubcategoria);
    const crearTipo = usecatalogo-negociosStore((s) => s.crearTipo);
    const editarTipo = usecatalogo-negociosStore((s) => s.editarTipo);

    const catalogItems = usecatalogo-negociosStore((s) => (Array.isArray(s.items) ? s.items : []));

    /* =========================
       Derivados cat芍logo
    ========================= */
    const categorias = useMemo(() => {
        return (catalogItems || [])
            .filter(isActivoCatalog)
            .filter((x) => {
                const lv = normLevel(x);
                return lv === "category" || lv === "categoria";
            })
            .map((x) => ({ id: normKey(x), key: normKey(x), label: normLabel(x) }))
            .filter((x) => x.id && x.label)
            .sort((a, b) => a.label.localeCompare(b.label, "es", { sensitivity: "base" }));
    }, [catalogItems]);

    const subcategoryOptions = useMemo(() => {
        const ck = str(form.categoryId);
        if (!ck) return [];
        return (catalogItems || [])
            .filter(isActivoCatalog)
            .filter((x) => {
                const lv = normLevel(x);
                const pk = normParentKey(x);
                return (lv === "subcategory" || lv === "subcategoria") && pk === ck;
            })
            .map((x) => ({ id: normKey(x), key: normKey(x), label: normLabel(x) }))
            .filter((x) => x.id && x.label)
            .sort((a, b) => a.label.localeCompare(b.label, "es", { sensitivity: "base" }));
    }, [catalogItems, form.categoryId]);

    const typeOptions = useMemo(() => {
        const sk = str(form.subcategoryId);
        if (!sk) return [];
        return (catalogItems || [])
            .filter(isActivoCatalog)
            .filter((x) => {
                const lv = normLevel(x);
                const pk = normParentKey(x);
                return (lv === "business_type" || lv === "tipo") && pk === sk;
            })
            .map((x) => ({ id: normKey(x), key: normKey(x), label: normLabel(x) }))
            .filter((x) => x.id && x.label)
            .sort((a, b) => a.label.localeCompare(b.label, "es", { sensitivity: "base" }));
    }, [catalogItems, form.subcategoryId]);

    const setField = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

    const setNestedField = (path) => (e) => {
        const value = e.target.value;
        setForm((p) => {
            const next = { ...p };
            const keys = String(path).split(".");
            let cur = next;
            for (let i = 0; i < keys.length - 1; i++) {
                const k = keys[i];
                cur[k] = { ...(cur[k] || {}) };
                cur = cur[k];
            }
            cur[keys[keys.length - 1]] = value;
            return next;
        });
    };

    /* =========================
       Carga inicial
       FIX: no bloquear reintentos por catalogError.
    ========================= */
    useEffect(() => {
        if (!propsLoaded && !propsLoading && typeof cargarProps === "function") cargarProps();
        if (!unitsLoaded && !unitsLoading && typeof cargarUnidades === "function") cargarUnidades();
        if (!negociosLoaded && !negociosLoading && typeof cargarnegocios === "function") cargarnegocios();

        const st = usecatalogo-negociosStore.getState();
        const needsCatalog = !st.loaded || !Array.isArray(st.items) || st.items.length === 0;

        if (!catalogLoading && typeof cargarCatalogo === "function" && needsCatalog) {
            cargarCatalogo({ force: true }).catch((e) => {
                console.error("[BusinessFormPage] error cargando cat芍logo", e);

                // Mensaje m芍s realista: si fue tenant faltante, no ※vac赤o??
                const code = usecatalogo-negociosStore.getState().errorCode;
                if (code === "TENANT_REQUIRED") {
                    toast.error("Cat芍logo no disponible: falta tenantId. Selecciona un tenant e intenta de nuevo.");
                    return;
                }
                toast.error("No se pudo cargar el cat芍logo de clasificaci車n.");
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* =========================
       Cargar negocio en edici車n
    ========================= */
    useEffect(() => {
        if (!isEdit) {
            setLoading(false);
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                setLoading(true);
                if (typeof fetchBusinessById !== "function") {
                    setLoading(false);
                    return;
                }

                const data = await fetchBusinessById(businessId);
                if (cancelled) return;

                setForm((p) => ({
                    ...p,
                    codigo: data?.codigo ?? "",
                    nombre: data?.nombre ?? "",
                    descripcion: data?.descripcion ?? "",
                    categoryId: data?.categoryId ?? "",
                    subcategoryId: data?.subcategoryId ?? "",
                    typeId: data?.typeId ?? "",
                    estadoOperacion: data?.estadoOperacion ?? "ACTIVO",

                    perteneceAPropiedad: data?.propiedadId ? "SI" : "NO",
                    propiedadId: data?.propiedadId ? String(data.propiedadId) : "",

                    ubicacion: {
                        pais: data?.ubicacion?.pais ?? "",
                        departamento: data?.ubicacion?.departamento ?? "",
                        municipio: data?.ubicacion?.municipio ?? "",
                        ciudad: data?.ubicacion?.ciudad ?? "",
                        direccion: data?.ubicacion?.direccion ?? "",
                        referencia: data?.ubicacion?.referencia ?? data?.referencia ?? "",
                        observaciones: data?.ubicacion?.observaciones ?? data?.observaciones ?? "",
                    },
                }));
            } catch (err) {
                console.error("[BusinessFormPage] error cargando negocio", err);
                toast.error("No se pudo cargar el negocio.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [isEdit, businessId, fetchBusinessById]);

    /* =========================
       Reset dependencias cat芍logo
    ========================= */
    useEffect(() => {
        setForm((p) => ({ ...p, subcategoryId: "", typeId: "" }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.categoryId]);

    useEffect(() => {
        setForm((p) => ({ ...p, typeId: "" }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.subcategoryId]);

    /* =========================
       Propiedad: reglas UX
       - No autoseleccionar Prop 1
    ========================= */
    useEffect(() => {
        if (form.perteneceAPropiedad === "NO") {
            setForm((p) => ({ ...p, propiedadId: "" }));
            return;
        }
        setForm((p) => ({ ...p, propiedadId: "" }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.perteneceAPropiedad]);

    const propsOptions = useMemo(() => {
        const list = [...props]
            .map((p) => ({ ...p, __id: getId(p) }))
            .filter((p) => p.__id)
            .filter(isPropActiva);

        list.sort((a, b) =>
            String(a.codigo ?? a.nombre ?? "").localeCompare(String(b.codigo ?? b.nombre ?? ""), undefined, {
                numeric: true,
                sensitivity: "base",
            })
        );

        return list;
    }, [props]);

    useEffect(() => {
        if (form.perteneceAPropiedad !== "SI") return;
        const current = sanitizeText(form.propiedadId);
        if (!current) return;

        const exists = propsOptions.some((p) => String(p.__id) === String(current));
        if (!exists) setForm((p) => ({ ...p, propiedadId: "" }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propsOptions]);

    const selectedProp = useMemo(() => {
        const pid = str(form.propiedadId);
        if (!pid) return null;
        return props.find((x) => String(getId(x)) === pid) || null;
    }, [props, form.propiedadId]);

    const ubicacionUI = useMemo(() => {
        return buildUbicacionForUI({
            prop: form.perteneceAPropiedad === "SI" ? selectedProp : null,
            form,
        });
    }, [form, selectedProp]);

    /* =========================
       Empty real (no ※vac赤o falso??
    ========================= */
    const showCatalogEmpty = useMemo(() => {
        if (!catalogLoaded) return false;
        if (catalogError) return false;
        return categorias.length === 0;
    }, [catalogLoaded, catalogError, categorias.length]);

    /* =========================
       Validaci車n / Submit
    ========================= */
    const canSubmit = useMemo(() => {
        const coreOk = Boolean(
            sanitizeText(form.nombre) && sanitizeText(form.categoryId) && sanitizeText(form.subcategoryId) && sanitizeText(form.typeId)
        );
        if (!coreOk) return false;

        if (form.perteneceAPropiedad === "SI") return Boolean(sanitizeText(form.propiedadId));

        const u = form.ubicacion || {};
        return Boolean(sanitizeText(u.pais) && sanitizeText(u.departamento) && sanitizeText(u.municipio) && sanitizeText(u.ciudad) && sanitizeText(u.direccion));
    }, [form]);

    const validate = () => {
        const e = {};

        if (!sanitizeText(form.nombre)) e.nombre = "Nombre requerido.";
        if (!sanitizeText(form.categoryId)) e.categoryId = "Selecciona una categor赤a.";
        if (!sanitizeText(form.subcategoryId)) e.subcategoryId = "Selecciona una subcategor赤a.";
        if (!sanitizeText(form.typeId)) e.typeId = "Selecciona un tipo.";

        if (form.perteneceAPropiedad === "SI") {
            if (!sanitizeText(form.propiedadId)) e.propiedadId = "Selecciona una propiedad.";
            if (propsOptions.length === 0) e.propiedadId = "No hay propiedades activas disponibles.";
        } else {
            const u = form.ubicacion || {};
            if (!sanitizeText(u.pais)) e["ubicacion.pais"] = "Pa赤s requerido.";
            if (!sanitizeText(u.departamento)) e["ubicacion.departamento"] = "Departamento requerido.";
            if (!sanitizeText(u.municipio)) e["ubicacion.municipio"] = "Municipio requerido.";
            if (!sanitizeText(u.ciudad)) e["ubicacion.ciudad"] = "Ciudad requerida.";
            if (!sanitizeText(u.direccion)) e["ubicacion.direccion"] = "Direcci車n requerida.";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if (saving) return;

        if (!validate()) {
            toast.error("Revisa los campos marcados.");
            return;
        }

        const payloadBase = {
            codigo: sanitizeText(form.codigo),
            nombre: sanitizeText(form.nombre),
            descripcion: sanitizeText(form.descripcion),
            categoryId: form.categoryId,
            subcategoryId: form.subcategoryId,
            typeId: form.typeId,
            estadoOperacion: form.estadoOperacion,
        };

        const payload =
            form.perteneceAPropiedad === "SI"
                ? { ...payloadBase, propiedadId: sanitizeText(form.propiedadId), ubicacion: null }
                : {
                    ...payloadBase,
                    propiedadId: null,
                    ubicacion: {
                        pais: sanitizeText(form.ubicacion?.pais),
                        departamento: sanitizeText(form.ubicacion?.departamento),
                        municipio: sanitizeText(form.ubicacion?.municipio),
                        ciudad: sanitizeText(form.ubicacion?.ciudad),
                        direccion: sanitizeText(form.ubicacion?.direccion),
                        referencia: sanitizeText(form.ubicacion?.referencia),
                        observaciones: sanitizeText(form.ubicacion?.observaciones),
                    },
                };

        try {
            setSaving(true);

            if (isEdit) {
                if (typeof updateBusiness !== "function") {
                    toast.error("Falta update() en negocios.store.js (conexi車n backend).");
                    return;
                }
                await updateBusiness(businessId, payload);
                toast.success("Negocio actualizado.");
                navigate(-1);
                return;
            }

            if (typeof createBusiness !== "function") {
                toast.error("Falta create() en negocios.store.js (conexi車n backend).");
                return;
            }

            const created = await createBusiness(payload);
            toast.success("Negocio creado.");

            const newId = created?.id ?? created?._id ?? created?.mongoId;
            if (newId) navigate(`/corporativo/negocios/${newId}/editar`);
            else navigate(-1);
        } catch (err) {
            console.error("[BusinessFormPage] error guardando", err);
            toast.error(err?.message || "Ocurri車 un error al guardar.");
        } finally {
            setSaving(false);
        }
    };

    /* =========================
       Cat芍logo: prefill EDIT label
    ========================= */
    const selectedCatalogLabel = useMemo(() => {
        const items = Array.isArray(usecatalogo-negociosStore.getState().items) ? usecatalogo-negociosStore.getState().items : [];
        const findLabel = (key) => {
            const hit = items.find((x) => String(normKey(x)) === String(key));
            return hit ? normLabel(hit) : "";
        };

        if (catModal.level === "categoria") return findLabel(form.categoryId);
        if (catModal.level === "subcategoria") return findLabel(form.subcategoryId);
        if (catModal.level === "tipo") return findLabel(form.typeId);
        return "";
    }, [catModal.level, form.categoryId, form.subcategoryId, form.typeId]);

    const openCatalogCreate = (level) => setCatModal({ open: true, level, mode: "create" });
    const openCatalogEdit = (level) => setCatModal({ open: true, level, mode: "edit" });

    const handleCatalogSubmit = async ({ name, mode }) => {
        const label = sanitizeText(name);
        if (!label) return toast.error("Nombre requerido.");

        try {
            const missing =
                (mode === "create" &&
                    ((catModal.level === "categoria" && typeof crearCategoria !== "function") ||
                        (catModal.level === "subcategoria" && typeof crearSubcategoria !== "function") ||
                        (catModal.level === "tipo" && typeof crearTipo !== "function"))) ||
                (mode === "edit" &&
                    ((catModal.level === "categoria" && typeof editarCategoria !== "function") ||
                        (catModal.level === "subcategoria" && typeof editarSubcategoria !== "function") ||
                        (catModal.level === "tipo" && typeof editarTipo !== "function")));

            if (missing) {
                toast.error("A迆n no hay endpoints/acciones POST/PATCH para cat芍logo (solo GET).");
                return;
            }

            if (mode === "create") {
                if (catModal.level === "categoria") {
                    const saved = await crearCategoria({ label });
                    setForm((p) => ({ ...p, categoryId: saved?.key ?? "", subcategoryId: "", typeId: "" }));
                }
                if (catModal.level === "subcategoria") {
                    if (!form.categoryId) return toast.error("Selecciona una categor赤a primero.");
                    const saved = await crearSubcategoria(form.categoryId, { label });
                    setForm((p) => ({ ...p, subcategoryId: saved?.key ?? "", typeId: "" }));
                }
                if (catModal.level === "tipo") {
                    if (!form.subcategoryId) return toast.error("Selecciona una subcategor赤a primero.");
                    const saved = await crearTipo(form.subcategoryId, { label });
                    setForm((p) => ({ ...p, typeId: saved?.key ?? "" }));
                }
                toast.success("Creado correctamente.");
            }

            if (mode === "edit") {
                if (catModal.level === "categoria") {
                    if (!form.categoryId) return toast.error("Selecciona una categor赤a.");
                    await editarCategoria(form.categoryId, { label });
                }
                if (catModal.level === "subcategoria") {
                    if (!form.subcategoryId) return toast.error("Selecciona una subcategor赤a.");
                    await editarSubcategoria(form.subcategoryId, { label });
                }
                if (catModal.level === "tipo") {
                    if (!form.typeId) return toast.error("Selecciona un tipo.");
                    await editarTipo(form.typeId, { label });
                }
                toast.success("Actualizado correctamente.");
            }

            setCatModal({ open: false, level: "", mode: "create" });
            await cargarCatalogo?.({ force: true });
        } catch (e) {
            console.error("[Catalogo] submit error", e);
            toast.error(e?.message || "No se pudo guardar el cat芍logo.");
        }
    };

    const title = isEdit ? "Editar negocio" : "Nuevo negocio";
    const description = "Los negocios se clasifican por cat芍logo (BD).";

    const loadingAny =
        loading ||
        saving ||
        catalogLoading ||
        (!catalogLoaded && !catalogError) ||
        (isEdit && (negociosLoading || unitsLoading));

    return (
        <BaseFormPage
            icon={Store}
            title={title}
            description={description}
            onBack={() => navigate(-1)}
            rightSlot={
                <SecondaryButton type="button" onClick={() => navigate(-1)} disabled={saving}>
                    Volver
                </SecondaryButton>
            }
        >
            {loadingAny ? (
                <div className="neo-plate neo-plate--tinted p-4 md:p-5 rounded-2xl text-xs subtle flex items-center gap-2">
                    <Loader2 className={cx("w-4 h-4 opacity-70", loadingAny ? "animate-spin" : "")} />
                    Cargando??
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="neo-card neo-card--deep neo-card--tinted no-clip w-full rounded-2xl p-4 md:p-6 space-y-6"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* IZQUIERDA */}
                        <div className="space-y-6">
                            <FormSectionCard title="Informaci車n b芍sica" description="Identificaci車n y descripci車n del negocio.">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <Field label="C車digo" hint="Opcional (ej. NEG-04)">
                                        <input
                                            value={form.codigo}
                                            onChange={setField("codigo")}
                                            className={fieldControlClass()}
                                            disabled={saving}
                                            placeholder="Ej. NEG-04"
                                        />
                                    </Field>

                                    <Field label="Estado">
                                        <select
                                            value={form.estadoOperacion}
                                            onChange={setField("estadoOperacion")}
                                            className={cx("neo-select w-full", fieldControlClass())}
                                            disabled={saving}
                                        >
                                            <option value="ACTIVO">ACTIVO</option>
                                            <option value="INACTIVO">INACTIVO</option>
                                        </select>
                                    </Field>

                                    <div className="md:col-span-2">
                                        <Field label="Nombre del negocio" required error={errors.nombre}>
                                            <input
                                                value={form.nombre}
                                                onChange={setField("nombre")}
                                                className={fieldControlClass({ error: !!errors.nombre, ok: canSubmit })}
                                                disabled={saving}
                                                placeholder="Ej. Apartamentos 04"
                                            />
                                        </Field>
                                    </div>

                                    <div className="md:col-span-2">
                                        <Field label="Descripci車n" hint="Opcional">
                                            <textarea
                                                value={form.descripcion}
                                                onChange={setField("descripcion")}
                                                className={cx("neo-textarea", fieldControlClass())}
                                                disabled={saving}
                                                placeholder="Descripci車n breve del negocio, prop車sito, detalles operativos??
                                                rows={5}
                                            />
                                        </Field>
                                    </div>
                                </div>
                            </FormSectionCard>

                            {/* UBICACI車N */}
                            <FormSectionCard
                                title="Ubicaci車n"
                                description="Si el negocio no pertenece a una propiedad, captura la ubicaci車n completa (igual que propiedades)."
                            >
                                <div className="grid gap-4">
                                    <div className="neo-plate neo-plate--soft p-3 rounded-xl">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold inline-flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 opacity-80" />
                                                    ?Pertenece a una propiedad?
                                                </div>
                                                <div className="text-xs subtle">Si eliges ※S赤?? la direcci車n se deriva de la propiedad (solo lectura).</div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <label className="inline-flex items-center gap-2 text-sm select-none">
                                                    <input
                                                        type="radio"
                                                        name="perteneceAPropiedad"
                                                        value="NO"
                                                        checked={form.perteneceAPropiedad === "NO"}
                                                        onChange={() => setForm((p) => ({ ...p, perteneceAPropiedad: "NO" }))}
                                                        disabled={saving}
                                                    />
                                                    No
                                                </label>
                                                <label className="inline-flex items-center gap-2 text-sm select-none">
                                                    <input
                                                        type="radio"
                                                        name="perteneceAPropiedad"
                                                        value="SI"
                                                        checked={form.perteneceAPropiedad === "SI"}
                                                        onChange={() => setForm((p) => ({ ...p, perteneceAPropiedad: "SI" }))}
                                                        disabled={saving}
                                                    />
                                                    S赤
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {form.perteneceAPropiedad === "SI" ? (
                                        <div className="grid gap-3">
                                            <Field label="Propiedad (activa)" required error={errors.propiedadId} hint="Obligatorio si pertenece a propiedad.">
                                                <select
                                                    value={form.propiedadId}
                                                    onChange={setField("propiedadId")}
                                                    className={cx("neo-select w-full", fieldControlClass({ error: !!errors.propiedadId }))}
                                                    disabled={saving || propsOptions.length === 0}
                                                >
                                                    <option value="">{propsOptions.length ? "Seleccione propiedad..." : "No hay propiedades activas"}</option>
                                                    {propsOptions.map((p) => (
                                                        <option key={p.__id} value={p.__id}>
                                                            {getPropLabel(p)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </Field>

                                            <LocationReadonlyCard title="Ubicaci車n (derivada)" data={ubicacionUI} />
                                        </div>
                                    ) : (
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <Field label="Pa赤s" required error={errors["ubicacion.pais"]}>
                                                <input
                                                    value={form.ubicacion.pais}
                                                    onChange={setNestedField("ubicacion.pais")}
                                                    className={fieldControlClass({ error: !!errors["ubicacion.pais"] })}
                                                    disabled={saving}
                                                    placeholder="Ej. El Salvador"
                                                />
                                            </Field>

                                            <Field label="Departamento" required error={errors["ubicacion.departamento"]}>
                                                <input
                                                    value={form.ubicacion.departamento}
                                                    onChange={setNestedField("ubicacion.departamento")}
                                                    className={fieldControlClass({ error: !!errors["ubicacion.departamento"] })}
                                                    disabled={saving}
                                                    placeholder="Ej. La Libertad"
                                                />
                                            </Field>

                                            <Field label="Municipio" required error={errors["ubicacion.municipio"]}>
                                                <input
                                                    value={form.ubicacion.municipio}
                                                    onChange={setNestedField("ubicacion.municipio")}
                                                    className={fieldControlClass({ error: !!errors["ubicacion.municipio"] })}
                                                    disabled={saving}
                                                    placeholder="Ej. Col車n"
                                                />
                                            </Field>

                                            <Field label="Ciudad" required error={errors["ubicacion.ciudad"]}>
                                                <input
                                                    value={form.ubicacion.ciudad}
                                                    onChange={setNestedField("ubicacion.ciudad")}
                                                    className={fieldControlClass({ error: !!errors["ubicacion.ciudad"] })}
                                                    disabled={saving}
                                                    placeholder="Ej. Lourdes"
                                                />
                                            </Field>

                                            <div className="md:col-span-2">
                                                <Field label="Direcci車n" required error={errors["ubicacion.direccion"]}>
                                                    <textarea
                                                        value={form.ubicacion.direccion}
                                                        onChange={setNestedField("ubicacion.direccion")}
                                                        className={cx("neo-textarea", fieldControlClass({ error: !!errors["ubicacion.direccion"] }))}
                                                        disabled={saving}
                                                        placeholder="Ej. Calle Nacional #28, Cant車n El Capul赤n??
                                                        rows={3}
                                                    />
                                                </Field>
                                            </div>

                                            <div className="md:col-span-2">
                                                <Field label="Referencia" hint="Opcional (c車mo llegar / punto de referencia)">
                                                    <input
                                                        value={form.ubicacion.referencia}
                                                        onChange={setNestedField("ubicacion.referencia")}
                                                        className={fieldControlClass()}
                                                        disabled={saving}
                                                        placeholder="Ej. Frente a gasolinera, port車n negro, calle de 8 metros??
                                                    />
                                                </Field>
                                            </div>

                                            <div className="md:col-span-2">
                                                <Field label="Observaciones" hint="Opcional (detalles 迆tiles)">
                                                    <textarea
                                                        value={form.ubicacion.observaciones}
                                                        onChange={setNestedField("ubicacion.observaciones")}
                                                        className={cx("neo-textarea", fieldControlClass())}
                                                        disabled={saving}
                                                        placeholder="Ej. Acceso Oriente y Poniente, no pavimentada, muro perimetral??
                                                        rows={3}
                                                    />
                                                </Field>
                                            </div>

                                            <div className="md:col-span-2">
                                                <LocationReadonlyCard title="Vista previa" data={ubicacionUI} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </FormSectionCard>
                        </div>

                        {/* DERECHA */}
                        <FormSectionCard title="Clasificaci車n" description="Cat芍logo controlado: Categor赤a ??Subcategor赤a ??Tipo.">
                            <ClasificacionCards
                                loading={catalogLoading}
                                error={catalogError}
                                empty={showCatalogEmpty}
                                onReload={() => cargarCatalogo?.({ force: true })}
                                categoryId={form.categoryId}
                                subcategoryId={form.subcategoryId}
                                typeId={form.typeId}
                                categorias={categorias}
                                subcategorias={subcategoryOptions}
                                tipos={typeOptions}
                                errors={{
                                    categoryId: errors.categoryId,
                                    subcategoryId: errors.subcategoryId,
                                    typeId: errors.typeId,
                                }}
                                disabled={saving}
                                onChangeCategory={(id) => setForm((p) => ({ ...p, categoryId: id }))}
                                onChangeSubcategory={(id) => setForm((p) => ({ ...p, subcategoryId: id }))}
                                onChangeType={(id) => setForm((p) => ({ ...p, typeId: id }))}
                                onCreateCategory={() => openCatalogCreate("categoria")}
                                onEditCategory={() => openCatalogEdit("categoria")}
                                onCreateSubcategory={() => openCatalogCreate("subcategoria")}
                                onEditSubcategory={() => openCatalogEdit("subcategoria")}
                                onCreateType={() => openCatalogCreate("tipo")}
                                onEditType={() => openCatalogEdit("tipo")}
                            />

                            {/* Hint enterprise: si el error es tenant */}
                            {catalogErrorCode === "TENANT_REQUIRED" ? (
                                <div className="mt-3 text-xs subtle">
                                    Tip: falta <b>x-tenant-id</b> en la request. Selecciona un tenant (login) y presiona ※Recargar cat芍logo??
                                </div>
                            ) : null}
                        </FormSectionCard>
                    </div>

                    <FormFooter
                        onCancel={() => navigate(-1)}
                        isSubmitting={saving}
                        canSubmit={canSubmit}
                        submitLabel={isEdit ? "Guardar cambios" : "Crear negocio"}
                        submitIcon={isEdit ? "save" : "plus"}
                        leftHint={
                            !canSubmit
                                ? form.perteneceAPropiedad === "SI"
                                    ? "Completa: Nombre, Clasificaci車n y Propiedad."
                                    : "Completa: Nombre, Clasificaci車n y Ubicaci車n (Pa赤s/Depto/Municipio/Ciudad/Direcci車n)."
                                : ""
                        }
                    />

                    <CatalogManageModal
                        open={catModal.open}
                        title={catModal.mode === "edit" ? `Editar ${catModal.level}` : `Agregar ${catModal.level}`}
                        subtitle="Crear/Editar requiere endpoints POST/PATCH (hoy backend solo tiene GET)."
                        mode={catModal.mode}
                        initialName={catModal.mode === "edit" ? selectedCatalogLabel : ""}
                        disabled={saving}
                        onClose={() => setCatModal({ open: false, level: "", mode: "create" })}
                        onSubmit={handleCatalogSubmit}
                    />
                </form>
            )}
        </BaseFormPage>
    );
}



