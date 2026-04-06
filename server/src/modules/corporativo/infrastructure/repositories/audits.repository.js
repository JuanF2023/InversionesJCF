// server/src/modules/corporativo/infrastructure/repositories/
import { Audits } from "#modules/corporativo/infrastructure/repositories/../../models/audits.model.js";

export const findAll = (filter = {}, opt = {}) =>
  Audits.find(filter)
    .sort({ at: -1 })
    .limit(opt.limit ?? 100)
    .skip(opt.skip ?? 0);

export const findByObjectId = (id) => Audits.findById(id);
export const create = (data) => Audits.create(data);
export const removeByObjectId = (id) => Audits.findByIdAndDelete(id);

