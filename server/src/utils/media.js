// client/src/utils/media.js
// =============================================================
// Normaliza URLs de media para que el browser pueda cargarlas.
// Soporta: http(s), blob:, data:, y rutas relativas a /uploads.
// =============================================================

const ABS_RE = /^(https?:|blob:|data:)/i;

export function mediaSrc(u = "") {
  if (!u) return "";

  // URLs absolutas o fuentes especiales
  if (ABS_RE.test(u)) return u;

  // Ya viene listo como ruta pública
  if (u.startsWith("/uploads/")) return u;

  // "uploads/xxx.jpg" -> "/uploads/xxx.jpg"
  if (u.startsWith("uploads/")) return `/${u}`;

  // "xxx.jpg" o "/xxx.jpg" -> "/uploads/xxx.jpg"
  const clean = String(u).replace(/^\/+/, "").replace(/^uploads\/+/, "");
  return `/uploads/${clean}`;
}

export default mediaSrc;
