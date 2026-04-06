// server/src/modules/corporativo/infrastructure/orm/idea.model.js
import mongoose from "mongoose";

const IdeaSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        notes: { type: String, default: "" },
    },
    { timestamps: true }
);

export const Idea = mongoose.model("Idea", IdeaSchema);
