import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { EmptyState } from "../../components/EmptyState";
import { SearchBar } from "../../components/SearchBar";
import { showToast } from "../../components/Toast";
import { getBookings, updateBookingStatus } from "../../api/bookingApi";
import { colors, borderRadius, transitions } from "../../styles/designTokens";
import type { Booking } from "../../types/Booking";

interface BookingHistoryPageProps {
  onNavigate: (page: string, params?: any) => void;
}

const statusConfig: Record<string, { label: string; variant: "warning" | "success" | "error" | "info" }> = {
  pending: { label: "Pending", variant: "warning" },
  confirmed: { label: "Confirmed", variant: "success" },
  cancelled: { label: "Cancelled", variant: "error" },
  completed: { label: "Completed", variant: "info" },
};

const getImageUrl = (img: string) => {
  if (img.startsWith("http")) return img;
  return `http://192.168.1.66:5000${img}`;
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// formatDateTime helper removed to avoid unused variable checks

export const BookingHistoryPage = ({ onNavigate }: BookingHistoryPageProps) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"current" | "previous">("current");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "active">("newest");

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError("");
      const res = await getBookings();
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const currentBookings = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed"
  );
  const previousBookings = bookings.filter(
    (b) => b.status === "cancelled" || b.status === "completed"
  );

  const baseBookings = activeTab === "current" ? currentBookings : previousBookings;

  // Filter, search, sort
  const displayBookings = useMemo(() => {
    let filtered = baseBookings;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.property?.title?.toLowerCase().includes(term) ||
          b.property?.location?.toLowerCase().includes(term) ||
          b.property?.city?.toLowerCase().includes(term) ||
          b._id?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "active") {
        const order = { pending: 0, confirmed: 1, completed: 2, cancelled: 3 };
        return (order[a.status] || 0) - (order[b.status] || 0);
      }
      return 0;
    });

    return filtered;
  }, [baseBookings, searchTerm, statusFilter, sortBy]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setLoading(true);
      await updateBookingStatus(bookingId, "cancelled");
      showToast("Booking cancelled successfully", "success");
      await fetchBookings();
    } catch (err: any) {
      showToast(err.message || "Failed to cancel booking", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = (bookingId: string) => {
    console.info("Download receipt for booking ID:", bookingId);
    showToast("Receipt download coming soon", "info");
  };

  const handleContactOwner = (booking: Booking) => {
    if (booking.property?.landlord?.email) {
      window.location.href = `mailto:${booking.property.landlord.email}`;
    } else {
      showToast("Owner contact info not available", "warning");
    }
  };

  if (!user) {
    return (
      <div style={{ padding: "40px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 400, margin: "60px auto" }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16 }}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <h2 style={{ color: colors.textPrimary, fontSize: 20, margin: "0 0 8px" }}>
            Please login to view your bookings
          </h2>
          <p style={{ color: colors.textTertiary, fontSize: 14, margin: "0 0 20px" }}>
            Sign in to track and manage your rental bookings.
          </p>
          <Button variant="primary" size="md" onClick={() => onNavigate("login")}>
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 80px 60px", maxWidth: 1280, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.textPrimary, margin: "0 0 8px" }}>
          My Bookings
          {bookings.length > 0 && (
            <span style={{ fontSize: 18, fontWeight: 500, color: colors.textTertiary, marginLeft: 10 }}>
              ({bookings.length})
            </span>
          )}
        </h1>
        <p style={{ fontSize: 15, color: colors.textTertiary, margin: 0 }}>
          Track and manage your rental bookings
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 24,
          background: colors.bgTertiary,
          borderRadius: borderRadius.xl,
          padding: 4,
          width: "fit-content",
        }}
      >
        {(["current", "previous"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 24px",
              background: activeTab === tab ? colors.bgPrimary : "transparent",
              color: activeTab === tab ? colors.textPrimary : colors.textTertiary,
              border: "none",
              borderRadius: borderRadius.lg,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: activeTab === tab ? colors.shadowSm : "none",
              transition: transitions.fast,
            }}
          >
            {tab === "current" ? "Current" : "Previous"}
            <span
              style={{
                marginLeft: 8,
                padding: "1px 8px",
                borderRadius: borderRadius.sm,
                fontSize: 11,
                background: activeTab === tab ? colors.primaryLight : colors.bgTertiary,
                color: activeTab === tab ? colors.primary : colors.textTertiary,
              }}
            >
              {tab === "current" ? currentBookings.length : previousBookings.length}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      {!loading && baseBookings.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1, minWidth: 250 }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search by property, location, or ID..."
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "10px 14px",
              border: `1.5px solid ${colors.border}`,
              borderRadius: borderRadius.xl,
              fontSize: 13,
              color: colors.textPrimary,
              background: colors.bgPrimary,
              outline: "none",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            {activeTab === "current" ? (
              <>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
              </>
            ) : (
              <>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </>
            )}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: "10px 14px",
              border: `1.5px solid ${colors.border}`,
              borderRadius: borderRadius.xl,
              fontSize: 13,
              color: colors.textPrimary,
              background: colors.bgPrimary,
              outline: "none",
              fontFamily: "inherit",
              cursor: "pointer",
            }}
            aria-label="Sort bookings"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="active">Active First</option>
          </select>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div
          style={{
            padding: 40,
            background: colors.errorBg,
            borderRadius: borderRadius["2xl"],
            border: `1px solid #FECACA`,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={colors.error} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p style={{ color: colors.error, fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>Failed to load bookings</p>
          <p style={{ color: colors.textTertiary, fontSize: 13, margin: "0 0 16px" }}>{error}</p>
          <Button variant="danger" size="md" onClick={fetchBookings}>Retry</Button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
          <p style={{ color: colors.textTertiary, fontSize: 14, marginTop: 12 }}>Loading bookings...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && baseBookings.length === 0 && (
        <EmptyState
          title={activeTab === "current" ? "No current bookings" : "No previous bookings"}
          description={
            activeTab === "current"
              ? "You haven't made any bookings yet. Browse properties to get started."
              : "Your completed and cancelled bookings will appear here."
          }
          action={
            activeTab === "current"
              ? { label: "Browse Properties", onClick: () => onNavigate("properties") }
              : undefined
          }
          icon={
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
        />
      )}

      {/* No search results */}
      {!loading && !error && baseBookings.length > 0 && displayBookings.length === 0 && (
        <EmptyState
          title="No matching bookings"
          description="Try adjusting your search or filter criteria."
          action={{ label: "Clear Filters", onClick: () => { setSearchTerm(""); setStatusFilter("all"); } }}
        />
      )}

      {/* Desktop Table View */}
      {!loading && displayBookings.length > 0 && (
        <>
          {/* Desktop Table */}
          <div style={{ display: "none", "@media (min-width: 768px)": { display: "block" } } as any}>
            <div
              style={{
                background: colors.bgPrimary,
                borderRadius: borderRadius["2xl"],
                overflow: "hidden",
                boxShadow: colors.shadowMd,
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.borderLight}`, background: colors.bgSecondary }}>
                    {["Property", "Booking ID", "Dates", "Total", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "14px 20px",
                          textAlign: "left",
                          fontSize: 11,
                          fontWeight: 600,
                          color: colors.textTertiary,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayBookings.map((booking) => {
                    const status = statusConfig[booking.status] || statusConfig.pending;
                    const imgSrc = booking.property?.images?.[0]
                      ? getImageUrl(booking.property.images[0])
                      : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&auto=format&fit=crop&q=60";

                    return (
                      <tr
                        key={booking._id}
                        style={{
                          borderBottom: `1px solid ${colors.borderLight}`,
                          transition: transitions.fast,
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = colors.bgSecondary; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <img
                              src={imgSrc}
                              alt={booking.property?.title}
                              style={{
                                width: 48,
                                height: 48,
                                borderRadius: borderRadius.lg,
                                objectFit: "cover",
                                flexShrink: 0,
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&auto=format&fit=crop&q=60";
                              }}
                            />
                            <div>
                              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>
                                {booking.property?.title || "Property"}
                              </p>
                              <p style={{ margin: "2px 0 0", fontSize: 12, color: colors.textTertiary }}>
                                {booking.property?.location}, {booking.property?.city}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ fontSize: 12, color: colors.textTertiary, fontFamily: "monospace" }}>
                            #{booking._id.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ fontSize: 13, color: colors.textPrimary }}>
                            <div>{formatDate(booking.startDate)}</div>
                            <div style={{ color: colors.textTertiary, fontSize: 12 }}>→ {formatDate(booking.endDate)}</div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: colors.primary }}>
                            NPR {booking.totalPrice?.toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <Badge variant={status.variant} size="sm">{status.label}</Badge>
                        </td>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onNavigate("property-details", { id: booking.property?._id })}
                              ariaLabel="View property details"
                            >
                              View
                            </Button>
                            {booking.status === "pending" && (
                              <Button
                                variant="dangerOutline"
                                size="sm"
                                onClick={() => handleCancelBooking(booking._id)}
                                ariaLabel="Cancel booking"
                              >
                                Cancel
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadReceipt(booking._id)}
                              ariaLabel="Download receipt"
                            >
                              Receipt
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleContactOwner(booking)}
                              ariaLabel="Contact owner"
                            >
                              Contact
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {displayBookings.map((booking) => {
              const status = statusConfig[booking.status] || statusConfig.pending;
              const imgSrc = booking.property?.images?.[0]
                ? getImageUrl(booking.property.images[0])
                : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop&q=60";

              return (
                <div
                  key={booking._id}
                  style={{
                    background: colors.bgPrimary,
                    borderRadius: borderRadius["2xl"],
                    overflow: "hidden",
                    boxShadow: colors.shadowMd,
                    transition: transitions.slow,
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.boxShadow = colors.shadowXl; }}
                  onMouseOut={(e) => { e.currentTarget.style.boxShadow = colors.shadowMd; }}
                >
                  <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                    {/* Image */}
                    <div
                      style={{
                        width: 160,
                        minHeight: 160,
                        flexShrink: 0,
                        cursor: "pointer",
                      }}
                      onClick={() => onNavigate("property-details", { id: booking.property?._id })}
                    >
                      <img
                        src={imgSrc}
                        alt={booking.property?.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&auto=format&fit=crop&q=60";
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, padding: 20, minWidth: 250 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                        <div>
                          <h3
                            style={{ margin: 0, fontSize: 16, fontWeight: 700, color: colors.textPrimary, cursor: "pointer" }}
                            onClick={() => onNavigate("property-details", { id: booking.property?._id })}
                          >
                            {booking.property?.title || "Property"}
                          </h3>
                          <p style={{ margin: "4px 0 0", fontSize: 13, color: colors.textTertiary }}>
                            {booking.property?.location}, {booking.property?.city}
                          </p>
                        </div>
                        <Badge variant={status.variant} size="sm">{status.label}</Badge>
                      </div>

                      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: colors.textTertiary, fontFamily: "monospace" }}>
                          ID: #{booking._id.slice(-8).toUpperCase()}
                        </span>
                      </div>

                      <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
                        <div>
                          <span style={{ fontSize: 11, fontWeight: 600, color: colors.textTertiary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Check In
                          </span>
                          <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 500, color: colors.textPrimary }}>
                            {formatDate(booking.startDate)}
                          </p>
                        </div>
                        <div>
                          <span style={{ fontSize: 11, fontWeight: 600, color: colors.textTertiary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Check Out
                          </span>
                          <p style={{ margin: "2px 0 0", fontSize: 13, fontWeight: 500, color: colors.textPrimary }}>
                            {formatDate(booking.endDate)}
                          </p>
                        </div>
                        <div>
                          <span style={{ fontSize: 11, fontWeight: 600, color: colors.textTertiary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Total
                          </span>
                          <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 700, color: colors.primary }}>
                            NPR {booking.totalPrice?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {booking.message && (
                        <p style={{ margin: "8px 0 0", fontSize: 12, color: colors.textTertiary, fontStyle: "italic" }}>
                          "{booking.message}"
                        </p>
                      )}

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigate("property-details", { id: booking.property?._id })}
                        >
                          View Details
                        </Button>
                        {booking.status === "pending" && (
                          <Button
                            variant="dangerOutline"
                            size="sm"
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadReceipt(booking._id)}
                        >
                          Receipt
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleContactOwner(booking)}
                        >
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};