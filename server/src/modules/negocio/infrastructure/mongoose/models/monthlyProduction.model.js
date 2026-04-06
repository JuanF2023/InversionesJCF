// server/src/modules/corporativo/infrastructure/orm/monthlyProduction.model.js
import mongoose from "mongoose";

const MonthlyProductionSchema = new mongoose.Schema(
    {
        month: { type: Number, min: 1, max: 12, required: true },
        year: { type: Number, required: true },
        amount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export const MonthlyProduction = mongoose.model("MonthlyProduction", MonthlyProductionSchema);
