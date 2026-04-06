// server/src/modules/corporativo/repositories/auth.repository.js
import { Sessions } from "#modules/corporativo/infrastructure/repositories/../../models/session.model.js";
import { User } from "#modules/corporativo/infrastructure/repositories/../../models/user.model.js";

export const findUserById = (id) => User.findById(id);
export const findUserByEmail = (email) => User.findOne({ email });
export const findUserByName = (nombre) => User.findOne({ nombre });

export const saveUserPinHash = (userId, pinHash) =>
  User.findByIdAndUpdate(userId, { pinHash }, { new: true });

export const createSession = (data) => Sessions.create(data);
export const findSessionByToken = (token) => Sessions.findOne({ token, active: true });
export const deactivateSession = (token) =>
  Sessions.findOneAndUpdate({ token }, { active: false }, { new: true });

