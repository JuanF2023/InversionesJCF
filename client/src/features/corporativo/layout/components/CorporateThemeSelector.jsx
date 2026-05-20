// client/src/features/corporativo/layout/components/CorporateThemeSelector.jsx
import React from "react";
import { Check, Palette, X } from "lucide-react";

import { DEFAULT_THEME, THEMES } from "@/core/theme/theme.constants.js";
import { useTheme } from "@/core/theme/ThemeProvider.jsx";

const THEME_LABELS = {
  "neo-ice": "Ice",
  "neo-mint": "Mint",
  "neo-dawn": "Dawn",
  "neo-stone": "Stone",
  "neo-ocean": "Ocean",
  "neo-plum": "Plum",
  "neo-dusk": "Dusk",
  "neo-graphite": "Graphite",
  "neo-dark": "Dark",
  light: "Light",
};

function normalizeThemes(themes) {
  if (Array.isArray(themes)) return themes;
  return Object.values(themes || {});
}

function getThemeValue(option) {
  if (typeof option === "string") return option;
  return option?.id || option?.value || option?.key || DEFAULT_THEME;
}

export default function CorporateThemeSelector({ onClose }) {
  const { theme, setTheme } = useTheme();
  const availableThemes = normalizeThemes(THEMES);

  const handleSelectTheme = (value) => {
    setTheme(value);
    onClose?.();
  };

  return (
    <div className="corporate-theme-selector">
      <div className="corporate-theme-selector__header">
        <div className="corporate-theme-selector__label">
          <Palette size={13} />
          <span>Tema visual</span>
        </div>

        <button
          type="button"
          className="corporate-theme-selector__close"
          onClick={onClose}
          aria-label="Cerrar menú"
          title="Cerrar"
        >
          <X size={14} />
        </button>
      </div>

      <div className="corporate-theme-selector__grid">
        {availableThemes.map((option) => {
          const value = getThemeValue(option);
          const active = value === theme;

          return (
            <button
              key={value}
              type="button"
              className="corporate-theme-option"
              data-active={active ? "true" : "false"}
              onClick={() => handleSelectTheme(value)}
            >
              <span>{THEME_LABELS[value] || value}</span>
              {active ? <Check size={13} /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
