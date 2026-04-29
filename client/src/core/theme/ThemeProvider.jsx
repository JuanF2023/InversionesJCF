// client/src/core/theme/ThemeProvider.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { DEFAULT_THEME, THEME_VALUES } from "./theme.constants.js";
import { getStoredTheme, setStoredTheme } from "./theme.storage.js";

const ThemeContext = createContext(null);

function normalizeTheme(value) {
  return THEME_VALUES.includes(value) ? value : DEFAULT_THEME;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return normalizeTheme(getStoredTheme());
  });

  useEffect(() => {
    const safeTheme = normalizeTheme(theme);

    document.documentElement.setAttribute("data-theme", safeTheme);
    setStoredTheme(safeTheme);

    if (safeTheme !== theme) {
      setThemeState(safeTheme);
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    setThemeState(normalizeTheme(newTheme));
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      isThemeReady: true,
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider.");
  }

  return ctx;
}
