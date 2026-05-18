// server/src/modules/corporativo/infrastructure/repositories/users/users-access.repository.mongo.js

import mongoose from "mongoose";

import { User } from "#modules/auth/infrastructure/mongoose/models/user.model.js";
import { Membership } from "#modules/auth/infrastructure/mongoose/models/membership.model.js";
import { Role } from "#modules/roles/infrastructure/mongoose/models/role.model.js";
import { Tenant } from "#modules/tenants/infrastructure/mongoose/models/tenant.model.js";

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

export function buildUsersAccessRepositoryMongo({ usersReadRepository }) {
    return {
        async getAccessOptions() {
            const [tenants, roles] = await Promise.all([
                Tenant.find({ status: "active" }).lean().exec(),
                Role.find({ status: "active" }).lean().exec(),
            ]);

            return {
                tenants,
                roles,
            };
        },

        async upsertAccessByUserId(
            userId,
            {
                tenantId,
                roleId,
                status = "active",
                createdBy = null,
                updatedBy = null,
            }
        ) {
            const safeUserId = str(userId);
            const safeTenantId = str(tenantId);
            const safeRoleId = str(roleId);

            if (!safeUserId) {
                throw new Error("User ID is required");
            }

            if (!safeTenantId) {
                throw new Error("Tenant ID is required");
            }

            if (!safeRoleId) {
                throw new Error("Role ID is required");
            }

            const user = await User.findById(safeUserId).lean().exec();

            if (!user) {
                return null;
            }

            const tenant = await Tenant.findById(safeTenantId).lean().exec();

            if (!tenant) {
                throw new Error(`Tenant not found: ${safeTenantId}`);
            }

            const role = await Role.findById(safeRoleId).lean().exec();

            if (!role) {
                throw new Error(`Role not found: ${safeRoleId}`);
            }

            const userObjectId = new mongoose.Types.ObjectId(safeUserId);
            const tenantObjectId = new mongoose.Types.ObjectId(safeTenantId);
            const roleObjectId = new mongoose.Types.ObjectId(safeRoleId);

            const now = new Date();
            const actorId = updatedBy || createdBy || null;

            const beforeMembership = await Membership.findOne({
                userId: userObjectId,
                tenantId: tenantObjectId,
            })
                .lean()
                .exec();

            await Membership.updateOne(
                {
                    userId: userObjectId,
                    tenantId: tenantObjectId,
                },
                {
                    $set: {
                        userId: userObjectId,
                        tenantId: tenantObjectId,
                        roleId: roleObjectId,
                        roleKey: role.key || "",
                        tenantKey: tenant.key || "",
                        status,
                        updatedAt: now,
                        updatedBy: actorId,
                    },
                    $setOnInsert: {
                        createdAt: now,
                        createdBy: actorId,
                    },
                },
                {
                    upsert: true,
                }
            ).exec();

            const afterMembership = await Membership.findOne({
                userId: userObjectId,
                tenantId: tenantObjectId,
            })
                .lean()
                .exec();

            await recordAuditSafe({
                actorUserId: resolveActorId(actorId),
                actorTenantId: safeTenantId,
                module: AUDIT_MODULES.ACCESS,
                action: AUDIT_ACTIONS.ACCESS_ASSIGNED,
                targetType: "MEMBERSHIP",
                targetId: afterMembership?._id
                    ? String(afterMembership._id)
                    : safeUserId,
                before: beforeMembership,
                after: {
                    membershipId: afterMembership?._id
                        ? String(afterMembership._id)
                        : null,
                    userId: safeUserId,
                    userEmail: user.email || "",
                    tenantId: safeTenantId,
                    tenantKey: tenant.key || "",
                    tenantName: tenant.name || "",
                    roleId: safeRoleId,
                    roleKey: role.key || "",
                    roleName: role.name || "",
                    status,
                },
                diff: {
                    tenantId: safeTenantId,
                    roleId: safeRoleId,
                    status,
                },
            });

            return usersReadRepository.findById(safeUserId);
        },

        async deactivateAccessByMembershipId(
            userId,
            membershipId,
            { updatedBy = null } = {}
        ) {
            const safeUserId = str(userId);
            const safeMembershipId = str(membershipId);

            if (!safeUserId) {
                throw new Error("User ID is required");
            }

            if (!safeMembershipId) {
                throw new Error("Membership ID is required");
            }

            const beforeMembership = await Membership.findById(safeMembershipId)
                .lean()
                .exec();

            if (!beforeMembership) {
                return null;
            }

            await Membership.findByIdAndUpdate(
                safeMembershipId,
                {
                    status: "inactive",
                    updatedAt: new Date(),
                    updatedBy: updatedBy || null,
                },
                {
                    new: true,
                }
            ).exec();

            await recordAuditSafe({
                actorUserId: resolveActorId(updatedBy),
                actorTenantId: beforeMembership.tenantId || null,
                module: AUDIT_MODULES.ACCESS,
                action: AUDIT_ACTIONS.ACCESS_REVOKED || "ACCESS_REVOKED",
                targetType: "MEMBERSHIP",
                targetId: safeMembershipId,
                before: beforeMembership,
                after: {
                    ...beforeMembership,
                    status: "inactive",
                    updatedBy: updatedBy || null,
                },
                diff: {
                    status: "inactive",
                },
            });

            return usersReadRepository.findById(safeUserId);
        },
    };
}