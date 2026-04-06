export const SESSION_HOURS = Number(process.env.SESSION_HOURS || 12);
export const SESSION_MS = SESSION_HOURS * 60 * 60 * 1000;

export const IDLE_MINUTES = Number(process.env.IDLE_MINUTES || 0);
export const IDLE_MS = IDLE_MINUTES > 0 ? IDLE_MINUTES * 60 * 1000 : 0;

export const TOUCH_ACTIVITY_ON_VERIFY =
  String(process.env.TOUCH_ACTIVITY_ON_VERIFY || "false") === "true";

export const SESSION_STATES = Object.freeze({
  ACTIVE: "ACTIVE",
  BREAK: "BREAK",
  CLOSED: "CLOSED",
});