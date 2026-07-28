import React, { useState, useEffect } from "react";

interface AdminDashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
  onBack: () => void;
  activePage?: string;
}

interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  userChange: string;
  propertyChange: string;
  bookingChange: string;
  revenueChange: string;
  recentBookings: Booking[];
  propertyCategories: PropertyCategory[];
}

interface Booking {
  id: string;
  property: string;
  user: string;
  amount: string;
  status: string;
  date: string;
}

interface PropertyCategory {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

const fallbackStats: AdminStats = {
  totalUsers: 0,
  totalProperties: 0,
  totalBookings: 0,
  totalRevenue: 0,
  userChange: "+0%",
  propertyChange: "+0%",
  bookingChange: "+0%",
  revenueChange: "+0%",
  recentBookings: [
    { id: "#BK001", property: "Cozy Studio in Thamel", user: "Ram Sharma", amount: "NPR 8,500", status: "confirmed", date: "2024-03-15" },
    { id: "#BK002", property: "Modern 2BHK Flat", user: "Sita Poudel", amount: "NPR 22,000", status: "pending", date: "2024-03-14" },
    { id: "#BK003", property: "Luxury Apartment", user: "Hari Gurung", amount: "NPR 45,000", status: "completed", date: "2024-03-12" },
    { id: "#BK004", property: "Bright Room Boudha", user: "Anita Thapa", amount: "NPR 6,000", status: "cancelled", date: "2024-03-10" },
    { id: "#BK005", property: "Spacious Flat Patan", user: "Bikram Rai", amount: "NPR 18,000", status: "confirmed", date: "2024-03-09" },
  ],
  propertyCategories: [
    { label: "Apartment", count: 210, percentage: 43, color: "#2563EB" },
    { label: "House", count: 98, percentage: 20, color: "#059669" },
    { label: "Studio", count: 120, percentage: 25, color: "#7C3AED" },
    { label: "Penthouse", count: 58, percentage: 12, color: "#D97706" },
  ],
};

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigate,
  onBack,
  activePage = "admin",
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [stats, setStats] = useState<AdminStats>(fallbackStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const raw = localStorage.getItem("rentalBuddyUser");
        const user = raw ? JSON.parse(raw) : null;
        const token = user?.token || user?.accessToken;

        const res = await fetch("/api/v1/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch stats");

        const data = await res.json();
        setStats({
          totalUsers: data.totalUsers ?? 0,
          totalProperties: data.totalProperties ?? 0,
          totalBookings: data.totalBookings ?? 0,
          totalRevenue: data.totalRevenue ?? 0,
          userChange: data.userChange ?? "+0%",
          propertyChange: data.propertyChange ?? "+0%",
          bookingChange: data.bookingChange ?? "+0%",
          revenueChange: data.revenueChange ?? "+0%",
          recentBookings: data.recentBookings ?? fallbackStats.recentBookings,
          propertyCategories: data.propertyCategories ?? fallbackStats.propertyCategories,
        });
      } catch {
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const sidebarItems = [
    { label: "Dashboard", page: "admin", icon: "📊" },
    { label: "Users", page: "admin-users", icon: "👥" },
    { label: "Properties", page: "admin-properties", icon: "🏠" },
    { label: "Bookings", page: "admin-bookings", icon: "📋" },
    { label: "Payments", page: "admin", icon: "💰" },
    { label: "Reports", page: "admin", icon: "📈" },
    { label: "Settings", page: "admin", icon: "⚙️" },
  ];

  const formatValue = (num: number, prefix: string) => {
    if (num === 0) return "-";
    if (prefix === "NPR") {
      if (num >= 1000000) return `NPR ${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `NPR ${(num / 1000).toFixed(1)}K`;
      return `NPR ${num.toLocaleString()}`;
    }
    return num.toLocaleString();
  };

  const statsCards = [
    {
      label: "Total Users",
      value: loading ? "..." : formatValue(stats.totalUsers, ""),
      change: stats.userChange,
      positive: stats.userChange.startsWith("+"),
      color: "#2563EB",
      bg: "#EFF6FF",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Total Properties",
      value: loading ? "..." : formatValue(stats.totalProperties, ""),
      change: stats.propertyChange,
      positive: stats.propertyChange.startsWith("+"),
      color: "#059669",
      bg: "#ECFDF5",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      label: "Total Bookings",
      value: loading ? "..." : formatValue(stats.totalBookings, ""),
      change: stats.bookingChange,
      positive: stats.bookingChange.startsWith("+"),
      color: "#7C3AED",
      bg: "#F5F3FF",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      label: "Total Revenue",
      value: loading ? "..." : formatValue(stats.totalRevenue, "NPR"),
      change: stats.revenueChange,
      positive: stats.revenueChange.startsWith("+"),
      color: "#D97706",
      bg: "#FFFBEB",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
  ];

  const recentBookings = stats.recentBookings;

  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      confirmed: { bg: "#ECFDF5", color: "#059669" },
      pending: { bg: "#FFFBEB", color: "#D97706" },
      completed: { bg: "#EFF6FF", color: "#2563EB" },
      cancelled: { bg: "#FEF2F2", color: "#DC2626" },
    };
    return styles[status] || { bg: "#F3F4F6", color: "#6B7280" };
  };

  const propertyCategories = stats.propertyCategories;

  const chartBars = [
    { day: "Mon", value: 65 },
    { day: "Tue", value: 45 },
    { day: "Wed", value: 80 },
    { day: "Thu", value: 55 },
    { day: "Fri", value: 90 },
    { day: "Sat", value: 70 },
    { day: "Sun", value: 50 },
  ];

  const quickActions = [
    { label: "Add Property", page: "admin-add-property", icon: "➕", color: "#2563EB", bg: "#EFF6FF" },
    { label: "Manage Users", page: "admin-users", icon: "👥", color: "#059669", bg: "#ECFDF5" },
    { label: "View Bookings", page: "admin-bookings", icon: "📋", color: "#7C3AED", bg: "#F5F3FF" },
  ];

  const renderSidebarItems = (isMobile: boolean) =>
    sidebarItems.map((item) => {
      const isActive = activePage === item.page;
      return (
        <button
          key={item.page + item.label}
          onClick={() => {
            onNavigate(item.page);
            if (isMobile) setMobileSidebarOpen(false);
          }}
          aria-current={isActive ? "page" : undefined}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: isMobile ? "12px 14px" : "11px 14px",
            marginBottom: 2,
            background: isActive ? "#EFF6FF" : "transparent",
            color: isActive ? "#2563EB" : "#6B7280",
            border: "none",
            borderRadius: 10,
            fontSize: isMobile ? 15 : 14,
            fontWeight: isActive ? 600 : 500,
            cursor: "pointer",
            fontFamily: "inherit",
            textAlign: "left",
            transition: "all 0.15s",
          }}
          onMouseOver={(e) => {
            if (!isActive) e.currentTarget.style.background = "#F9FAFB";
          }}
          onMouseOut={(e) => {
            if (!isActive) e.currentTarget.style.background = "transparent";
          }}
        >
          <span style={{ fontSize: 18, width: 24, textAlign: "center", flexShrink: 0 }}>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </button>
      );
    });

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)", background: "#F3F4F6" }}>
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 199,
          }}
          className="sidebar-overlay"
          aria-hidden="true"
        />
      )}

      <aside
        role="navigation"
        aria-label="Admin sidebar navigation"
        style={{
          width: 260,
          minWidth: 260,
          background: "white",
          borderRight: "1px solid #E5E7EB",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s, min-width 0.3s",
          overflow: "hidden",
          position: "sticky",
          top: 64,
          height: "calc(100vh - 64px)",
          zIndex: 200,
        }}
        className="admin-sidebar"
      >
        <div style={{ padding: "20px 20px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: 16,
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              RB
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>Admin Panel</p>
              <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>Rental Buddy</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "0 12px", overflowY: "auto" }}>
          {renderSidebarItems(false)}
        </nav>

        <div style={{ padding: "12px", borderTop: "1px solid #F3F4F6" }}>
          <button
            onClick={onBack}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              background: "transparent",
              color: "#6B7280",
              border: "none",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: "28px 32px", overflow: "auto", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>Dashboard</h1>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "4px 0 0" }}>
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open mobile sidebar"
              style={{
                display: "none",
                padding: "10px",
                background: "white",
                border: "1px solid #E5E7EB",
                borderRadius: 10,
                cursor: "pointer",
              }}
              className="mobile-sidebar-toggle"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div
              style={{
                position: "relative",
                padding: "10px",
                background: "white",
                border: "1px solid #E5E7EB",
                borderRadius: 10,
                cursor: "pointer",
              }}
              role="button"
              aria-label="Notifications"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#DC2626" }} />
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
              aria-label="Admin profile"
            >
              A
            </div>
          </div>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 28 }}
          role="region"
          aria-label="Statistics"
        >
          {statsCards.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "white",
                borderRadius: 16,
                padding: "22px 24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                border: "1px solid #F3F4F6",
                transition: "box-shadow 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)")}
              onMouseOut={(e) => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)")}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: stat.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-hidden="true"
                >
                  {stat.icon}
                </div>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    background: stat.positive ? "#ECFDF5" : "#FEF2F2",
                    color: stat.positive ? "#059669" : "#DC2626",
                  }}
                >
                  {stat.change}
                </span>
              </div>
              <p style={{ margin: "0 0 4px", fontSize: 13, color: "#6B7280", fontWeight: 500 }}>{stat.label}</p>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#111827" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 28 }}>
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              border: "1px solid #F3F4F6",
            }}
            role="figure"
            aria-label="Booking analytics bar chart"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>Booking Analytics</h3>
              <select
                style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12, fontFamily: "inherit", background: "white" }}
                aria-label="Booking analytics time range"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160, paddingTop: 8 }}>
              {chartBars.map((bar) => (
                <div key={bar.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 40,
                      height: `${bar.value}%`,
                      background: "#2563EB",
                      borderRadius: "6px 6px 0 0",
                      minHeight: 8,
                      transition: "height 0.3s",
                      opacity: 0.85,
                    }}
                    role="img"
                    aria-label={`${bar.day}: ${bar.value}%`}
                  />
                  <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 500 }}>{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              border: "1px solid #F3F4F6",
            }}
            role="figure"
            aria-label="Property categories breakdown"
          >
            <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#111827" }}>Property Categories</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {propertyCategories.map((cat) => (
                <div key={cat.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{cat.label}</span>
                    <span style={{ fontSize: 13, color: "#6B7280" }}>{cat.count} ({cat.percentage}%)</span>
                  </div>
                  <div style={{ height: 8, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }} role="progressbar" aria-valuenow={cat.percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`${cat.label}: ${cat.percentage}%`}>
                    <div style={{ height: "100%", width: `${cat.percentage}%`, background: cat.color, borderRadius: 999, transition: "width 0.5s" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            border: "1px solid #F3F4F6",
            overflow: "hidden",
          }}
          role="region"
          aria-label="Recent bookings table"
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: "1px solid #F3F4F6" }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>Recent Bookings</h3>
            <button
              onClick={() => onNavigate("admin-bookings")}
              style={{
                padding: "8px 16px",
                background: "#EFF6FF",
                color: "#2563EB",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              View All
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
                  {["Booking ID", "Property", "User", "Amount", "Status", "Date"].map((header) => (
                    <th key={header} style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => {
                  const statusStyle = getStatusStyle(booking.status);
                  return (
                    <tr key={booking.id} style={{ borderBottom: "1px solid #F9FAFB" }}>
                      <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#111827" }}>{booking.id}</td>
                      <td style={{ padding: "14px 20px", fontSize: 14, color: "#374151" }}>{booking.property}</td>
                      <td style={{ padding: "14px 20px", fontSize: 14, color: "#374151" }}>{booking.user}</td>
                      <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#111827" }}>{booking.amount}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: statusStyle.bg, color: statusStyle.color, textTransform: "capitalize" }}>
                          {booking.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#6B7280" }}>{booking.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 24 }}>
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.page)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 20px",
                background: "white",
                border: "1px solid #F3F4F6",
                borderRadius: 14,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = action.color;
                e.currentTarget.style.boxShadow = `0 0 0 2px ${action.bg}`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#F3F4F6";
                e.currentTarget.style.boxShadow = "none";
              }}
              aria-label={action.label}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: action.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {action.icon}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{action.label}</span>
            </button>
          ))}
        </div>
      </main>

      {mobileSidebarOpen && (
        <aside
          role="navigation"
          aria-label="Admin mobile sidebar navigation"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            width: 280,
            background: "white",
            zIndex: 200,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 0 40px rgba(0,0,0,0.15)",
            animation: "slideInLeft 0.25s ease",
          }}
          className="mobile-sidebar"
        >
          <div style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F3F4F6" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#2563EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 16,
                }}
                aria-hidden="true"
              >
                RB
              </div>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Admin Panel</span>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close mobile sidebar"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
            {renderSidebarItems(true)}
          </nav>
          <div style={{ padding: "12px", borderTop: "1px solid #F3F4F6" }}>
            <button
              onClick={() => {
                onBack();
                setMobileSidebarOpen(false);
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 14px",
                background: "transparent",
                color: "#6B7280",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </aside>
      )}

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .mobile-sidebar-toggle { display: flex !important; }
          .sidebar-overlay { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export { AdminDashboardPage };
export default AdminDashboardPage;
