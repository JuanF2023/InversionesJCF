import mongoose from "mongoose";

const uri =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.DB_URI;

if (!uri) {
  throw new Error("No se encontró MONGODB_URI/MONGO_URI/DB_URI en server/.env");
}

await mongoose.connect(uri);

const db = mongoose.connection.db;

const users = await db.collection("users").find({
  $or: [
    { email: /juanito003013/i },
    { email: /jino/i },
    { displayName: /Juan Flores/i },
    { displayName: /Jino Palacios/i },
    { firstName: /Juan/i },
    { firstName: /Jino/i }
  ]
}).toArray();

console.log("\n===== USERS =====");
console.log(JSON.stringify(users, null, 2));

const userIds = users.flatMap((u) => [u._id, String(u._id)]);

const memberships = await db.collection("memberships").find({
  $or: [
    { userId: { $in: userIds } },
    { user: { $in: userIds } }
  ]
}).toArray();

console.log("\n===== MEMBERSHIPS =====");
console.log(JSON.stringify(memberships, null, 2));

const roleIds = memberships.map((m) => m.roleId).filter(Boolean);
const tenantIds = memberships.map((m) => m.tenantId).filter(Boolean);

const roles = await db.collection("roles").find({
  _id: { $in: roleIds }
}).toArray();

console.log("\n===== ROLES =====");
console.log(JSON.stringify(roles, null, 2));

const tenants = await db.collection("tenants").find({
  _id: { $in: tenantIds }
}).toArray();

console.log("\n===== TENANTS =====");
console.log(JSON.stringify(tenants, null, 2));

await mongoose.disconnect();
