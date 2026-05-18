// server/src/modules/corporativo/domain/users/users.entity.js

import { cleanText, normalizeEmail } from "#modules/corporativo/domain/users/users.rules.js";

export class CorporativoUser {
    constructor({ id = "", nombre = "", email = "", activo = false } = {}) {
        this.id = cleanText(id);
        this.nombre = cleanText(nombre);
        this.email = normalizeEmail(email);
        this.activo = Boolean(activo);
    }

    isActive() {
        return this.activo;
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            email: this.email,
            activo: this.activo,
        };
    }
}