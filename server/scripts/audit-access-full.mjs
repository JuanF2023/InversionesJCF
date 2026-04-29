import mongoose from "mongoose";

const uri =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.DB_URI;

if (!uri) throw new Error("No se encontró URI de Mongo en server/.env");

await mongoose.connect(uri);
const db = mongoose.connection.db;

const users = await db.collection("users")
  .find({})
  .project({
    _id: 1,
    displayName: 1,
    firstName: 1,
    lastName: 1,
    email: 1,
    status: 1,
    roles: 1,
  })
  .sort({ email: 1 })
  .toArray();

const memberships = await db.collection("memberships")
  .find({})
  .sort({ userId: 1, tenantId: 1 })
  .toArray();

const roles = await db.collection("roles")
  .find({})
  .project({ _id: 1, key: 1, slug: 1, name: 1, tenantType: 1 })
  .sort({ tenantType: 1, name: 1 })
  .toArray();

const tenants = await db.collection("tenants")
  .find({})
  .project({ _id: 1, key: 1, slug: 1, name: 1, type: 1, status: 1 })
  .sort({ type: 1, name: 1 })
  .toArray();

function id(value) {
  return value ? String(value) : "";
}

const userById = new Map(users.map((u) => [id(u._id), u]));
const roleById = new Map(roles.map((r) => [id(r._id), r]));
const tenantById = new Map(tenants.map((t) => [id(t._id), t]));

console.log("\n===== USERS =====");
console.table(users.map((u) => ({
  id: id(u._id),
  name: u.displayName || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
  email: u.email,
  status: u.status,
  legacyRoles: Array.isArray(u.roles) ? u.roles.length : 0,
})));

console.log("\n===== MEMBERSHIPS RESUELTAS =====");
console.table(memberships.map((m) => {
  const user = userById.get(id(m.userId)) || userById.get(id(m.user));
  const role = roleById.get(id(m.roleId));
  const tenant = tenantById.get(id(m.tenantId));

  return {
    membershipId: id(m._id),
    userId: id(m.userId || m.user),
    userName: user?.displayName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "NO_RESUELTO",
    email: user?.email || "NO_RESUELTO",
    tenantId: id(m.tenantId),
    tenant: tenant?.name || "NO_RESUELTO",
    tenantType: tenant?.type || "",
    roleId: id(m.roleId),
    role: role?.name || "NO_RESUELTO",
    roleKey: role?.key || "",
    status: m.status,
  };
}));

console.log("\n===== USERS SIN MEMBERSHIP =====");
const membershipUserIds = new Set(memberships.map((m) => id(m.userId || m.user)));
console.table(users
  .filter((u) => !membershipUserIds.has(id(u._id)))
  .map((u) => ({
    id: id(u._id),
    name: u.displayName || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
    email: u.email,
    status: u.status,
  }))
);

console.log("\n===== MEMBERSHIPS HUERFANAS O ROTAS =====");
console.table(memberships
  .filter((m) => {
    const userOk = userById.has(id(m.userId || m.user));
    const roleOk = roleById.has(id(m.roleId));
    const tenantOk = tenantById.has(id(m.tenantId));
    return !userOk || !roleOk || !tenantOk;
  })
  .map((m) => ({
    membershipId: id(m._id),
    userId: id(m.userId || m.user),
    userOk: userById.has(id(m.userId || m.user)),
    tenantId: id(m.tenantId),
    tenantOk: tenantById.has(id(m.tenantId)),
    roleId: id(m.roleId),
    roleOk: roleById.has(id(m.roleId)),
    status: m.status,
  }))
);

console.log("\n===== ROLES =====");
console.table(roles.map((r) => ({
  id: id(r._id),
  key: r.key,
  slug: r.slug,
  name: r.name,
  tenantType: r.tenantType,
})));

console.log("\n===== TENANTS =====");
console.table(tenants.map((t) => ({
  id: id(t._id),
  key: t.key,
  slug: t.slug,
  name: t.name,
  type: t.type,
  status: t.status,
})));

await mongoose.disconnect();
