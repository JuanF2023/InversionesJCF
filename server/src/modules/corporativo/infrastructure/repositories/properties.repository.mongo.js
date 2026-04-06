// server/src/modules/corporativo/infrastructure/repositories/properties.repository.mongo.js
import mongoose from "mongoose";
import PropertyModel from "#modules/negocio/infrastructure/mongoose/models/properties.model.js";

export class PropertiesRepositoryMongo {
    async list({ q = "", page = 1, limit = 50, estado, pais } = {}) {
        const find = {};

        if (q?.trim()) {
            const term = q.trim();
            find.$or = [
                { nombre: { $regex: term, $options: "i" } },
                { codigo: { $regex: term, $options: "i" } },
            ];
        }

        if (estado) find.estado = String(estado).toUpperCase();
        if (pais) find["ubicacion.pais"] = String(pais);

        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(200, Math.max(1, Number(limit) || 50));
        const skip = (pageNum - 1) * limitNum;

        const [items, total] = await Promise.all([
            PropertyModel.find(find).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
            PropertyModel.countDocuments(find),
        ]);

        return { items, page: pageNum, limit: limitNum, total };
    }

    async getById(id) {
        const key = String(id || "").trim();
        if (!key) return null;

        if (mongoose.isValidObjectId(key)) {
            const doc = await PropertyModel.findById(key).lean();
            if (doc) return doc;
        }

        // fallback por codigo (si te pasan "PROP-001")
        return PropertyModel.findOne({ codigo: key }).lean();
    }

    async create(data) {
        const created = await PropertyModel.create(data);
        return created.toObject ? created.toObject() : created;
    }

    async update(id, patch) {
        const key = String(id || "").trim();
        if (!key) return null;

        const filter = mongoose.isValidObjectId(key) ? { _id: key } : { codigo: key };

        const updated = await PropertyModel.findOneAndUpdate(
            filter,
            { $set: patch },
            { new: true, lean: true }
        );

        return updated || null;
    }

    async delete(id) {
        const key = String(id || "").trim();
        if (!key) return { deleted: false };

        const filter = mongoose.isValidObjectId(key) ? { _id: key } : { codigo: key };

        const res = await PropertyModel.deleteOne(filter);
        return { deleted: Boolean(res?.deletedCount) };
    }
}

