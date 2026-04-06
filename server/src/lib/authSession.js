// client/src/lib/authSession.js

// --- helpers de base ---
function decodeJwt(token) {
    try {
      const payload = token.split(".")[1];
      const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(decodeURIComponent(escape(json)));
    } catch {
      return null;
    }
  }
  
  export function isTokenValid(token) {
    if (!token) return false;
    const data = decodeJwt(token);
    if (!data?.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return data.exp > now;
  }
  
  // --- almacenamiento ---
  const TOKEN_KEY = "authToken";
  const USER_KEY = "usuarioLogeado";
  
  export function saveSession({ token, user }) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      window.__user = user; // hidrata runtime
    } catch {}
  }
  
  export function loadSession() {
    try {
      const token = localStorage.getItem(TOKEN_KEY) || "";
      const rawUser = localStorage.getItem(USER_KEY);
      const user = rawUser ? JSON.parse(rawUser) : null;
      return { token, user };
    } catch {
      return { token: "", user: null };
    }
  }
  
  export function clearSession() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
    window.__user = null;
  }
  
