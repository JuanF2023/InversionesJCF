// server/src/modules/corporativo/domain/entities/catalog.entity.js
/**
 * Entidad de Catálogo de Negocios (Corporativo)
 * - Categoría -> Subcategorías -> Tipos
 * - Validaciones mínimas para consistencia en BD y API.
 */

const str = (v) => String(v ?? "").trim();

export class catalogo-negociosEntity {
    /**
     * @param {object} props
     */
    constructor(props = {}) {
        this.codigo = str(props.codigo).toUpperCase();
        this.nombre = str(props.nombre);
        this.orden = Number(props.orden ?? 0) || 0;
        this.activo = props.activo !== false;

        this.tenantId = str(props.tenantId || "CORPORATIVO");

        this.subcategorias = Array.isArray(props.subcategorias) ? props.subcategorias : [];
    }

    validate() {
        if (!this.codigo) throw new Error("catalogo-negocios: codigo requerido.");
        if (!this.nombre) throw new Error("catalogo-negocios: nombre requerido.");

        for (const sub of this.subcategorias) {
            const sc = str(sub?.codigo).toUpperCase();
            const sn = str(sub?.nombre);
            if (!sc || !sn) throw new Error("catalogo-negocios: subcategoría inválida (codigo/nombre).");

            const tipos = Array.isArray(sub?.tipos) ? sub.tipos : [];
            for (const t of tipos) {
                const tc = str(t?.codigo).toUpperCase();
                const tn = str(t?.nombre);
                if (!tc || !tn) throw new Error("catalogo-negocios: tipo inválido (codigo/nombre).");
            }
        }
    }
}

