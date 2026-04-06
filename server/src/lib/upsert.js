import { auditCreate, auditUpdate } from "./audit.js";

/**
 * Upsert genérico con auditoría.
 * @param {Collection} col - colección mongo
 * @param {object} filter
 * @param {object} setOnInsert - datos del documento en creación
 * @param {object} set - datos para actualizar
 * @param {object} user - req.actor
 */
export async function upsertWithAudit(col, filter, setOnInsert, set, user) {
  const { value } = await col.findOneAndUpdate(
    filter,
    { $setOnInsert: { ...setOnInsert, ...auditCreate(user) }, $set: { ...set, ...auditUpdate(user) } },
    { upsert: true, returnDocument: "after" }
  );
  return value;
}
