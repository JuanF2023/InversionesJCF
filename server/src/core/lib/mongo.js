// server/src/core/lib/mongo.js
import mongoose from "mongoose";

/**
 * Conexión Mongo (enterprise)
 * - Reutiliza conexión existente (idempotente)
 */
export async function connectMongo() {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
        const err = new Error("Falta MONGODB_URI (o MONGO_URI) en .env");
        err.code = "CONFIG_ERROR";
        throw err;
    }

    if (mongoose.connection?.readyState === 1) return mongoose.connection;

    await mongoose.connect(uri, {
        autoIndex: true,
    });

    return mongoose.connection;
}
