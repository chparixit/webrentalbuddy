import { memo } from "react";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: number;
}

interface DashboardSidebarProps {
  items: SidebarItem[];
  activeItem: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const DashboardSidebar = memo(function DashboardSidebar({
  items,
  activeItem,
  isCollapsed,
  onToggleCollapse,
}: DashboardSidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 89,
          }}
          onClick={onToggleCollapse}
          className="sidebar-overlay"
          aria-hidden="true"
        />
      )}

      <aside
        style={{
          width: isCollapsed ? 0 : 260,
          minWidth: isCollapsed ? 0 : 260,
          background: "white",
          borderRight: "1px solid #F3F4F6",
          height: "calc(100vh - 64px)",
          position: "sticky",
          top: 64,
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 90,
          display: "flex",
          flexDirection: "column",
        }}
        role="navigation"
        aria-label="Dashboard sidebar"
      >
        {/* Sidebar header */}
        <div
          style={{
            padding: "20px 20px 12px",
            borderBottom: "1px solid #F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Menu
          </span>
          <button
            onClick={onToggleCollapse}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              color: "#9CA3AF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#F3F4F6")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            aria-label="Close sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ padding: "12px 12px", flex: 1, overflowY: "auto" }}>
          {items.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "12px 14px",
                  background: isActive ? "#EFF6FF" : "transparent",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#2563EB" : "#6B7280",
                  fontFamily: "inherit",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                  marginBottom: 2,
                  position: "relative",
                  outline: "none",
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "#F9FAFB";
                    e.currentTarget.style.color = "#374151";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#6B7280";
                  }
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 0 2px #2563EB40";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
                aria-current={isActive ? "page" : undefined}
                aria-label={`${item.label}${item.badge ? ` (${item.badge} notifications)` : ""}`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 3,
                      height: 24,
                      borderRadius: "0 4px 4px 0",
                      background: "#2563EB",
                    }}
                    aria-hidden="true"
                  />
                )}
                <span
                  style={{
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 18,
                  }}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 700,
                      background: "#DC2626",
                      color: "white",
                      minWidth: 20,
                      textAlign: "center",
                      lineHeight: 1.5,
                    }}
                    aria-label={`${item.badge} notifications`}
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid #F3F4F6",
            fontSize: 11,
            color: "#9CA3AF",
            textAlign: "center",
          }}
        >
          Rental Buddy v1.0
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-overlay {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .sidebar-overlay {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
});