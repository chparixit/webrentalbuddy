// === Pagination Component ===
// Renders page navigation controls using backend meta response
import type { PaginationMeta } from "../../types/user";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ meta, onPageChange }: PaginationProps) => {
  const { page, totalPages, total } = meta;

  // Don't render if there's only one page or no results
  if (totalPages <= 1) return null;

  // Generate page numbers to display (show max 5 pages around current)
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const delta = 2; // show 2 pages before and after current
    const start = Math.max(1, page - delta);
    const end = Math.min(totalPages, page + delta);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <span style={{ fontSize: 13, color: "#6B7280" }}>
        Showing page {page} of {totalPages} ({total} total users)
      </span>

      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {/* Previous button */}
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          style={{
            padding: "6px 12px",
            border: "1.5px solid #E5E7EB",
            borderRadius: 8,
            background: page <= 1 ? "#F9FAFB" : "white",
            color: page <= 1 ? "#D1D5DB" : "#374151",
            cursor: page <= 1 ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "inherit",
          }}
        >
          Previous
        </button>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} style={{ padding: "4px 8px", color: "#9CA3AF", fontSize: 13 }}>
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={{
                minWidth: 34,
                height: 34,
                border: p === page ? "none" : "1.5px solid #E5E7EB",
                borderRadius: 8,
                background: p === page ? "#2563EB" : "white",
                color: p === page ? "white" : "#374151",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: p === page ? 600 : 500,
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {p}
            </button>
          )
        )}

        {/* Next button */}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          style={{
            padding: "6px 12px",
            border: "1.5px solid #E5E7EB",
            borderRadius: 8,
            background: page >= totalPages ? "#F9FAFB" : "white",
            color: page >= totalPages ? "#D1D5DB" : "#374151",
            cursor: page >= totalPages ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "inherit",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};