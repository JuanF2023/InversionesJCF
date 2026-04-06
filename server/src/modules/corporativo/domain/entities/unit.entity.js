// server/src/modules/corporativo/domain/entities/unit.entity.js

/**
 * Domain entity definition for a Unit.
 * This is a plain description of the business fields, independent from Mongoose.
 */
export const UNIT_STATUS = {
    AVAILABLE: "available",
    OCCUPIED: "occupied",
    RESERVED: "reserved",
    MAINTENANCE: "maintenance",
    OUT_OF_SERVICE: "out_of_service",
};

export const UNIT_USE = {
    RESIDENTIAL: "residential",
    COMMERCIAL: "commercial",
    MIXED: "mixed",
    OTHER: "other",
};

/**
 * Minimal validator / factory (can grow later).
 */
export function buildUnitPayload(input) {
    const now = new Date();

    return {
        tenantId: input.tenantId,               // must come from auth / context
        propertyId: input.propertyId,
        businessId: input.businessId || null,

        code: input.code?.trim(),
        name: input.name?.trim(),

        use: input.use || UNIT_USE.OTHER,
        unitType: input.unitType || null,
        level: input.level || null,
        doorNumber: input.doorNumber || null,

        builtAreaM2: input.builtAreaM2 ?? null,
        usableAreaM2: input.usableAreaM2 ?? null,
        capacityPeople: input.capacityPeople ?? null,

        baseRentMonthly: input.baseRentMonthly ?? 0,
        currency: input.currency || "USD",
        includesTaxes: Boolean(input.includesTaxes),
        fixedMonthlyExpenses: input.fixedMonthlyExpenses ?? 0,
        economicNotes: input.economicNotes || null,

        status: input.status || UNIT_STATUS.AVAILABLE,
        lastStatusChangeAt: input.lastStatusChangeAt || now,

        notes: input.notes || null,
        active: input.active ?? true,

        // metadata will be completed in use cases
    };
}
