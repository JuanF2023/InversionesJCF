// client/src/core/ui/components/DataTable.jsx
import React, { useMemo, useState } from "react";

const cx = (...classes) => classes.filter(Boolean).join(" ");

function readCellValue(row, key) {
  if (!key) return "";

  return String(key)
    .split(".")
    .reduce((acc, part) => (acc == null ? undefined : acc[part]), row);
}

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  searchable = false,
  searchPlaceholder = "Buscar...",
  rowKey = (row, index) => row?.id || row?._id || row?.codigo || index,
  footerLeft = null,
  emptyMessage = "No hay datos",
  dense = false,
  striped = false,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
}) {
  const [query, setQuery] = useState("");
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [page, setPage] = useState(1);

  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeData = Array.isArray(data) ? data : [];

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return safeData;

    const q = query.trim().toLowerCase();

    return safeData.filter((row) =>
      safeColumns.some((column) => {
        const value = column.render
          ? column.render(row)
          : readCellValue(row, column.key);

        return String(value ?? "").toLowerCase().includes(q);
      })
    );
  }, [safeData, query, safeColumns, searchable]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / currentPageSize));

  const visibleRows = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * currentPageSize;

    return filtered.slice(start, start + currentPageSize);
  }, [filtered, page, totalPages, currentPageSize]);

  return (
    <div className="space-y-3">
      {searchable ? (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--chip)] px-4 py-2 text-sm text-[var(--text)] outline-none transition focus:ring-2 focus:ring-[var(--accent)]/35 md:max-w-md"
          />

          <select
            value={currentPageSize}
            onChange={(event) => {
              setCurrentPageSize(Number(event.target.value));
              setPage(1);
            }}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--chip)] px-3 py-2 text-sm font-semibold text-[var(--text)] outline-none md:w-auto"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option} por página
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--chip)]">
              <tr>
                {safeColumns.map((column) => (
                  <th
                    key={column.key || column.header}
                    style={{ width: column.width }}
                    className={cx(
                      "px-4 text-left font-semibold",
                      dense ? "py-2" : "py-3",
                      column.align === "right" && "text-right",
                      column.align === "center" && "text-center"
                    )}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={safeColumns.length || 1}
                    className="p-6 text-center opacity-60"
                  >
                    Cargando...
                  </td>
                </tr>
              ) : visibleRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={safeColumns.length || 1}
                    className="p-6 text-center opacity-60"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                visibleRows.map((row, index) => (
                  <tr
                    key={rowKey(row, index)}
                    className={cx(
                      "border-t border-[var(--border)] transition hover:bg-[var(--chip)]",
                      striped && index % 2 === 1 && "bg-[color-mix(in_srgb,var(--panel)_88%,var(--chip)_12%)]"
                    )}
                  >
                    {safeColumns.map((column) => {
                      const value = column.render
                        ? column.render(row)
                        : readCellValue(row, column.key);

                      return (
                        <td
                          key={column.key || column.header}
                          className={cx(
                            "px-4",
                            dense ? "py-2" : "py-3",
                            column.align === "right" && "text-right",
                            column.align === "center" && "text-center",
                            column.className
                          )}
                        >
                          {value ?? "—"}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3 text-sm opacity-80 md:flex-row md:items-center md:justify-between">
        <div>{footerLeft}</div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={page <= 1}
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>

          <span className="text-xs font-semibold">
            Página {Math.min(page, totalPages)} de {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={page >= totalPages}
            className="rounded-lg border border-[var(--border)] px-3 py-1.5 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
