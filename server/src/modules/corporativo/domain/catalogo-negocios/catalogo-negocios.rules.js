// server/src/modules/corporativo/domain/catalogo-negocios/catalogo-negocios.rules.js

/**
 * Reglas de dominio: Cat¨¢logo de Negocios (enterprise)
 * - Validaciones puras (sin DB)
 * - Nombres estables para imports desde usecases
 */

function str(v) {
  return String(v ?? "").trim();
}

function asArray(v) {
  return Array.isArray(v) ? v : [];
}

function upper(v) {
  return str(v).toUpperCase();
}

export const CATALOGO_LEVELS = Object.freeze({
  CATEGORY: "category",
  SUBCATEGORY: "subcategory",
  BUSINESS_TYPE: "business_type",
});

export function isValidLevel(level) {
  const lv = str(level);
  return (
    lv === CATALOGO_LEVELS.CATEGORY ||
    lv === CATALOGO_LEVELS.SUBCATEGORY ||
    lv === CATALOGO_LEVELS.BUSINESS_TYPE
  );
}

/**
 * Valida payload para CREAR item de cat¨¢logo.
 * @throws Error con statusCode y code.
 */
export function validateCreateCatalogoItem(payload = {}) {
  const level = str(payload.level);
  const label = str(payload.label);
  const parentKey = payload.parentKey == null ? null : str(payload.parentKey);

  if (!isValidLevel(level)) {
    const err = new Error("level inv¨¢lido. Use: category | subcategory | business_type");
    err.statusCode = 400;
    err.code = "CATALOGO_LEVEL_INVALID";
    throw err;
  }

  if (!label) {
    const err = new Error("label requerido");
    err.statusCode = 400;
    err.code = "CATALOGO_LABEL_REQUIRED";
    throw err;
  }

  // Reglas jer¨¢rquicas (sin DB)
  if (level === CATALOGO_LEVELS.CATEGORY) {
    // category no debe tener parentKey
    if (parentKey) {
      const err = new Error("parentKey no permitido para category");
      err.statusCode = 400;
      err.code = "CATALOGO_PARENT_NOT_ALLOWED";
      throw err;
    }
  }

  if (level === CATALOGO_LEVELS.SUBCATEGORY) {
    if (!parentKey) {
      const err = new Error("parentKey requerido para subcategory");
      err.statusCode = 400;
      err.code = "CATALOGO_PARENT_REQUIRED";
      throw err;
    }
  }

  if (level === CATALOGO_LEVELS.BUSINESS_TYPE) {
    if (!parentKey) {
      const err = new Error("parentKey requerido para business_type");
      err.statusCode = 400;
      err.code = "CATALOGO_PARENT_REQUIRED";
      throw err;
    }
  }

  const tags = asArray(payload.tags).map(str).filter(Boolean);
  const synonyms = asArray(payload.synonyms).map(str).filter(Boolean);

  const scopeRaw = payload.scope == null ? null : str(payload.scope);
  const scope = scopeRaw ? scopeRaw : null;
  if (scope && !["b2c", "b2b", "mixed"].includes(scope)) {
    const err = new Error("scope inv¨¢lido. Use: b2c | b2b | mixed");
    err.statusCode = 400;
    err.code = "CATALOGO_SCOPE_INVALID";
    throw err;
  }

  // Normalizado para que el usecase/repo lo use directo
  return {
    key: payload.key ? str(payload.key) : "",
    level,
    parentKey,
    label,
    tags,
    scope,
    synonyms,
    order: Number(payload.order ?? 0) || 0,
  };
}

/**
 * Valida patch para UPDATE.
 * - No fuerza level/parentKey/label, pero si vienen los valida.
 */
export function validateUpdateCatalogoItem(patch = {}) {
  const out = { ...patch };

  if ("level" in out) {
    const lv = str(out.level);
    if (!isValidLevel(lv)) {
      const err = new Error("level inv¨¢lido. Use: category | subcategory | business_type");
      err.statusCode = 400;
      err.code = "CATALOGO_LEVEL_INVALID";
      throw err;
    }
    out.level = lv;
  }

  if ("label" in out) {
    const lb = str(out.label);
    if (!lb) {
      const err = new Error("label no puede ser vac¨ªo");
      err.statusCode = 400;
      err.code = "CATALOGO_LABEL_REQUIRED";
      throw err;
    }
    out.label = lb;
  }

  if ("parentKey" in out) {
    out.parentKey = out.parentKey == null ? null : str(out.parentKey);
  }

  if ("tags" in out) {
    out.tags = asArray(out.tags).map(str).filter(Boolean);
  }

  if ("synonyms" in out) {
    out.synonyms = asArray(out.synonyms).map(str).filter(Boolean);
  }

  if ("scope" in out) {
    const sc = out.scope == null ? null : str(out.scope);
    if (sc && !["b2c", "b2b", "mixed"].includes(sc)) {
      const err = new Error("scope inv¨¢lido. Use: b2c | b2b | mixed");
      err.statusCode = 400;
      err.code = "CATALOGO_SCOPE_INVALID";
      throw err;
    }
    out.scope = sc;
  }

  if ("activo" in out) {
    out.activo = Boolean(out.activo);
  }

  if ("system" in out) {
    out.system = Boolean(out.system);
  }

  if ("order" in out) {
    out.order = Number(out.order ?? 0) || 0;
  }

  return out;
}

