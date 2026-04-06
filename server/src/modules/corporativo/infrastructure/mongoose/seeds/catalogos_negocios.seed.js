// server/src/modules/corporativo/infrastructure/mongoose/seeds/catalogos_negocios.seed.js

/**
 * Manual de Clasificación de Negocios �?Inversiones JCF v1.1 (Enterprise)
 * Fecha: 2026-02-11
 *
 * Estructura:
 * - category (Nivel 1)       parentKey: null
 * - subcategory (Nivel 2)    parentKey: <category.key>
 * - business_type (Nivel 3)  parentKey: <subcategory.key>
 *
 * Reglas Enterprise (v1.1):
 * 1) Un "business_type" vive en UN solo lugar oficial (un solo parentKey).
 * 2) Lo transversal se modela con:
 *    - tags: capacidades (produce, retail, service, delivery, b2b, events, etc.)
 *    - scope: "b2c" | "b2b" | "mixed"
 *    - synonyms: strings para búsquedas / UX
 *
 * Gobernanza:
 * - system: true  => catálogo oficial (no editable por usuarios)
 * - active: true  => habilitado
 */

const META = Object.freeze({
    version: "1.1",
    fecha: "2026-02-11",
    governance: {
        rule_single_parent_for_type: true,
        rule_cross_cutting_with_tags: true,
    },
    tagsCatalog: [
        "service",
        "retail",
        "produce",
        "manufacturing",
        "delivery",
        "events",
        "b2b",
        "b2c",
        "mixed",
        "installation",
        "maintenance",
        "professional",
        "creative",
        "logistics",
        "tourism",
        "education",
        "health",
        "tech",
        "real_estate",
        "energy",
        "construction",
    ],
});

/** Helpers enterprise */
const asStr = (v) => String(v ?? "").trim();
const VALID_TYPES = new Set([
    "meta",
    "category",
    "subcategory",
    "business_type",
]);

function item({
    key,
    type,
    label,
    parentKey = null,
    order = 0,
    active = true,
    system = true,
    tags = [],
    scope = "mixed",
    synonyms = [],
    meta = undefined,
}) {

    if (!VALID_TYPES.has(type)) {
        throw new Error(`Invalid catalog type: ${type}`);
    }

    return {
        key: asStr(key),
        type,
        label: asStr(label),
        parentKey: parentKey == null ? null : asStr(parentKey),
        order: Number(order) || 0,
        active: Boolean(active),
        system: Boolean(system),
        tags: Array.isArray(tags) ? tags.filter(Boolean) : [],
        scope: asStr(scope) || "mixed",
        synonyms: Array.isArray(synonyms)
            ? synonyms.filter(Boolean).map(asStr)
            : [],
        ...(meta ? { meta } : {}),
    };
}


export const catalogo-negociosSeed = [
    /* =========================================================
       📊 META / CONTROL
    ========================================================= */
    item({
        key: "catalogo_negocios_v1_1",
        type: "meta",
        label: "Manual de Clasificación de Negocios �?Inversiones JCF v1.1",
        parentKey: null,
        order: 0,
        tags: [],
        scope: "mixed",
        meta: META,
    }),

    /* =========================================================
       🟦 NIVEL 1 �?CATEGORÍAS (17)
    ========================================================= */
    item({ key: "comunicacion_marketing", type: "category", label: "Comunicación / Marketing", order: 1 }),
    item({ key: "restaurantes", type: "category", label: "Restaurantes", order: 2 }),
    item({ key: "manufactura", type: "category", label: "Manufactura", order: 3 }),
    item({ key: "retail_comercio", type: "category", label: "Retail / Comercio", order: 4 }),
    item({ key: "servicios", type: "category", label: "Servicios", order: 5 }),
    item({ key: "transporte", type: "category", label: "Transporte", order: 6 }),
    item({ key: "turismo", type: "category", label: "Turismo", order: 7 }),
    item({ key: "educacion", type: "category", label: "Educación", order: 8 }),
    item({ key: "salud", type: "category", label: "Salud", order: 9 }),
    item({ key: "tecnologia", type: "category", label: "Tecnología", order: 10 }),
    item({ key: "agroindustria", type: "category", label: "Agroindustria", order: 11 }),
    item({ key: "finanzas", type: "category", label: "Finanzas", order: 12 }),
    item({ key: "inmobiliario", type: "category", label: "Inmobiliario", order: 13 }),
    item({ key: "energia_servicios_basicos", type: "category", label: "Energía y Servicios Básicos", order: 14 }),
    item({ key: "entretenimiento_deporte", type: "category", label: "Entretenimiento y Deporte", order: 15 }),
    item({ key: "organizaciones_otros", type: "category", label: "Organizaciones / Otros", order: 16 }),
    item({ key: "construccion", type: "category", label: "Construcción", order: 17 }),

    /* =========================================================
       🟨 CATEGORÍA 1 �?COMUNICACIÓN / MARKETING
    ========================================================= */
    item({ key: "cm_publicidad_campanas", type: "subcategory", label: "Publicidad y campañas", parentKey: "comunicacion_marketing", order: 1 }),
    item({ key: "cm_marketing_digital_performance", type: "subcategory", label: "Marketing digital (performance)", parentKey: "comunicacion_marketing", order: 2 }),
    item({ key: "cm_branding_identidad", type: "subcategory", label: "Branding e identidad", parentKey: "comunicacion_marketing", order: 3 }),
    item({ key: "cm_produccion_audiovisual_contenido", type: "subcategory", label: "Producción audiovisual y contenido", parentKey: "comunicacion_marketing", order: 4 }),
    item({ key: "cm_redes_sociales_community", type: "subcategory", label: "Redes sociales y community (operación)", parentKey: "comunicacion_marketing", order: 5 }),
    item({ key: "cm_medios_relaciones_publicas", type: "subcategory", label: "Medios y relaciones públicas", parentKey: "comunicacion_marketing", order: 6 }),

    // Tipos
    item({ key: "cm_agencia_publicidad", type: "business_type", label: "Agencia de publicidad", parentKey: "cm_publicidad_campanas", order: 1, tags: ["service", "creative"], scope: "b2b" }),
    item({ key: "cm_gestion_campanas_atl_btl", type: "business_type", label: "Gestión de campañas (ATL/BTL)", parentKey: "cm_publicidad_campanas", order: 2, tags: ["service", "creative"], scope: "b2b" }),
    item({ key: "cm_medios_tradicionales", type: "business_type", label: "Medios tradicionales (radio/prensa/TV)", parentKey: "cm_publicidad_campanas", order: 3, tags: ["service"], scope: "b2b" }),
    item({ key: "cm_publicidad_exterior", type: "business_type", label: "Publicidad exterior (vallas/mupis)", parentKey: "cm_publicidad_campanas", order: 4, tags: ["service"], scope: "b2b" }),
    item({ key: "cm_promociones_activaciones", type: "business_type", label: "Promociones y activaciones", parentKey: "cm_publicidad_campanas", order: 5, tags: ["service", "events"], scope: "b2b" }),

    item({ key: "cm_agencia_marketing_digital", type: "business_type", label: "Agencia de marketing digital", parentKey: "cm_marketing_digital_performance", order: 1, tags: ["service", "tech"], scope: "b2b" }),
    item({ key: "cm_paid_media", type: "business_type", label: "Paid Media (Meta/Google/TikTok Ads)", parentKey: "cm_marketing_digital_performance", order: 2, tags: ["service", "tech"], scope: "b2b" }),
    item({ key: "cm_seo_posicionamiento", type: "business_type", label: "SEO / posicionamiento orgánico", parentKey: "cm_marketing_digital_performance", order: 3, tags: ["service", "tech"], scope: "b2b" }),
    item({ key: "cm_email_marketing_automatizacion", type: "business_type", label: "Email marketing / automatización", parentKey: "cm_marketing_digital_performance", order: 4, tags: ["service", "tech"], scope: "b2b" }),
    item({ key: "cm_growth_performance_marketing", type: "business_type", label: "Growth / performance marketing", parentKey: "cm_marketing_digital_performance", order: 5, tags: ["service", "tech"], scope: "b2b" }),

    item({ key: "cm_branding_estrategico", type: "business_type", label: "Branding estratégico", parentKey: "cm_branding_identidad", order: 1, tags: ["service", "creative"], scope: "b2b" }),
    item({ key: "cm_identidad_visual_manual_marca", type: "business_type", label: "Identidad visual / manual de marca", parentKey: "cm_branding_identidad", order: 2, tags: ["service", "creative"], scope: "b2b" }),
    item({ key: "cm_naming_storytelling", type: "business_type", label: "Naming y storytelling", parentKey: "cm_branding_identidad", order: 3, tags: ["service", "creative"], scope: "b2b" }),
    item({ key: "cm_packaging_etiqueta_producto", type: "business_type", label: "Packaging y etiqueta de producto", parentKey: "cm_branding_identidad", order: 4, tags: ["service", "creative"], scope: "b2b" }),
    item({ key: "cm_rebranding_reposicionamiento", type: "business_type", label: "Rebranding / reposicionamiento", parentKey: "cm_branding_identidad", order: 5, tags: ["service", "creative"], scope: "b2b" }),

    item({ key: "cm_productora_audiovisual", type: "business_type", label: "Productora audiovisual", parentKey: "cm_produccion_audiovisual_contenido", order: 1, tags: ["service", "creative"], scope: "b2b" }),
    item({ key: "cm_fotografia_comercial", type: "business_type", label: "Fotografía comercial", parentKey: "cm_produccion_audiovisual_contenido", order: 2, tags: ["service", "creative"], scope: "b2b" }),
    item({ key: "cm_video_comercial_corporativo", type: "business_type", label: "Video comercial / corporativo", parentKey: "cm_produccion_audiovisual_contenido", order: 3, tags: ["service", "creative"], scope: "b2b" }),
    item({ key: "cm_animacion_motion_graphics", type: "business_type", label: "Animación / motion graphics", parentKey: "cm_produccion_audiovisual_contenido", order: 4, tags: ["service", "creative"], scope: "b2b" }),
    item({ key: "cm_produccion_redes_short_form", type: "business_type", label: "Producción para redes (short-form)", parentKey: "cm_produccion_audiovisual_contenido", order: 5, tags: ["service", "creative"], scope: "b2b" }),

    item({ key: "cm_community_management", type: "business_type", label: "Community management", parentKey: "cm_redes_sociales_community", order: 1, tags: ["service", "tech"], scope: "b2b" }),
    item({ key: "cm_gestion_redes_calendario_publicacion", type: "business_type", label: "Gestión de redes sociales (calendario + publicación)", parentKey: "cm_redes_sociales_community", order: 2, tags: ["service", "tech"], scope: "b2b" }),
    item({ key: "cm_moderacion_atencion_redes", type: "business_type", label: "Moderación / atención en redes", parentKey: "cm_redes_sociales_community", order: 3, tags: ["service", "tech"], scope: "b2b" }),
    item({ key: "cm_influencer_marketing_gestion", type: "business_type", label: "Influencer marketing (gestión)", parentKey: "cm_redes_sociales_community", order: 4, tags: ["service", "tech"], scope: "b2b" }),
    item({ key: "cm_contenido_ugc_gestion_curacion", type: "business_type", label: "Contenido UGC (gestión/curación)", parentKey: "cm_redes_sociales_community", order: 5, tags: ["service", "tech"], scope: "b2b" }),

    item({ key: "cm_relaciones_publicas_pr", type: "business_type", label: "Relaciones públicas (PR)", parentKey: "cm_medios_relaciones_publicas", order: 1, tags: ["service", "professional"], scope: "b2b" }),
    item({ key: "cm_gestion_prensa_notas_cobertura", type: "business_type", label: "Gestión de prensa / notas y cobertura", parentKey: "cm_medios_relaciones_publicas", order: 2, tags: ["service", "professional"], scope: "b2b" }),
    item({ key: "cm_comunicacion_corporativa", type: "business_type", label: "Comunicación corporativa", parentKey: "cm_medios_relaciones_publicas", order: 3, tags: ["service", "professional"], scope: "b2b" }),
    item({ key: "cm_manejo_crisis_reputacional", type: "business_type", label: "Manejo de crisis reputacional", parentKey: "cm_medios_relaciones_publicas", order: 4, tags: ["service", "professional"], scope: "b2b" }),
    item({ key: "cm_eventos_prensa_lanzamientos", type: "business_type", label: "Eventos de prensa / lanzamientos", parentKey: "cm_medios_relaciones_publicas", order: 5, tags: ["service", "events"], scope: "b2b" }),

    /* =========================================================
       🟨 CATEGORÍA 2 �?RESTAURANTES
       (B2C por defecto; lo B2B va en Manufactura con keys B2B)
    ========================================================= */
    item({ key: "r_restaurante_tradicional", type: "subcategory", label: "Restaurante tradicional", parentKey: "restaurantes", order: 1 }),
    item({ key: "r_comida_rapida", type: "subcategory", label: "Comida rápida", parentKey: "restaurantes", order: 2 }),
    item({ key: "r_panaderia_reposteria", type: "subcategory", label: "Panadería y repostería", parentKey: "restaurantes", order: 3 }),
    item({ key: "r_cafeteria", type: "subcategory", label: "Cafetería", parentKey: "restaurantes", order: 4 }),
    item({ key: "r_bebidas", type: "subcategory", label: "Bebidas", parentKey: "restaurantes", order: 5 }),
    item({ key: "r_cocina_oculta_delivery", type: "subcategory", label: "Cocina oculta / delivery", parentKey: "restaurantes", order: 6 }),
    item({ key: "r_servicio_movil", type: "subcategory", label: "Servicio móvil", parentKey: "restaurantes", order: 7 }),
    item({ key: "r_catering_eventos", type: "subcategory", label: "Catering y eventos", parentKey: "restaurantes", order: 8 }),

    // Restaurante tradicional
    item({ key: "r_rest_comida_tipica", type: "business_type", label: "Restaurante de comida típica", parentKey: "r_restaurante_tradicional", order: 1, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_rest_familiar", type: "business_type", label: "Restaurante familiar", parentKey: "r_restaurante_tradicional", order: 2, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_rest_formal", type: "business_type", label: "Restaurante formal", parentKey: "r_restaurante_tradicional", order: 3, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_rest_casual_dining", type: "business_type", label: "Restaurante casual dining", parentKey: "r_restaurante_tradicional", order: 4, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_rest_gourmet", type: "business_type", label: "Restaurante gourmet", parentKey: "r_restaurante_tradicional", order: 5, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_rest_popular", type: "business_type", label: "Restaurante popular", parentKey: "r_restaurante_tradicional", order: 6, tags: ["service", "b2c"], scope: "b2c" }),

    // Comida rápida
    item({ key: "r_hamburgueseria", type: "business_type", label: "Hamburguesería", parentKey: "r_comida_rapida", order: 1, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_taqueria", type: "business_type", label: "Taquería", parentKey: "r_comida_rapida", order: 2, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_pupuseria", type: "business_type", label: "Pupusería", parentKey: "r_comida_rapida", order: 3, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_polleria", type: "business_type", label: "Pollería", parentKey: "r_comida_rapida", order: 4, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_hot_dogs_snacks", type: "business_type", label: "Hot dogs / snacks", parentKey: "r_comida_rapida", order: 5, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_pizza_rapida", type: "business_type", label: "Pizza rápida", parentKey: "r_comida_rapida", order: 6, tags: ["service", "b2c"], scope: "b2c" }),

    // Panadería y repostería (B2C). Importante: NO se duplica en Manufactura.
    item({
        key: "r_panaderia_artesanal",
        type: "business_type",
        label: "Panadería artesanal",
        parentKey: "r_panaderia_reposteria",
        order: 1,
        tags: ["service", "retail", "b2c"],
        scope: "b2c",
        synonyms: ["panadería", "pan dulce"],
    }),
    item({
        key: "r_panaderia_industrial_pequena",
        type: "business_type",
        label: "Panadería industrial pequeña",
        parentKey: "r_panaderia_reposteria",
        order: 2,
        tags: ["service", "retail", "b2c"],
        scope: "b2c",
        synonyms: ["producción pequeña", "panificación"],
    }),
    item({ key: "r_reposteria", type: "business_type", label: "Repostería", parentKey: "r_panaderia_reposteria", order: 3, tags: ["service", "retail", "b2c"], scope: "b2c" }),
    item({ key: "r_pasteleria", type: "business_type", label: "Pastelería", parentKey: "r_panaderia_reposteria", order: 4, tags: ["service", "retail", "b2c"], scope: "b2c" }),
    item({ key: "r_panaderia_con_cafeteria", type: "business_type", label: "Panadería con cafetería", parentKey: "r_panaderia_reposteria", order: 5, tags: ["service", "retail", "b2c"], scope: "b2c" }),

    // Cafetería
    item({ key: "r_cafeteria_tradicional", type: "business_type", label: "Cafetería tradicional", parentKey: "r_cafeteria", order: 1, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_coffee_shop", type: "business_type", label: "Coffee shop", parentKey: "r_cafeteria", order: 2, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_cafeteria_con_panaderia", type: "business_type", label: "Cafetería con panadería", parentKey: "r_cafeteria", order: 3, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_cafeteria_especialidad", type: "business_type", label: "Cafetería de especialidad", parentKey: "r_cafeteria", order: 4, tags: ["service", "b2c"], scope: "b2c" }),

    // Bebidas
    item({ key: "r_jugueria", type: "business_type", label: "Juguería", parentKey: "r_bebidas", order: 1, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_licuados_smoothies", type: "business_type", label: "Licuados y smoothies", parentKey: "r_bebidas", order: 2, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_bar_sin_comida", type: "business_type", label: "Bar sin comida", parentKey: "r_bebidas", order: 3, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_cerveceria_artesanal_taproom", type: "business_type", label: "Cervecería artesanal (taproom)", parentKey: "r_bebidas", order: 4, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_bebidas_para_llevar", type: "business_type", label: "Bebidas para llevar", parentKey: "r_bebidas", order: 5, tags: ["service", "delivery", "b2c"], scope: "b2c" }),

    // Cocina oculta / delivery
    item({ key: "r_dark_kitchen", type: "business_type", label: "Dark kitchen", parentKey: "r_cocina_oculta_delivery", order: 1, tags: ["service", "delivery"], scope: "mixed" }),
    item({ key: "r_cocina_delivery", type: "business_type", label: "Cocina de delivery", parentKey: "r_cocina_oculta_delivery", order: 2, tags: ["service", "delivery"], scope: "mixed" }),
    item({ key: "r_marca_virtual", type: "business_type", label: "Marca virtual", parentKey: "r_cocina_oculta_delivery", order: 3, tags: ["service", "delivery"], scope: "mixed" }),
    item({ key: "r_cocina_compartida", type: "business_type", label: "Cocina compartida", parentKey: "r_cocina_oculta_delivery", order: 4, tags: ["service", "delivery"], scope: "mixed" }),

    // Servicio móvil
    item({ key: "r_food_truck", type: "business_type", label: "Food truck", parentKey: "r_servicio_movil", order: 1, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_carrito_comida", type: "business_type", label: "Carrito de comida", parentKey: "r_servicio_movil", order: 2, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_puesto_movil", type: "business_type", label: "Puesto móvil", parentKey: "r_servicio_movil", order: 3, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "r_catering_movil", type: "business_type", label: "Catering móvil", parentKey: "r_servicio_movil", order: 4, tags: ["service", "events"], scope: "mixed" }),

    // Catering y eventos
    item({ key: "r_catering_corporativo", type: "business_type", label: "Catering corporativo", parentKey: "r_catering_eventos", order: 1, tags: ["service", "events", "b2b"], scope: "b2b" }),
    item({ key: "r_catering_social", type: "business_type", label: "Catering social", parentKey: "r_catering_eventos", order: 2, tags: ["service", "events"], scope: "mixed" }),
    item({ key: "r_banquetes", type: "business_type", label: "Banquetes", parentKey: "r_catering_eventos", order: 3, tags: ["service", "events"], scope: "mixed" }),
    item({ key: "r_eventos_privados", type: "business_type", label: "Eventos privados", parentKey: "r_catering_eventos", order: 4, tags: ["service", "events"], scope: "mixed" }),

    /* =========================================================
       🟨 CATEGORÍA 3 �?MANUFACTURA
       (aquí van los equivalentes B2B para evitar duplicados)
    ========================================================= */
    item({ key: "m_alimentos", type: "subcategory", label: "Alimentos", parentKey: "manufactura", order: 1 }),
    item({ key: "m_bebidas", type: "subcategory", label: "Bebidas", parentKey: "manufactura", order: 2 }),
    item({ key: "m_textil_confeccion", type: "subcategory", label: "Textil y confección", parentKey: "manufactura", order: 3 }),
    item({ key: "m_madera_muebles", type: "subcategory", label: "Madera y muebles", parentKey: "manufactura", order: 4 }),
    item({ key: "m_metal_mecanica", type: "subcategory", label: "Metal y mecánica", parentKey: "manufactura", order: 5 }),
    item({ key: "m_artesanal", type: "subcategory", label: "Artesanal", parentKey: "manufactura", order: 6 }),
    item({ key: "m_construccion_ligera", type: "subcategory", label: "Construcción ligera", parentKey: "manufactura", order: 7 }),

    // Alimentos (B2B)
    item({
        key: "m_panaderia_b2b",
        type: "business_type",
        label: "Panadería (producción para terceros)",
        parentKey: "m_alimentos",
        order: 1,
        tags: ["manufacturing", "produce", "b2b"],
        scope: "b2b",
        synonyms: ["panadería industrial", "producción panadera"],
    }),
    item({
        key: "m_pasteleria_b2b",
        type: "business_type",
        label: "Pastelería (producción para terceros)",
        parentKey: "m_alimentos",
        order: 2,
        tags: ["manufacturing", "produce", "b2b"],
        scope: "b2b",
    }),
    item({ key: "m_tortilleria", type: "business_type", label: "Tortillería", parentKey: "m_alimentos", order: 3, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_fabrica_alimentos_preparados", type: "business_type", label: "Fábrica de alimentos preparados", parentKey: "m_alimentos", order: 4, tags: ["manufacturing", "produce", "b2b"], scope: "b2b" }),
    item({ key: "m_produccion_comida_b2b", type: "business_type", label: "Producción de comida para terceros (B2B)", parentKey: "m_alimentos", order: 5, tags: ["manufacturing", "produce", "b2b"], scope: "b2b" }),

    // Bebidas
    item({ key: "m_fabrica_bebidas_naturales", type: "business_type", label: "Fábrica de bebidas naturales", parentKey: "m_bebidas", order: 1, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_fabrica_jugos", type: "business_type", label: "Fábrica de jugos", parentKey: "m_bebidas", order: 2, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_cerveceria_artesanal", type: "business_type", label: "Cervecería artesanal (producción)", parentKey: "m_bebidas", order: 3, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_produccion_bebidas_embotelladas", type: "business_type", label: "Producción de bebidas embotelladas", parentKey: "m_bebidas", order: 4, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_produccion_agua_purificada", type: "business_type", label: "Producción de agua purificada", parentKey: "m_bebidas", order: 5, tags: ["manufacturing", "produce"], scope: "mixed" }),

    // Textil
    item({ key: "m_taller_costura", type: "business_type", label: "Taller de costura", parentKey: "m_textil_confeccion", order: 1, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_taller_confeccion", type: "business_type", label: "Taller de confección", parentKey: "m_textil_confeccion", order: 2, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_produccion_uniformes", type: "business_type", label: "Producción de uniformes", parentKey: "m_textil_confeccion", order: 3, tags: ["manufacturing", "produce", "b2b"], scope: "b2b" }),
    item({ key: "m_produccion_ropa_artesanal", type: "business_type", label: "Producción de ropa artesanal", parentKey: "m_textil_confeccion", order: 4, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_produccion_calzado", type: "business_type", label: "Producción de calzado", parentKey: "m_textil_confeccion", order: 5, tags: ["manufacturing", "produce"], scope: "mixed" }),

    // Madera
    item({ key: "m_carpinteria", type: "business_type", label: "Carpintería (producción)", parentKey: "m_madera_muebles", order: 1, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_fabrica_muebles", type: "business_type", label: "Fábrica de muebles", parentKey: "m_madera_muebles", order: 2, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_taller_muebles_medida", type: "business_type", label: "Taller de muebles a medida", parentKey: "m_madera_muebles", order: 3, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_produccion_puertas_ventanas", type: "business_type", label: "Producción de puertas y ventanas", parentKey: "m_madera_muebles", order: 4, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_ebanisteria", type: "business_type", label: "Ebanistería", parentKey: "m_madera_muebles", order: 5, tags: ["manufacturing", "produce"], scope: "mixed" }),

    // Metal/mecánica
    item({ key: "m_taller_metalurgico", type: "business_type", label: "Taller metalúrgico", parentKey: "m_metal_mecanica", order: 1, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_soldadura", type: "business_type", label: "Soldadura", parentKey: "m_metal_mecanica", order: 2, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_fabricacion_estructuras", type: "business_type", label: "Fabricación de estructuras", parentKey: "m_metal_mecanica", order: 3, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_taller_mecanico_industrial", type: "business_type", label: "Taller mecánico industrial", parentKey: "m_metal_mecanica", order: 4, tags: ["manufacturing", "maintenance", "b2b"], scope: "b2b" }),
    item({ key: "m_fabricacion_piezas", type: "business_type", label: "Fabricación de piezas", parentKey: "m_metal_mecanica", order: 5, tags: ["manufacturing", "produce"], scope: "mixed" }),

    // Artesanal
    item({ key: "m_artesanias", type: "business_type", label: "Artesanías", parentKey: "m_artesanal", order: 1, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_produccion_manual_alimentos", type: "business_type", label: "Producción manual de alimentos", parentKey: "m_artesanal", order: 2, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_velas_artesanales", type: "business_type", label: "Velas artesanales", parentKey: "m_artesanal", order: 3, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_jabones_artesanales", type: "business_type", label: "Jabones artesanales", parentKey: "m_artesanal", order: 4, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "m_productos_hechos_mano", type: "business_type", label: "Productos hechos a mano", parentKey: "m_artesanal", order: 5, tags: ["manufacturing", "produce"], scope: "mixed" }),

    // Construcción ligera
    item({ key: "m_prefabricados_pequenos", type: "business_type", label: "Prefabricados pequeños", parentKey: "m_construccion_ligera", order: 1, tags: ["manufacturing", "produce", "construction"], scope: "mixed" }),
    item({ key: "m_bloquera", type: "business_type", label: "Bloquera", parentKey: "m_construccion_ligera", order: 2, tags: ["manufacturing", "produce", "construction"], scope: "mixed" }),
    item({ key: "m_produccion_adoquines", type: "business_type", label: "Producción de adoquines", parentKey: "m_construccion_ligera", order: 3, tags: ["manufacturing", "produce", "construction"], scope: "mixed" }),
    item({ key: "m_elementos_concreto", type: "business_type", label: "Producción de elementos de concreto", parentKey: "m_construccion_ligera", order: 4, tags: ["manufacturing", "produce", "construction"], scope: "mixed" }),
    item({ key: "m_taller_estructuras_ligeras", type: "business_type", label: "Taller de estructuras ligeras", parentKey: "m_construccion_ligera", order: 5, tags: ["manufacturing", "produce", "construction"], scope: "mixed" }),

    /* =========================================================
       🟨 CATEGORÍA 4 �?RETAIL / COMERCIO
    ========================================================= */
    item({ key: "rt_alimentos_bebidas", type: "subcategory", label: "Alimentos y bebidas", parentKey: "retail_comercio", order: 1 }),
    item({ key: "rt_moda_accesorios", type: "subcategory", label: "Moda y accesorios", parentKey: "retail_comercio", order: 2 }),
    item({ key: "rt_hogar_ferreteria", type: "subcategory", label: "Hogar y ferretería", parentKey: "retail_comercio", order: 3 }),
    item({ key: "rt_tecnologia_electronicos", type: "subcategory", label: "Tecnología y electrónicos", parentKey: "retail_comercio", order: 4 }),
    item({ key: "rt_salud_cuidado_personal", type: "subcategory", label: "Salud y cuidado personal", parentKey: "retail_comercio", order: 5 }),
    item({ key: "rt_automotriz", type: "subcategory", label: "Automotriz", parentKey: "retail_comercio", order: 6 }),
    item({ key: "rt_miscelaneo_general", type: "subcategory", label: "Misceláneo / general", parentKey: "retail_comercio", order: 7 }),

    item({ key: "rt_tienda_abarrotes", type: "business_type", label: "Tienda de abarrotes", parentKey: "rt_alimentos_bebidas", order: 1, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_mini_super", type: "business_type", label: "Mini súper", parentKey: "rt_alimentos_bebidas", order: 2, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_tienda_conveniencia", type: "business_type", label: "Tienda de conveniencia", parentKey: "rt_alimentos_bebidas", order: 3, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_licoreria", type: "business_type", label: "Licorería", parentKey: "rt_alimentos_bebidas", order: 4, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_venta_bebidas_embotelladas", type: "business_type", label: "Venta de bebidas embotelladas", parentKey: "rt_alimentos_bebidas", order: 5, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_venta_productos_gourmet", type: "business_type", label: "Venta de productos gourmet", parentKey: "rt_alimentos_bebidas", order: 6, tags: ["retail", "b2c"], scope: "b2c" }),

    item({ key: "rt_tienda_ropa", type: "business_type", label: "Tienda de ropa", parentKey: "rt_moda_accesorios", order: 1, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_boutique", type: "business_type", label: "Boutique", parentKey: "rt_moda_accesorios", order: 2, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_venta_calzado", type: "business_type", label: "Venta de calzado", parentKey: "rt_moda_accesorios", order: 3, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_venta_accesorios", type: "business_type", label: "Venta de accesorios", parentKey: "rt_moda_accesorios", order: 4, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_tienda_ropa_usada", type: "business_type", label: "Tienda de ropa usada", parentKey: "rt_moda_accesorios", order: 5, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_venta_uniformes_retail", type: "business_type", label: "Venta de uniformes (retail)", parentKey: "rt_moda_accesorios", order: 6, tags: ["retail", "b2c"], scope: "b2c" }),

    item({ key: "rt_ferreteria", type: "business_type", label: "Ferretería", parentKey: "rt_hogar_ferreteria", order: 1, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_materiales_basicos", type: "business_type", label: "Tienda de materiales básicos", parentKey: "rt_hogar_ferreteria", order: 2, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_venta_pintura", type: "business_type", label: "Venta de pintura", parentKey: "rt_hogar_ferreteria", order: 3, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_articulos_hogar", type: "business_type", label: "Venta de artículos del hogar", parentKey: "rt_hogar_ferreteria", order: 4, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_tienda_electrodomesticos", type: "business_type", label: "Tienda de electrodomésticos", parentKey: "rt_hogar_ferreteria", order: 5, tags: ["retail", "b2c"], scope: "b2c" }),

    item({ key: "rt_tienda_celulares", type: "business_type", label: "Tienda de celulares", parentKey: "rt_tecnologia_electronicos", order: 1, tags: ["retail", "tech", "b2c"], scope: "b2c" }),
    item({ key: "rt_venta_computadoras", type: "business_type", label: "Venta de computadoras", parentKey: "rt_tecnologia_electronicos", order: 2, tags: ["retail", "tech", "b2c"], scope: "b2c" }),
    item({ key: "rt_accesorios_tecnologicos", type: "business_type", label: "Accesorios tecnológicos", parentKey: "rt_tecnologia_electronicos", order: 3, tags: ["retail", "tech", "b2c"], scope: "b2c" }),
    item({ key: "rt_electronica_basica", type: "business_type", label: "Electrónica básica", parentKey: "rt_tecnologia_electronicos", order: 4, tags: ["retail", "tech", "b2c"], scope: "b2c" }),
    item({ key: "rt_reparacion_mas_venta", type: "business_type", label: "Reparación + venta (si predomina la venta)", parentKey: "rt_tecnologia_electronicos", order: 5, tags: ["retail", "tech", "maintenance"], scope: "mixed" }),

    item({ key: "rt_farmacia", type: "business_type", label: "Farmacia", parentKey: "rt_salud_cuidado_personal", order: 1, tags: ["retail", "health", "b2c"], scope: "b2c" }),
    item({ key: "rt_tienda_naturista", type: "business_type", label: "Tienda naturista", parentKey: "rt_salud_cuidado_personal", order: 2, tags: ["retail", "health", "b2c"], scope: "b2c" }),
    item({ key: "rt_venta_cosmeticos", type: "business_type", label: "Venta de cosméticos", parentKey: "rt_salud_cuidado_personal", order: 3, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_productos_higiene", type: "business_type", label: "Productos de higiene", parentKey: "rt_salud_cuidado_personal", order: 4, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_suplementos_alimenticios", type: "business_type", label: "Suplementos alimenticios", parentKey: "rt_salud_cuidado_personal", order: 5, tags: ["retail", "health", "b2c"], scope: "b2c" }),

    item({ key: "rt_venta_repuestos", type: "business_type", label: "Venta de repuestos", parentKey: "rt_automotriz", order: 1, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_accesorios_automotrices", type: "business_type", label: "Accesorios automotrices", parentKey: "rt_automotriz", order: 2, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_lubricantes", type: "business_type", label: "Lubricantes", parentKey: "rt_automotriz", order: 3, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_llantas", type: "business_type", label: "Llantas", parentKey: "rt_automotriz", order: 4, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_tienda_automotriz", type: "business_type", label: "Tienda automotriz", parentKey: "rt_automotriz", order: 5, tags: ["retail", "b2c"], scope: "b2c" }),

    item({ key: "rt_tienda_miscelanea", type: "business_type", label: "Tienda miscelánea", parentKey: "rt_miscelaneo_general", order: 1, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_bazar", type: "business_type", label: "Bazar", parentKey: "rt_miscelaneo_general", order: 2, tags: ["retail", "b2c"], scope: "b2c" }),
    item({ key: "rt_venta_catalogo", type: "business_type", label: "Venta por catálogo", parentKey: "rt_miscelaneo_general", order: 3, tags: ["retail", "mixed"], scope: "mixed" }),
    item({ key: "rt_tienda_general", type: "business_type", label: "Tienda general", parentKey: "rt_miscelaneo_general", order: 4, tags: ["retail", "b2c"], scope: "b2c" }),

    /* =========================================================
       🟨 CATEGORÍA 5 �?SERVICIOS
    ========================================================= */
    item({ key: "s_servicios_profesionales", type: "subcategory", label: "Servicios profesionales", parentKey: "servicios", order: 1 }),
    item({ key: "s_servicios_tecnicos", type: "subcategory", label: "Servicios técnicos", parentKey: "servicios", order: 2 }),
    item({ key: "s_servicios_personales", type: "subcategory", label: "Servicios personales", parentKey: "servicios", order: 3 }),
    item({ key: "s_servicios_empresariales", type: "subcategory", label: "Servicios empresariales", parentKey: "servicios", order: 4 }),
    item({ key: "s_educativos_privados", type: "subcategory", label: "Educativos privados", parentKey: "servicios", order: 5 }),
    item({ key: "s_salud_no_clinicos", type: "subcategory", label: "Servicios de salud (no clínicos)", parentKey: "servicios", order: 6 }),
    item({ key: "s_servicios_creativos", type: "subcategory", label: "Servicios creativos", parentKey: "servicios", order: 7 }),

    item({ key: "s_servicios_contables", type: "business_type", label: "Servicios contables", parentKey: "s_servicios_profesionales", order: 1, tags: ["service", "professional", "b2b"], scope: "b2b" }),
    item({ key: "s_servicios_legales", type: "business_type", label: "Servicios legales", parentKey: "s_servicios_profesionales", order: 2, tags: ["service", "professional", "b2b"], scope: "b2b" }),
    item({ key: "s_consultoria_empresarial", type: "business_type", label: "Consultoría empresarial", parentKey: "s_servicios_profesionales", order: 3, tags: ["service", "professional", "b2b"], scope: "b2b" }),
    item({ key: "s_asesoria_financiera", type: "business_type", label: "Asesoría financiera", parentKey: "s_servicios_profesionales", order: 4, tags: ["service", "professional", "b2b"], scope: "b2b" }),
    item({ key: "s_arquitectura", type: "business_type", label: "Arquitectura", parentKey: "s_servicios_profesionales", order: 5, tags: ["service", "professional", "b2b"], scope: "b2b" }),
    item({ key: "s_ingenieria", type: "business_type", label: "Ingeniería", parentKey: "s_servicios_profesionales", order: 6, tags: ["service", "professional", "b2b"], scope: "b2b" }),
    item({ key: "s_auditoria", type: "business_type", label: "Auditoría", parentKey: "s_servicios_profesionales", order: 7, tags: ["service", "professional", "b2b"], scope: "b2b" }),

    item({ key: "s_taller_mecanico_servicio", type: "business_type", label: "Taller mecánico (servicio)", parentKey: "s_servicios_tecnicos", order: 1, tags: ["service", "maintenance"], scope: "mixed" }),
    item({ key: "s_reparacion_electrodomesticos", type: "business_type", label: "Reparación de electrodomésticos", parentKey: "s_servicios_tecnicos", order: 2, tags: ["service", "maintenance"], scope: "b2c" }),
    item({ key: "s_servicio_electrico", type: "business_type", label: "Servicio eléctrico", parentKey: "s_servicios_tecnicos", order: 3, tags: ["service", "installation", "maintenance"], scope: "mixed" }),
    item({ key: "s_servicio_plomeria", type: "business_type", label: "Servicio de plomería", parentKey: "s_servicios_tecnicos", order: 4, tags: ["service", "installation", "maintenance"], scope: "mixed" }),
    item({ key: "s_servicio_aire_acondicionado", type: "business_type", label: "Servicio de aire acondicionado", parentKey: "s_servicios_tecnicos", order: 5, tags: ["service", "installation", "maintenance"], scope: "mixed" }),
    item({ key: "s_mantenimiento_general", type: "business_type", label: "Mantenimiento general", parentKey: "s_servicios_tecnicos", order: 6, tags: ["service", "maintenance"], scope: "mixed" }),

    item({ key: "s_peluqueria", type: "business_type", label: "Peluquería", parentKey: "s_servicios_personales", order: 1, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "s_barberia", type: "business_type", label: "Barbería", parentKey: "s_servicios_personales", order: 2, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "s_estetica", type: "business_type", label: "Estética", parentKey: "s_servicios_personales", order: 3, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "s_spa", type: "business_type", label: "Spa", parentKey: "s_servicios_personales", order: 4, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "s_masajes", type: "business_type", label: "Masajes", parentKey: "s_servicios_personales", order: 5, tags: ["service", "b2c"], scope: "b2c" }),
    item({ key: "s_cuidado_personal", type: "business_type", label: "Cuidado personal", parentKey: "s_servicios_personales", order: 6, tags: ["service", "b2c"], scope: "b2c" }),

    item({ key: "s_limpieza_empresarial", type: "business_type", label: "Limpieza empresarial", parentKey: "s_servicios_empresariales", order: 1, tags: ["service", "b2b"], scope: "b2b" }),
    item({ key: "s_seguridad_privada", type: "business_type", label: "Seguridad privada", parentKey: "s_servicios_empresariales", order: 2, tags: ["service", "b2b"], scope: "b2b" }),
    item({ key: "s_outsourcing", type: "business_type", label: "Outsourcing", parentKey: "s_servicios_empresariales", order: 3, tags: ["service", "b2b"], scope: "b2b" }),
    item({ key: "s_recursos_humanos", type: "business_type", label: "Recursos humanos", parentKey: "s_servicios_empresariales", order: 4, tags: ["service", "b2b"], scope: "b2b" }),
    item({ key: "s_call_center", type: "business_type", label: "Call center", parentKey: "s_servicios_empresariales", order: 5, tags: ["service", "b2b"], scope: "b2b" }),
    item({ key: "s_servicios_administrativos", type: "business_type", label: "Servicios administrativos", parentKey: "s_servicios_empresariales", order: 6, tags: ["service", "b2b"], scope: "b2b" }),

    item({ key: "s_academia", type: "business_type", label: "Academia", parentKey: "s_educativos_privados", order: 1, tags: ["service", "education"], scope: "mixed" }),
    item({ key: "s_clases_privadas", type: "business_type", label: "Clases privadas", parentKey: "s_educativos_privados", order: 2, tags: ["service", "education"], scope: "mixed" }),
    item({ key: "s_tutorias", type: "business_type", label: "Tutorías", parentKey: "s_educativos_privados", order: 3, tags: ["service", "education"], scope: "mixed" }),
    item({ key: "s_capacitacion_empresarial", type: "business_type", label: "Capacitación empresarial", parentKey: "s_educativos_privados", order: 4, tags: ["service", "education", "b2b"], scope: "b2b" }),
    item({ key: "s_cursos_tecnicos", type: "business_type", label: "Cursos técnicos", parentKey: "s_educativos_privados", order: 5, tags: ["service", "education"], scope: "mixed" }),

    item({ key: "s_consultorio_privado", type: "business_type", label: "Consultorio privado", parentKey: "s_salud_no_clinicos", order: 1, tags: ["service", "health"], scope: "b2c" }),
    item({ key: "s_terapias", type: "business_type", label: "Terapias", parentKey: "s_salud_no_clinicos", order: 2, tags: ["service", "health"], scope: "b2c" }),

    item({ key: "s_nutricion", type: "business_type", label: "Nutrición", parentKey: "s_salud_no_clinicos", order: 4, tags: ["service", "health"], scope: "b2c" }),
    item({ key: "s_rehabilitacion", type: "business_type", label: "Rehabilitación", parentKey: "s_salud_no_clinicos", order: 5, tags: ["service", "health"], scope: "b2c" }),
    item({ key: "s_bienestar_no_clinico", type: "business_type", label: "Bienestar (no clínico)", parentKey: "s_salud_no_clinicos", order: 6, tags: ["service", "health"], scope: "b2c" }),

    item({ key: "s_diseno_grafico", type: "business_type", label: "Diseño gráfico", parentKey: "s_servicios_creativos", order: 1, tags: ["service", "creative"], scope: "mixed" }),
    item({ key: "s_fotografia", type: "business_type", label: "Fotografía", parentKey: "s_servicios_creativos", order: 2, tags: ["service", "creative"], scope: "mixed" }),
    item({ key: "s_produccion_audiovisual", type: "business_type", label: "Producción audiovisual (servicio general)", parentKey: "s_servicios_creativos", order: 3, tags: ["service", "creative"], scope: "mixed" }),
    item({ key: "s_marketing_digital", type: "business_type", label: "Marketing digital (servicio)", parentKey: "s_servicios_creativos", order: 4, tags: ["service", "tech"], scope: "mixed" }),
    item({ key: "s_publicidad", type: "business_type", label: "Publicidad (servicio)", parentKey: "s_servicios_creativos", order: 5, tags: ["service", "creative"], scope: "mixed" }),

    /* =========================================================
       CATEGORÍA 6 �?TRANSPORTE
    ========================================================= */
    item({ key: "t_personas", type: "subcategory", label: "Transporte de personas", parentKey: "transporte", order: 1 }),
    item({ key: "t_mercancias", type: "subcategory", label: "Transporte de mercancías", parentKey: "transporte", order: 2 }),
    item({ key: "t_especializado", type: "subcategory", label: "Transporte especializado", parentKey: "transporte", order: 3 }),
    item({ key: "t_arrendamiento_vehiculos", type: "subcategory", label: "Arrendamiento de vehículos", parentKey: "transporte", order: 4 }),
    item({ key: "t_apoyo_transporte", type: "subcategory", label: "Servicios de apoyo al transporte", parentKey: "transporte", order: 5 }),

    item({ key: "t_taxi", type: "business_type", label: "Taxi", parentKey: "t_personas", order: 1, tags: ["service", "logistics"], scope: "b2c" }),
    item({ key: "t_transporte_privado", type: "business_type", label: "Transporte privado", parentKey: "t_personas", order: 2, tags: ["service", "logistics"], scope: "b2c" }),
    item({ key: "t_transporte_escolar", type: "business_type", label: "Transporte escolar", parentKey: "t_personas", order: 3, tags: ["service", "logistics"], scope: "b2c" }),
    item({ key: "t_transporte_turistico", type: "business_type", label: "Transporte turístico", parentKey: "t_personas", order: 4, tags: ["service", "logistics", "tourism"], scope: "mixed" }),
    item({ key: "t_transporte_empresarial", type: "business_type", label: "Transporte empresarial", parentKey: "t_personas", order: 5, tags: ["service", "logistics", "b2b"], scope: "b2b" }),
    item({ key: "t_servicio_shuttle", type: "business_type", label: "Servicio de shuttle", parentKey: "t_personas", order: 6, tags: ["service", "logistics"], scope: "mixed" }),

    item({ key: "t_carga_liviana", type: "business_type", label: "Transporte de carga liviana", parentKey: "t_mercancias", order: 1, tags: ["service", "logistics"], scope: "b2b" }),
    item({ key: "t_carga_pesada", type: "business_type", label: "Transporte de carga pesada", parentKey: "t_mercancias", order: 2, tags: ["service", "logistics"], scope: "b2b" }),
    item({ key: "t_reparto_urbano", type: "business_type", label: "Reparto urbano", parentKey: "t_mercancias", order: 3, tags: ["service", "delivery", "logistics"], scope: "mixed" }),
    item({ key: "t_mensajeria", type: "business_type", label: "Mensajería", parentKey: "t_mercancias", order: 4, tags: ["service", "delivery", "logistics"], scope: "mixed" }),
    item({ key: "t_logistica_local", type: "business_type", label: "Logística local", parentKey: "t_mercancias", order: 5, tags: ["service", "logistics", "b2b"], scope: "b2b" }),

    item({ key: "t_transporte_refrigerado", type: "business_type", label: "Transporte refrigerado", parentKey: "t_especializado", order: 1, tags: ["service", "logistics", "b2b"], scope: "b2b" }),
    item({ key: "t_materiales_peligrosos", type: "business_type", label: "Transporte de materiales peligrosos", parentKey: "t_especializado", order: 2, tags: ["service", "logistics", "b2b"], scope: "b2b" }),
    item({ key: "t_transporte_valores", type: "business_type", label: "Transporte de valores", parentKey: "t_especializado", order: 3, tags: ["service", "logistics", "b2b"], scope: "b2b" }),
    item({ key: "t_transporte_maquinaria", type: "business_type", label: "Transporte de maquinaria", parentKey: "t_especializado", order: 4, tags: ["service", "logistics", "b2b"], scope: "b2b" }),
    item({ key: "t_transporte_especializado_tipo", type: "business_type", label: "Transporte especializado", parentKey: "t_especializado", order: 5, tags: ["service", "logistics"], scope: "mixed" }),

    item({ key: "t_renta_vehiculos", type: "business_type", label: "Renta de vehículos", parentKey: "t_arrendamiento_vehiculos", order: 1, tags: ["service"], scope: "mixed" }),
    item({ key: "t_renta_motocicletas", type: "business_type", label: "Renta de motocicletas", parentKey: "t_arrendamiento_vehiculos", order: 2, tags: ["service"], scope: "mixed" }),
    item({ key: "t_renta_camiones", type: "business_type", label: "Renta de camiones", parentKey: "t_arrendamiento_vehiculos", order: 3, tags: ["service", "b2b"], scope: "b2b" }),
    item({ key: "t_renta_maquinaria_ligera", type: "business_type", label: "Renta de maquinaria ligera", parentKey: "t_arrendamiento_vehiculos", order: 4, tags: ["service", "b2b"], scope: "b2b" }),
    item({ key: "t_leasing_vehicular", type: "business_type", label: "Leasing vehicular", parentKey: "t_arrendamiento_vehiculos", order: 5, tags: ["service", "b2b"], scope: "b2b" }),

    item({ key: "t_gestion_flotas", type: "business_type", label: "Gestión de flotas", parentKey: "t_apoyo_transporte", order: 1, tags: ["service", "logistics", "b2b"], scope: "b2b" }),
    item({ key: "t_coordinacion_logistica", type: "business_type", label: "Coordinación logística", parentKey: "t_apoyo_transporte", order: 2, tags: ["service", "logistics", "b2b"], scope: "b2b" }),
    item({ key: "t_plataforma_transporte", type: "business_type", label: "Plataforma de transporte", parentKey: "t_apoyo_transporte", order: 3, tags: ["service", "tech"], scope: "mixed" }),
    item({ key: "t_administracion_rutas", type: "business_type", label: "Administración de rutas", parentKey: "t_apoyo_transporte", order: 4, tags: ["service", "logistics", "b2b"], scope: "b2b" }),

    /* =========================================================
       CATEGORÍA 7 �?TURISMO
    ========================================================= */
    item({ key: "tu_alojamiento_turistico", type: "subcategory", label: "Alojamiento turístico", parentKey: "turismo", order: 1 }),
    item({ key: "tu_agencias_operadores", type: "subcategory", label: "Agencias y operadores turísticos", parentKey: "turismo", order: 2 }),
    item({ key: "tu_experiencias_actividades", type: "subcategory", label: "Experiencias y actividades", parentKey: "turismo", order: 3 }),
    item({ key: "tu_entretenimiento_turistico", type: "subcategory", label: "Entretenimiento turístico", parentKey: "turismo", order: 4 }),
    item({ key: "tu_servicios_complementarios", type: "subcategory", label: "Servicios complementarios", parentKey: "turismo", order: 5 }),

    item({ key: "tu_hotel", type: "business_type", label: "Hotel", parentKey: "tu_alojamiento_turistico", order: 1, tags: ["service", "tourism"], scope: "b2c" }),
    item({ key: "tu_hostal", type: "business_type", label: "Hostal", parentKey: "tu_alojamiento_turistico", order: 2, tags: ["service", "tourism"], scope: "b2c" }),
    item({ key: "tu_motel", type: "business_type", label: "Motel", parentKey: "tu_alojamiento_turistico", order: 3, tags: ["service", "tourism"], scope: "b2c" }),
    item({ key: "tu_casa_huespedes", type: "business_type", label: "Casa de huéspedes", parentKey: "tu_alojamiento_turistico", order: 4, tags: ["service", "tourism"], scope: "b2c" }),
    item({ key: "tu_apartamento_turistico", type: "business_type", label: "Apartamento turístico", parentKey: "tu_alojamiento_turistico", order: 5, tags: ["service", "tourism"], scope: "b2c" }),
    item({ key: "tu_airbnb_renta_vacacional", type: "business_type", label: "Airbnb / renta vacacional", parentKey: "tu_alojamiento_turistico", order: 6, tags: ["service", "tourism"], scope: "b2c" }),
    item({ key: "tu_eco_lodge", type: "business_type", label: "Eco-lodge", parentKey: "tu_alojamiento_turistico", order: 7, tags: ["service", "tourism"], scope: "b2c" }),

    item({ key: "tu_agencia_viajes", type: "business_type", label: "Agencia de viajes", parentKey: "tu_agencias_operadores", order: 1, tags: ["service", "tourism"], scope: "mixed" }),
    item({ key: "tu_operador_turistico", type: "business_type", label: "Operador turístico", parentKey: "tu_agencias_operadores", order: 2, tags: ["service", "tourism"], scope: "mixed" }),
    item({ key: "tu_tours_locales", type: "business_type", label: "Tours locales", parentKey: "tu_agencias_operadores", order: 3, tags: ["service", "tourism"], scope: "mixed" }),
    item({ key: "tu_tours_internacionales", type: "business_type", label: "Tours internacionales", parentKey: "tu_agencias_operadores", order: 4, tags: ["service", "tourism"], scope: "mixed" }),
    item({ key: "tu_turismo_corporativo", type: "business_type", label: "Turismo corporativo", parentKey: "tu_agencias_operadores", order: 5, tags: ["service", "tourism", "b2b"], scope: "b2b" }),

    item({ key: "tu_tours_guiados", type: "business_type", label: "Tours guiados", parentKey: "tu_experiencias_actividades", order: 1, tags: ["service", "tourism"], scope: "mixed" }),
    item({ key: "tu_excursiones", type: "business_type", label: "Excursiones", parentKey: "tu_experiencias_actividades", order: 2, tags: ["service", "tourism"], scope: "mixed" }),
    item({ key: "tu_turismo_aventura", type: "business_type", label: "Turismo de aventura", parentKey: "tu_experiencias_actividades", order: 3, tags: ["service", "tourism"], scope: "mixed" }),
    item({ key: "tu_turismo_ecologico", type: "business_type", label: "Turismo ecológico", parentKey: "tu_experiencias_actividades", order: 4, tags: ["service", "tourism"], scope: "mixed" }),
    item({ key: "tu_turismo_cultural", type: "business_type", label: "Turismo cultural", parentKey: "tu_experiencias_actividades", order: 5, tags: ["service", "tourism"], scope: "mixed" }),
    item({ key: "tu_turismo_gastronomico", type: "business_type", label: "Turismo gastronómico", parentKey: "tu_experiencias_actividades", order: 6, tags: ["service", "tourism"], scope: "mixed" }),

    item({ key: "tu_parque_recreativo", type: "business_type", label: "Parque recreativo", parentKey: "tu_entretenimiento_turistico", order: 1, tags: ["service", "tourism"], scope: "mixed" }),
    item({ key: "tu_centro_turistico", type: "business_type", label: "Centro turístico", parentKey: "tu_entretenimiento_turistico", order: 2, tags: ["service", "tourism"], scope: "mixed" }),
    item({ key: "tu_balneario", type: "business_type", label: "Balneario", parentKey: "tu_entretenimiento_turistico", order: 3, tags: ["service", "tourism"], scope: "mixed" }),
    item({ key: "tu_termales", type: "business_type", label: "Termales", parentKey: "tu_entretenimiento_turistico", order: 4, tags: ["service", "tourism"], scope: "mixed" }),
    item({ key: "tu_parque_tematico", type: "business_type", label: "Parque temático", parentKey: "tu_entretenimiento_turistico", order: 5, tags: ["service", "tourism"], scope: "mixed" }),

    item({ key: "tu_alquiler_equipo_turistico", type: "business_type", label: "Alquiler de equipo turístico", parentKey: "tu_servicios_complementarios", order: 1, tags: ["service", "tourism"], scope: "mixed" }),
    item({ key: "tu_guias_turisticos", type: "business_type", label: "Guías turísticos", parentKey: "tu_servicios_complementarios", order: 2, tags: ["service", "tourism"], scope: "mixed" }),
    item({ key: "tu_servicios_eventos_turisticos", type: "business_type", label: "Servicios para eventos turísticos", parentKey: "tu_servicios_complementarios", order: 3, tags: ["service", "tourism", "events"], scope: "mixed" }),
    item({ key: "tu_fotografia_turistica", type: "business_type", label: "Fotografía turística", parentKey: "tu_servicios_complementarios", order: 4, tags: ["service", "tourism", "creative"], scope: "mixed" }),


    /* =========================================================
    CATEGORÍA 8 �?EDUCACIÓN
 ========================================================= */
    item({ key: "e_instituciones", type: "subcategory", label: "Instituciones educativas", parentKey: "educacion", order: 1 }),
    item({ key: "e_capacitacion", type: "subcategory", label: "Capacitación y cursos", parentKey: "educacion", order: 2 }),
    item({ key: "e_servicios_educativos", type: "subcategory", label: "Servicios educativos", parentKey: "educacion", order: 3 }),
    item({ key: "e_educacion_tecnologia", type: "subcategory", label: "EdTech", parentKey: "educacion", order: 4 }),

    item({ key: "e_colegio", type: "business_type", label: "Colegio", parentKey: "e_instituciones", order: 1, tags: ["service", "education"], scope: "b2c" }),
    item({ key: "e_universidad", type: "business_type", label: "Universidad", parentKey: "e_instituciones", order: 2, tags: ["service", "education"], scope: "b2c" }),
    item({ key: "e_instituto_tecnico", type: "business_type", label: "Instituto técnico", parentKey: "e_instituciones", order: 3, tags: ["service", "education"], scope: "b2c" }),

    item({ key: "e_cursos_profesionales", type: "business_type", label: "Cursos profesionales", parentKey: "e_capacitacion", order: 1, tags: ["service", "education"], scope: "mixed" }),
    item({ key: "e_capacitacion_empresarial", type: "business_type", label: "Capacitación empresarial", parentKey: "e_capacitacion", order: 2, tags: ["service", "education", "b2b"], scope: "b2b" }),
    item({ key: "e_idiomas", type: "business_type", label: "Academia de idiomas", parentKey: "e_capacitacion", order: 3, tags: ["service", "education"], scope: "b2c" }),

    item({ key: "e_tutorias_servicio", type: "business_type", label: "Tutorías (servicio)", parentKey: "e_servicios_educativos", order: 1, tags: ["service", "education"], scope: "b2c" }),
    item({ key: "e_psicoeducacion", type: "business_type", label: "Orientación y apoyo académico", parentKey: "e_servicios_educativos", order: 2, tags: ["service", "education"], scope: "b2c" }),

    item({ key: "e_plataforma_cursos", type: "business_type", label: "Plataforma de cursos", parentKey: "e_educacion_tecnologia", order: 1, tags: ["service", "tech", "education"], scope: "mixed" }),
    item({ key: "e_lms", type: "business_type", label: "LMS / software educativo", parentKey: "e_educacion_tecnologia", order: 2, tags: ["service", "tech", "education"], scope: "b2b" }),

    /* =========================================================
       CATEGORÍA 9 �?SALUD
    ========================================================= */
    item({ key: "sa_clinicas", type: "subcategory", label: "Clínicas y consultorios", parentKey: "salud", order: 1 }),
    item({ key: "sa_servicios_salud", type: "subcategory", label: "Servicios de salud", parentKey: "salud", order: 2 }),
    item({ key: "sa_bienestar", type: "subcategory", label: "Bienestar", parentKey: "salud", order: 3 }),

    item({ key: "sa_clinica_general", type: "business_type", label: "Clínica general", parentKey: "sa_clinicas", order: 1, tags: ["service", "health"], scope: "b2c" }),
    item({ key: "sa_consultorio_medico", type: "business_type", label: "Consultorio médico", parentKey: "sa_clinicas", order: 2, tags: ["service", "health"], scope: "b2c" }),
    item({ key: "sa_laboratorio_clinico", type: "business_type", label: "Laboratorio clínico", parentKey: "sa_clinicas", order: 3, tags: ["service", "health"], scope: "b2c" }),

    item({ key: "sa_fisioterapia", type: "business_type", label: "Fisioterapia", parentKey: "sa_servicios_salud", order: 1, tags: ["service", "health"], scope: "b2c" }),
    item({ key: "sa_odontologia", type: "business_type", label: "Odontología", parentKey: "sa_servicios_salud", order: 2, tags: ["service", "health"], scope: "b2c" }),
    item({ key: "sa_salud_domicilio", type: "business_type", label: "Atención a domicilio", parentKey: "sa_servicios_salud", order: 3, tags: ["service", "health"], scope: "b2c" }),

    item({ key: "sa_nutricion_bienestar", type: "business_type", label: "Nutrición (bienestar)", parentKey: "sa_bienestar", order: 1, tags: ["service", "health"], scope: "b2c", synonyms: ["nutriólogo"] }),
    item({ key: "sa_psicologia_bienestar", type: "business_type", label: "Psicología (bienestar)", parentKey: "sa_bienestar", order: 2, tags: ["service", "health"], scope: "b2c" }),

    /* =========================================================
       CATEGORÍA 10 �?TECNOLOGÍA
    ========================================================= */
    item({ key: "te_servicios_software", type: "subcategory", label: "Software y servicios", parentKey: "tecnologia", order: 1 }),
    item({ key: "te_infra_cloud", type: "subcategory", label: "Infraestructura / Cloud", parentKey: "tecnologia", order: 2 }),
    item({ key: "te_hardware_soporte", type: "subcategory", label: "Hardware y soporte", parentKey: "tecnologia", order: 3 }),

    item({ key: "te_desarrollo_software", type: "business_type", label: "Desarrollo de software", parentKey: "te_servicios_software", order: 1, tags: ["service", "tech", "b2b"], scope: "b2b" }),
    item({ key: "te_agencia_web", type: "business_type", label: "Agencia web / apps", parentKey: "te_servicios_software", order: 2, tags: ["service", "tech", "b2b"], scope: "b2b" }),
    item({ key: "te_saas", type: "business_type", label: "SaaS / producto digital", parentKey: "te_servicios_software", order: 3, tags: ["service", "tech"], scope: "mixed" }),

    item({ key: "te_cloud_services", type: "business_type", label: "Servicios cloud", parentKey: "te_infra_cloud", order: 1, tags: ["service", "tech", "b2b"], scope: "b2b" }),
    item({ key: "te_ciberseguridad", type: "business_type", label: "Ciberseguridad", parentKey: "te_infra_cloud", order: 2, tags: ["service", "tech", "b2b"], scope: "b2b" }),

    item({ key: "te_soporte_it", type: "business_type", label: "Soporte IT", parentKey: "te_hardware_soporte", order: 1, tags: ["service", "tech"], scope: "mixed" }),
    item({ key: "te_reparacion_pc", type: "business_type", label: "Reparación de computadoras", parentKey: "te_hardware_soporte", order: 2, tags: ["service", "tech", "maintenance"], scope: "b2c" }),

    /* =========================================================
       CATEGORÍA 11 �?AGROINDUSTRIA (tu bloque, ya limpio)
    ========================================================= */
    item({ key: "ag_produccion_agricola", type: "subcategory", label: "Producción agrícola", parentKey: "agroindustria", order: 1 }),
    item({ key: "ag_produccion_pecuaria", type: "subcategory", label: "Producción pecuaria", parentKey: "agroindustria", order: 2 }),
    item({ key: "ag_transformadora", type: "subcategory", label: "Agroindustria transformadora", parentKey: "agroindustria", order: 3 }),
    item({ key: "ag_comercializacion", type: "subcategory", label: "Comercialización agroindustrial", parentKey: "agroindustria", order: 4 }),
    item({ key: "ag_servicios_apoyo", type: "subcategory", label: "Servicios de apoyo agroindustrial", parentKey: "agroindustria", order: 5 }),

    item({ key: "ag_cultivo_granos", type: "business_type", label: "Cultivo de granos", parentKey: "ag_produccion_agricola", order: 1, tags: ["produce", "manufacturing"], scope: "mixed" }),
    item({ key: "ag_cultivo_hortalizas", type: "business_type", label: "Cultivo de hortalizas", parentKey: "ag_produccion_agricola", order: 2, tags: ["produce", "manufacturing"], scope: "mixed" }),
    item({ key: "ag_cultivo_frutas", type: "business_type", label: "Cultivo de frutas", parentKey: "ag_produccion_agricola", order: 3, tags: ["produce", "manufacturing"], scope: "mixed" }),
    item({ key: "ag_agricultura_organica", type: "business_type", label: "Agricultura orgánica", parentKey: "ag_produccion_agricola", order: 4, tags: ["produce", "manufacturing"], scope: "mixed" }),
    item({ key: "ag_agricultura_intensiva", type: "business_type", label: "Agricultura intensiva", parentKey: "ag_produccion_agricola", order: 5, tags: ["produce", "manufacturing"], scope: "mixed" }),
    item({ key: "ag_viveros_plantaciones", type: "business_type", label: "Viveros y plantaciones", parentKey: "ag_produccion_agricola", order: 6, tags: ["produce", "manufacturing"], scope: "mixed" }),

    item({ key: "ag_ganaderia_bovina", type: "business_type", label: "Ganadería bovina", parentKey: "ag_produccion_pecuaria", order: 1, tags: ["produce", "manufacturing"], scope: "mixed" }),
    item({ key: "ag_ganaderia_porcina", type: "business_type", label: "Ganadería porcina", parentKey: "ag_produccion_pecuaria", order: 2, tags: ["produce", "manufacturing"], scope: "mixed" }),
    item({ key: "ag_avicultura", type: "business_type", label: "Avicultura", parentKey: "ag_produccion_pecuaria", order: 3, tags: ["produce", "manufacturing"], scope: "mixed" }),
    item({ key: "ag_produccion_lacteos", type: "business_type", label: "Producción de lácteos", parentKey: "ag_produccion_pecuaria", order: 4, tags: ["produce", "manufacturing"], scope: "mixed" }),
    item({ key: "ag_cria_especializada", type: "business_type", label: "Cría especializada", parentKey: "ag_produccion_pecuaria", order: 5, tags: ["produce", "manufacturing"], scope: "mixed" }),

    item({ key: "ag_procesadora_alimentos", type: "business_type", label: "Procesadora de alimentos", parentKey: "ag_transformadora", order: 1, tags: ["manufacturing", "produce", "b2b"], scope: "b2b" }),
    item({ key: "ag_beneficiado_granos", type: "business_type", label: "Beneficiado de granos", parentKey: "ag_transformadora", order: 2, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "ag_empaque_agricola", type: "business_type", label: "Empaque agrícola", parentKey: "ag_transformadora", order: 3, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "ag_industria_lactea", type: "business_type", label: "Industria láctea", parentKey: "ag_transformadora", order: 4, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "ag_procesamiento_carnico", type: "business_type", label: "Procesamiento cárnico", parentKey: "ag_transformadora", order: 5, tags: ["manufacturing", "produce"], scope: "mixed" }),
    item({ key: "ag_molinos", type: "business_type", label: "Molinos", parentKey: "ag_transformadora", order: 6, tags: ["manufacturing", "produce"], scope: "mixed" }),

    item({ key: "ag_comercializadora_agricola", type: "business_type", label: "Comercializadora agrícola", parentKey: "ag_comercializacion", order: 1, tags: ["retail", "b2b"], scope: "b2b" }),
    item({ key: "ag_distribuidora_productos_agro", type: "business_type", label: "Distribuidora de productos agro", parentKey: "ag_comercializacion", order: 2, tags: ["retail", "b2b"], scope: "b2b" }),
    item({ key: "ag_exportacion_agricola", type: "business_type", label: "Exportación agrícola", parentKey: "ag_comercializacion", order: 3, tags: ["retail", "b2b"], scope: "b2b" }),
    item({ key: "ag_acopio_agricola", type: "business_type", label: "Acopio agrícola", parentKey: "ag_comercializacion", order: 4, tags: ["retail", "b2b"], scope: "b2b" }),

    item({ key: "ag_servicios_agricolas", type: "business_type", label: "Servicios agrícolas", parentKey: "ag_servicios_apoyo", order: 1, tags: ["service", "b2b"], scope: "b2b" }),
    item({ key: "ag_mecanizacion_agricola", type: "business_type", label: "Mecanización agrícola", parentKey: "ag_servicios_apoyo", order: 2, tags: ["service", "b2b"], scope: "b2b" }),
    item({ key: "ag_riego_sistemas", type: "business_type", label: "Riego y sistemas agrícolas", parentKey: "ag_servicios_apoyo", order: 3, tags: ["service", "b2b"], scope: "b2b" }),
    item({ key: "ag_asistencia_tecnica_agro", type: "business_type", label: "Asistencia técnica agro", parentKey: "ag_servicios_apoyo", order: 4, tags: ["service", "b2b"], scope: "b2b" }),
    item({ key: "ag_servicios_veterinarios_productivos", type: "business_type", label: "Servicios veterinarios productivos", parentKey: "ag_servicios_apoyo", order: 5, tags: ["service", "health", "b2b"], scope: "b2b" }),

    /* =========================================================
       CATEGORÍAS 12�?7 (se mantienen de tu estructura, con tags)
       (Para no hacer este mensaje infinito, sigo tu mismo patrón.)
    ========================================================= */

    // 12 �?FINANZAS (tu bloque, con tags)
    item({ key: "f_intermediacion_financiera", type: "subcategory", label: "Intermediación financiera", parentKey: "finanzas", order: 1 }),
    item({ key: "f_servicios_financieros", type: "subcategory", label: "Servicios financieros", parentKey: "finanzas", order: 2 }),
    item({ key: "f_pagos_transacciones", type: "subcategory", label: "Pagos y transacciones", parentKey: "finanzas", order: 3 }),
    item({ key: "f_inversion_capital", type: "subcategory", label: "Inversión y capital", parentKey: "finanzas", order: 4 }),
    item({ key: "f_seguros", type: "subcategory", label: "Seguros", parentKey: "finanzas", order: 5 }),
    item({ key: "f_credito_financiamiento", type: "subcategory", label: "Crédito y financiamiento", parentKey: "finanzas", order: 6 }),

    item({ key: "f_banco", type: "business_type", label: "Banco", parentKey: "f_intermediacion_financiera", order: 1, tags: ["service", "b2b"], scope: "mixed" }),
    item({ key: "f_cooperativa_ahorro_credito", type: "business_type", label: "Cooperativa de ahorro y crédito", parentKey: "f_intermediacion_financiera", order: 2, tags: ["service"], scope: "mixed" }),
    item({ key: "f_institucion_financiera", type: "business_type", label: "Institución financiera", parentKey: "f_intermediacion_financiera", order: 3, tags: ["service"], scope: "mixed" }),
    item({ key: "f_microfinanciera", type: "business_type", label: "Microfinanciera", parentKey: "f_intermediacion_financiera", order: 4, tags: ["service"], scope: "mixed" }),
    item({ key: "f_prestamista_formal", type: "business_type", label: "Prestamista formal", parentKey: "f_intermediacion_financiera", order: 5, tags: ["service"], scope: "mixed" }),

    item({ key: "f_contabilidad", type: "business_type", label: "Contabilidad", parentKey: "f_servicios_financieros", order: 1, tags: ["service", "professional", "b2b"], scope: "b2b" }),
    item({ key: "f_asesoria_financiera", type: "business_type", label: "Asesoría financiera", parentKey: "f_servicios_financieros", order: 2, tags: ["service", "professional", "b2b"], scope: "b2b" }),
    item({ key: "f_auditoria", type: "business_type", label: "Auditoría", parentKey: "f_servicios_financieros", order: 3, tags: ["service", "professional", "b2b"], scope: "b2b" }),
    item({ key: "f_gestion_fiscal_tributaria", type: "business_type", label: "Gestión fiscal / tributaria", parentKey: "f_servicios_financieros", order: 4, tags: ["service", "professional", "b2b"], scope: "b2b" }),
    item({ key: "f_servicios_financieros_empresariales", type: "business_type", label: "Servicios financieros empresariales", parentKey: "f_servicios_financieros", order: 5, tags: ["service", "b2b"], scope: "b2b" }),

    // 13 �?INMOBILIARIO (tu bloque)
    item({ key: "in_renta_residencial", type: "subcategory", label: "Renta residencial", parentKey: "inmobiliario", order: 1 }),
    item({ key: "in_renta_comercial", type: "subcategory", label: "Renta comercial", parentKey: "inmobiliario", order: 2 }),
    item({ key: "in_desarrollo_inmobiliario", type: "subcategory", label: "Desarrollo inmobiliario", parentKey: "inmobiliario", order: 3 }),
    item({ key: "in_administracion_inmobiliaria", type: "subcategory", label: "Administración inmobiliaria", parentKey: "inmobiliario", order: 4 }),
    item({ key: "in_compra_venta_intermediacion", type: "subcategory", label: "Compra, venta e intermediación", parentKey: "inmobiliario", order: 5 }),
    item({ key: "in_especializado", type: "subcategory", label: "Inmobiliario especializado", parentKey: "inmobiliario", order: 6 }),

    item({ key: "in_renta_apartamentos", type: "business_type", label: "Renta de apartamentos", parentKey: "in_renta_residencial", order: 1, tags: ["real_estate"], scope: "mixed" }),
    item({ key: "in_renta_casas", type: "business_type", label: "Renta de casas", parentKey: "in_renta_residencial", order: 2, tags: ["real_estate"], scope: "mixed" }),
    item({ key: "in_renta_cuartos", type: "business_type", label: "Renta de cuartos", parentKey: "in_renta_residencial", order: 3, tags: ["real_estate"], scope: "mixed" }),
    item({ key: "in_renta_multifamiliar", type: "business_type", label: "Renta multifamiliar", parentKey: "in_renta_residencial", order: 4, tags: ["real_estate"], scope: "mixed" }),

    // 14 �?ENERGÍA / SERVICIOS BÁSICOS (tu bloque)
    item({ key: "en_energia_electrica", type: "subcategory", label: "Energía eléctrica", parentKey: "energia_servicios_basicos", order: 1 }),
    item({ key: "en_combustibles_derivados", type: "subcategory", label: "Combustibles y derivados", parentKey: "energia_servicios_basicos", order: 2 }),
    item({ key: "en_agua_saneamiento", type: "subcategory", label: "Agua y saneamiento", parentKey: "energia_servicios_basicos", order: 3 }),
    item({ key: "en_complementarios", type: "subcategory", label: "Servicios básicos complementarios", parentKey: "energia_servicios_basicos", order: 4 }),
    item({ key: "en_energia_especializada", type: "subcategory", label: "Energía especializada", parentKey: "energia_servicios_basicos", order: 5 }),

    item({ key: "en_generacion_electrica", type: "business_type", label: "Generación eléctrica", parentKey: "en_energia_electrica", order: 1, tags: ["energy", "b2b"], scope: "b2b" }),
    item({ key: "en_distribucion_electrica", type: "business_type", label: "Distribución eléctrica", parentKey: "en_energia_electrica", order: 2, tags: ["energy", "b2b"], scope: "b2b" }),

    // 15 �?ENTRETENIMIENTO Y DEPORTE (tu bloque)
    item({ key: "ed_entretenimiento_recreativo", type: "subcategory", label: "Entretenimiento recreativo", parentKey: "entretenimiento_deporte", order: 1 }),
    item({ key: "ed_espectaculos_eventos", type: "subcategory", label: "Espectáculos y eventos", parentKey: "entretenimiento_deporte", order: 2 }),
    item({ key: "ed_cine_medios", type: "subcategory", label: "Cine y medios", parentKey: "entretenimiento_deporte", order: 3 }),
    item({ key: "ed_deporte_actividad_fisica", type: "subcategory", label: "Deporte y actividad física", parentKey: "entretenimiento_deporte", order: 4 }),
    item({ key: "ed_recreacion_infantil_familiar", type: "subcategory", label: "Recreación infantil y familiar", parentKey: "entretenimiento_deporte", order: 5 }),
    item({ key: "ed_entretenimiento_nocturno", type: "subcategory", label: "Entretenimiento nocturno", parentKey: "entretenimiento_deporte", order: 6 }),

    // 16 �?ORGANIZACIONES / OTROS (tu bloque)
    item({ key: "oo_sin_fines_lucro", type: "subcategory", label: "Organizaciones sin fines de lucro", parentKey: "organizaciones_otros", order: 1 }),
    item({ key: "oo_religiosas", type: "subcategory", label: "Organizaciones religiosas", parentKey: "organizaciones_otros", order: 2 }),
    item({ key: "oo_gremiales", type: "subcategory", label: "Organizaciones gremiales", parentKey: "organizaciones_otros", order: 3 }),
    item({ key: "oo_internas_holding", type: "subcategory", label: "Organizaciones internas / holding", parentKey: "organizaciones_otros", order: 4 }),
    item({ key: "oo_proyectos_especiales", type: "subcategory", label: "Proyectos especiales", parentKey: "organizaciones_otros", order: 5 }),
    item({ key: "oo_otros_institucionales", type: "subcategory", label: "Otros institucionales", parentKey: "organizaciones_otros", order: 6 }),

    // 17 �?CONSTRUCCIÓN (tu bloque)
    item({ key: "c_construccion_residencial", type: "subcategory", label: "Construcción residencial", parentKey: "construccion", order: 1 }),
    item({ key: "c_construccion_comercial", type: "subcategory", label: "Construcción comercial", parentKey: "construccion", order: 2 }),
    item({ key: "c_infraestructura", type: "subcategory", label: "Infraestructura", parentKey: "construccion", order: 3 }),
    item({ key: "c_remodelacion_mantenimiento", type: "subcategory", label: "Remodelación y mantenimiento", parentKey: "construccion", order: 4 }),
    item({ key: "c_servicios_especializados", type: "subcategory", label: "Servicios especializados de construcción", parentKey: "construccion", order: 5 }),
    item({ key: "c_gestion_supervision", type: "subcategory", label: "Gestión y supervisión de proyectos", parentKey: "construccion", order: 6 }),

    item({ key: "c_constructora_viviendas", type: "business_type", label: "Constructora de viviendas", parentKey: "c_construccion_residencial", order: 1, tags: ["construction", "b2b"], scope: "b2b" }),
    item({ key: "c_remodelacion_residencial", type: "business_type", label: "Remodelación residencial", parentKey: "c_remodelacion_mantenimiento", order: 1, tags: ["construction", "maintenance"], scope: "mixed" }),
    item({ key: "c_remodelacion_comercial", type: "business_type", label: "Remodelación comercial", parentKey: "c_remodelacion_mantenimiento", order: 2, tags: ["construction", "maintenance", "b2b"], scope: "b2b" }),
    item({ key: "e_centro_formacion", type: "business_type", label: "Centro de formación", parentKey: "e_instituciones", order: 6, tags: ["service", "education"], scope: "mixed" }),

    item({ key: "e_bootcamp", type: "business_type", label: "Bootcamp", parentKey: "e_capacitacion", order: 4, tags: ["service", "education", "tech"], scope: "mixed" }),
    item({ key: "e_certificaciones", type: "business_type", label: "Certificaciones", parentKey: "e_capacitacion", order: 5, tags: ["service", "education"], scope: "mixed" }),
    item({ key: "e_talleres", type: "business_type", label: "Talleres", parentKey: "e_capacitacion", order: 6, tags: ["service", "education"], scope: "mixed" }),

    item({ key: "e_evaluacion_academica", type: "business_type", label: "Evaluación académica", parentKey: "e_servicios_educativos", order: 3, tags: ["service", "education"], scope: "b2c" }),
    item({ key: "e_psicopedagogia", type: "business_type", label: "Psicopedagogía", parentKey: "e_servicios_educativos", order: 4, tags: ["service", "education", "health"], scope: "b2c" }),
    item({ key: "e_materiales_educativos_servicio", type: "business_type", label: "Materiales educativos (servicio)", parentKey: "e_servicios_educativos", order: 5, tags: ["service", "education"], scope: "mixed" }),

    item({ key: "e_contenido_digital_educativo", type: "business_type", label: "Contenido digital educativo", parentKey: "e_educacion_tecnologia", order: 3, tags: ["service", "tech", "education"], scope: "mixed" }),
    item({ key: "e_tutoria_online", type: "business_type", label: "Tutoría online (plataforma)", parentKey: "e_educacion_tecnologia", order: 4, tags: ["service", "tech", "education"], scope: "b2c" }),
    item({ key: "e_marketplace_cursos", type: "business_type", label: "Marketplace de cursos", parentKey: "e_educacion_tecnologia", order: 5, tags: ["service", "tech", "education"], scope: "mixed" }),

    /* -------------------------
       9 �?SALUD (faltantes)
    ------------------------- */
    item({ key: "sa_clinica_especialidades", type: "business_type", label: "Clínica de especialidades", parentKey: "sa_clinicas", order: 4, tags: ["service", "health"], scope: "b2c" }),
    item({ key: "sa_centro_diagnostico", type: "business_type", label: "Centro de diagnóstico", parentKey: "sa_clinicas", order: 5, tags: ["service", "health"], scope: "b2c" }),
    item({ key: "sa_clinica_dental", type: "business_type", label: "Clínica dental", parentKey: "sa_clinicas", order: 6, tags: ["service", "health"], scope: "b2c" }),

    item({ key: "sa_enfermeria_domicilio", type: "business_type", label: "Enfermería a domicilio", parentKey: "sa_servicios_salud", order: 4, tags: ["service", "health"], scope: "b2c" }),
    item({ key: "sa_cuidados_mayores", type: "business_type", label: "Cuidados para adultos mayores", parentKey: "sa_servicios_salud", order: 5, tags: ["service", "health"], scope: "b2c" }),
    item({ key: "sa_transporte_medico", type: "business_type", label: "Transporte médico (no emergencia)", parentKey: "sa_servicios_salud", order: 6, tags: ["service", "health", "logistics"], scope: "b2c" }),

    item({ key: "sa_gimnasio_bienestar", type: "business_type", label: "Gimnasio (bienestar)", parentKey: "sa_bienestar", order: 3, tags: ["service", "health"], scope: "b2c" }),
    item({ key: "sa_masajes_bienestar", type: "business_type", label: "Masajes (bienestar)", parentKey: "sa_bienestar", order: 4, tags: ["service", "health"], scope: "b2c" }),
    item({ key: "sa_spa_bienestar", type: "business_type", label: "Spa (bienestar)", parentKey: "sa_bienestar", order: 5, tags: ["service", "health"], scope: "b2c" }),

    /* -------------------------
       10 �?TECNOLOGÍA (faltantes)
    ------------------------- */
    item({ key: "te_consultoria_it", type: "business_type", label: "Consultoría IT", parentKey: "te_servicios_software", order: 4, tags: ["service", "tech", "professional", "b2b"], scope: "b2b" }),
    item({ key: "te_qa_testing", type: "business_type", label: "QA / testing", parentKey: "te_servicios_software", order: 5, tags: ["service", "tech", "b2b"], scope: "b2b" }),
    item({ key: "te_data_analytics", type: "business_type", label: "Data / analytics", parentKey: "te_servicios_software", order: 6, tags: ["service", "tech", "b2b"], scope: "b2b" }),

    item({ key: "te_devops", type: "business_type", label: "DevOps", parentKey: "te_infra_cloud", order: 3, tags: ["service", "tech", "b2b"], scope: "b2b" }),
    item({ key: "te_msp", type: "business_type", label: "MSP (managed services)", parentKey: "te_infra_cloud", order: 4, tags: ["service", "tech", "b2b"], scope: "b2b" }),
    item({ key: "te_hosting", type: "business_type", label: "Hosting", parentKey: "te_infra_cloud", order: 5, tags: ["service", "tech"], scope: "mixed" }),

    item({ key: "te_venta_equipos_it", type: "business_type", label: "Venta de equipos IT", parentKey: "te_hardware_soporte", order: 3, tags: ["retail", "tech"], scope: "mixed" }),
    item({ key: "te_servicio_redes", type: "business_type", label: "Instalación y soporte de redes", parentKey: "te_hardware_soporte", order: 4, tags: ["service", "tech", "installation", "maintenance"], scope: "b2b" }),
    item({ key: "te_servicio_cctv", type: "business_type", label: "Instalación de CCTV", parentKey: "te_hardware_soporte", order: 5, tags: ["service", "tech", "installation"], scope: "mixed" }),

    /* -------------------------
       13 �?INMOBILIARIO (faltantes)
    ------------------------- */
    item({ key: "in_renta_locales", type: "business_type", label: "Renta de locales", parentKey: "in_renta_comercial", order: 1, tags: ["real_estate"], scope: "mixed" }),
    item({ key: "in_renta_bodegas", type: "business_type", label: "Renta de bodegas", parentKey: "in_renta_comercial", order: 2, tags: ["real_estate"], scope: "mixed" }),
    item({ key: "in_renta_oficinas", type: "business_type", label: "Renta de oficinas", parentKey: "in_renta_comercial", order: 3, tags: ["real_estate"], scope: "mixed" }),
    item({ key: "in_renta_plaza_comercial", type: "business_type", label: "Renta de plaza/complejo comercial", parentKey: "in_renta_comercial", order: 4, tags: ["real_estate"], scope: "mixed" }),

    item({ key: "in_desarrollo_residencial", type: "business_type", label: "Desarrollo residencial", parentKey: "in_desarrollo_inmobiliario", order: 1, tags: ["real_estate", "construction"], scope: "mixed" }),
    item({ key: "in_desarrollo_comercial", type: "business_type", label: "Desarrollo comercial", parentKey: "in_desarrollo_inmobiliario", order: 2, tags: ["real_estate", "construction", "b2b"], scope: "b2b" }),
    item({ key: "in_loteo_urbanizacion", type: "business_type", label: "Loteo / urbanización", parentKey: "in_desarrollo_inmobiliario", order: 3, tags: ["real_estate", "construction"], scope: "mixed" }),

    item({ key: "in_property_management", type: "business_type", label: "Property management", parentKey: "in_administracion_inmobiliaria", order: 1, tags: ["real_estate", "service", "professional"], scope: "mixed" }),
    item({ key: "in_administracion_condominios", type: "business_type", label: "Administración de condominios", parentKey: "in_administracion_inmobiliaria", order: 2, tags: ["real_estate", "service", "professional"], scope: "mixed" }),
    item({ key: "in_cobranza_rentas", type: "business_type", label: "Cobranza de rentas", parentKey: "in_administracion_inmobiliaria", order: 3, tags: ["real_estate", "service"], scope: "mixed" }),

    item({ key: "in_bienes_raices", type: "business_type", label: "Bienes raíces (broker/asesoría)", parentKey: "in_compra_venta_intermediacion", order: 1, tags: ["real_estate", "service", "professional"], scope: "mixed" }),
    item({ key: "in_corretaje_inmobiliario", type: "business_type", label: "Corretaje inmobiliario", parentKey: "in_compra_venta_intermediacion", order: 2, tags: ["real_estate", "service", "professional"], scope: "mixed" }),
    item({ key: "in_valuos_tasaciones", type: "business_type", label: "Avalúos / tasaciones", parentKey: "in_compra_venta_intermediacion", order: 3, tags: ["real_estate", "service", "professional"], scope: "b2b" }),

    item({ key: "in_airbnb_gestion", type: "business_type", label: "Gestión Airbnb / renta corta", parentKey: "in_especializado", order: 1, tags: ["real_estate", "tourism", "service"], scope: "mixed" }),
    item({ key: "in_renta_vacacional", type: "business_type", label: "Renta vacacional", parentKey: "in_especializado", order: 2, tags: ["real_estate", "tourism"], scope: "b2c" }),
    item({ key: "in_parqueo_estacionamiento", type: "business_type", label: "Parqueo / estacionamiento", parentKey: "in_especializado", order: 3, tags: ["real_estate", "service"], scope: "mixed" }),

    /* -------------------------
       14 �?ENERGÍA Y SERVICIOS BÁSICOS (faltantes)
    ------------------------- */
    item({ key: "en_comercializacion_energia", type: "business_type", label: "Comercialización de energía", parentKey: "en_energia_electrica", order: 3, tags: ["energy", "b2b"], scope: "b2b" }),
    item({ key: "en_instalacion_solar", type: "business_type", label: "Instalación solar", parentKey: "en_energia_especializada", order: 1, tags: ["energy", "installation", "b2b"], scope: "mixed" }),
    item({ key: "en_mantenimiento_solar", type: "business_type", label: "Mantenimiento solar", parentKey: "en_energia_especializada", order: 2, tags: ["energy", "maintenance"], scope: "mixed" }),

    item({ key: "en_gasolinera", type: "business_type", label: "Gasolinera", parentKey: "en_combustibles_derivados", order: 1, tags: ["energy", "retail"], scope: "mixed" }),
    item({ key: "en_distribucion_gas", type: "business_type", label: "Distribución de gas", parentKey: "en_combustibles_derivados", order: 2, tags: ["energy", "logistics", "b2b"], scope: "b2b" }),
    item({ key: "en_lubricantes_energia", type: "business_type", label: "Lubricantes y derivados", parentKey: "en_combustibles_derivados", order: 3, tags: ["energy", "retail"], scope: "mixed" }),

    item({ key: "en_agua_potable", type: "business_type", label: "Agua potable (servicio)", parentKey: "en_agua_saneamiento", order: 1, tags: ["service"], scope: "mixed" }),
    item({ key: "en_saneamiento", type: "business_type", label: "Saneamiento", parentKey: "en_agua_saneamiento", order: 2, tags: ["service"], scope: "mixed" }),
    item({ key: "en_pozos_mantenimiento", type: "business_type", label: "Pozos / mantenimiento de sistemas", parentKey: "en_agua_saneamiento", order: 3, tags: ["service", "maintenance"], scope: "b2b" }),

    item({ key: "en_recoleccion_residuos", type: "business_type", label: "Recolección de residuos", parentKey: "en_complementarios", order: 1, tags: ["service", "logistics", "b2b"], scope: "b2b" }),
    item({ key: "en_reciclaje", type: "business_type", label: "Reciclaje", parentKey: "en_complementarios", order: 2, tags: ["service", "b2b"], scope: "mixed" }),
    item({ key: "en_servicios_ambientales", type: "business_type", label: "Servicios ambientales", parentKey: "en_complementarios", order: 3, tags: ["service", "b2b"], scope: "b2b" }),

    /* -------------------------
       15 �?ENTRETENIMIENTO Y DEPORTE (faltantes)
    ------------------------- */
    item({ key: "ed_salon_juegos", type: "business_type", label: "Salón de juegos", parentKey: "ed_entretenimiento_recreativo", order: 1, tags: ["service", "events"], scope: "b2c" }),
    item({ key: "ed_arcade", type: "business_type", label: "Arcade", parentKey: "ed_entretenimiento_recreativo", order: 2, tags: ["service"], scope: "b2c" }),
    item({ key: "ed_karaoke", type: "business_type", label: "Karaoke", parentKey: "ed_entretenimiento_recreativo", order: 3, tags: ["service"], scope: "b2c" }),

    item({ key: "ed_productora_eventos", type: "business_type", label: "Productora de eventos", parentKey: "ed_espectaculos_eventos", order: 1, tags: ["service", "events", "b2b"], scope: "b2b" }),
    item({ key: "ed_renta_sonido_luces", type: "business_type", label: "Renta de sonido y luces", parentKey: "ed_espectaculos_eventos", order: 2, tags: ["service", "events"], scope: "mixed" }),
    item({ key: "ed_artistas_show", type: "business_type", label: "Artistas / show", parentKey: "ed_espectaculos_eventos", order: 3, tags: ["service", "events"], scope: "mixed" }),

    item({ key: "ed_cine", type: "business_type", label: "Cine", parentKey: "ed_cine_medios", order: 1, tags: ["service"], scope: "b2c" }),
    item({ key: "ed_productora_media", type: "business_type", label: "Productora (medios)", parentKey: "ed_cine_medios", order: 2, tags: ["service", "creative"], scope: "mixed" }),
    item({ key: "ed_estudio_foto_video", type: "business_type", label: "Estudio de foto/video", parentKey: "ed_cine_medios", order: 3, tags: ["service", "creative"], scope: "mixed" }),

    item({ key: "ed_gimnasio", type: "business_type", label: "Gimnasio", parentKey: "ed_deporte_actividad_fisica", order: 1, tags: ["service", "health"], scope: "b2c" }),
    item({ key: "ed_escuela_deportiva", type: "business_type", label: "Escuela deportiva", parentKey: "ed_deporte_actividad_fisica", order: 2, tags: ["service"], scope: "b2c" }),
    item({ key: "ed_clases_fitness", type: "business_type", label: "Clases fitness", parentKey: "ed_deporte_actividad_fisica", order: 3, tags: ["service", "health"], scope: "b2c" }),

    item({ key: "ed_salon_fiestas_infantiles", type: "business_type", label: "Salón de fiestas infantiles", parentKey: "ed_recreacion_infantil_familiar", order: 1, tags: ["service", "events"], scope: "b2c" }),
    item({ key: "ed_parque_infantil", type: "business_type", label: "Parque infantil", parentKey: "ed_recreacion_infantil_familiar", order: 2, tags: ["service"], scope: "b2c" }),
    item({ key: "ed_entretenimiento_familiar", type: "business_type", label: "Entretenimiento familiar", parentKey: "ed_recreacion_infantil_familiar", order: 3, tags: ["service"], scope: "b2c" }),

    item({ key: "ed_discoteca", type: "business_type", label: "Discoteca", parentKey: "ed_entretenimiento_nocturno", order: 1, tags: ["service", "events"], scope: "b2c" }),
    item({ key: "ed_bar_nocturno", type: "business_type", label: "Bar nocturno", parentKey: "ed_entretenimiento_nocturno", order: 2, tags: ["service"], scope: "b2c" }),
    item({ key: "ed_eventos_nocturnos", type: "business_type", label: "Eventos nocturnos", parentKey: "ed_entretenimiento_nocturno", order: 3, tags: ["service", "events"], scope: "mixed" }),

    /* -------------------------
       16 �?ORGANIZACIONES / OTROS (faltantes)
    ------------------------- */
    item({ key: "oo_fundacion", type: "business_type", label: "Fundación", parentKey: "oo_sin_fines_lucro", order: 1, tags: ["service"], scope: "mixed" }),
    item({ key: "oo_asociacion", type: "business_type", label: "Asociación", parentKey: "oo_sin_fines_lucro", order: 2, tags: ["service"], scope: "mixed" }),
    item({ key: "oo_ong", type: "business_type", label: "ONG", parentKey: "oo_sin_fines_lucro", order: 3, tags: ["service"], scope: "mixed" }),

    item({ key: "oo_iglesia", type: "business_type", label: "Iglesia", parentKey: "oo_religiosas", order: 1, tags: ["service"], scope: "mixed" }),
    item({ key: "oo_ministerio", type: "business_type", label: "Ministerio", parentKey: "oo_religiosas", order: 2, tags: ["service"], scope: "mixed" }),
    item({ key: "oo_organizacion_religiosa", type: "business_type", label: "Organización religiosa", parentKey: "oo_religiosas", order: 3, tags: ["service"], scope: "mixed" }),

    item({ key: "oo_camara_comercio", type: "business_type", label: "Cámara de comercio", parentKey: "oo_gremiales", order: 1, tags: ["service", "b2b"], scope: "b2b" }),
    item({ key: "oo_asociacion_gremial", type: "business_type", label: "Asociación gremial", parentKey: "oo_gremiales", order: 2, tags: ["service", "b2b"], scope: "b2b" }),
    item({ key: "oo_colegio_profesional", type: "business_type", label: "Colegio profesional", parentKey: "oo_gremiales", order: 3, tags: ["service", "b2b"], scope: "b2b" }),

    item({ key: "oo_holding", type: "business_type", label: "Holding", parentKey: "oo_internas_holding", order: 1, tags: ["service", "b2b"], scope: "b2b" }),
    item({ key: "oo_corporativo_admin", type: "business_type", label: "Corporativo / administración central", parentKey: "oo_internas_holding", order: 2, tags: ["service", "b2b"], scope: "b2b" }),

    item({ key: "oo_proyecto_social", type: "business_type", label: "Proyecto social", parentKey: "oo_proyectos_especiales", order: 1, tags: ["service", "events"], scope: "mixed" }),
    item({ key: "oo_proyecto_inversion", type: "business_type", label: "Proyecto de inversión", parentKey: "oo_proyectos_especiales", order: 2, tags: ["service", "b2b"], scope: "b2b" }),

    item({ key: "oo_otros", type: "business_type", label: "Otros institucionales", parentKey: "oo_otros_institucionales", order: 1, tags: ["service"], scope: "mixed" }),

    /* -------------------------
       17 �?CONSTRUCCIÓN (faltantes)
    ------------------------- */
    item({ key: "c_constructora_residencial_general", type: "business_type", label: "Constructora residencial (general)", parentKey: "c_construccion_residencial", order: 2, tags: ["construction"], scope: "mixed" }),
    item({ key: "c_autoconstruccion_asistida", type: "business_type", label: "Autoconstrucción asistida", parentKey: "c_construccion_residencial", order: 3, tags: ["construction", "service"], scope: "b2c" }),

    item({ key: "c_constructora_comercial", type: "business_type", label: "Constructora comercial", parentKey: "c_construccion_comercial", order: 1, tags: ["construction", "b2b"], scope: "b2b" }),
    item({ key: "c_locales_naves_bodegas", type: "business_type", label: "Construcción de locales / naves / bodegas", parentKey: "c_construccion_comercial", order: 2, tags: ["construction", "b2b"], scope: "b2b" }),

    item({ key: "c_obra_civil", type: "business_type", label: "Obra civil", parentKey: "c_infraestructura", order: 1, tags: ["construction", "b2b"], scope: "b2b" }),
    item({ key: "c_calles_drenajes", type: "business_type", label: "Calles / drenajes / servicios", parentKey: "c_infraestructura", order: 2, tags: ["construction", "b2b"], scope: "b2b" }),
    item({ key: "c_movimiento_tierra", type: "business_type", label: "Movimiento de tierra", parentKey: "c_infraestructura", order: 3, tags: ["construction"], scope: "mixed" }),

    item({ key: "c_mantenimiento_edificios", type: "business_type", label: "Mantenimiento de edificios", parentKey: "c_remodelacion_mantenimiento", order: 3, tags: ["construction", "maintenance"], scope: "mixed" }),
    item({ key: "c_pintura_acabados", type: "business_type", label: "Pintura y acabados", parentKey: "c_remodelacion_mantenimiento", order: 4, tags: ["construction"], scope: "mixed" }),
    item({ key: "c_reparaciones_generales", type: "business_type", label: "Reparaciones generales", parentKey: "c_remodelacion_mantenimiento", order: 5, tags: ["construction", "maintenance"], scope: "mixed" }),

    item({ key: "c_electricidad_construccion", type: "business_type", label: "Electricidad (obra)", parentKey: "c_servicios_especializados", order: 1, tags: ["construction", "installation"], scope: "mixed" }),


    item({ key: "c_plomeria_construccion", type: "business_type", label: "Plomería (obra)", parentKey: "c_servicios_especializados", order: 2, tags: ["construction", "installation"], scope: "mixed" }),
    item({ key: "c_aire_acondicionado_obra", type: "business_type", label: "Aire acondicionado (obra)", parentKey: "c_servicios_especializados", order: 3, tags: ["construction", "installation", "maintenance"], scope: "mixed" }),
    item({ key: "c_albanileria", type: "business_type", label: "Albañilería", parentKey: "c_servicios_especializados", order: 4, tags: ["construction"], scope: "mixed" }),
    item({ key: "c_carpinteria_obra", type: "business_type", label: "Carpintería (obra)", parentKey: "c_servicios_especializados", order: 5, tags: ["construction"], scope: "mixed" }),
    item({ key: "c_herreria", type: "business_type", label: "Herrería", parentKey: "c_servicios_especializados", order: 6, tags: ["construction", "manufacturing"], scope: "mixed" }),
    item({ key: "c_soldadura_obra", type: "business_type", label: "Soldadura (obra)", parentKey: "c_servicios_especializados", order: 7, tags: ["construction", "manufacturing"], scope: "mixed" }),
    item({ key: "c_tablayeso_drywall", type: "business_type", label: "Tablayeso / drywall", parentKey: "c_servicios_especializados", order: 8, tags: ["construction"], scope: "mixed" }),
    item({ key: "c_cielo_falso", type: "business_type", label: "Cielo falso", parentKey: "c_servicios_especializados", order: 9, tags: ["construction"], scope: "mixed" }),
    item({ key: "c_pisos_ceramica", type: "business_type", label: "Pisos / cerámica", parentKey: "c_servicios_especializados", order: 10, tags: ["construction"], scope: "mixed" }),
    item({ key: "c_impermeabilizacion", type: "business_type", label: "Impermeabilización", parentKey: "c_servicios_especializados", order: 11, tags: ["construction", "maintenance"], scope: "mixed" }),
    item({ key: "c_techos_lamina", type: "business_type", label: "Techos / lámina", parentKey: "c_servicios_especializados", order: 12, tags: ["construction", "installation"], scope: "mixed" }),
    item({ key: "c_vidrieria", type: "business_type", label: "Vidriería", parentKey: "c_servicios_especializados", order: 13, tags: ["construction"], scope: "mixed" }),
    item({ key: "c_puertas_ventanas_instalacion", type: "business_type", label: "Instalación de puertas y ventanas", parentKey: "c_servicios_especializados", order: 14, tags: ["construction", "installation"], scope: "mixed" }),
    item({ key: "c_pintura_profesional", type: "business_type", label: "Pintura profesional", parentKey: "c_servicios_especializados", order: 15, tags: ["construction"], scope: "mixed" }),
    item({ key: "c_topografia", type: "business_type", label: "Topografía", parentKey: "c_servicios_especializados", order: 16, tags: ["construction", "professional", "b2b"], scope: "b2b" }),
    item({
        key: "c_estructuras",
        type: "business_type",
        label: "Estructuras metálicas",
        parentKey: "c_servicios_especializados",
        order: 17,
        tags: ["construction", "manufacturing"],
        scope: "mixed"
    }),

    // Gestión y supervisión
    item({ key: "c_direccion_proyecto", type: "business_type", label: "Dirección de proyecto", parentKey: "c_gestion_supervision", order: 1, tags: ["construction", "professional", "b2b"], scope: "b2b" }),
    item({ key: "c_supervision_obra", type: "business_type", label: "Supervisión de obra", parentKey: "c_gestion_supervision", order: 2, tags: ["construction", "professional", "b2b"], scope: "b2b" }),
    item({ key: "c_residencia_obra", type: "business_type", label: "Residente de obra", parentKey: "c_gestion_supervision", order: 3, tags: ["construction", "professional", "b2b"], scope: "b2b" }),
    item({ key: "c_presupuestos_control_costos", type: "business_type", label: "Presupuestos y control de costos", parentKey: "c_gestion_supervision", order: 4, tags: ["construction", "professional", "b2b"], scope: "b2b" }),
    item({ key: "c_planificacion_cronogramas", type: "business_type", label: "Planificación y cronogramas", parentKey: "c_gestion_supervision", order: 5, tags: ["construction", "professional", "b2b"], scope: "b2b" }),

];

function validateParentIntegrity(items) {
    const keys = new Set(items.map(i => i.key));

    for (const item of items) {
        if (item.parentKey && !keys.has(item.parentKey)) {
            throw new Error(
                `ParentKey inválido en ${item.key}: ${item.parentKey}`
            );
        }
    }
}

validateParentIntegrity(catalogo-negociosSeed);


export default catalogo-negociosSeed;

