// server/src/modules/auth/infrastructure/repositories/sessions.repository.mongo.js
import { SessionModel } from "#modules/auth/infrastructure/mongoose/models/session.model.js";
import Membership from "#modules/auth/infrastructure/mongoose/models/membership.model.js";

const ACTIVE_STATES = ["ACTIVE", "BREAK"];
const CLOSED_STATE = "CLOSED";
const Q_MAX_TIME_MS = Number(process.env.MONGO_QUERY_MAX_TIME_MS || 2000);

function assertConnected() {
  const readyState = SessionModel?.db?.readyState;

  if (readyState !== 1) {
    const error = new Error(
      `[SessionsRepositoryMongo] Mongo no listo. readyState=${readyState}`
    );
    error.code = "MONGO_NOT_READY";
    throw error;
  }
}

function buildActiveFilter(extra = {}) {
  return {
    ...extra,
    state: { $in: ACTIVE_STATES },
  };
}

function asId(value) {
  return value != null ? String(value).trim() : null;
}

function asIsoDate(value) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function sanitizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function looksLikeEmail(value) {
  return typeof value === "string" && value.includes("@");
}

function resolveUserName(user) {
  if (!user || typeof user !== "object") {
    return "Usuario";
  }

  const displayName = sanitizeText(user.displayName);
  if (displayName && !looksLikeEmail(displayName)) {
    return displayName;
  }

  const firstName = sanitizeText(user.firstName);
  const lastName = sanitizeText(user.lastName);
  const fullComposedName = `${firstName} ${lastName}`.trim();
  if (fullComposedName && !looksLikeEmail(fullComposedName)) {
    return fullComposedName;
  }

  const legacyCandidates = [
    user.nombre,
    user.fullName,
    user.name,
    user.username,
  ]
    .map(sanitizeText)
    .filter(Boolean)
    .filter((value) => !looksLikeEmail(value));

  return legacyCandidates[0] || "Usuario";
}

function buildMembershipIndex(memberships = []) {
  const index = new Map();

  for (const membership of memberships) {
    const userId = asId(membership?.userId?._id || membership?.userId);
    const tenantId = asId(membership?.tenantId?._id || membership?.tenantId);

    if (!userId) continue;

    const exactKey = `${userId}:${tenantId || ""}`;
    if (!index.has(exactKey)) {
      index.set(exactKey, membership);
    }

    if (!index.has(userId)) {
      index.set(userId, membership);
    }
  }

  return index;
}

function buildRolesIndex(roles = []) {
  const index = new Map();

  for (const role of roles) {
    const id = asId(role?._id);
    if (!id) continue;
    index.set(id, role);
  }

  return index;
}

function resolveMembershipForSession(document, membershipIndex) {
  const userId = asId(document?.userId?._id || document?.userId);
  const tenantId = asId(document?.tenantId);

  if (!userId) return null;

  const exactKey = `${userId}:${tenantId || ""}`;
  return membershipIndex.get(exactKey) || membershipIndex.get(userId) || null;
}

function resolveRoleName({ membership = null, user = null, rolesIndex = null } = {}) {
  const roleIdValue =
    membership?.roleId?._id ||
    membership?.roleId ||
    membership?.role?._id ||
    membership?.role;

  const resolvedRole =
    rolesIndex && roleIdValue ? rolesIndex.get(asId(roleIdValue)) : null;

  const candidates = [
    membership?.roleId?.name,
    membership?.role?.name,
    resolvedRole?.name,
    membership?.roleName,
    user?.rol,
    user?.roleName,
    user?.role,
  ]
    .map(sanitizeText)
    .filter(Boolean);

  return candidates[0] || "Rol no disponible";
}

function mapActiveSession(document, membership = null, rolesIndex = null) {
  const user = document?.userId || null;
  const tenantId = asId(document?.tenantId || membership?.tenantId);

  return {
    sessionId: asId(document?._id),
    userId: asId(user?._id || document?.userId),
    membershipId: asId(membership?._id || document?.membershipId),
    tenantId,
    nombre: resolveUserName(user),
    email: sanitizeText(user?.email),
    rol: resolveRoleName({ membership, user, rolesIndex }),
    roleName: resolveRoleName({ membership, user, rolesIndex }),
    state: document?.state || "ACTIVE",
    startedAt: asIsoDate(document?.startedAt),
    expiresAt: asIsoDate(document?.expiresAt),
    lastActiveAt: asIsoDate(document?.lastActiveAt),
    orphan: !user || typeof user !== "object",
  };
}

export class SessionsRepositoryMongo {
  async findActiveByUserId(userId) {
    assertConnected();

    if (!userId) return null;

    return SessionModel.findOne(buildActiveFilter({ userId }))
      .sort({ startedAt: -1 })
      .maxTimeMS(Q_MAX_TIME_MS)
      .lean()
      .exec();
  }

  async create(data) {
    assertConnected();

    const document = new SessionModel(data);
    return document.save();
  }

  async findActiveByToken(token, options = {}) {
    assertConnected();

    const cleanedToken = String(token || "").trim();
    if (!cleanedToken) return null;

    let query = SessionModel.findOne(
      buildActiveFilter({ token: cleanedToken })
    ).maxTimeMS(Q_MAX_TIME_MS);

    if (options.populateUser) {
      query = query.populate("userId");
    }

    return query.exec();
  }

  async updateById(id, update) {
    assertConnected();

    if (!id) return null;

    return SessionModel.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    )
      .maxTimeMS(Q_MAX_TIME_MS)
      .exec();
  }

  async touchActivityByToken(token) {
    assertConnected();

    const cleanedToken = String(token || "").trim();
    if (!cleanedToken) return null;

    return SessionModel.updateOne(
      buildActiveFilter({ token: cleanedToken }),
      {
        $set: {
          lastActiveAt: new Date(),
        },
      }
    )
      .maxTimeMS(Q_MAX_TIME_MS)
      .exec();
  }

  async forceCloseByQuery(query = {}) {
    assertConnected();

    const normalizedQuery = { ...query };
    if (!Object.keys(normalizedQuery).length) return null;

    return SessionModel.findOneAndUpdate(
      buildActiveFilter(normalizedQuery),
      {
        $set: {
          state: CLOSED_STATE,
          closedAt: new Date(),
          closedReason: normalizedQuery.token
            ? "force_close_by_token"
            : "force_close",
          closeSource: "system",
          lastActiveAt: new Date(),
        },
      },
      { new: true }
    )
      .maxTimeMS(Q_MAX_TIME_MS)
      .exec();
  }

  async listActiveSessions({ tenantId = null } = {}) {
    assertConnected();

    const filter = buildActiveFilter();

    if (tenantId) {
      filter.tenantId = tenantId;
    }

    const documents = await SessionModel.find(filter)
      .populate({
        path: "userId",
        select:
          "displayName firstName lastName nombre fullName name username email rol role roleName",
      })
      .sort({ lastActiveAt: -1, startedAt: -1 })
      .maxTimeMS(Q_MAX_TIME_MS)
      .lean()
      .exec();

    if (!Array.isArray(documents) || documents.length === 0) {
      return {
        items: [],
        stale: false,
      };
    }

    const userIds = [
      ...new Set(
        documents
          .map((doc) => asId(doc?.userId?._id || doc?.userId))
          .filter(Boolean)
      ),
    ];

    if (!userIds.length) {
      return {
        items: documents.map((document) => mapActiveSession(document, null, null)),
        stale: true,
      };
    }

    try {
      const membershipFilter = {
        userId: { $in: userIds },
      };

      if (tenantId) {
        membershipFilter.tenantId = tenantId;
      }

      const memberships = await Membership.find(membershipFilter)
        .select("userId tenantId roleId roleName status")
        .maxTimeMS(Q_MAX_TIME_MS)
        .lean()
        .exec();

      const membershipIndex = buildMembershipIndex(memberships);

      const roleIds = [
        ...new Set(
          memberships
            .map((membership) => asId(membership?.roleId?._id || membership?.roleId))
            .filter(Boolean)
        ),
      ];

      let rolesIndex = new Map();

      if (roleIds.length > 0) {
        const roles = await SessionModel.db
          .collection("roles")
          .find(
            { _id: { $in: roleIds.map((id) => SessionModel.db.base.Types.ObjectId.createFromHexString(id)) } },
            { projection: { name: 1, key: 1, slug: 1, tenantType: 1 } }
          )
          .toArray();

        rolesIndex = buildRolesIndex(roles);
      }

      return {
        items: documents.map((document) => {
          const membership =
            resolveMembershipForSession(document, membershipIndex) || null;
          return mapActiveSession(document, membership, rolesIndex);
        }),
        stale: false,
      };
    } catch (error) {
      console.error("[SessionsRepositoryMongo] membership enrichment failed", {
        message: error?.message,
      });

      return {
        items: documents.map((document) => mapActiveSession(document, null, null)),
        stale: true,
      };
    }
  }

  async listActive(params = {}) {
    return this.listActiveSessions(params);
  }
}

export default SessionsRepositoryMongo;