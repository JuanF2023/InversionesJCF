// server/src/modules/auth/application/services/auth.service.js
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_env";
const SESSION_HOURS = Number(process.env.SESSION_HOURS || 12);
const SESSION_MS = SESSION_HOURS * 60 * 60 * 1000;

const STATES = {
    ACTIVE: "ACTIVE",
    BREAK: "BREAK",
    CLOSED: "CLOSED",
};

const INTENTS = {
    ENTER: "enter",
    CONTINUE: "continue",
    VALIDATE_ONLY: "validate_only",
};

/**
 * Extrae token desde Authorization: Bearer o header x-session-token.
 * @param {Record<string, string>} headers
 * @returns {string|null}
 */
export function extractTokenFromHeaders(headers = {}) {
    const auth = headers?.authorization;

    if (typeof auth === "string" && auth.toLowerCase().startsWith("bearer ")) {
        return auth.slice(7).trim();
    }

    const xs = headers?.["x-session-token"];
    if (typeof xs === "string" && xs.trim()) {
        return xs.trim();
    }

    return null;
}

/**
 * Normaliza cualquier identificador a string.
 * @param {unknown} value
 * @returns {string}
 */
function asObjectIdString(value) {
    return value != null ? String(value).trim() : "";
}

/**
 * Firma el JWT de sesión.
 * @param {object} params
 * @param {object} params.user
 * @param {string} params.tenantId
 * @param {string|null} params.sessionId
 * @param {string|null} params.membershipId
 * @returns {{ ok: true, token: string, tenantId: string, expiresAtMs: number }}
 */
function signJwt({ user, tenantId, sessionId, membershipId }) {
    const payload = {
        sub: String(user._id),
        tenantId: String(tenantId),
        sessionId: sessionId ? String(sessionId) : null,
        membershipId: membershipId ? String(membershipId) : null,
        user: {
            _id: String(user._id),
            nombre: user?.nombre || user?.displayName || "",
            email: user?.email || "",
        },
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: `${SESSION_HOURS}h`,
    });

    return {
        ok: true,
        token,
        tenantId: String(tenantId),
        expiresAtMs: Date.now() + SESSION_MS,
    };
}

/**
 * Construye opciones de tenant para selección en login.
 * @param {Array<object>} tenants
 * @returns {Array<object>}
 */
function buildTenantOptions(tenants = []) {
    return tenants.map((tenant) => ({
        tenantId: asObjectIdString(tenant?._id),
        key: tenant?.key || "",
        name: tenant?.name || "",
        type: tenant?.type || "",
        slug: tenant?.slug || "",
    }));
}

export class AuthService {
    constructor({
        userRepository,
        sessionRepository,
        membershipsRepository,
        tenantsRepository,
    }) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.membershipsRepository = membershipsRepository;
        this.tenantsRepository = tenantsRepository;

        this.#assertRepos();
    }

    #assertRepos() {
        if (!this.userRepository) {
            throw new Error("[AuthService] userRepository no disponible.");
        }

        if (!this.sessionRepository) {
            throw new Error("[AuthService] sessionRepository no disponible.");
        }

        if (!this.membershipsRepository) {
            throw new Error("[AuthService] membershipsRepository no disponible.");
        }

        if (!this.tenantsRepository) {
            throw new Error("[AuthService] tenantsRepository no disponible.");
        }

        const requiredSessions = [
            "findActiveByUserId",
            "create",
            "findActiveByToken",
            "updateById",
            "forceCloseByQuery",
            "listActive",
        ];

        const missingSessions = requiredSessions.filter(
            (key) => typeof this.sessionRepository[key] !== "function"
        );

        if (missingSessions.length) {
            throw new Error(
                `[AuthService] SessionRepository incompleto: ${missingSessions.join(", ")}`
            );
        }

        const requiredMemberships = [
            "listActiveByUserId",
            "findActiveByUserAndTenant",
        ];

        const missingMemberships = requiredMemberships.filter(
            (key) => typeof this.membershipsRepository[key] !== "function"
        );

        if (missingMemberships.length) {
            throw new Error(
                `[AuthService] MembershipsRepository incompleto: ${missingMemberships.join(", ")}`
            );
        }

        const requiredTenants = ["findByIds", "findById"];

        const missingTenants = requiredTenants.filter(
            (key) => typeof this.tenantsRepository[key] !== "function"
        );

        if (missingTenants.length) {
            throw new Error(
                `[AuthService] TenantsRepository incompleto: ${missingTenants.join(", ")}`
            );
        }
    }

    /**
     * Login por PIN.
     * Regla de negocio:
     * 1. Validar PIN y memberships.
     * 2. Si el usuario tiene múltiples tenants y no envía tenantId, SIEMPRE pedir selección.
     * 3. Solo después validar sesión activa existente.
     *
     * @param {object} params
     * @param {string|number} params.pin
     * @param {string} [params.device]
     * @param {"enter"|"continue"|"validate_only"} [params.intent]
     * @param {string|null} [params.tenantId]
     * @param {string|null} [params.ipAddress]
     * @param {string|null} [params.userAgent]
     * @returns {Promise<object>}
     */
    async loginByPin({
        pin,
        device = "web",
        intent = INTENTS.ENTER,
        tenantId = null,
        ipAddress = null,
        userAgent = null,
    }) {
        const cleanedPin = String(pin || "").trim();

        if (!cleanedPin) {
            return {
                ok: false,
                statusCode: 400,
                code: "PIN_REQUIRED",
                message: "PIN requerido.",
            };
        }

        const user = await this.userRepository.findByPin(cleanedPin);

        if (!user) {
            return {
                ok: false,
                statusCode: 401,
                code: "PIN_INVALID",
                message: "PIN inválido.",
            };
        }

        const userId = asObjectIdString(user._id);

        const memberships = await this.membershipsRepository.listActiveByUserId(
            userId
        );

        if (!Array.isArray(memberships) || memberships.length === 0) {
            return {
                ok: false,
                statusCode: 409,
                code: "NO_MEMBERSHIP",
                message: "Usuario sin acceso a ningún tenant. Cree un membership activo.",
            };
        }

        if (intent === INTENTS.VALIDATE_ONLY) {
            return {
                ok: true,
                statusCode: 200,
                data: {
                    user: {
                        _id: user._id,
                        nombre: user?.nombre,
                        email: user?.email,
                    },
                },
            };
        }

        const distinctTenantIds = [
            ...new Set(
                memberships
                    .map((membership) => asObjectIdString(membership?.tenantId))
                    .filter(Boolean)
            ),
        ];

        let targetTenantId = tenantId ? asObjectIdString(tenantId) : "";

        /**
         * PRIORIDAD 1:
         * Si el usuario tiene múltiples tenants y no indicó tenant,
         * se obliga la selección ANTES de validar si ya existe sesión activa.
         */
        if (distinctTenantIds.length > 1 && !targetTenantId) {
            const tenants = await this.tenantsRepository.findByIds(distinctTenantIds);
            const options = buildTenantOptions(tenants);

            return {
                ok: false,
                statusCode: 409,
                code: "TENANT_AMBIGUOUS",
                message: "Usuario con múltiples tenants activos. Requiere selección de tenant.",
                data: {
                    tenants: options,
                },
            };
        }

        /**
         * PRIORIDAD 2:
         * Si solo existe un tenant activo, se resuelve automáticamente.
         */
        if (!targetTenantId && distinctTenantIds.length === 1) {
            targetTenantId = distinctTenantIds[0];
        }

        const membership =
            await this.membershipsRepository.findActiveByUserAndTenant({
                userId,
                tenantId: targetTenantId,
            });

        if (!membership) {
            return {
                ok: false,
                statusCode: 403,
                code: "TENANT_FORBIDDEN",
                message: "No tiene membership activo para el tenant seleccionado.",
            };
        }

        /**
         * PRIORIDAD 3:
         * Una vez resuelto el tenant, ahora sí se valida si ya existe una sesión activa.
         */
        const existing = await this.sessionRepository.findActiveByUserId(userId);

        if (intent === INTENTS.CONTINUE) {
            if (!existing) {
                return {
                    ok: false,
                    statusCode: 409,
                    code: "NO_ACTIVE_SESSION",
                    message: 'No hay sesión activa. Presione "Entrar" para iniciar sesión.',
                };
            }

            const existingTenantId = existing?.tenantId
                ? asObjectIdString(existing.tenantId)
                : "";

            if (existingTenantId && existingTenantId !== targetTenantId) {
                return {
                    ok: false,
                    statusCode: 409,
                    code: "SESSION_TENANT_MISMATCH",
                    message:
                        "Ya existe una sesión activa en otro tenant. Cierre esa sesión o use el mismo tenant.",
                    data: {
                        activeTenantId: existingTenantId,
                        requestedTenantId: targetTenantId,
                    },
                };
            }

            return {
                ok: true,
                statusCode: 200,
                data: {
                    token: existing.token,
                    tenantId: existingTenantId || targetTenantId,
                    sessionId: String(existing._id),
                    membershipId: asObjectIdString(
                        existing?.membershipId || membership?._id
                    ),
                    user,
                    state: existing.state || STATES.ACTIVE,
                    startedAt: existing.startedAt || null,
                    expiresAt: existing.expiresAt || null,
                },
            };
        }

        if (intent === INTENTS.ENTER && existing) {
            return {
                ok: false,
                statusCode: 409,
                code: "SESSION_EXISTS",
                message: 'Ya existe una sesión activa para este usuario. Usa "Continuar".',
                data: {
                    tenantId: asObjectIdString(existing?.tenantId),
                    sessionId: existing?._id ? String(existing._id) : null,
                    state: existing?.state || STATES.ACTIVE,
                },
            };
        }

        const now = new Date();
        const tempToken = `pending_${crypto.randomUUID()}`;
        const expiresAt = new Date(Date.now() + SESSION_MS);

        const created = await this.sessionRepository.create({
            userId,
            tenantId: targetTenantId,
            membershipId: asObjectIdString(membership._id),
            token: tempToken,
            deviceLabel: device,
            ipAddress: ipAddress || null,
            userAgent: userAgent || null,
            state: STATES.ACTIVE,
            startedAt: now,
            lastActiveAt: now,
            expiresAt,
        });

        const sessionId = created?._id ? String(created._id) : null;

        const signed = signJwt({
            user,
            tenantId: targetTenantId,
            sessionId,
            membershipId: membership._id,
        });

        await this.sessionRepository.updateById(sessionId, {
            token: signed.token,
            tenantId: signed.tenantId,
            membershipId: asObjectIdString(membership._id),
            lastActiveAt: now,
            expiresAt: new Date(signed.expiresAtMs),
        });

        await this.userRepository.updateLastLogin(userId, now);

        return {
            ok: true,
            statusCode: 200,
            data: {
                token: signed.token,
                tenantId: signed.tenantId,
                sessionId,
                membershipId: asObjectIdString(membership._id),
                user,
                state: STATES.ACTIVE,
                startedAt: now,
                expiresAt: new Date(signed.expiresAtMs),
            },
        };
    }

    /**
     * Verifica una sesión por token.
     * @param {object} params
     * @param {string} params.token
     * @param {boolean} [params.touchActivity=true]
     * @returns {Promise<object>}
     */
    async verifySession({ token, touchActivity = true }) {
        const cleanedToken = String(token || "").trim();

        if (!cleanedToken) {
            return {
                ok: false,
                statusCode: 401,
                code: "NO_TOKEN",
                message: "Token requerido.",
            };
        }

        let decoded;

        try {
            decoded = jwt.verify(cleanedToken, JWT_SECRET);
        } catch (error) {
            const isExpired = error?.name === "TokenExpiredError";

            return {
                ok: false,
                statusCode: 401,
                code: isExpired ? "TOKEN_EXPIRED" : "TOKEN_INVALID",
                message: isExpired
                    ? "Token inválido o expirado."
                    : "Token inválido.",
            };
        }

        const session = await this.sessionRepository.findActiveByToken(cleanedToken, {
            populateUser: true,
        });

        if (!session) {
            return {
                ok: false,
                statusCode: 401,
                code: "SESSION_INVALID",
                message: "Sesión no válida.",
            };
        }

        if (touchActivity) {
            if (typeof this.sessionRepository.touchActivityByToken === "function") {
                await this.sessionRepository.touchActivityByToken(cleanedToken);
            } else {
                await this.sessionRepository.updateById(String(session._id), {
                    lastActiveAt: new Date(),
                });
            }
        }

        const tenantId = session?.tenantId
            ? asObjectIdString(session.tenantId)
            : asObjectIdString(decoded?.tenantId);

        const membershipId = session?.membershipId
            ? asObjectIdString(session.membershipId)
            : asObjectIdString(decoded?.membershipId);

        return {
            ok: true,
            statusCode: 200,
            data: {
                token: cleanedToken,
                sessionId: String(session._id),
                tenantId: tenantId || null,
                membershipId: membershipId || null,
                state: session.state,
                user: session.userId || session.user || null,
            },
        };
    }

    /**
     * Cierra una sesión activa.
     * No elimina el documento; conserva historial para auditoría.
     *
     * @param {object} params
     * @param {string|null} [params.sessionId]
     * @param {string|null} [params.token]
     * @param {string|null} [params.tenantId]
     * @returns {Promise<object>}
     */
    async forceCloseSession({
        sessionId = null,
        token = null,
        tenantId = null,
    } = {}) {
        const normalizedSessionId = asObjectIdString(sessionId);
        const normalizedToken = String(token || "").trim();
        const normalizedTenantId = asObjectIdString(tenantId);

        if (!normalizedSessionId && !normalizedToken) {
            return {
                ok: false,
                statusCode: 400,
                code: "SESSION_IDENTIFIER_REQUIRED",
                message: "Debe enviar sessionId o token para cerrar la sesión.",
            };
        }

        const closeQuery = {};

        if (normalizedSessionId) {
            closeQuery._id = normalizedSessionId;
        }

        if (normalizedToken) {
            closeQuery.token = normalizedToken;
        }

        if (normalizedTenantId) {
            closeQuery.tenantId = normalizedTenantId;
        }

        const closedSession = await this.sessionRepository.forceCloseByQuery(closeQuery);

        if (!closedSession) {
            return {
                ok: false,
                statusCode: 404,
                code: "SESSION_NOT_FOUND",
                message: "No se encontró una sesión activa para cerrar.",
            };
        }

        return {
            ok: true,
            statusCode: 200,
            data: {
                sessionId: closedSession?._id
                    ? String(closedSession._id)
                    : normalizedSessionId || null,
                tenantId: closedSession?.tenantId
                    ? String(closedSession.tenantId)
                    : normalizedTenantId || null,
                state: closedSession?.state || STATES.CLOSED,
                closedAt: closedSession?.closedAt || new Date(),
            },
        };
    }
}

/* Backwards compatible exports */
export async function loginByPinService(payload, deps) {
    const svc = deps?.authService || deps?.service || null;

    if (svc instanceof AuthService) {
        return svc.loginByPin(payload);
    }

    throw new Error(
        "loginByPinService requiere { authService: AuthService } en deps."
    );
}

export async function verifySessionService(payload, deps) {
    const svc = deps?.authService || deps?.service || null;

    if (svc instanceof AuthService) {
        return svc.verifySession(payload);
    }

    throw new Error(
        "verifySessionService requiere { authService: AuthService } en deps."
    );
}

export async function forceCloseSessionService(payload, deps) {
    const svc = deps?.authService || deps?.service || null;

    if (svc instanceof AuthService) {
        return svc.forceCloseSession(payload);
    }

    throw new Error(
        "forceCloseSessionService requiere { authService: AuthService } en deps."
    );
}

export default AuthService;