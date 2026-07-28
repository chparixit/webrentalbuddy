import type { Booking } from "../types/Booking";
import { getMediaUrl } from "../utils/media";

interface BookingCardProps {
  booking: Booking;
  onViewProperty?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  pending: { label: "Pending", bg: "#FFFBEB", color: "#D97706" },
  confirmed: { label: "Confirmed", bg: "#ECFDF5", color: "#059669" },
  cancelled: { label: "Cancelled", bg: "#FEF2F2", color: "#DC2626" },
  completed: { label: "Completed", bg: "#EFF6FF", color: "#2563EB" },
};

export const BookingCard = ({ booking, onViewProperty, onCancel }: BookingCardProps) => {
  const status = statusConfig[booking.status] || statusConfig.pending;
  const imgSrc = booking.property?.images?.[0]
    ? getMediaUrl(booking.property.images[0])
    : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60";

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "row",
        transition: "all 0.3s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
      }}
    >
      {/* Property Image */}
      <div
        style={{
          width: 200,
          minHeight: 180,
          flexShrink: 0,
          cursor: "pointer",
        }}
        onClick={() => onViewProperty?.(booking.property?._id)}
      >
        <img
          src={imgSrc}
          alt={booking.property?.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60";
          }}
        />
      </div>

      {/* Booking Details */}
      <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#111827",
                  cursor: "pointer",
                }}
                onClick={() => onViewProperty?.(booking.property?._id)}
              >
                {booking.property?.title || "Property"}
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6B7280" }}>
                {booking.property?.location}, {booking.property?.city}
              </p>
            </div>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 600,
                background: status.bg,
                color: status.color,
                whiteSpace: "nowrap",
              }}
            >
              {status.label}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              gap: 24,
              marginTop: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Check In
              </span>
              <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 500, color: "#111827" }}>
                {formatDate(booking.startDate)}
              </p>
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Check Out
              </span>
              <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 500, color: "#111827" }}>
                {formatDate(booking.endDate)}
              </p>
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Price
              </span>
              <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 700, color: "#2563EB" }}>
                NPR {booking.totalPrice?.toLocaleString()}
              </p>
            </div>
          </div>

          {booking.message && (
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#6B7280", fontStyle: "italic" }}>
              "{booking.message}"
            </p>
          )}
        </div>

        {/* Actions */}
        {booking.status === "pending" && onCancel && (
          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => onCancel(booking._id)}
              style={{
                padding: "8px 20px",
                background: "#FEF2F2",
                color: "#DC2626",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#FEE2E2")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#FEF2F2")}
            >
              Cancel Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};