// client/src/core/ui/forms/FormField.jsx
import React from "react";
import clsx from "clsx";

import "@/core/ui/forms/styles/forms.css";

export default function FormField({
  label,
  helper,
  error,
  children,
  className = "",
  required = false,
}) {
  return (
    <div className={clsx("form-field", className)}>
      {label ? (
        <label className="form-field__label">
          <span>{label}</span>

          {required ? (
            <span className="form-field__required">*</span>
          ) : null}
        </label>
      ) : null}

      {children}

      {helper && !error ? (
        <p className="form-field__helper">{helper}</p>
      ) : null}

      {error ? (
        <p className="form-field__error">{error}</p>
      ) : null}
    </div>
  );
}
