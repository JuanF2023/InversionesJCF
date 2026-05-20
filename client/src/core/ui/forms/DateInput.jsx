// client/src/core/ui/forms/DateInput.jsx
import React from "react";
import clsx from "clsx";

import "@/core/ui/forms/styles/forms.css";

export default function DateInput({
  className = "",
  error = false,
  ...props
}) {
  return (
    <input
      type="date"
      className={clsx(
        "form-input",
        error && "form-input--error",
        className
      )}
      {...props}
    />
  );
}
