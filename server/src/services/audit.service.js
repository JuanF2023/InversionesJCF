// server/src/services/audit.service.js
import { ObjectId } from "mongodb";

export function oid(v) {
  try { return new ObjectId(String(v)); } catch { return null; }
}

export function withCreateAudit(doc, actor) {
  const now = new Date();
  return {
    ...doc,
    createdAt: now,
    updatedAt: now,
    createdBy: actor?.id ? oid(actor.id) : null,
    updatedBy: actor?.id ? oid(actor.id) : null,
  };
}

export function withUpdateAudit(update, actor) {
  return {
    ...update,
    updatedAt: new Date(),
    updatedBy: actor?.id ? oid(actor.id) : null,
  };
}
