// client/src/components/ui/IdeasModal.jsx
import React, { useEffect, useState } from "react";
import { useTheme } from "../@/core/theme/ThemeProvider.jsx";


const cx = (...c) => c.filter(Boolean).join(" ");

export default function IdeasModal({ open, onClose, onSave, initialData, mode = "create" }) {
  const { theme } = useTheme();
  const isNeo = theme?.startsWith("neo");
  const [idea, setIdea] = useState({ titulo: "", detalle: "" });

  useEffect(() => {
    setIdea({
      titulo: initialData?.titulo || "",
      detalle: initialData?.detalle || "",
    });
  }, [initialData, open]);

  if (!open) return null;
  const canSave = idea.titulo.trim().length >= 3;

  return (
    <div className="fixed inset-0 z-[210]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={cx("absolute left-1/2 top-20 -translate-x-1/2 w-[min(640px,92vw)] p-4 md:p-5", isNeo ? "neo-card" : "card")}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{mode === "edit" ? "Editar idea" : "Agregar idea"}</h3>
          <button onClick={onClose} className={cx(isNeo ? "neo-plate px-3 py-1.5" : "rounded-md px-3 py-1.5 bg-[var(--chip)] hover:bg-[var(--chip-hover)]")}>Cerrar</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs subtle mb-1">T��tulo</label>
            <input className="neo-input w-full px-3 py-2" value={idea.titulo} onChange={(e) => setIdea((x) => ({ ...x, titulo: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs subtle mb-1">Detalle (opcional)</label>
            <textarea className="neo-input w-full px-3 py-2" rows={3} value={idea.detalle} onChange={(e) => setIdea((x) => ({ ...x, detalle: e.target.value }))} />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className={cx(isNeo ? "neo-plate px-4 py-2" : "rounded-lg px-4 py-2 bg-[var(--chip)] hover:bg-[var(--chip-hover)]")}>Cancelar</button>
          <button
            disabled={!canSave}
            onClick={() => canSave && onSave?.({ titulo: idea.titulo.trim(), detalle: idea.detalle.trim() })}
            className={cx("btn-gradient btn-action", !canSave && "opacity-60 cursor-not-allowed")}
          >
            {mode === "edit" ? "Actualizar" : "Guardar idea"}
          </button>
        </div>
      </div>
    </div>
  );
}
