// === Admin Dashboard Overview ===
import { useState, useEffect } from "react";

interface AdminDashboardProps {
  onNavigate: (page: string, params?: any) => void;
  onBack: () => void;
}

export function AdminDashboard({ onNavigate, onBack }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stored = localStorage.getItem("rentalBuddyUser");
        if (!stored) return;
        const user = JSON.parse(stored);
        const headers = { Authorization: `Bearer ${user.token}` };

        const [usersRes, propsRes, bookingsRes] = await Promise.all([
          fetch("/api/v1/admin/users", { headers }),
          fetch("/api/v1/properties", { headers }),
          fetch("/api/v1/bookings", { headers }),
        ]);

        const usersData = await usersRes.json();
        const propsData = await propsRes.json();
        const bookingsData = await bookingsRes.json();

        setStats({
          totalUsers: usersData.users?.length || usersData.data?.length || 0,
          totalProperties: propsData.data?.length || 0,
          totalBookings: bookingsData.data?.length || 0,
          pendingBookings: bookingsData.data?.filter((b: any) => b.status === "pending").length || 0,
        });
      } catch (err) {
        setError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const adminCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "#3B82F6",
      action: () => onNavigate("admin-users"),
    },
    {
      label: "Properties",
      value: stats.totalProperties,
      icon: "🏘️",
      color: "#10B981",
      action: () => onNavigate("admin-properties"),
    },
    {
      label: "Bookings",
      value: stats.totalBookings,
      icon: "📅",
      color: "#8B5CF6",
      action: () => onNavigate("admin-bookings"),
    },
    {
      label: "Pending",
      value: stats.pendingBookings,
      icon: "⏳",
      color: "#F59E0B",
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
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>
          Admin Dashboard
        </h1>
        <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
          Overview of your rental platform
        </p>
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
        </div>
      )}

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
    </div>
  );
}