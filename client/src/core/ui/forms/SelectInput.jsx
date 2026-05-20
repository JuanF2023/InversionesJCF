// client/src/core/ui/forms/SelectInput.jsx
import React from "react";
import clsx from "clsx";

import "@/core/ui/forms/styles/forms.css";

export default function SelectInput({
  children,
  className = "",
  error = false,
  ...props
}) {
  return (
    <select
      className={clsx(
        "form-input",
        "form-select",
        error && "form-input--error",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
