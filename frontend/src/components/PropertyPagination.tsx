import type { PaginationMeta } from "../types/property";
import { colors, borderRadius, transitions } from "../styles/designTokens";

interface PropertyPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const PropertyPagination = ({ meta, onPageChange }: PropertyPaginationProps) => {
  const { page, totalPages, total } = meta;

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2;
    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
        padding: "32px 0",
      }}
    >
      <span style={{ fontSize: 13, color: colors.textMuted }}>
        Showing {(page - 1) * meta.limit + 1}–{Math.min(page * meta.limit, total)} of {total} properties
      </span>

      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          style={{
            width: 40,
            height: 40,
            borderRadius: borderRadius.xl,
            border: `1.5px solid ${colors.border}`,
            background: "white",
            color: page <= 1 ? colors.textMuted : colors.textPrimary,
            cursor: page <= 1 ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "inherit",
            transition: transitions.fast,
            opacity: page <= 1 ? 0.5 : 1,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {getPageNumbers().map((p, i) =>
          typeof p === "string" ? (
            <span key={`ellipsis-${i}`} style={{ padding: "0 4px", color: colors.textMuted, fontSize: 14 }}>
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
              style={{
                width: 40,
                height: 40,
                borderRadius: borderRadius.xl,
                border: p === page ? `2px solid ${colors.primary}` : `1.5px solid ${colors.border}`,
                background: p === page ? colors.primary : "white",
                color: p === page ? "white" : colors.textSecondary,
                fontWeight: p === page ? 700 : 500,
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "inherit",
                transition: transitions.fast,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          style={{
            width: 40,
            height: 40,
            borderRadius: borderRadius.xl,
            border: `1.5px solid ${colors.border}`,
            background: "white",
            color: page >= totalPages ? colors.textMuted : colors.textPrimary,
            cursor: page >= totalPages ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "inherit",
            transition: transitions.fast,
            opacity: page >= totalPages ? 0.5 : 1,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};
