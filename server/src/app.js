// server/src/app.js
import express from "express";

import { applyHttpSecurity } from "./core/interface/http/security.js";
import { applyHttpParsers } from "./core/interface/http/parsers.js";
import { applyHttpLogging } from "./core/interface/http/logging.js";
import { applyHttpContext } from "./core/interface/http/context.js";
import { mountStatic } from "./core/interface/http/static.js";
import { mountRoutes } from "./core/interface/http/routes.js";
import { mountErrors } from "./core/interface/http/errors.js";

const app = express();

app.disable("x-powered-by");
app.set("etag", false);
if (process.env.TRUST_PROXY === "1") app.set("trust proxy", true);

applyHttpSecurity(app);
applyHttpParsers(app);
applyHttpLogging(app);
applyHttpContext(app);
mountStatic(app);
mountRoutes(app);
mountErrors(app);

export default app;
