// server/src/services/acl.service.js
import { ObjectId } from "mongodb";
import { getDb } from "../config/db.js";

const ROLE_PERMS = {
  corporate_admin:   ["*"],
  corporate_analyst: ["read:*", "report:*"],
  business_manager:  ["business:*", "incomes:*", "units:*", "banks:read"],
  cashier:           ["incomes:create", "incomes:read"],
  waiter:            ["orders:read", "tickets:create"],
  cook:              ["orders:read"],
  viewer:            ["read:*"],
  legal_proxy:       ["read:*", "contracts:*"] // ejemplo
};

export async function can(actor, context, action, resource) {
  if (!actor?.id) return false;

  const db = await getDb();
  const userId = new ObjectId(actor.id);
  const now = new Date();

  const memberships = await db.collection("memberships").find({
    userId,
    status: "active",
    $and: [
      { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
      { $or: [{ endsAt: null }, { endsAt: { $gte: now } }] }
    ]
  }).toArray();

  const orgMemberships = memberships.filter(m => m.level === "org");
  const bizMemberships = context?.businessId
    ? memberships.filter(m => m.level === "business" && String(m.businessId) === String(context.businessId))
    : [];

  const effective = [...orgMemberships, ...bizMemberships];
  if (!effective.length) return false;

  const needle = `${resource}:${action}`;
  return effective.some(m => {
    const base = ROLE_PERMS[m.role] || [];
    const allow = new Set([...(m.allow || []), ...base]);
    const deny  = new Set(m.deny || []);

    if (deny.has(needle)) return false;
    if (allow.has("*")) return true;
    if (allow.has(`${resource}:*`)) return true;
    if (allow.has("read:*") && action.startsWith("read")) return true;
    return allow.has(needle);
  });
}
