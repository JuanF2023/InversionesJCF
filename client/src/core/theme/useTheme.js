// client/src/core/theme/useTheme.js

/**
 * Hook de acceso al contexto de tema.
 * Mantiene separación limpia (Clean Architecture):
 * - No lógica aquí, solo re-export del provider.
 */

export { useTheme } from "./ThemeProvider.jsx";
