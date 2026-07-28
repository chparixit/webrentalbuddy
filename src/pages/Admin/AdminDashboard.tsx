// === Admin Dashboard Overview ===
import { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/client";

interface AdminDashboardProps {
  onNavigate: (page: string, params?: any) => void;
  onBack: () => void;
}

interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  activeBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

const CURRENCY_LOCALE = "en-IN";
const CURRENCY_CODE = "NPR";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: "currency",
    currency: CURRENCY_CODE,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function AdminDashboard({ onNavigate, onBack }: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiClient.get("/api/v1/admin/stats");
      const responseData = response.data;
      const data: AdminStats = responseData.data || responseData;
      setStats({
        totalUsers: data.totalUsers ?? 0,
        totalProperties: data.totalProperties ?? 0,
        totalBookings: data.totalBookings ?? 0,
        totalRevenue: data.totalRevenue ?? 0,
        activeBookings: data.activeBookings ?? 0,
        pendingBookings: data.pendingBookings ?? 0,
        completedBookings: data.completedBookings ?? 0,
        cancelledBookings: data.cancelledBookings ?? 0,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load stats";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const adminCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "#3B82F6",
      action: () => onNavigate("admin-users"),
    },
    {
      label: "Total Properties",
      value: stats.totalProperties,
      icon: "🏘️",
      color: "#10B981",
      action: () => onNavigate("admin-properties"),
    },
    {
      label: "Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: "💰",
      color: "#F59E0B",
      action: () => onNavigate("admin-bookings"),
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: "📅",
      color: "#8B5CF6",
      action: () => onNavigate("admin-bookings"),
    },
  ];

  const quickActions = [
    { label: "Add Property", page: "admin-add-property", icon: "➕" },
    { label: "Manage Users", page: "admin-users", icon: "👥" },
    { label: "View Bookings", page: "admin-bookings", icon: "📋" },
  ];

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "#2563EB",
            cursor: "pointer",
            fontSize: 14,
            marginBottom: 16,
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          ← Back to Dashboard
        </button>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
              Admin Dashboard
            </h1>
            <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
              Overview of your rental platform
            </p>
          </div>
          <button
            onClick={() => fetchStats()}
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: loading ? "#9CA3AF" : "#F3F4F6",
              color: "#374151",
              border: "1px solid #E5E7EB",
              borderRadius: 10,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
          >
            {loading ? "⟳ Refreshing..." : "↻ Refresh"}
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ padding: 40, textAlign: "center", color: "#6B7280" }}>
          Loading stats...
        </div>
      )}

      {error && (
        <div style={{
          padding: 16,
          background: "#FEF2F2",
          color: "#DC2626",
          borderRadius: 12,
          marginBottom: 24,
          fontSize: 14,
        }}>
          {error}
          <button
            onClick={() => fetchStats()}
            style={{
              marginLeft: 12,
              background: "#DC2626",
              color: "white",
              border: "none",
              borderRadius: 6,
              padding: "4px 12px",
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "inherit",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Stats Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginBottom: 32,
          }}>
            {adminCards.map((card) => (
              <div
                key={card.label}
                onClick={card.action}
                style={{
                  background: "white",
                  borderRadius: 16,
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  border: "1px solid #F3F4F6",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"; }}
                onMouseOut={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 8px", fontWeight: 500 }}>
                      {card.label}
                    </p>
                    <p style={{ fontSize: 36, fontWeight: 700, color: "#111827", margin: 0 }}>
                      {card.value}
                    </p>
                  </div>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    background: `${card.color}10`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                  }}>
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: "0 0 16px" }}>
            Quick Actions
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}>
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => onNavigate(action.page)}
                style={{
                  padding: "20px 24px",
                  background: "white",
                  border: "1.5px solid #E5E7EB",
                  borderRadius: 12,
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#374151",
                  fontFamily: "inherit",
                  textAlign: "center",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = "#F9FAFB"; e.currentTarget.style.borderColor = "#2563EB"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#E5E7EB"; }}
              >
                {action.icon} {action.label}
              </button>
            ))}
          </div>

          {/* Management Sections */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}>
            <div
              onClick={() => onNavigate("admin-properties")}
              style={{
                background: "white",
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                border: "1px solid #F3F4F6",
                cursor: "pointer",
              }}
            >
              <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "#111827" }}>
                🏘️ Property Management
              </h3>
              <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
                Add, edit, and manage property listings
              </p>
            </div>
            <div
              onClick={() => onNavigate("admin-bookings")}
              style={{
                background: "white",
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                border: "1px solid #F3F4F6",
                cursor: "pointer",
              }}
            >
              <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "#111827" }}>
                📋 Booking Management
              </h3>
              <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
                View and manage all user bookings
              </p>
            </div>
            <div
              onClick={() => onNavigate("admin-users")}
              style={{
                background: "white",
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                border: "1px solid #F3F4F6",
                cursor: "pointer",
              }}
            >
              <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: "#111827" }}>
                👥 User Management
              </h3>
              <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
                View and manage platform users
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}