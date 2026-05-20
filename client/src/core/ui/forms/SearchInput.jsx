// client/src/core/ui/forms/SearchInput.jsx
import React from "react";
import { Search } from "lucide-react";
import clsx from "clsx";

import "@/core/ui/forms/styles/forms.css";

export default function SearchInput({
  className = "",
  inputClassName = "",
  ...props
}) {
  return (
    <div className={clsx("search-input", className)}>
      <Search
        size={16}
        className="search-input__icon"
      />

      <input
        type="text"
        className={clsx(
          "form-input search-input__control",
          inputClassName
        )}
        {...props}
      />
    </div>
  );
}
