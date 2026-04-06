// server/src/modules/corporativo/repositories/permissions.repository.js
import { Permissions } from "#modules/corporativo/infrastructure/repositories/../../models/permissions.model.js";

export const findAll = (filter = {}) => Permissions.find(filter).sort({ id: 1 });
export const findById = (id) => Permissions.findOne({ id });
export const create = (data) => Permissions.create(data);
export const update = (id, data) => Permissions.findOneAndUpdate({ id }, data, { new: true });
export const remove = (id) => Permissions.findOneAndDelete({ id });

