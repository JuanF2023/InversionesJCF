// server/src/modules/corporativo/repositories/roles.repository.js
import { Roles } from "#modules/corporativo/infrastructure/repositories/../../models/roles.model.js";

export function findMany({ filter = {}, select = "", sort = "name", skip = 0, limit = 50, lean = true } = {}) {
  const q = Roles.find(filter).select(select).sort(sort).skip(skip).limit(limit);
  return lean ? q.lean() : q.exec();
}
export const count = (filter = {}) => Roles.countDocuments(filter);
export function findById(id, { select = "", lean = true } = {}) {
  const q = Roles.findById(id).select(select);
  return lean ? q.lean() : q.exec();
}
export async function create(doc) {
  const d = await Roles.create(doc);
  return d.toObject?.() ?? d;
}
export async function updateById(id, payload) {
  const d = await Roles.findByIdAndUpdate(id, { $set: payload }, { new: true });
  return d?.toObject?.() ?? d;
}
export const removeById = (id) => Roles.findByIdAndDelete(id);

