import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { getMediaUrl } from "../../utils/media";
import { getBookings } from "../../api/bookingApi";
import { getWishlist } from "../../api/wishlistApi";
import type { DashboardUser, StatCardData, QuickAction, BookingTableItem, ActivityItem } from "../../types/dashboard";
import type { Booking } from "../../types/Booking";
import type { WishlistItem } from "../../types/Booking";
import { StatCard } from "../../components/dashboard/StatCard";
import { WelcomeHeader } from "../../components/dashboard/WelcomeHeader";
import { ActionCard } from "../../components/dashboard/ActionCard";
import { RecentBookingsTable } from "../../components/dashboard/RecentBookingsTable";
import { ActivityTimeline } from "../../components/dashboard/ActivityTimeline";
import { ErrorState } from "../../components/dashboard/ErrorState";
import { DashboardSkeleton } from "../../components/dashboard/DashboardSkeleton";

// ─── Icons ───────────────────────────────────────────────────────────────────

const BookingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ActiveBookingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const WishlistIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ViewIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PasswordIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const BrowseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

// ─── Props Interface ─────────────────────────────────────────────────────────

interface DashboardProps {
  user: DashboardUser;
  onGoProfileUpdate: () => void;
  onGoPasswordUpdate: () => void;
  onNavigate?: (page: string, params?: Record<string, string>) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const getStatus = (status: string): "pending" | "confirmed" | "completed" | "cancelled" => {
  if (["pending", "confirmed", "completed", "cancelled"].includes(status)) {
    return status as any;
  }
  return "pending";
};

const getActivityType = (booking: Booking): "booked" | "cancelled" => {
  if (booking.status === "cancelled") return "cancelled";
  return "booked";
};

// ─── Dashboard Component ─────────────────────────────────────────────────────

export default function Dashboard({
  user,
  onGoProfileUpdate,
  onGoPasswordUpdate,
  onNavigate,
}: DashboardProps) {
  const [profileImage, setProfileImage] = useState<string>(user?.profileImage || "");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real data from API
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
    }
  }, [user]);

  // ─── Fetch dashboard data ──────────────────────────────────────────────

  const fetchDashboardData = useCallback(async () => {
    if (!user?.token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");

    try {
      const [bookingsRes, wishlistRes] = await Promise.allSettled([
        getBookings(),
        getWishlist(),
      ]);

      if (bookingsRes.status === "fulfilled") {
        setBookings(Array.isArray(bookingsRes.value.data) ? bookingsRes.value.data : []);
      } else {
        console.error("Failed to fetch bookings:", bookingsRes.reason);
      }

      if (wishlistRes.status === "fulfilled") {
        setWishlistItems(Array.isArray(wishlistRes.value.data) ? wishlistRes.value.data : []);
      } else {
        console.error("Failed to fetch wishlist:", wishlistRes.reason);
      }

      if (bookingsRes.status === "rejected" && wishlistRes.status === "rejected") {
        throw new Error("Failed to load dashboard data");
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to load dashboard data";
      setErrorMessage(errMsg);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // ─── Derived Stats ─────────────────────────────────────────────────────

  const statsData = useMemo(() => {
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(
      (b) => b.status === "pending" || b.status === "confirmed"
    ).length;
    const wishlistCount = wishlistItems.length;
    return { totalBookings, activeBookings, wishlistCount };
  }, [bookings, wishlistItems]);

  // ─── Image Upload Handler ──────────────────────────────────────────────

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/v1/upload-profile-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setProfileImage(data.path);
      setMessage("Profile image updated successfully!");
    } catch (err: unknown) {
      const errorMessageVal = err instanceof Error ? err.message : "Failed to upload image";
      setMessage(errorMessageVal);
      setIsError(true);
    } finally {
      setUploading(false);
    }
  }, [user?.token]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // ─── Stats Cards ───────────────────────────────────────────────────────

  const statsCards: StatCardData[] = useMemo(() => [
    {
      id: "total-bookings",
      label: "Total Bookings",
      value: statsData.totalBookings.toString(),
      icon: <BookingIcon />,
      color: "#2563EB",
      bgColor: "#EFF6FF",
      description: "All time bookings",
    },
    {
      id: "active-bookings",
      label: "Active Bookings",
      value: statsData.activeBookings.toString(),
      icon: <ActiveBookingIcon />,
      color: "#059669",
      bgColor: "#ECFDF5",
      description: "Currently active",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      value: statsData.wishlistCount.toString(),
      icon: <WishlistIcon />,
      color: "#DC2626",
      bgColor: "#FEF2F2",
      description: "Saved properties",
    },
    {
      id: "profile-views",
      label: "Profile Views",
      value: "0",
      icon: <ViewIcon />,
      color: "#7C3AED",
      bgColor: "#F5F3FF",
      description: "This month",
      trend: { direction: "up", percentage: 0 },
    },
  ], [statsData]);

  // ─── Quick Actions ────────────────────────────────────────────────────

  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: "browse",
      label: "Browse Properties",
      icon: <BrowseIcon />,
      onClick: () => onNavigate?.("properties"),
      color: "#2563EB",
      bgColor: "#EFF6FF",
    },
    {
      id: "wishlist",
      label: "View Wishlist",
      icon: <WishlistIcon />,
      onClick: () => onNavigate?.("wishlist"),
      color: "#DC2626",
      bgColor: "#FEF2F2",
    },
    {
      id: "bookings",
      label: "My Bookings",
      icon: <BookingIcon />,
      onClick: () => onNavigate?.("bookings"),
      color: "#059669",
      bgColor: "#ECFDF5",
    },
    {
      id: "profile",
      label: "Edit Profile",
      icon: <ProfileIcon />,
      onClick: onGoProfileUpdate,
      color: "#7C3AED",
      bgColor: "#F5F3FF",
    },
  ], [onNavigate, onGoProfileUpdate]);

  // ─── Recent Bookings Data ─────────────────────────────────────────────

  const recentBookings: BookingTableItem[] = useMemo(() => {
    return bookings.slice(0, 5).map((booking) => {
      const property = booking.property;
      const propName = typeof property === "object" && property !== null
        ? (property as any).title || (property as any).name || "Property"
        : "Property";
      const propLocation = typeof property === "object" && property !== null
        ? (property as any).location || ""
        : "";
      const propCity = typeof property === "object" && property !== null
        ? (property as any).city || ""
        : "";
      const propImage = typeof property === "object" && property !== null
        ? (property as any).images?.[0] || ""
        : "";

      return {
        id: booking._id,
        propertyName: propName,
        propertyImage: propImage,
        location: propLocation ? `${propLocation}${propCity ? `, ${propCity}` : ""}` : propCity || "N/A",
        bookingDate: formatDate(booking.startDate),
        status: getStatus(booking.status),
        amount: booking.totalPrice,
        onView: () => {
          const propId = typeof property === "object" && property !== null
            ? (property as any)._id
            : undefined;
          if (propId) onNavigate?.("property-details", { id: propId });
        },
      };
    });
  }, [bookings, onNavigate]);

  // ─── Activity Data ────────────────────────────────────────────────────

  const recentActivity: ActivityItem[] = useMemo(() => {
    const activities: ActivityItem[] = [];

    // Add booking activities
    bookings.slice(0, 5).forEach((booking) => {
      const property = booking.property;
      const propName = typeof property === "object" && property !== null
        ? (property as any).title || (property as any).name || "Property"
        : "Property";
      const type = getActivityType(booking);

      activities.push({
        id: `booking-${booking._id}`,
        type,
        description: type === "booked"
          ? `Booked ${propName}`
          : `Cancelled booking for ${propName}`,
        timestamp: formatDate(booking.createdAt || booking.startDate),
      });
    });

    // Add wishlist activities
    wishlistItems.slice(0, 5).forEach((item) => {
      const property = item.property;
      const propName = typeof property === "object" && property !== null
        ? (property as any).title || (property as any).name || "Property"
        : "Property";

      activities.push({
        id: `wishlist-${item._id}`,
        type: "saved",
        description: `Saved ${propName} to wishlist`,
        timestamp: formatDate(item.createdAt),
      });
    });

    // Sort by timestamp (newest first) and limit to 8
    return activities
      .sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA;
      })
      .slice(0, 8);
  }, [bookings, wishlistItems]);

  // ─── Retry ────────────────────────────────────────────────────────────

  const handleRetry = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleContactSupport = useCallback(() => {
    onNavigate?.("contact");
  }, [onNavigate]);

  // ─── Stable callbacks for JSX (must be defined before early returns) ──
  const handleViewAllBookings = useCallback(() => onNavigate?.("bookings"), [onNavigate]);

  // ─── No User State ────────────────────────────────────────────────────

  if (!user) {
    return (
      <div
        style={{ padding: "40px", textAlign: "center" }}
        role="alert"
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
          }}
          aria-hidden="true"
        >
          <ProfileIcon />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#111827", margin: "0 0 8px" }}>
          No user data found
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
          Please login first to access your dashboard.
        </p>
      </div>
    );
  }

  // ─── Loading State ────────────────────────────────────────────────────

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // ─── Error State ──────────────────────────────────────────────────────

  if (isError) {
    return (
      <div style={{ padding: "24px 32px" }}>
        <ErrorState
          message={errorMessage || "Failed to load dashboard data. Please try again."}
          onRetry={handleRetry}
          onContactSupport={handleContactSupport}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px 32px",
        maxWidth: 1400,
        margin: "0 auto",
      }}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageUpload}
        aria-hidden="true"
      />

      {/* Welcome Header */}
      <WelcomeHeader
        user={user}
        onUploadClick={triggerFileInput}
        uploading={uploading}
      />

      {/* Status Message */}
      {message && (
        <div
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            marginBottom: 24,
            fontSize: 14,
            fontWeight: 500,
            background: message.includes("success") ? "#ECFDF5" : "#FEF2F2",
            color: message.includes("success") ? "#065F46" : "#991B1B",
            border: `1px solid ${message.includes("success") ? "#A7F3D0" : "#FECACA"}`,
          }}
          role="status"
          aria-live="polite"
        >
          {message}
        </div>
      )}

      {/* Statistics Cards */}
      <section aria-label="Statistics overview">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginBottom: 28,
          }}
        >
          {statsCards.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section aria-label="Quick actions">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {quickActions.map((action) => (
            <ActionCard key={action.id} action={action} />
          ))}
        </div>
      </section>

      {/* Main Content Grid: Recent Bookings + Activity */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          marginBottom: 28,
        }}
        className="dashboard-content-grid"
      >
        <RecentBookingsTable
          bookings={recentBookings}
          onViewAll={handleViewAllBookings}
        />

        <ActivityTimeline activities={recentActivity} />
      </div>

      {/* Profile Summary Card */}
      <section aria-label="Profile summary">
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 28,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            border: "1px solid #F3F4F6",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                overflow: "hidden",
                background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                border: "3px solid white",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
              }}
            >
              {profileImage ? (
                <img
                  src={getMediaUrl(profileImage)}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: 28, color: "white", fontWeight: 700 }}>
                  {user.name?.charAt(0).toUpperCase() || "?"}
                </span>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#111827",
                  margin: "0 0 12px",
                }}
              >
                Account Details
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 16,
                }}
              >
                {[
                  { label: "Name", value: user.name },
                  { label: "Email", value: user.email },
                  { label: "Role", value: user.role || "user" },
                  { label: "Preferred Location", value: user.preferredLocation || "Not set" },
                ].map((field) => (
                  <div key={field.label}>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#9CA3AF",
                        margin: "0 0 4px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {field.label}
                    </p>
                    <p
                      style={{
                        fontSize: 14,
                        color: "#111827",
                        margin: 0,
                        fontWeight: 500,
                        textTransform: field.label === "Role" ? "capitalize" : "none",
                      }}
                    >
                      {field.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={onGoProfileUpdate}
                style={{
                  padding: "10px 20px",
                  background: "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "background 0.15s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#1D4ED8")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#2563EB")}
                aria-label="Edit your profile"
              >
                <ProfileIcon />
                Edit Profile
              </button>
              <button
                onClick={onGoPasswordUpdate}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  color: "#374151",
                  border: "1px solid #E5E7EB",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.15s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#F9FAFB";
                  e.currentTarget.style.borderColor = "#2563EB";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                }}
                aria-label="Change your password"
              >
                <PasswordIcon />
                Change Password
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 1024px) {
          .dashboard-content-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .custom-dashboard {
            padding: 16px !important;
          }
        }
        div:focus-visible > .avatar-overlay,
        div:hover > .avatar-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}