// client/src/core/theme/theme.storage.js

const THEME_STORAGE_KEY = "jcf_theme";

function canUseLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getStoredTheme() {
  if (!canUseLocalStorage()) return null;

  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredTheme(theme) {
  if (!canUseLocalStorage() || !theme) return;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage may be disabled in private mode or restricted environments.
  }
}

export function clearStoredTheme() {
  if (!canUseLocalStorage()) return;

  try {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    // Storage may be disabled in private mode or restricted environments.
  }
}
