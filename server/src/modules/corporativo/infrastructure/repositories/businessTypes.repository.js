// server/src/modules/corporativo/repositories/businessTypes.repository.js
import { BusinessType } from "#modules/corporativo/infrastructure/repositories/../../models/businessTypes.model.js";

/** Crear tipo de negocio */
export function createType(data) {
  return BusinessType.create(data);
}

/** Listar tipos con filtros y opciones (sort, skip, limit) */
export function listTypes(filter = {}, { sort = { nombre: 1 }, skip = 0, limit = 50 } = {}) {
  return BusinessType.find(filter).sort(sort).skip(skip).limit(limit).lean();
}

/** Contar tipos (para paginación) */
export function countTypes(filter = {}) {
  return BusinessType.countDocuments(filter);
}

/** Buscar por ID */
export function findTypeById(id) {
  return BusinessType.findById(id).lean();
}

/** Actualizar por ID */
export function updateTypeById(id, patch, opts = { new: true, runValidators: true }) {
  return BusinessType.findByIdAndUpdate(id, patch, opts).lean();
}

/** Soft delete (activo=false) */
export function softDeleteType(id, actorId = null) {
  return BusinessType.findByIdAndUpdate(
    id,
    { activo: false, updatedBy: actorId },
    { new: true }
  ).lean();
}

/** Buscar por categoría */
export function listTypesByCategory(categoriaId, extra = {}) {
  return BusinessType.find({ categoriaId, ...extra }).sort({ nombre: 1 }).lean();
}

/** Buscar por slug dentro de una categoría */
export function findTypeBySlug(categoriaId, slug) {
  return BusinessType.findOne({ categoriaId, slug }).lean();
}

