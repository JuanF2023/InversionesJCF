// client/src/core/ui/tables/TablePagination.jsx
import React from "react";

export default function TablePagination({
  page = 1,
  totalPages = 1,
  onPrevious,
  onNext,
  className = "",
}) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-sm text-[var(--text-soft)]">
        Página {page} de {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={page <= 1}
          className="
            rounded-xl
            border border-[var(--border)]
            bg-[var(--surface)]
            px-3 py-2
            text-sm font-medium
            transition-all
            hover:border-[var(--accent)]
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          Anterior
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          className="
            rounded-xl
            border border-[var(--border)]
            bg-[var(--surface)]
            px-3 py-2
            text-sm font-medium
            transition-all
            hover:border-[var(--accent)]
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
