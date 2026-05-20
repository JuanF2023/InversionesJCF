// server/src/modules/corporativo/infrastructure/repositories/permissions.repository.js
import { PermissionModel } from "#modules/corporativo/infrastructure/mongoose/models/permission.model.js";

export const PermissionsRepository = {
    async findAll() {
        return PermissionModel.find().lean();
    },
};