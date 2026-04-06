// server/src/core/interface/http/logging.js
import morgan from "morgan";

export function applyHttpLogging(app) {
  if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));
}
