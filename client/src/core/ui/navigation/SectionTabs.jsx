// client/src/core/ui/navigation/SectionTabs.jsx
import React from "react";
import clsx from "clsx";

import "@/core/ui/navigation/styles/section-tabs.css";

export default function SectionTabs({ tabs = [], activeKey, onChange, className = "" }) {
    return (
        <div className={clsx("section-tabs", className)} role="tablist">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = tab.key === activeKey;

                return (
                    <button
                        key={tab.key}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(tab.key)}
                        className={clsx("section-tabs__item", active && "section-tabs__item--active")}
                    >
                        {Icon ? <Icon size={15} className="section-tabs__icon" /> : null}
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
