// client/src/core/theme/ThemeSwitcher.jsx
import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Palette } from "lucide-react";

import { useTheme } from "@/core/theme/ThemeProvider.jsx";
import { DEFAULT_THEME, THEME_LABELS, THEMES } from "@/core/theme/theme.constants.js";

function isValidTheme(theme) {
  return THEMES.includes(theme);
}

export default function ThemeSwitcher({ className = "" }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selectedTheme = isValidTheme(theme) ? theme : DEFAULT_THEME;
  const selectedLabel = THEME_LABELS[selectedTheme] || selectedTheme;

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSelect = (themeName) => {
    setTheme(themeName);
    setOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={["relative w-full min-w-[220px]", className].filter(Boolean).join(" ")}
    >
      <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[var(--text)] opacity-70">
        Tema visual
      </label>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--chip)] px-3 py-2 text-left text-sm font-semibold text-[var(--text)] shadow-sm transition hover:bg-[var(--chip-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Palette size={15} className="shrink-0 opacity-70" />
          <span className="truncate">{selectedLabel}</span>
        </span>

        <ChevronDown
          size={16}
          className={[
            "shrink-0 opacity-70 transition-transform",
            open ? "rotate-180" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Seleccionar tema visual"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-[120] max-h-72 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--panel)] p-1 shadow-2xl"
        >
          {THEMES.map((themeName) => {
            const active = themeName === selectedTheme;

            return (
              <button
                key={themeName}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => handleSelect(themeName)}
                className={[
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition",
                  active
                    ? "bg-[var(--accent)]/15 text-[var(--text)]"
                    : "text-[var(--text)] hover:bg-[var(--chip)]",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span>{THEME_LABELS[themeName] || themeName}</span>
                {active ? <Check size={15} className="shrink-0 text-[var(--accent)]" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
