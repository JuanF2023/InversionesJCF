# policies/
Propósito: autorización por roles/tenants/ownership (can/cannot).

Estructura sugerida:
- index.js (exporta funciones/clases públicas)
- ...archivos relacionados

Convenciones:
- ESM (import/export) con extensión `.js`
- Usa imports relativos dentro del módulo (ej: `../services/...`)
- Evita `modules/restaurante/modules/restaurante` en rutas
