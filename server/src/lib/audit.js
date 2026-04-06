// server/src/utils/audit.js
/**
 * Helpers de auditoría para no repetir lógica en controladores.
 * createdAt/createdBy al crear, updatedAt/updatedBy al actualizar.
 */

export function auditCreate(actor) {
  const who = normActor(actor);
  const now = new Date();
  return {
    createdAt: now,
    createdBy: who,
    updatedAt: now,
    updatedBy: who,
  };
}

export function auditUpdate(actor) {
  const who = normActor(actor);
  return {
    updatedAt: new Date(),
    updatedBy: who,
  };
}

function normActor(actor) {
  if (!actor) return { id: "system", name: "System" };
  const id = String(actor.id ?? "system");
  const name = String(actor.name ?? "System");
  return { id, name };
}
