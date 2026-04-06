// server/src/modules/auth/infrastructure/repositories/user.repository.js
import { User } from "../mongoose/models/user.model.js";

const Q_MAX_TIME_MS = Number(process.env.MONGO_QUERY_MAX_TIME_MS || 2000);

const userRepository = {
    async findByPin(pin) {
        return User.findOne({ pin: String(pin).trim() })
            .maxTimeMS(Q_MAX_TIME_MS)
            .lean()
            .exec();
    },

    async findById(id) {
        return User.findById(id).maxTimeMS(Q_MAX_TIME_MS).lean().exec();
    },

    async updateLastLogin(id, fecha = new Date()) {
        await User.updateOne({ _id: id }, { $set: { lastLoginAt: fecha } })
            .maxTimeMS(Q_MAX_TIME_MS)
            .exec();
    },
};

export default userRepository;

/** Compat (si algún código aún importa así) */
export const UserRepository = userRepository;