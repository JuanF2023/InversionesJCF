// server/src/modules/corporativo/domain/validators/property.validator.js
/**
 * Validaciones de dominio (enterprise).
 * No depende de Mongoose ni Express.
 */

export function validatePropertyCreate(input = {}) {
    const errors = [];

    const codigo = String(input.codigo ?? "").trim();
    const nombre = String(input.nombre ?? "").trim();

    if (!codigo) errors.push("codigo es obligatorio.");
    if (!nombre) errors.push("nombre es obligatorio.");

    const pais = String(input?.ubicacion?.pais ?? "").trim();
    if (!pais) errors.push("ubicacion.pais es obligatorio.");

    return { ok: errors.length === 0, errors };
}

export function validatePropertyUpdate(input = {}) {
    // En update permitimos parcial, pero si vienen campos, deben ser válidos.
    const errors = [];

    if (input.codigo !== undefined && !String(input.codigo).trim()) errors.push("codigo no puede ser vacío.");
    if (input.nombre !== undefined && !String(input.nombre).trim()) errors.push("nombre no puede ser vacío.");

    if (input.ubicacion?.pais !== undefined && !String(input.ubicacion.pais).trim()) {
        errors.push("ubicacion.pais no puede ser vacío.");
    }

    return { ok: errors.length === 0, errors };
}
