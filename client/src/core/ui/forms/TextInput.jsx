// client/src/core/ui/forms/TextInput.jsx
import React from "react";
import clsx from "clsx";

import "@/core/ui/forms/styles/forms.css";

export default function TextInput({
  className = "",
  error = false,
  ...props
}) {
  return (
    <input
      className={clsx(
        "form-input",
        error && "form-input--error",
        className
      )}
      {...props}
    />
  );
}
