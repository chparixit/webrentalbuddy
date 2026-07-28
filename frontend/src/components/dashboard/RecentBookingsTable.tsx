import { memo } from "react";
import type { BookingTableItem } from "../../types/dashboard";
import { getMediaUrl } from "../../utils/media";

interface RecentBookingsTableProps {
  bookings: BookingTableItem[];
  onViewAll?: () => void;
}

const statusConfig: Record<string, { bg: string; color: string; dot: string }> = {
  pending: { bg: "#FEF3C7", color: "#92400E", dot: "#D97706" },
  confirmed: { bg: "#DBEAFE", color: "#1E40AF", dot: "#2563EB" },
  completed: { bg: "#D1FAE5", color: "#065F46", dot: "#059669" },
  cancelled: { bg: "#FEE2E2", color: "#991B1B", dot: "#DC2626" },
};

const SingleBookingRow = memo(function SingleBookingRow({
  booking,
}: {
  booking: BookingTableItem;
}) {
  const status = statusConfig[booking.status] || statusConfig.pending;

  return (
    <tr
      style={{
        borderBottom: "1px solid #F3F4F6",
        transition: "background 0.15s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.background = "#F9FAFB")}
      onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td style={{ padding: "16px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              overflow: "hidden",
              background: "#F3F4F6",
              flexShrink: 0,
            }}
          >
            <img
              src={getMediaUrl(booking.propertyImage)}
              alt={booking.propertyName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44'%3E%3Crect width='44' height='44' fill='%23F3F4F6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239CA3AF' font-size='18'%3E🏠%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          <div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#111827",
                display: "block",
                marginBottom: 2,
              }}
            >
              {booking.propertyName}
            </span>
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>
              {booking.location}
            </span>
          </div>
        </div>
      </td>
      <td style={{ padding: "16px 12px", fontSize: 13, color: "#6B7280", whiteSpace: "nowrap" }}>
        {booking.bookingDate}
      </td>
      <td style={{ padding: "16px 12px" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            background: status.bg,
            color: status.color,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: status.dot,
            }}
            aria-hidden="true"
          />
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </td>
      <td
        style={{
          padding: "16px 12px",
          fontSize: 14,
          fontWeight: 600,
          color: "#111827",
          whiteSpace: "nowrap",
        }}
      >
        रू {booking.amount.toLocaleString()}
      </td>
      <td style={{ padding: "16px 12px" }}>
        {booking.onView && (
          <button
            onClick={booking.onView}
            style={{
              padding: "6px 14px",
              background: "transparent",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#2563EB";
              e.currentTarget.style.color = "#2563EB";
              e.currentTarget.style.background = "#EFF6FF";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#E5E7EB";
              e.currentTarget.style.color = "#374151";
              e.currentTarget.style.background = "transparent";
            }}
            aria-label={`View booking for ${booking.propertyName}`}
          >
            View
          </button>
        )}
      </td>
    </tr>
  );
});

export const RecentBookingsTable = memo(function RecentBookingsTable({
  bookings,
  onViewAll,
}: RecentBookingsTableProps) {
  if (bookings.length === 0) {
    return (
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 32,
          border: "1px solid #F3F4F6",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: 28,
          }}
          aria-hidden="true"
        >
          📅
        </div>
        <h4
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#111827",
            margin: "0 0 4px",
          }}
        >
          No bookings yet
        </h4>
        <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 16px" }}>
          Start exploring properties and make your first booking!
        </p>
        {onViewAll && (
          <button
            onClick={onViewAll}
            style={{
              padding: "10px 24px",
              background: "#2563EB",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Browse Properties
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        border: "1px solid #F3F4F6",
        overflow: "hidden",
      }}
      role="region"
      aria-label="Recent bookings"
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>
          Recent Bookings
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            style={{
              padding: "6px 14px",
              background: "transparent",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              color: "#2563EB",
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#EFF6FF";
              e.currentTarget.style.borderColor = "#2563EB";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#E5E7EB";
            }}
            aria-label="View all bookings"
          >
            View All
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 600,
          }}
          role="table"
        >
          <thead>
            <tr style={{ background: "#F9FAFB" }}>
              {["Property", "Date", "Status", "Amount", ""].map((header) => (
                <th
                  key={header}
                  style={{
                    padding: "12px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#6B7280",
                    textAlign: "left",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                  scope="col"
                >
                  {header || "Action"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <SingleBookingRow key={booking.id} booking={booking} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});