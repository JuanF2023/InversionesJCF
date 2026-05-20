// server/src/modules/corporativo/infrastructure/mongoose/models/permission.model.js
import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            trim: true,
            default: "",
        },
        group: {
            type: String,
            trim: true,
            default: "general",
            index: true,
        },
        module: {
            type: String,
            trim: true,
            default: "general",
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        type: {
            type: String,
            enum: ["admin", "operativo", "consulta"],
            default: "consulta",
            index: true,
        },
        active: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        collection: "permissions",
        timestamps: true,
    }
);

export const PermissionModel =
    mongoose.models.Permission ||
    mongoose.model("Permission", permissionSchema);

export default PermissionModel;