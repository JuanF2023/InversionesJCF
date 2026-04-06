// server/src/lib/counters.js
import { getDb } from "../config/db.js";

/**
 * Reserva un bloque de n IDs consecutivos en `counters`.
 * SIN conflictos: no mezcla $inc y $setOnInsert sobre el mismo path.
 * Devuelve { start, end }.
 */
export async function getNextSequenceBlock(name, size = 1) {
  if (!Number.isFinite(size) || size <= 0) {
    throw new Error("Block size inválido");
  }

  const db = await getDb();

  // Usamos returnDocument: "before" para obtener el valor previo.
  // Solo $inc toca 'seq'. $setOnInsert NO toca 'seq' �?evita conflicto.
  const result = await db.collection("counters").findOneAndUpdate(
    { _id: name },
    {
      $inc: { seq: size },
      $setOnInsert: { createdAt: new Date() }, // �?NO pongas 'seq' aquí
    },
    { upsert: true, returnDocument: "before" }
  );

  const prev = result?.value?.seq ?? 0;
  const start = prev + 1;
  const end = prev + size;
  return { start, end };
}

/**
 * Versión "uno en uno" por si la necesitas en otros lugares.
 * También evita conflicto (solo $inc sobre 'seq').
 */
export async function getNextSequence(name) {
  const { start } = await getNextSequenceBlock(name, 1);
  return start;
}
