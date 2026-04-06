// server/src/utils/metadata.js
export function withMetaCreate(payload = {}, req) {
  return { ...payload, createdBy: req.actorId || null, updatedBy: req.actorId || null, tenantId: req.tenantId || null };
}
export function withMetaUpdate(patch = {}, req) {
  return { ...patch, updatedBy: req.actorId || null };
}
