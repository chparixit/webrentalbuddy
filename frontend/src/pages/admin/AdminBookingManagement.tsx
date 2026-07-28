import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteBooking,
  getBookings,
  updateBookingStatus,
} from "../../api/bookingApi";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { showToast } from "../../components/Toast";
import type { Booking } from "../../types/Booking";

interface AdminBookingManagementProps {
  onBack: () => void;
}

const statusStyles: Record<string, { label: string; bg: string; color: string; border: string }> = {
  pending: { label: "Pending", bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  confirmed: { label: "Confirmed", bg: "#ECFDF5", color: "#059669", border: "#A7F3D0" },
  cancelled: { label: "Cancelled", bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
  completed: { label: "Completed", bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
};

const statusOptions = ["all", "pending", "confirmed", "completed", "cancelled"] as const;

export const AdminBookingManagement = ({ onBack }: AdminBookingManagementProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getBookings();
      setBookings(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filteredBookings = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      if (!matchesStatus) return false;
      if (!query) return true;
      const propertyTitle = booking.property?.title?.toLowerCase() ?? "";
      const userName = booking.user?.name?.toLowerCase() ?? "";
      return propertyTitle.includes(query) || userName.includes(query);
    });
  }, [bookings, statusFilter, searchQuery]);

  const changeStatus = async (bookingId: string, nextStatus: string) => {
    try {
      setActionLoadingId(bookingId);
      const response = await updateBookingStatus(bookingId, nextStatus);
      setBookings((current) =>
        current.map((booking) =>
          booking._id === bookingId ? response.data : booking
        )
      );
      showToast(`Booking marked as ${nextStatus}`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update booking", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      await deleteBooking(deleteTarget._id);
      setBookings((current) =>
        current.filter((booking) => booking._id !== deleteTarget._id)
      );
      showToast("Booking removed successfully", "success");
      setDeleteTarget(null);
    } catch (err: any) {
      showToast(err.message || "Failed to delete booking", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div style={{ padding: "40px 80px", maxWidth: 1280, margin: "0 auto" }}>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "#2563EB",
          cursor: "pointer",
          fontSize: 14,
          marginBottom: 20,
          fontFamily: "inherit",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        ← Back to Admin Panel
      </button>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, color: "#111827" }}>
            Booking Management
          </h1>
          <p style={{ margin: 0, color: "#6B7280", fontSize: 15 }}>
            Review incoming bookings, confirm requests, and keep booking history clean.
          </p>
        </div>
      </div>

      {/* Filters bar */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search input */}
        <div style={{ position: "relative", flex: "1 1 280px", minWidth: 220 }}>
          <svg
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            width="18"
            height="18"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by property or user name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px 12px 42px",
              borderRadius: 12,
              border: "1px solid #E5E7EB",
              background: "white",
              fontFamily: "inherit",
              fontSize: 14,
              outline: "none",
              transition: "border-color 0.2s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#93C5FD")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#E5E7EB")}
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #E5E7EB",
            background: "white",
            fontFamily: "inherit",
            fontSize: 14,
            outline: "none",
            cursor: "pointer",
            minWidth: 160,
          }}
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "all" ? "All Statuses" : opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Error state */}
      {!loading && error && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "#FEF2F2",
            borderRadius: 16,
            border: "1px solid #FECACA",
          }}
        >
          <svg
            width="48"
            height="48"
            fill="none"
            stroke="#DC2626"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            style={{ marginBottom: 16 }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 600, color: "#991B1B" }}>
            Unable to load bookings
          </h3>
          <p style={{ margin: "0 0 20px", fontSize: 14, color: "#B91C1C" }}>{error}</p>
          <button
            onClick={loadBookings}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              background: "#DC2626",
              color: "white",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: "white",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div
                style={{
                  width: 200,
                  minHeight: 180,
                  flexShrink: 0,
                  background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s infinite",
                }}
              />
              <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                    <div
                      style={{
                        height: 18,
                        width: "60%",
                        borderRadius: 6,
                        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.5s infinite",
                      }}
                    />
                    <div
                      style={{
                        height: 14,
                        width: "40%",
                        borderRadius: 6,
                        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.5s infinite",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      height: 24,
                      width: 80,
                      borderRadius: 8,
                      background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.5s infinite",
                      alignSelf: "flex-start",
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
                  {[1, 2, 3].map((j) => (
                    <div key={j} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div
                        style={{
                          height: 10,
                          width: 60,
                          borderRadius: 4,
                          background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 1.5s infinite",
                        }}
                      />
                      <div
                        style={{
                          height: 14,
                          width: 90,
                          borderRadius: 4,
                          background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 1.5s infinite",
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  {[1, 2].map((k) => (
                    <div
                      key={k}
                      style={{
                        height: 36,
                        width: k === 1 ? 120 : 100,
                        borderRadius: 10,
                        background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.5s infinite",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
          <style>{`
            @keyframes shimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}</style>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredBookings.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "white",
            borderRadius: 16,
            border: "1px solid #E5E7EB",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              margin: "0 auto 20px",
              background: "#F3F4F6",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="36"
              height="36"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
            </svg>
          </div>
          <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 600, color: "#111827" }}>
            {searchQuery || statusFilter !== "all" ? "No matching bookings" : "No bookings yet"}
          </h3>
          <p style={{ margin: 0, fontSize: 14, color: "#6B7280", maxWidth: 400, marginInline: "auto" }}>
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "When guests make bookings, they will appear here."}
          </p>
        </div>
      )}

      {/* Bookings table */}
      {!loading && !error && filteredBookings.length > 0 && (
        <div
          style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid #E5E7EB",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 820,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#F9FAFB",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  {["Property", "Guest", "Dates", "Price", "Status", "Actions"].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: "14px 18px",
                        textAlign: header === "Actions" ? "right" : "left",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const badge = statusStyles[booking.status] || statusStyles.pending;
                  return (
                    <tr
                      key={booking._id}
                      style={{
                        borderBottom: "1px solid #F3F4F6",
                        transition: "background 0.15s",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = "#F9FAFB")}
                      onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* Property */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img
                            src={
                              booking.property?.images?.[0]
                                ? `${import.meta.env.VITE_MEDIA_URL || ""}${booking.property.images[0]}`
                                : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60"
                            }
                            alt={booking.property?.title}
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 10,
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60";
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>
                              {booking.property?.title || "Property"}
                            </div>
                            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                              {booking.property?.location}, {booking.property?.city}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Guest */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontWeight: 500, fontSize: 14, color: "#111827" }}>
                          {booking.user?.name || "User"}
                        </div>
                        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                          {booking.user?.email}
                        </div>
                      </td>

                      {/* Dates */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ fontSize: 13, color: "#374151" }}>
                          {formatDate(booking.startDate)}
                        </div>
                        <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                          → {formatDate(booking.endDate)}
                        </div>
                      </td>

                      {/* Price */}
                      <td style={{ padding: "14px 18px" }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#2563EB" }}>
                          NPR {booking.totalPrice?.toLocaleString()}
                        </span>
                      </td>

                      {/* Status badge */}
                      <td style={{ padding: "14px 18px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                          {booking.status === "pending" && (
                            <button
                              onClick={() => changeStatus(booking._id, "confirmed")}
                              disabled={actionLoadingId === booking._id}
                              style={{
                                padding: "6px 14px",
                                borderRadius: 8,
                                border: "none",
                                background: "#059669",
                                color: "white",
                                cursor: actionLoadingId === booking._id ? "not-allowed" : "pointer",
                                fontFamily: "inherit",
                                fontWeight: 600,
                                fontSize: 13,
                                opacity: actionLoadingId === booking._id ? 0.7 : 1,
                              }}
                            >
                              {actionLoadingId === booking._id ? "Saving..." : "Confirm"}
                            </button>
                          )}

                          {booking.status === "confirmed" && (
                            <button
                              onClick={() => changeStatus(booking._id, "completed")}
                              disabled={actionLoadingId === booking._id}
                              style={{
                                padding: "6px 14px",
                                borderRadius: 8,
                                border: "none",
                                background: "#2563EB",
                                color: "white",
                                cursor: actionLoadingId === booking._id ? "not-allowed" : "pointer",
                                fontFamily: "inherit",
                                fontWeight: 600,
                                fontSize: 13,
                                opacity: actionLoadingId === booking._id ? 0.7 : 1,
                              }}
                            >
                              {actionLoadingId === booking._id ? "Saving..." : "Mark Done"}
                            </button>
                          )}

                          {booking.status !== "cancelled" && booking.status !== "completed" && (
                            <button
                              onClick={() => changeStatus(booking._id, "cancelled")}
                              disabled={actionLoadingId === booking._id}
                              style={{
                                padding: "6px 14px",
                                borderRadius: 8,
                                border: "1px solid #FECACA",
                                background: "#FEF2F2",
                                color: "#DC2626",
                                cursor: actionLoadingId === booking._id ? "not-allowed" : "pointer",
                                fontFamily: "inherit",
                                fontWeight: 600,
                                fontSize: 13,
                                opacity: actionLoadingId === booking._id ? 0.7 : 1,
                              }}
                            >
                              {actionLoadingId === booking._id ? "Saving..." : "Cancel"}
                            </button>
                          )}

                          <button
                            onClick={() => setDeleteTarget(booking)}
                            style={{
                              padding: "6px 14px",
                              borderRadius: 8,
                              border: "1px solid #E5E7EB",
                              background: "white",
                              color: "#6B7280",
                              cursor: "pointer",
                              fontFamily: "inherit",
                              fontWeight: 600,
                              fontSize: 13,
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete booking"
        message={`This will remove the booking for "${deleteTarget?.property?.title || "this property"}".`}
        confirmLabel="Delete Booking"
        loading={deleteLoading}
      />
    </div>
  );
};
