// client/src/core/utils/authSession.js
/**
 * Sesi車n local (enterprise)
 * - Mantiene compatibilidad con keys legacy
 * - Soporta token, accessToken y refreshToken
 * - Normaliza expiresAt a number(ms) | null
 * - Sincroniza tenantId (multi-tenant) con localStorage: jcf_last_tenant_id
 */

const STORAGE_KEY = "jcf_auth_v1";

// Keys legacy por migraci車n
const LEGACY_KEYS = ["ijcf_auth_v1", "auth_session", "jcf_auth_v1"];

// Tenant selection
const LAST_TENANT_KEY = "jcf_last_tenant_id";
const LEGACY_LAST_TENANT_KEYS = ["ijcf_last_tenant_id"];

/**
 * Lee JSON seguro desde localStorage.
 * @param {string} key
 * @returns {any|null}
 */
function readJson(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function safeStr(v) {
  return String(v ?? "").trim();
}

/**
 * Lee el 迆ltimo tenant guardado.
 * @returns {string|null}
 */
export function getLastTenantId() {
  try {
    const v = safeStr(window.localStorage.getItem(LAST_TENANT_KEY));
    if (v) return v;

    for (const k of LEGACY_LAST_TENANT_KEYS) {
      const legacy = safeStr(window.localStorage.getItem(k));
      if (legacy) return legacy;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Guarda el 迆ltimo tenant.
 * @param {string} tenantId
 */
export function setLastTenantId(tenantId) {
  try {
    const v = safeStr(tenantId);
    if (!v) return;
    window.localStorage.setItem(LAST_TENANT_KEY, v);
  } catch {
    // no-op
  }
}

/**
 * Resuelve la ruta home seg迆n usuario autenticado.
 * @param {object|null} user
 * @returns {string}
 */
export function resolveHomePath(user) {
  if (!user || typeof user !== "object") return "/corporativo";

  const directHome =
    safeStr(user?.homePath) ||
    safeStr(user?.home_path) ||
    safeStr(user?.redirectTo) ||
    safeStr(user?.redirect_to);

  if (directHome) {
    return directHome.startsWith("/") ? directHome : `/${directHome}`;
  }

  const roles = Array.isArray(user?.roles) ? user.roles : [];
  const roleSlugs = roles
    .map((r) => safeStr(r?.slug).toLowerCase())
    .filter(Boolean);

  const singleRoleSlug = safeStr(user?.roleSlug).toLowerCase();
  if (singleRoleSlug) roleSlugs.unshift(singleRoleSlug);

  const corporateRoles = new Set([
    "owner",
    "legal_representative",
    "corporate_manager",
    "admin",
    "super_admin",
    "corporativo",
  ]);

  const restaurantRoles = new Set([
    "restaurante",
    "restaurant",
    "mesero",
    "cajero",
    "cocinero",
    "supervisor_restaurante",
    "gerente_restaurante",
  ]);

  if (roleSlugs.some((slug) => corporateRoles.has(slug))) {
    return "/corporativo";
  }

  if (roleSlugs.some((slug) => restaurantRoles.has(slug))) {
    return "/restaurante";
  }

  return "/corporativo";
}

/**
 * Extrae tenantId desde varias formas del payload.
 * @param {any} session
 * @returns {string}
 */
function resolveTenantIdFromSession(session) {
  if (!session) return "";

  const direct =
    session?.tenantId ||
    session?.tenant_id ||
    session?.tenant?.id ||
    session?.tenant?._id ||
    session?.tenant?.tenantId ||
    session?.context?.tenantId ||
    session?.context?.tenant_id ||
    session?.user?.tenantId ||
    session?.user?.tenant_id ||
    "";

  const resolved = safeStr(direct);
  if (resolved) return resolved;

  const last = getLastTenantId();
  return safeStr(last);
}

/**
 * Migra una sesi車n guardada en una key vieja a la key oficial.
 */
function migrateLegacySession() {
  try {
    const current = readJson(STORAGE_KEY);
    if (current?.token || current?.accessToken) return;

    for (const key of LEGACY_KEYS) {
      if (key === STORAGE_KEY) continue;

      const legacy = readJson(key);
      if (legacy?.token || legacy?.accessToken) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
        window.localStorage.removeItem(key);
        console.log(`[authSession] migrated ${key} -> ${STORAGE_KEY}`);
        return;
      }
    }
  } catch (error) {
    console.error("[authSession] migrateLegacySession error:", error);
  }
}

/**
 * Normaliza expiresAt a number(ms) o null.
 * Acepta number(ms), Date, ISO string o null/undefined.
 * @param {any} value
 * @returns {number|null}
 */
function normalizeExpiresAt(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (value instanceof Date) {
    const ms = value.getTime();
    return Number.isFinite(ms) ? ms : null;
  }

  if (typeof value === "string") {
    const ms = Date.parse(value);
    return Number.isFinite(ms) ? ms : null;
  }

  return null;
}

/**
 * Normaliza token principal.
 * Prioridad:
 * 1. session.token
 * 2. session.accessToken
 *
 * @param {object} session
 * @returns {string|null}
 */
function normalizeAccessToken(session) {
  const token =
    safeStr(session?.token) ||
    safeStr(session?.accessToken);

  return token || null;
}

/**
 * Normaliza refresh token.
 * @param {object} session
 * @returns {string|null}
 */
function normalizeRefreshToken(session) {
  const refreshToken =
    safeStr(session?.refreshToken) ||
    safeStr(session?.refresh_token);

  return refreshToken || null;
}

/**
 * Guarda la sesi車n en localStorage.
 * Devuelve el payload almacenado.
 *
 * @param {object} session
 * @returns {object|null}
 */
export function saveSession(session) {
  try {
    if (!session || typeof session !== "object") return null;

    const token = normalizeAccessToken(session);
    const refreshToken = normalizeRefreshToken(session);
    const user = session?.user || null;

    if (!token || !user) {
      return null;
    }

    const expiresAt =
      normalizeExpiresAt(session?.expiresAt) ||
      normalizeExpiresAt(session?.accessTokenExpiresAt) ||
      normalizeExpiresAt(session?.tokenExpiresAt);

    const tenantId = resolveTenantIdFromSession(session);

    const payload = {
      ...session,
      token,
      accessToken: token,
      refreshToken,
      user,
      expiresAt,
      tenantId: tenantId || null,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    if (tenantId) {
      setLastTenantId(tenantId);
    }

    console.log("[authSession] saveSession OK", {
      hasToken: Boolean(token),
      hasRefreshToken: Boolean(refreshToken),
      userEmail: user?.email || null,
      expiresAt,
      tenantId: tenantId || null,
    });

    return payload;
  } catch (error) {
    console.error("[authSession] saveSession error:", error);
    return null;
  }
}

/**
 * Carga la sesi車n desde localStorage.
 * Devuelve objeto normalizado.
 *
 * @returns {{
 *   token: string|null,
 *   accessToken: string|null,
 *   refreshToken: string|null,
 *   user: any|null,
 *   expiresAt: number|null,
 *   tenantId: string|null,
 *   [k:string]: any
 * }}
 */
export function loadSession() {
  try {
    migrateLegacySession();

    const data = readJson(STORAGE_KEY) || {};
    const token = normalizeAccessToken(data);
    const refreshToken = normalizeRefreshToken(data);
    const tenantId = safeStr(resolveTenantIdFromSession(data)) || null;

    if (tenantId) {
      setLastTenantId(tenantId);
    }

    return {
      ...data,
      token,
      accessToken: token,
      refreshToken,
      user: data?.user ?? null,
      expiresAt:
        normalizeExpiresAt(data?.expiresAt) ||
        normalizeExpiresAt(data?.accessTokenExpiresAt) ||
        normalizeExpiresAt(data?.tokenExpiresAt),
      tenantId,
    };
  } catch (error) {
    console.error("[authSession] loadSession error:", error);
    return {
      token: null,
      accessToken: null,
      refreshToken: null,
      user: null,
      expiresAt: null,
      tenantId: null,
    };
  }
}

/**
 * Limpia la sesi車n.
 */
export function clearSession() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);

    for (const key of LEGACY_KEYS) {
      window.localStorage.removeItem(key);
    }

    console.log("[authSession] clearSession");
  } catch (error) {
    console.error("[authSession] clearSession error:", error);
  }
}

/**
 * Decodifica payload JWT (Base64URL) sin verificar firma.
 * @param {string} token
 * @returns {object|null}
 */
function decodeJwtPayload(token) {
  try {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length < 2) return null;

    const payloadBase64 = parts[1];
    if (!payloadBase64) return null;

    const fixed = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (fixed.length % 4)) % 4);
    const json = atob(fixed + padding);

    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Valida exp del JWT.
 * @param {string} token
 * @returns {boolean}
 */
export function isTokenValid(token) {
  const payload = decodeJwtPayload(token);
  if (!payload) return false;

  if (!payload?.exp) return true;

  const nowSec = Date.now() / 1000;
  return payload.exp > nowSec;
}

/**
 * Obtiene expiraci車n del JWT como ms.
 * @param {string} token
 * @returns {number|null}
 */
export function getTokenExpiration(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return null;

  const ms = payload.exp * 1000;
  return Number.isFinite(ms) ? ms : null;
}
