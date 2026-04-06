// server/src/core/interface/http/middlewares/authChain.middleware.js
import actor from "./actor.middleware.js";
import requireAuth from "./requireAuth.middleware.js";
import sessionActivityMiddleware from "./sessionActivity.middleware.js";

/**
 * authChain()
 * - Devuelve una LISTA (iterable) de middlewares.
 * - Útil para: router.use(...authChain()) o const guard=[...authChain(), ...]
 *
 * @param {{
 *  requireAuth?: boolean,
 *  touchActivity?: boolean,
 *  strict?: boolean
 * }} opts
 * @returns {Array<Function>}
 */
export function authChain(opts = {}) {
  const chain = [];

  chain.push(actor());

  const requireAuthEnabled = opts.requireAuth !== false;
  if (requireAuthEnabled) {
    chain.push(
      requireAuth({
        strict: opts.strict === true,
        touchActivity: false,
      })
    );
  }

  const touch = opts.touchActivity === true;
  if (touch) {
    chain.push(sessionActivityMiddleware());
  }

  return chain;
}

/**
 * authChainHandler()
 * - Devuelve UN middleware (no iterable).
 * - Útil para: router.use(authChainHandler()) si necesitas opciones.
 *
 * @param {{
 *  requireAuth?: boolean,
 *  touchActivity?: boolean,
 *  strict?: boolean
 * }} opts
 * @returns {(req,res,next)=>void}
 */
export function authChainHandler(opts = {}) {
  const chain = authChain(opts);

  return function authChainUnified(req, res, next) {
    let idx = 0;

    function run(err) {
      if (err) return next(err);
      const mw = chain[idx++];
      if (!mw) return next();
      try {
        return mw(req, res, run);
      } catch (e) {
        return next(e);
      }
    }

    return run();
  };
}

/**
 * DEFAULT (enterprise):
 * - Exporta un middleware listo para router.use(authChain)
 * - Mantiene compatibilidad con tus routers existentes: router.use(authChain);
 */
const authChainMiddleware = authChainHandler();
export default authChainMiddleware;
