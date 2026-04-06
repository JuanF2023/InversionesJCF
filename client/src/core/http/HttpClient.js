// client/src/core/http/HttpClient.js
import axios from "axios";
import { loadSession, saveSession, clearSession } from "@/core/utils/authSession.js";

/**
 * HTTP CLIENT ENTERPRISE
 * - Access token en requests
 * - Refresh token autom芍tico
 * - Cola de requests mientras se refresca
 * - Retry 迆nico por request
 * - Logout seguro si refresh falla
 */

const BASE_URL = (() => {
  let url = import.meta.env.VITE_API_URL || "http://localhost:4000";

  if (!url.endsWith("/api")) {
    url = url.replace(/\/+$/, "") + "/api";
  }

  return url;
})();

const REFRESH_ENDPOINT = "/auth/refresh";
const LOGIN_PATH = "/login";

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

/**
 * Notifica a todos los requests en espera que ya hay token nuevo.
 */
function notifyRefreshSubscribers(newAccessToken) {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
}

/**
 * Pone en cola requests mientras se completa el refresh.
 */
function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

/**
 * Obtiene access token desde la sesi車n persistida.
 */
function getAccessToken() {
  const session = loadSession() || {};
  return session?.token || session?.accessToken || null;
}

/**
 * Obtiene refresh token desde la sesi車n persistida.
 */
function getRefreshToken() {
  const session = loadSession() || {};
  return session?.refreshToken || null;
}

/**
 * Obtiene tenantId desde la sesi車n persistida.
 */
function getTenantId() {
  const session = loadSession() || {};
  return session?.tenantId || session?.user?.tenantId || null;
}

/**
 * Guarda nuevos tokens respetando la sesi車n existente.
 */
function persistNewTokens(tokensPayload) {
  const current = loadSession() || {};

  const nextSession = {
    ...current,
    token: tokensPayload?.token || tokensPayload?.accessToken || current?.token,
    accessToken:
      tokensPayload?.accessToken ||
      tokensPayload?.token ||
      current?.accessToken ||
      current?.token,
    refreshToken: tokensPayload?.refreshToken || current?.refreshToken,
    expiresAt: tokensPayload?.expiresAt || current?.expiresAt,
    tenantId: tokensPayload?.tenantId || current?.tenantId,
    user: tokensPayload?.user || current?.user,
  };

  saveSession(nextSession);
  return nextSession;
}

/**
 * Redirecci車n segura al login.
 */
function redirectToLogin() {
  if (typeof window === "undefined") return;

  if (window.location.pathname !== LOGIN_PATH) {
    window.location.href = LOGIN_PATH;
  }
}

/**
 * Llama al backend para refrescar tokens.
 * Usa axios base para evitar loops con interceptors del cliente principal.
 */
async function requestTokenRefresh() {
  const refreshToken = getRefreshToken();
  const tenantId = getTenantId();

  if (!refreshToken) {
    throw new Error("No hay refresh token disponible.");
  }

  const response = await axios.post(
    `${BASE_URL}${REFRESH_ENDPOINT}`,
    {
      refreshToken,
      tenantId,
    },
    {
      timeout: 15000,
      headers: {
        "Content-Type": "application/json",
        ...(tenantId ? { "x-tenant-id": tenantId } : {}),
        "x-device-label": "web-client",
      },
    }
  );

  const payload =
    response?.data?.data ||
    response?.data ||
    null;

  if (!payload) {
    throw new Error("Respuesta inv芍lida al refrescar token.");
  }

  return persistNewTokens(payload);
}

/**
 * REQUEST INTERCEPTOR
 */
http.interceptors.request.use(
  (config) => {
    const session = loadSession() || {};
    const accessToken = session?.token || session?.accessToken || null;
    const tenantId = session?.tenantId || session?.user?.tenantId || null;

    config.headers = config.headers || {};

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      config.headers["x-session-token"] = accessToken;
    }

    if (tenantId) {
      config.headers["x-tenant-id"] = tenantId;
    }

    config.headers["x-device-label"] = "web-client";

    if (!config.headers["x-request-id"] && typeof crypto !== "undefined" && crypto.randomUUID) {
      config.headers["x-request-id"] = crypto.randomUUID();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 */
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    /**
     * Evita loop infinito.
     */
    if (originalRequest._retry === true) {
      return Promise.reject(error);
    }

    /**
     * Solo intenta refresh para 401.
     */
    if (status !== 401) {
      return Promise.reject(error);
    }

    /**
     * Si el 401 vino del endpoint de refresh, se cierra sesi車n.
     */
    if (String(originalRequest?.url || "").includes(REFRESH_ENDPOINT)) {
      clearSession();
      redirectToLogin();
      return Promise.reject(error);
    }

    /**
     * Si no hay refresh token, logout directo.
     */
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearSession();
      redirectToLogin();
      return Promise.reject(error);
    }

    /**
     * Si ya hay refresh en progreso, poner request en cola.
     */
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newAccessToken) => {
          if (!newAccessToken) {
            reject(error);
            return;
          }

          originalRequest._retry = true;
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers["x-session-token"] = newAccessToken;

          resolve(http(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshedSession = await requestTokenRefresh();
      const newAccessToken =
        refreshedSession?.token ||
        refreshedSession?.accessToken ||
        null;

      if (!newAccessToken) {
        throw new Error("No se recibi車 nuevo access token.");
      }

      notifyRefreshSubscribers(newAccessToken);

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      originalRequest.headers["x-session-token"] = newAccessToken;

      return http(originalRequest);
    } catch (refreshError) {
      notifyRefreshSubscribers(null);
      clearSession();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default http;
