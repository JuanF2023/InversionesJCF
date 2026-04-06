// server/src/jobs/idleSessions.job.js
import { Session } from "#modules/auth/infrastructure/mongoose/models/session.model.js";
import { IDLE_MS, SESSION_STATES } from "#modules/auth/config/session.config.js";

/**
 * Cierra sesiones por inactividad.
 */
export async function idleSessionsJob() {
  if (!IDLE_MS) return { ok: true, skipped: true };

  const now = new Date();
  const cutoff = new Date(Date.now() - IDLE_MS);

  const res = await Session.updateMany(
    {
      state: { $in: [SESSION_STATES.ACTIVE, SESSION_STATES.BREAK] },
      lastActiveAt: { $lte: cutoff },
    },
    {
      $set: {
        state: SESSION_STATES.CLOSED,
        closedAt: now,
        closedReason: "idle_timeout",
        closeSource: "idle_job",
        closedBy: "system",
        lastActiveAt: now,
      },
    }
  );

  return {
    ok: true,
    matched: res.matchedCount ?? res.n ?? 0,
    modified: res.modifiedCount ?? res.nModified ?? 0,
  };
}