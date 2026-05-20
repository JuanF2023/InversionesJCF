// server/src/modules/corporativo/infrastructure/repositories/users/users-write.repository.mongo.js

import mongoose from "mongoose";

import { User } from "#modules/auth/infrastructure/mongoose/models/user.model.js";
import { hashPin } from "#modules/auth/application/security/pin.security.js";

import { auditLogService } from "#modules/audit/application/services/audit-log.service.js";
import {
    AUDIT_ACTIONS,
    AUDIT_MODULES,
} from "#modules/audit/domain/audit-actions.constants.js";

import {
    resolveActorId,
    str,
} from "#modules/corporativo/infrastructure/repositories/users/users-aggregation.mongo.js";

async function recordAuditSafe(payload) {
    try {
        await auditLogService.record(payload);
    } catch (error) {
        console.error(
            "[audit] No se pudo registrar auditoría:",
            error?.message || error
        );
    }
}

export function buildUsersWriteRepositoryMongo({ usersReadRepository }) {
    return {
        async create({
            nombre,
            email,
            pin,
            activo = true,
            createdBy = null,
            updatedBy = null,
        }) {
            const safeNombre = str(nombre);
            const safeEmail = str(email).toLowerCase();
            const safePin = str(pin);

            if (!safeNombre) {
                throw new Error("Nombre requerido.");
            }

            if (!safeEmail) {
                throw new Error("Email requerido.");
            }

            if (!safePin) {
                throw new Error("PIN requerido.");
            }

            const pinHash = await hashPin(safePin);
            const actorId = resolveActorId(updatedBy || createdBy);

            const created = await User.create({
                displayName: safeNombre,
                email: safeEmail,
                pinHash,
                pinLength: safePin.length,
                pinChangedAt: new Date(),
                status: activo ? "active" : "inactive",
                createdBy: actorId,
                updatedBy: actorId,
            });

            await recordAuditSafe({
                actorUserId: actorId,
                actorTenantId: null,
                module: AUDIT_MODULES.ACCESS,
                action: AUDIT_ACTIONS.USER_CREATED || "USER_CREATED",
                targetType: "USER",
                targetId: String(created._id),
                before: null,
                after: {
                    userId: String(created._id),
                    email: created.email,
                    displayName: created.displayName,
                    status: created.status,
                },
                diff: {
                    created: true,
                },
            });

            return usersReadRepository.findById(String(created._id));
        },

        async updateById(id, patch = {}) {
            const safeId = str(id);

            if (!safeId) {
                throw new Error("User ID is required");
            }

            if (!mongoose.Types.ObjectId.isValid(safeId)) {
                return null;
            }

            const beforeUser = await User.findById(safeId).lean().exec();

            if (!beforeUser) {
                return null;
            }

            const update = {};
            const actorId = resolveActorId(patch.updatedBy);

            if (typeof patch.nombre !== "undefined") {
                update.displayName = str(patch.nombre);
            }

            if (typeof patch.email !== "undefined") {
                update.email = str(patch.email).toLowerCase();
            }

            if (typeof patch.activo !== "undefined") {
                update.status = patch.activo ? "active" : "inactive";
            }

            if (typeof patch.pin !== "undefined" && str(patch.pin)) {
                const safePin = str(patch.pin);

                update.pinHash = await hashPin(safePin);
                update.pinLength = safePin.length;
                update.pinChangedAt = new Date();
                update.failedPinAttempts = 0;
                update.lockedUntil = null;
            }

            update.updatedBy = actorId;
            update.updatedAt = new Date();

            await User.findByIdAndUpdate(
                safeId,
                { $set: update },
                {
                    new: true,
                    runValidators: true,
                }
            ).exec();

            const afterUser = await User.findById(safeId).lean().exec();

            await recordAuditSafe({
                actorUserId: actorId,
                actorTenantId: null,
                module: AUDIT_MODULES.ACCESS,
                action: AUDIT_ACTIONS.USER_UPDATED || "USER_UPDATED",
                targetType: "USER",
                targetId: safeId,
                before: {
                    userId: safeId,
                    email: beforeUser.email,
                    displayName: beforeUser.displayName,
                    status: beforeUser.status,
                },
                after: {
                    userId: safeId,
                    email: afterUser?.email || "",
                    displayName: afterUser?.displayName || "",
                    status: afterUser?.status || "",
                },
                diff: {
                    fields: Object.keys(update).filter(
                        (field) => field !== "updatedAt"
                    ),
                },
            });

            return usersReadRepository.findById(safeId);
        },

        async softDeleteById(id, updatedBy = null) {
            const safeId = str(id);

            if (!safeId) {
                throw new Error("User ID is required");
            }

            if (!mongoose.Types.ObjectId.isValid(safeId)) {
                return null;
            }

            const actorId = resolveActorId(updatedBy);
            const beforeUser = await User.findById(safeId).lean().exec();

            if (!beforeUser) {
                return null;
            }

            await User.findByIdAndUpdate(
                safeId,
                {
                    $set: {
                        status: "inactive",
                        updatedBy: actorId,
                        updatedAt: new Date(),
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            ).exec();

            await recordAuditSafe({
                actorUserId: actorId,
                actorTenantId: null,
                module: AUDIT_MODULES.ACCESS,
                action: AUDIT_ACTIONS.USER_DEACTIVATED || "USER_DEACTIVATED",
                targetType: "USER",
                targetId: safeId,
                before: {
                    userId: safeId,
                    email: beforeUser.email,
                    displayName: beforeUser.displayName,
                    status: beforeUser.status,
                },
                after: {
                    userId: safeId,
                    email: beforeUser.email,
                    displayName: beforeUser.displayName,
                    status: "inactive",
                },
                diff: {
                    status: "inactive",
                },
            });

            return usersReadRepository.findById(safeId);
        },
    };
}