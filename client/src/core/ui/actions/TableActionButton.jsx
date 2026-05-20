// client/src/core/ui/actions/TableActionButton.jsx
import React from "react";
import clsx from "clsx";

import "@/core/ui/actions/styles/table-action-button.css";

const VARIANT_CLASS = {
  view: "table-action-btn--view",
  edit: "table-action-btn--edit",
  access: "table-action-btn--access",
  warning: "table-action-btn--warning",
  danger: "table-action-btn--danger",
  neutral: "table-action-btn--neutral",
};

export default function TableActionButton({
  as: Component = "button",
  icon: Icon,
  children,
  variant = "neutral",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <Component
      type={Component === "button" ? type : undefined}
      className={clsx(
        "table-action-btn",
        VARIANT_CLASS[variant],
        className
      )}
      {...props}
    >
      {Icon ? <Icon size={14} className="table-action-btn__icon" /> : null}

      <span>{children}</span>
    </Component>
  );
}
