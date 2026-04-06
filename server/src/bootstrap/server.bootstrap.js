// server/src/bootstrap/server.bootstrap.js
import http from "node:http";
import mongoose from "mongoose";
import app from "../app.js";
import { ensureIndexes } from "./indexes.bootstrap.js";
import { idleSessionsJob } from "../jobs/idleSessions.job.js";

const PORT = Number(process.env.PORT || 4000);
const MONGO_URI =
    process.env.MONGO_URI || "mongodb://localhost:27017/inversionesjcf";

let server = null;
let idleTimer = null;

function wireProcessGuards() {
    process.on("unhandledRejection", (reason) => {
        console.error("🛑 UNHANDLED REJECTION:", reason);
    });

    process.on("uncaughtException", (err) => {
        console.error("🛑 UNCAUGHT EXCEPTION:", err);
    });
}

async function shutdown({ code = 0, signal = "" } = {}) {
    try {
        if (idleTimer) clearInterval(idleTimer);

        if (server) {
            await new Promise((resolve) => server.close(resolve));
            server = null;
        }

        await mongoose.disconnect().catch(() => { });
        console.log("🔒 Shutdown limpio.");
    } finally {
        // nodemon usa SIGUSR2 para reiniciar.
        if (signal === "SIGUSR2") {
            process.kill(process.pid, "SIGUSR2");
            return;
        }
        process.exit(code);
    }
}

function wireSignals() {
    ["SIGINT", "SIGTERM"].forEach((sig) =>
        process.on(sig, () => shutdown({ code: 0, signal: sig }))
    );
    process.once("SIGUSR2", () => shutdown({ code: 0, signal: "SIGUSR2" }));
}

function startIdleSessionsJob() {
    // cada 10 min
    const intervalMs = 10 * 60 * 1000;

    idleTimer = setInterval(() => {
        Promise.resolve(idleSessionsJob()).catch((e) =>
            console.error("💥 idleSessionsJob error:", e)
        );
    }, intervalMs);

    idleTimer.unref?.();
}

export async function startServer() {
    try {
        mongoose.set("strictQuery", true);
        wireProcessGuards();

        await mongoose.connect(MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
            autoIndex: true,
        });

        console.log("�?MongoDB conectado");

        await ensureIndexes({ mongoose });

        server = http.createServer(app);

        server.on("error", (err) => {
            console.error("💥 HTTP server error:", err);
            process.exit(1);
        });

        server.listen(PORT, () => {
            console.log(`🚀 API lista �?http://localhost:${PORT}`);
        });

        wireSignals();
        startIdleSessionsJob();
    } catch (e) {
        console.error("💥 Error al iniciar la API:", e);
        process.exit(1);
    }
}
