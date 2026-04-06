// client/src/core/utils/timefmt.js

/**
 * Formatea una duración transcurrida desde un timestamp en milisegundos.
 * Ejemplos:
 * - 45s
 * - 12m 8s
 * - 3h 14m
 *
 * @param {number|string|Date} startMs
 * @returns {string}
 */
export function formatDurationSince(startMs) {
  const normalized = normalizeDateLikeToMs(startMs);
  if (!Number.isFinite(normalized)) return "-";

  const diff = Date.now() - normalized;
  if (Number.isNaN(diff) || diff < 0) return "-";

  return formatDurationMs(diff);
}

/**
* Formatea el tiempo restante hasta un timestamp en milisegundos.
* Ejemplos:
* - 45s
* - 12m 8s
* - 3h 14m
*
* @param {number|string|Date} endMs
* @returns {string}
*/
export function formatTimeLeft(endMs) {
  const normalized = normalizeDateLikeToMs(endMs);
  if (!Number.isFinite(normalized)) return "-";

  const diff = normalized - Date.now();
  if (Number.isNaN(diff) || diff <= 0) return "0s";

  return formatDurationMs(diff);
}

/**
* Formatea fecha como: 31/Ene/2026
*
* @param {number|string|Date} input
* @returns {string}
*/
export function formatDateShortES(input = new Date()) {
  const date = normalizeToDate(input);
  if (!date) return "--/---/----";

  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
* Formatea fecha larga en español.
* Ejemplo: 31 de enero de 2026
*
* @param {number|string|Date} input
* @returns {string}
*/
export function formatDateLongES(input = new Date()) {
  const date = normalizeToDate(input);
  if (!date) return "Fecha inválida";

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
* Formatea hora de 12 horas.
* Ejemplo: 8:05 AM
*
* @param {number|string|Date} input
* @returns {string}
*/
export function formatHour12(input = new Date()) {
  const date = normalizeToDate(input);
  if (!date) return "--:--";

  return new Intl.DateTimeFormat("es-ES", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

/**
* Formatea hora de 24 horas.
* Ejemplo: 08:05
*
* @param {number|string|Date} input
* @returns {string}
*/
export function formatHour24(input = new Date()) {
  const date = normalizeToDate(input);
  if (!date) return "--:--";

  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
* Formatea monto en USD.
* Ejemplo: $1,250.50
*
* @param {number|string} value
* @returns {string}
*/
export function formatCurrencyUSD(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
* Formatea número con separadores.
* Ejemplo: 12,345
*
* @param {number|string} value
* @returns {string}
*/
export function formatNumber(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "0";

  return new Intl.NumberFormat("es-ES").format(amount);
}

/* -------------------------------------------------------------------------- */
/* Helpers internos                                                            */
/* -------------------------------------------------------------------------- */

function normalizeToDate(input) {
  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : input;
  }

  if (typeof input === "number" || typeof input === "string") {
    const date = new Date(input);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

function normalizeDateLikeToMs(input) {
  if (input instanceof Date) {
    const time = input.getTime();
    return Number.isNaN(time) ? NaN : time;
  }

  const numeric = Number(input);
  if (Number.isFinite(numeric)) {
    return numeric;
  }

  const parsed = new Date(input).getTime();
  return Number.isNaN(parsed) ? NaN : parsed;
}

function formatDurationMs(diffMs) {
  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hrs = Math.floor(min / 60);

  if (hrs > 0) return `${hrs}h ${min % 60}m`;
  if (min > 0) return `${min}m ${sec % 60}s`;
  return `${sec}s`;
}
