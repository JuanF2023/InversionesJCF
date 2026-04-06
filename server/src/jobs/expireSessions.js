// server/src/jobs/expireSessions.js
import { Session } from "#modules/auth/infrastructure/mongoose/models/session.model.js";
import { SESSION_STATES } from "#modules/auth/config/session.config.js";

/**
 * Cierra sesiones expiradas por expiresAt.
 */
export async function expireSessionsJob() {
  const now = new Date();

  const res = await Session.updateMany(
    {
      state: { $in: [SESSION_STATES.ACTIVE, SESSION_STATES.BREAK] },
      expiresAt: { $lte: now },
    },
    {
      $set: {
        state: SESSION_STATES.CLOSED,
        closedAt: now,
        closedReason: "expired",
        closeSource: "expire_job",
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