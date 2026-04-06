// server/src/modules/corporativo/domain/entities/property.entity.js
import { validatePropertyCreate, validatePropertyUpdate } from "#modules/corporativo/domain/validators/property.validator.js";

/**
 * Entidad de dominio (shape + normalización).
 * Mantener esto liviano y sin dependencias externas.
 */
export class PropertyEntity {
    static create(input) {
        const v = validatePropertyCreate(input);
        if (!v.ok) {
            const err = new Error(`Property inválida: ${v.errors.join(" ")}`);
            err.code = "DOMAIN_VALIDATION_ERROR";
            err.details = v.errors;
            throw err;
        }

        return PropertyEntity.normalize(input);
    }

    static patch(input) {
        const v = validatePropertyUpdate(input);
        if (!v.ok) {
            const err = new Error(`Property inválida: ${v.errors.join(" ")}`);
            err.code = "DOMAIN_VALIDATION_ERROR";
            err.details = v.errors;
            throw err;
        }

        return PropertyEntity.normalize(input);
    }

    static normalize(input = {}) {
        return {
            id: input.id ?? input._id ?? undefined,
            codigo: String(input.codigo ?? "").trim(),
            nombre: String(input.nombre ?? "").trim(),
            estado: String(input.estado ?? "ACTIVA").trim(),
            tipo: String(input.tipo ?? "").trim(),
            descripcionActual: String(input.descripcionActual ?? "").trim(),
            notas: String(input.notas ?? "").trim(),

            ubicacion: {
                pais: String(input?.ubicacion?.pais ?? "").trim(),
                departamento: String(input?.ubicacion?.departamento ?? "").trim(),
                ciudad: String(input?.ubicacion?.ciudad ?? "").trim(),
                municipio: String(input?.ubicacion?.municipio ?? "").trim(),
                direccion: String(input?.ubicacion?.direccion ?? "").trim(),
                bandera: String(input?.ubicacion?.bandera ?? "").trim(),
            },

            historia: {
                fechaCompra: input?.historia?.fechaCompra ?? null,
                descripcionCompra: String(input?.historia?.descripcionCompra ?? "").trim(),
                precioCompra: input?.historia?.precioCompra ?? null,
            },

            valores: {
                valorCompra: input?.valores?.valorCompra ?? null,
                valorActual: input?.valores?.valorActual ?? null,
                costoTotalActual: input?.valores?.costoTotalActual ?? null,
                ingresoMensualActual: input?.valores?.ingresoMensualActual ?? null,
            },

            dimensiones: {
                medidasDeclaradas: String(input?.dimensiones?.medidasDeclaradas ?? "").trim(),
                areaM2: input?.dimensiones?.areaM2 ?? null,
                areaV2: input?.dimensiones?.areaV2 ?? null,
                norte: String(input?.dimensiones?.norte ?? "").trim(),
                sur: String(input?.dimensiones?.sur ?? "").trim(),
                este: String(input?.dimensiones?.este ?? "").trim(),
                oeste: String(input?.dimensiones?.oeste ?? "").trim(),
                acceso: String(input?.dimensiones?.acceso ?? "").trim(),
            },

            media: Array.isArray(input.media) ? input.media : [],
        };
    }
}
