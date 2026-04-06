import { Tenants } from "#modules/corporativo/models/tenants.model.js";

export const findAll = (filter = {}) => Tenants.find(filter).sort({ nombre: 1 });
export const findById = (id) => Tenants.findById(id);
export const create = (data) => Tenants.create(data);
export const update = (id, data) => Tenants.findByIdAndUpdate(id, data, { new: true });
export const remove = (id) => Tenants.findByIdAndDelete(id);

