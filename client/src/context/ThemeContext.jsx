// client/src/context/ThemeContext.jsx

import { createContext, useContext, useEffect, useState } from "react";

/** Temas disponibles (solo Claros y Oscuros) */
export const VALID_THEMES = [
  // Claros
  "neo-ice", "neo-mint", "neo-dawn", "neo-stone",
  // Oscuros
  "neo-ocean", "neo-plum", "neo-dusk", "neo-graphite", "neo-dark",
];

/** Fallback si llega algo inv¨¢lido */
export const FALLBACK = "neo-ice";

/** Normaliza valores antiguos guardados en localStorage */
function normalizeStoredTheme(t) {
  if (!t) return null;
  if (t === "dark") return "neo-dark";
  if (t === "moderno") return "neo-ice";
  return t;
}

function sanitize(t) {
  return VALID_THEMES.includes(t) ? t : FALLBACK;
}

const ThemeContext = createContext({ theme: FALLBACK, setTheme: () => { } });

export function ThemeProvider({ children }) {
  const hasWindow = typeof window !== "undefined";

  const hasStorage =
    hasWindow &&
    (() => {
      try {
        const k = "__tchk";
        localStorage.setItem(k, "1");
        localStorage.removeItem(k);
        return true;
      } catch {
        return false;
      }
    })();

  const storedRaw = hasStorage ? normalizeStoredTheme(localStorage.getItem("theme")) : null;

  const prefersDark =
    hasWindow &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const systemDefault = prefersDark ? "neo-ocean" : "neo-ice";

  const [theme, setTheme] = useState(sanitize(storedRaw || systemDefault));

  useEffect(() => {
    const safe = sanitize(theme);

    if (hasWindow) {
      document.documentElement.setAttribute("data-theme", safe);
    }

    if (hasStorage) {
      localStorage.setItem("theme", safe);
    }
  }, [theme, hasWindow, hasStorage]);

  useEffect(() => {
    if (!hasWindow || storedRaw) return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e) => {
      setTheme(e.matches ? "neo-ocean" : "neo-ice");
    };

    try {
      mql.addEventListener("change", handler);
    } catch {
      mql.addListener(handler);
    }

    return () => {
      try {
        mql.removeEventListener("change", handler);
      } catch {
        mql.removeListener(handler);
      }
    };
  }, [storedRaw, hasWindow]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
