import mongoose from "mongoose";

export function validateObjectId(...paramNames) {
  const fields = paramNames.flat().filter(Boolean);
  if (fields.length === 0) {
    return (req, res, next) => {
      const id = req.params?.id;
      if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ ok: false, message: `ID inválido: ${id}` });
      }
      next();
    };
  }
  return (req, res, next) => {
    for (const name of fields) {
      const val = req.params?.[name];
      if (val && !mongoose.Types.ObjectId.isValid(val)) {
        return res.status(400).json({ ok: false, message: `ID inválido en '${name}': ${val}` });
      }
    }
    next();
  };
}

export function validateObjectIdQuery(...names) {
  const fields = names.flat().filter(Boolean);
  return (req, res, next) => {
    for (const name of fields) {
      const val = req.query?.[name];
      if (val && !mongoose.Types.ObjectId.isValid(val)) {
        return res.status(400).json({ ok: false, message: `ID inválido en query '${name}': ${val}` });
      }
    }
    next();
  };
}

export function validateObjectIdBody(...names) {
  const fields = names.flat().filter(Boolean);
  return (req, res, next) => {
    for (const name of fields) {
      const val = req.body?.[name];
      if (val && !mongoose.Types.ObjectId.isValid(val)) {
        return res.status(400).json({ ok: false, message: `ID inválido en body '${name}': ${val}` });
      }
    }
    next();
  };
}
