// client/src/features/corporativo/Propiedades/Detalles/DetallesLayout.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext.jsx";
import {
  Building2,
  CircleDollarSign,
  Layers,
  MapPin,
  Pencil,
  Store,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { usePropertiesStore } from "@/features/corporativo/propiedades/store/properties.store.js";

import IngresosProp from "./DetallesIngresosProp.jsx";
import NegociosProp from "./DetallesNegociosProp.jsx";
import UnidadesProp from "./DetallesUnidadesProp.jsx";
import ProyectosProp from "./DetallesProyectosProp.jsx";

import QueryTabs from "@/shared/components/ui/navigation/QueryTabs.jsx";
import MediaManager from "@/shared/components/ui/modals/MediaManagerModal.jsx";
import { mediaUrl } from "@/core/utils/media.js";
import http from "@/core/http/HttpClient.js";

import { getCountryCodeFromUbicacion, flagEmojiFromCode, flagLocalFromCode } from "@lib/countryFlags.js";

import { flagCdnFromCode } from "@lib/countryFlags.js";

const cx = (...c) => c.filter(Boolean).join(" ");

/** Sanitiza texto para UI */
function cleanUiText(v) {
  if (v == null) return "";
  return String(v)
    .replace(/\uFEFF/g, "")
    .replace(/[\u200B-\u200D\u2060]/g, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .replace(/\uFFFD/g, "")
    .trim();
}

function cleanUrl(v) {
  const s = cleanUiText(v);
  return s || "";
}

/**
 * Normaliza ??bandera??:
 * - url absoluta (https://...)
 * - /uploads/.. o uploads/..
 * - /api/uploads/..
 */
function resolveFlagSrc(v) {
  const s0 = cleanUrl(v);
  if (!s0) return "";

  let s = s0;

  if (/^uploads\//i.test(s)) s = `/${s}`;
  if (/^api\/uploads\//i.test(s)) s = `/${s}`;

  if (/^https?:\/\//i.test(s)) return s;

  if (s.startsWith("/api/uploads/")) return s;
  if (s.startsWith("/uploads/")) return s;

  return s;
}


const money = (n) =>
  new Intl.NumberFormat("es-US", { style: "currency", currency: "USD" }).format(Number(n || 0));

const fmt = (v) => (v === 0 ? "0" : v ?? "??");

const MESES_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const dateHuman = (v) => {
  if (!v) return "??";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "??";
  return `${d.getDate()} ${MESES_ES[d.getMonth()]} ${d.getFullYear()}`;
};

const ageDetail = (v) => {
  if (!v) return "??";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "??";

  const hoy = new Date();
  let y = hoy.getFullYear() - d.getFullYear();
  let m = hoy.getMonth() - d.getMonth();

  if (hoy.getDate() < d.getDate()) m -= 1;
  if (m < 0) {
    y -= 1;
    m += 12;
  }

  if (y <= 0 && m <= 0) return "<1 mes";
  if (y <= 0) return `${m} ${m === 1 ? "mes" : "meses"}`;

  return `Antig??edad: ${y} ${y === 1 ? "año" : "años"}${m > 0 ? ` ${m} ${m === 1 ? "mes" : "meses"}` : ""
    }`;
};

const TONES = {
  ok: { base: "hsl(142 70% 45%)" },
  warn: { base: "hsl(43 90% 55%)" },
  info: { base: "hsl(215 75% 55%)" },
};

function StatusPill({ estado = "" }) {
  const e = String(estado).toLowerCase();
  const tone = e.includes("act") ? TONES.ok : e.includes("ina") ? TONES.warn : TONES.info;

  return (
    <span
      className="px-2 py-[2px] rounded-full text-[11px] font-semibold ring-1 leading-none"
      style={{
        color: tone.base,
        background: `color-mix(in srgb, ${tone.base} 12%, transparent)`,
        borderColor: `color-mix(in srgb, ${tone.base} 28%, transparent)`,
      }}
    >
      {estado || "??"}
    </span>
  );
}

function KpiBar({ value = 0, max = 1 }) {
  const pct = Math.max(0, Math.min(100, max ? (value / max) * 100 : 0));
  return (
    <div
      className="h-1.5 rounded-full bg-[var(--chip)]/70 overflow-hidden ring-1 ring-border"
      role="img"
      aria-label={`Progreso ${Math.round(pct)}%`}
    >
      <div
        className="h-full"
        style={{
          width: `${pct}%`,
          background:
            "linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 65%, transparent))",
        }}
      />
    </div>
  );
}

function KpiItem({ icon, title, value, barMax }) {
  const num = Number(String(value).replace(/[^0-9.-]/g, "")) || 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs subtle flex items-center gap-1.5 leading-5">
          {React.cloneElement(icon, { size: 14, className: "translate-y-[1px]" })} {title}
        </span>
        <span className="text-sm font-semibold leading-5">{value}</span>
      </div>
      <KpiBar value={num} max={barMax} />
    </div>
  );
}

function getApiId(p) {
  const v = p?.mongoId ?? p?._id ?? null;
  return v ? String(v).trim() : "";
}

function getBusinessId(p) {
  const v = p?.id ?? p?.codigo ?? null;
  return v ? String(v).trim() : "";
}

/* ================== BANDERA: IMG -> EMOJI FALLBACK ================== */
function FlagBadge({ ubicacion, className = "" }) {
  const [imgFailed, setImgFailed] = useState(false);

  const cc = getCountryCodeFromUbicacion(ubicacion);
  const emoji = flagEmojiFromCode(cc);

  const paisRaw = ubicacion?.pais;
  const pais =
    typeof paisRaw === "string"
      ? cleanUiText(paisRaw)
      : cleanUiText(paisRaw?.nombre ?? paisRaw?.name ?? "");

  const title = pais || cc || "Pa??s";
  const flagSrc = resolveFlagSrc(ubicacion?.bandera) || flagLocalFromCode(cc);


  useEffect(() => {
    setImgFailed(false);
  }, [flagSrc, cc]);

  if (flagSrc && !imgFailed) {
    return (
      <img
        src={flagSrc}
        alt=""
        className={cx("h-4 w-6 rounded-sm ring-1 ring-border object-cover", className)}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        title={title}
        aria-label={title}
      />
    );
  }

  if (emoji) {
    return (
      <span
        className={cx("inline-flex items-center justify-center h-4 w-6 text-[14px] leading-none", className)}
        title={title}
        aria-label={title}
      >
        {emoji}
      </span>
    );
  }

  return (
    <span
      className={cx(
        "inline-flex items-center justify-center h-4 w-6 text-[11px] font-semibold rounded-sm ring-1 ring-border bg-[var(--chip)]/50",
        className
      )}
      title={title}
      aria-label={title}
    >
      {(cc || "??").toUpperCase()}
    </span>
  );
}

/* ================== TARJETA INLINE ================== */
function PropCard({ p, selected, onClick }) {
  const navigate = useNavigate();

  const nombre = cleanUiText(p?.nombre) || `Propiedad ${getBusinessId(p) || ""}`;
  const estado = p?.estado ?? "??";
  const pais = cleanUiText(p?.ubicacion?.pais) || "??";
  const fechaCompra = p?.historia?.fechaCompra;

  const precioCompra = p?.precioCompra ?? p?.historia?.precioCompra ?? 0;
  const valorActual = p?.valores?.valorActual ?? p?.valorActual ?? 0;
  const costoActual = p?.valores?.costoTotalActual ?? 0;

  const ingresoMensual = p?.kpis?.ingresoMensual ?? 0;
  const ingresoAcum = p?.kpis?.ingresoAcumulado ?? 0;

  const negociosCount = p?.kpis?.negocios ?? (Array.isArray(p?.negocios) ? p.negocios.length : 0);

  const moneyMax = Math.max(
    Number(precioCompra || 0),
    Number(valorActual || 0),
    Number(costoActual || 0),
    Number(ingresoAcum || 0),
    1
  );

  const apiId = getApiId(p);
  const idLabel = getBusinessId(p) || "??";

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-selected={selected}
      className={cx(
        "neo-card neo-card--deep neo-card--tinted no-clip p-3 md:p-4 rounded-xl w-full h-full flex flex-col text-left",
        "relative isolate ring-1 ring-border transition-all duration-200 will-change-transform",
        "before:absolute before:inset-y-2 before:left-1.5 before:w-1 before:rounded-full before:opacity-0 before:transition",
        selected
          ? "z-10 ring-2 ring-[var(--accent)] shadow-[0_18px_48px_rgba(0,0,0,.28)] scale-[1.01] bg-[linear-gradient(180deg,rgba(255,255,255,.08),transparent)] before:bg-[var(--accent)] before:opacity-100"
          : "hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(0,0,0,.22)] hover:ring-2 hover:ring-[var(--accent)] before:bg-transparent",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      )}
      title={`Ver ${nombre}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Building2
            size={18}
            className="shrink-0 text-[color-mix(in_srgb,var(--accent)_70%,#000_30%)] opacity-90"
          />
          <h3 className="truncate font-semibold leading-tight text-base">{nombre}</h3>

          <span className="hidden sm:block">
            <FlagBadge ubicacion={p?.ubicacion} />
          </span>

          <StatusPill estado={estado} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className="px-2 py-0.5 text-[11px] font-semibold rounded-md ring-1 ring-border"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            ID {idLabel}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!apiId) return;
              navigate(`/corporativo/propiedades/${encodeURIComponent(apiId)}/editar`);
            }}
            className="group flex items-center justify-center h-8 w-8 rounded-lg ring-1 transition-all active:scale-95"
            style={{
              background: `color-mix(in srgb, var(--accent) 15%, transparent)`,
              borderColor: `color-mix(in srgb, var(--accent) 40%, transparent)`,
              color: `var(--accent)`,
            }}
            title="Editar propiedad"
            aria-label="Editar propiedad"
          >
            <Pencil size={16} className="transition-transform group-hover:rotate-12" />
          </button>
        </div>
      </div>

      <div className="min-w-0">
        <div className="subtle truncate text-xs" style={{ fontVariantNumeric: "tabular-nums" }}>
          {pais} ?? Antig??edad: {ageDetail(fechaCompra).replace(/^Antig??edad:\s*/, "")}
        </div>
      </div>

      {p?.descripcionActual && (
        <div className="mt-2">
          <div
            className="text-xs subtle overflow-y-auto pr-1"
            style={{ maxHeight: "2.5em" }}
            title={p.descripcionActual}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {p.descripcionActual}
          </div>
        </div>
      )}

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <KpiItem icon={<CircleDollarSign />} title="Precio de compra" value={money(precioCompra)} barMax={moneyMax} />
        <KpiItem icon={<TrendingUp />} title="Valor actual" value={money(valorActual)} barMax={moneyMax} />
        <KpiItem icon={<Layers />} title="Costo total" value={money(costoActual)} barMax={moneyMax} />
        <KpiItem icon={<Wallet />} title="Ingreso acumulado" value={money(ingresoAcum)} barMax={moneyMax} />
        <KpiItem icon={<Wallet />} title="Ingreso mensual" value={money(ingresoMensual)} barMax={moneyMax} />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs subtle flex items-center gap-1.5 leading-5">
              <Store size={14} className="translate-y-[1px]" /> Negocios
            </span>
            <span className="text-sm font-semibold leading-5">{negociosCount}</span>
          </div>
          <KpiBar value={Number(negociosCount || 0)} max={Math.max(negociosCount || 0, 5)} />
        </div>
      </div>
    </div>
  );
}

function TarjetasPropiedadInline() {
  const { propiedades, cargar, selectedPropId, select } = usePropertiesStore((s) => ({
    propiedades: s.propiedades,
    cargar: s.cargar,
    selectedPropId: s.selectedPropId,
    select: s.select,
  }));

  const { theme } = useTheme();

  useEffect(() => {
    if (!Array.isArray(propiedades) || propiedades.length === 0) {
      cargar?.();
    }
  }, [propiedades, cargar]);

  const list = useMemo(() => {
    if (!Array.isArray(propiedades)) return [];
    const allSorted = [...propiedades].sort((a, b) =>
      String(getBusinessId(a) || "").localeCompare(String(getBusinessId(b) || ""), undefined, {
        numeric: true,
        sensitivity: "base",
      })
    );
    const act = allSorted.filter((p) => String(p?.estado || "").toLowerCase().includes("act"));
    return act.length > 0 ? act : allSorted;
  }, [propiedades]);

  return (
    <div className="neo-card neo-card--deep neo-card--tinted no-clip p-4 rounded-2xl relative" data-theme={theme}>
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))] gap-3 md:gap-4 items-stretch content-start">
        {list.map((p) => {
          const pid = getApiId(p);
          const selected = String(selectedPropId ?? "") === String(pid ?? "");
          return (
            <PropCard
              key={pid || getBusinessId(p) || Math.random()}
              p={p}
              selected={selected}
              onClick={() => select(pid)}
            />
          );
        })}
        {list.length === 0 && <div className="text-sm subtle p-3">A??n no hay propiedades para mostrar.</div>}
      </div>
    </div>
  );
}

/* ====== Secciones de detalle ====== */
function Section({ title, children }) {
  return (
    <div className="rounded-xl ring-1 ring-border bg-[var(--panel)]/40 p-3">
      <h3 className="text-sm font-semibold tracking-wide mb-2">{title}</h3>
      {children}
    </div>
  );
}

function LStatRow({ label, value }) {
  return (
    <div className="grid grid-cols-[160px,1fr] items-start gap-3 py-1.5 border-b border-border/60 last:border-b-0">
      <span className="text-sm subtle">{label}</span>
      <span className="text-sm font-medium whitespace-pre-wrap break-words">{fmt(value)}</span>
    </div>
  );
}

const TABS = {
  datos: "datos",
  negocios: "negocios",
  unidades: "unidades",
  ingresos: "ingresos",
  proyectos: "proyectos",
};

export default function DetallesLayout({ propiedad }) {
  const { theme } = useTheme();

  const { cargar, selectedPropId, select } = usePropertiesStore((s) => ({
    cargar: s.cargar,
    selectedPropId: s.selectedPropId,
    select: s.select,
  }));

  const propFromStore = usePropertiesStore((s) => {
    const list = Array.isArray(s.propiedades) ? s.propiedades : [];
    const sid = String(s.selectedPropId ?? "");
    return list.find((p) => String(getApiId(p)) === sid) || null;
  });

  const [detail, setDetail] = useState(null);
  const propBase = propiedad ?? propFromStore;

  useEffect(() => {
    (async () => {
      if (!propBase) {
        await cargar?.();
        const st = usePropertiesStore.getState?.();
        const arr = Array.isArray(st?.propiedades) ? st.propiedades : [];
        if (arr.length > 0 && !selectedPropId) {
          const first = arr[0];
          const pid = getApiId(first);
          if (pid) select(String(pid));
        }
      }
    })();
  }, [propBase, cargar, selectedPropId, select]);

  const apiId = useMemo(() => {
    if (selectedPropId) return String(selectedPropId).trim();
    return String(getApiId(propFromStore ?? propBase) || "").trim();
  }, [selectedPropId, propFromStore, propBase]);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!apiId) return;

      try {
        const resp = await http.get(`/properties/${encodeURIComponent(apiId)}/detail`);
        const payload = resp?.data || {};
        const property = payload?.property ?? null;
        const kpis = payload?.kpis ?? null;

        if (!alive) return;

        if (!property) {
          setDetail(null);
          return;
        }

        const base = propBase && typeof propBase === "object" ? propBase : {};
        const baseUbicacion = base?.ubicacion && typeof base.ubicacion === "object" ? base.ubicacion : {};
        const apiUbicacion = property?.ubicacion && typeof property.ubicacion === "object" ? property.ubicacion : {};

        const merged = {
          ...base,
          ...property,
          ubicacion: {
            ...baseUbicacion,
            ...apiUbicacion,
            bandera: apiUbicacion?.bandera ?? baseUbicacion?.bandera ?? undefined,
          },
          kpis: {
            ...(base?.kpis || {}),
            ...(property?.kpis || {}),
            ...(kpis || {}),
          },
        };

        setDetail(merged);
      } catch {
        if (!alive) return;
        setDetail(null);
      }
    })();

    return () => {
      alive = false;
    };
  }, [apiId, propBase]);

  const prop = detail ?? propBase;

  const {
    id,
    nombre,
    estado,
    notas,
    ubicacion = {},
    historia = {},
    valores = {},
    dimensiones = {},
    media = [],
    metadatos,
    creadoPor,
    fechaCreacion,
    actualizadoPor,
    fechaActualizacion,
    kpis = {},
  } = prop || {};

  const meta = useMemo(
    () => ({
      creadoPor: metadatos?.creadoPor ?? creadoPor,
      fechaCreacion: metadatos?.fechaCreacion ?? fechaCreacion,
      actualizadoPor: metadatos?.actualizadoPor ?? actualizadoPor,
      fechaActualizacion: metadatos?.fechaActualizacion ?? fechaActualizacion,
    }),
    [metadatos, creadoPor, fechaCreacion, actualizadoPor, fechaActualizacion]
  );

  const precioCompraResolved = Number(historia?.precioCompra || 0);
  const valorActualResolved = Number(valores?.valorActual || 0);
  const costoTotalResolved = Number(valores?.costoTotalActual || 0);

  const [params] = useSearchParams();
  const sub = (params.get("sub") || TABS.datos).toLowerCase();

  const propiedadId = useMemo(() => String(getApiId(prop) || ""), [prop]);

  const subItems = [
    { key: TABS.datos, label: "Datos", disabled: false },
    { key: TABS.negocios, label: "Negocios", disabled: !propiedadId },
    { key: TABS.unidades, label: "Unidades", disabled: !propiedadId },
    { key: TABS.ingresos, label: "Ingresos", disabled: !propiedadId },
    { key: TABS.proyectos, label: "Proyectos", disabled: !propiedadId },
  ];

  const mediaItems = useMemo(
    () => (Array.isArray(media) ? media.map((m) => ({ ...m, kind: m.kind || m.tipo })) : []),
    [media]
  );

  const [previewIdx, setPreviewIdx] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showMediaMgr, setShowMediaMgr] = useState(false);

  const handleMediaSaved = async () => {
    await cargar?.({ force: true });
  };

  const dragInfo = useRef({ from: -1 });

  async function apiReorder(orderIds = []) {
    if (!propiedadId) return;
    await http.put(`/properties/${encodeURIComponent(propiedadId)}/media/reorder`, { order: orderIds });
  }

  function onDragStart(i) {
    dragInfo.current.from = i;
  }

  async function onDrop(i) {
    const from = dragInfo.current.from;
    dragInfo.current.from = -1;
    if (from === -1 || from === i || !Array.isArray(mediaItems)) return;

    const ids = mediaItems.map((m) => m._id || m.id || m.url);
    const [moved] = ids.splice(from, 1);
    ids.splice(i, 0, moved);

    await apiReorder(ids);
    await cargar?.({ force: true });

    setPreviewIdx(Math.max(0, Math.min(i, mediaItems.length - 1)));
  }

  async function moveMedia(index, dir) {
    if (!Array.isArray(mediaItems) || mediaItems.length < 2) return;
    const j = index + dir;
    if (j < 0 || j >= mediaItems.length) return;

    const ids = mediaItems.map((m) => m._id || m.id || m.url);
    [ids[index], ids[j]] = [ids[j], ids[index]];

    await apiReorder(ids);
    await cargar?.({ force: true });
    setPreviewIdx(j);
  }

  async function deleteMedia(m) {
    const mediaId = m?._id || m?.id;
    if (!propiedadId || !mediaId) return;
    // eslint-disable-next-line no-alert
    if (!confirm("?Eliminar este elemento de multimedia?")) return;

    await http.delete(`/properties/${encodeURIComponent(propiedadId)}/media/${encodeURIComponent(mediaId)}`);
    await cargar?.({ force: true });
    setPreviewIdx(0);
  }

  const headerTitle = useMemo(() => {
    const n = cleanUiText(nombre);
    if (n) return n;
    return `Propiedad ${getBusinessId(prop) || propiedadId || "??"}`;
  }, [nombre, prop, propiedadId]);

  return (
    <div className="space-y-4" data-theme={theme}>
      <TarjetasPropiedadInline />

      <div className="neo-card neo-card--tinted p-2 rounded-xl">
        <nav className="flex items-center justify-between gap-2" role="tablist" aria-label="Secciones de la propiedad">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 mr-1">
              <FlagBadge ubicacion={ubicacion} />

              <span className="font-semibold text-sm md:text-base truncate">{headerTitle}</span>
              {estado && <StatusPill estado={estado} />}
            </div>

            <QueryTabs
              items={subItems}
              param="sub"
              defaultKey={TABS.datos}
              ariaLabel="Subsecciones de detalle de la propiedad"
              appearance="tabline"
              level="l2"
              className="tabbar shrink-0 overflow-visible pb-1"
            />
          </div>

          <div className="shrink-0" />
        </nav>
      </div>

      {sub === TABS.datos && (
        <section className="neo-card neo-card--deep neo-card--tinted no-clip p-4 rounded-2xl">
          <div className="mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold tracking-wide">Detalle de la propiedad</h3>
              {Array.isArray(mediaItems) && <span className="subtle text-xs">({mediaItems.length})</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-4">
            <aside className="space-y-2 md:max-h-[70vh] overflow-auto pr-1 md:sticky md:top-3 rounded-lg p-2 bg-[color-mix(in_srgb,var(--accent) 6%, transparent)]/30">
              {mediaItems.length === 0 ? (
                <div className="text-sm subtle flex items-center gap-2">
                  <MapPin size={16} className="opacity-60" />
                  Sin fotos / videos
                </div>
              ) : (
                mediaItems.map((m, i) => (
                  <div
                    key={m._id || m.id || m.url || i}
                    className="relative group rounded-lg overflow-hidden ring-1 ring-border select-none"
                    draggable
                    onDragStart={() => onDragStart(i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDrop(i)}
                    aria-grabbed={dragInfo.current.from === i}
                    title="Arrastra para reordenar o clic para ampliar"
                  >
                    <button
                      onClick={() => {
                        setPreviewIdx(i);
                        setShowLightbox(true);
                      }}
                      className="block w-full"
                    >
                      {m.kind === "video" ? (
                        <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
                          <div className="absolute inset-0 grid place-items-center text-xs">?? Video</div>
                        </div>
                      ) : (
                        <img
                          src={mediaUrl(m.url)}
                          alt=""
                          className="w-full h-full object-cover"
                          style={{ aspectRatio: "16 / 9" }}
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </button>

                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveMedia(i, -1);
                        }}
                        className="h-7 w-7 rounded-md bg-black/60 text-white text-xs ring-1 ring-white/30 hover:bg-black/70"
                        title="Subir"
                        aria-label="Subir"
                      >
                        ??
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveMedia(i, +1);
                        }}
                        className="h-7 w-7 rounded-md bg-black/60 text-white text-xs ring-1 ring-white/30 hover:bg-black/70"
                        title="Bajar"
                        aria-label="Bajar"
                      >
                        ??
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMedia(m);
                        }}
                        className="h-7 w-7 rounded-md bg-red-600/80 text-white text-xs ring-1 ring-white/30 hover:bg-red-600"
                        title="Eliminar"
                        aria-label="Eliminar"
                      >
                        ?
                      </button>
                    </div>
                  </div>
                ))
              )}
            </aside>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Section title="Compra y valor">
                  <LStatRow label="Fecha de compra" value={dateHuman(historia?.fechaCompra)} />
                  <LStatRow label="Precio de compra" value={money(precioCompraResolved)} />
                  <LStatRow label="Valor actual" value={money(valorActualResolved)} />
                  <LStatRow label="Costo total actual" value={money(costoTotalResolved)} />
                </Section>

                <Section title="Ubicaci??n">
                  <LStatRow label="Pa??s" value={ubicacion?.pais} />
                  <LStatRow label="Departamento" value={ubicacion?.departamento} />
                  <LStatRow label="Municipio" value={ubicacion?.municipio} />
                  <LStatRow label="Ciudad" value={ubicacion?.ciudad} />
                  <LStatRow label="Direcci??n" value={ubicacion?.direccion} />
                  <LStatRow label="Acceso" value={dimensiones?.acceso} />
                </Section>

                <Section title="Administraci??n">
                  <LStatRow label="C??digo" value={getBusinessId(prop) || id || "??"} />
                  <LStatRow label="Nombre" value={prop?.nombre ?? "??"} />
                  <LStatRow label="Estado" value={prop?.estado ?? "??"} />
                  <LStatRow label="Descripci??n actual" value={prop?.descripcionActual || "??"} />
                  <LStatRow label="Notas" value={notas || "??"} />
                </Section>
              </div>

              <div className="space-y-4">
                <Section title="Relaci??n operativa">
                  <div className="text-xs subtle mb-1">*Valores calculados desde asignaciones, unidades e ingresos.</div>
                  <LStatRow label="Negocios asociados" value={kpis?.negocios ?? "??"} />
                  <LStatRow label="Unidades activas" value={kpis?.unidadesActivas ?? "??"} />
                  <LStatRow label="Ingreso mensual" value={money(kpis?.ingresoMensual || 0)} />
                  <LStatRow label="Ingreso acumulado" value={money(kpis?.ingresoAcumulado ?? 0)} />
                </Section>

                <Section title="Dimensiones">
                  <LStatRow label="Medidas declaradas" value={dimensiones?.medidasDeclaradas} />
                  <LStatRow label="??rea (m2)" value={dimensiones?.areaM2} />
                  <LStatRow label="??rea (v2)" value={dimensiones?.areaV2} />
                  <LStatRow label="Norte" value={dimensiones?.norte} />
                  <LStatRow label="Sur" value={dimensiones?.sur} />
                  <LStatRow label="Este/Oriente" value={dimensiones?.este} />
                  <LStatRow label="Oeste/Poniente" value={dimensiones?.oeste} />
                </Section>

                <Section title="Metadatos">
                  <LStatRow label="Creado por" value={meta?.creadoPor} />
                  <LStatRow label="Fecha de creaci??n" value={dateHuman(meta?.fechaCreacion)} />
                  <LStatRow label="Actualizado por" value={meta?.actualizadoPor} />
                  <LStatRow label="Fecha de actualizaci??n" value={dateHuman(meta?.fechaActualizacion)} />
                </Section>
              </div>
            </div>
          </div>

          {showMediaMgr && (
            <MediaManager
              open={showMediaMgr}
              onClose={() => setShowMediaMgr(false)}
              theme={theme}
              propiedadId={propiedadId}
              initialItems={mediaItems}
              onSaved={handleMediaSaved}
              endpointBase="/properties"
            />
          )}

          {showLightbox && mediaItems.length > 0 && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center" role="dialog" aria-modal="true">
              <button className="absolute inset-0 cursor-zoom-out" aria-hidden="true" onClick={() => setShowLightbox(false)} />
              <div className="relative z-[105] w-full max-w-[min(92vw,1200px)] max-h-[85vh] px-4">
                {mediaItems[previewIdx]?.kind === "video" ? (
                  <video src={mediaUrl(mediaItems[previewIdx].url)} className="w-full max-h-[85vh] object-contain rounded-lg" controls autoPlay />
                ) : (
                  <img src={mediaUrl(mediaItems[previewIdx].url)} className="w-full max-h-[85vh] object-contain rounded-lg select-none" alt="" />
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {sub === TABS.negocios && propiedadId && <NegociosProp propiedadId={propiedadId} />}
      {sub === TABS.unidades && propiedadId && <UnidadesProp propiedadId={propiedadId} />}
      {sub === TABS.proyectos && propiedadId && <ProyectosProp propiedadId={propiedadId} />}
      {sub === TABS.ingresos && propiedadId && <IngresosProp propiedadId={propiedadId} />}
    </div>
  );
}




