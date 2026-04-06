import mongoose from "mongoose";
import dotenv from "dotenv";

import catalogo-negociosSeed from "./catalogos_negocios.seed.js";
import CatalogoModel from "../models/catalog.model.js";

dotenv.config();

/**
 * Transforma seed plano (category, subcategory, business_type)
 * en estructura jerárquica compatible con catalogo-negociosSchema
 */
function buildHierarchicalCatalog(flatSeed) {
    const categories = flatSeed.filter(i => i.type === "category");
    const subcategories = flatSeed.filter(i => i.type === "subcategory");
    const businessTypes = flatSeed.filter(i => i.type === "business_type");

    return categories.map(cat => {
        const catSubcategories = subcategories
            .filter(sub => sub.parentKey === cat.key)
            .map(sub => {
                const tipos = businessTypes
                    .filter(bt => bt.parentKey === sub.key)
                    .map(bt => ({
                        codigo: bt.key.toUpperCase(),
                        nombre: bt.label,
                        activo: true,
                        orden: bt.order || 0
                    }));

                return {
                    codigo: sub.key.toUpperCase(),
                    nombre: sub.label,
                    activo: true,
                    orden: sub.order || 0,
                    tipos
                };
            });

        return {
            tenantId: "CORPORATIVO",
            codigo: cat.key.toUpperCase(),
            nombre: cat.label,
            activo: true,
            orden: cat.order || 0,
            subcategorias: catSubcategories,
            creadoPor: "seed",
            actualizadoPor: "seed"
        };
    });
}

async function run() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI no está definido en .env");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("�?Mongo conectado");

        // Transformar estructura
        const hierarchicalData = buildHierarchicalCatalog(catalogo-negociosSeed);

        // Limpiar colección
        await CatalogoModel.deleteMany({});
        console.log("🧹 Catálogo limpiado");

        // Insertar datos transformados
        await CatalogoModel.insertMany(hierarchicalData);
        console.log("🚀 Seed ejecutado correctamente");

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error("�?Error ejecutando seed:", error);
        await mongoose.disconnect();
        process.exit(1);
    }
}

run();

