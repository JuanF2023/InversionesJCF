// server/src/core/interface/http/response.js

/**
 * Respuesta HTTP estandarizada para todos los controllers.
 *
 * Convención:
 * - result.statusCode → código HTTP
 * - result.ok → éxito lógico
 * - result.data → payload
 * - result.code → código de error (opcional)
 * - result.message → mensaje (opcional)
 *
 * Esta función:
 * - protege contra status inválidos
 * - evita duplicación en controllers
 * - asegura consistencia en toda la API
 */
export function sendResponse(res, result = {}, fallback = 200) {
    const status =
        Number.isInteger(result?.statusCode) &&
            result.statusCode >= 100 &&
            result.statusCode <= 599
            ? result.statusCode
            : fallback;

    return res.status(status).json(result);
}

/**
 * Helper explícito para respuestas exitosas
 */
export function ok(res, data = {}, statusCode = 200) {
    return res.status(statusCode).json({
        ok: true,
        statusCode,
        data,
    });
}

/**
 * Helper explícito para errores controlados
 */
export function fail(
    res,
    {
        statusCode = 500,
        code = "INTERNAL_ERROR",
        message = "Error interno del servidor",
        details = null,
    } = {}
) {
    return res.status(statusCode).json({
        ok: false,
        statusCode,
        code,
        message,
        ...(details ? { details } : {}),
    });
}

/**
 * Normaliza cualquier excepción a formato estándar
 * (útil para usar dentro de catch si no usas middleware global)
 */
export function errorFromException(error, fallbackMessage = "Error interno") {
    return {
        ok: false,
        statusCode: error?.statusCode || error?.status || 500,
        code: error?.code || "UNEXPECTED_ERROR",
        message: error?.message || fallbackMessage,
    };
}