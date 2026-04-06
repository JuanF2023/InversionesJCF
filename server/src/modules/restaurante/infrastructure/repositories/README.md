# repositories/
Propósito: DAO/queries contra DB (Mongoose/Prisma).

Estructura sugerida:
- index.js (exporta funciones/clases públicas)
- ...archivos relacionados

Convenciones:
- ESM (import/export) con extensión `.js`
- Usa imports relativos dentro del módulo (ej: `../services/...`)
- Evita `modules/restaurante/modules/restaurante` en rutas
