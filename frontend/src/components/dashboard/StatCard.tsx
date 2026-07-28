import { memo } from "react";
import type { StatCardData } from "../../types/dashboard";

interface StatCardProps {
  stat: StatCardData;
}

export const StatCard = memo(function StatCard({ stat }: StatCardProps) {
  return (
    <div
      className="stat-card"
      style={{
        background: "white",
        borderRadius: 16,
        padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        border: "1px solid #F3F4F6",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
        e.currentTarget.style.borderColor = stat.color;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)";
        e.currentTarget.style.borderColor = "#F3F4F6";
      }}
      role="article"
      aria-label={`${stat.label}: ${stat.value}`}
    >
      {/* Gradient accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${stat.color}, ${stat.bgColor})`,
          borderRadius: "16px 16px 0 0",
        }}
        aria-hidden="true"
      />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p
            style={{
              fontSize: 13,
              color: "#6B7280",
              margin: "0 0 8px",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            {stat.label}
          </p>
          <p
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#111827",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {stat.value}
          </p>
          {stat.description && (
            <p
              style={{
                fontSize: 12,
                color: "#9CA3AF",
                margin: "4px 0 0",
                fontWeight: 400,
              }}
            >
              {stat.description}
            </p>
          )}
          {stat.trend && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                marginTop: 8,
                padding: "2px 8px",
                borderRadius: 6,
                background: stat.trend.direction === "up" ? "#ECFDF5" : "#FEF2F2",
                fontSize: 12,
                fontWeight: 600,
                color: stat.trend.direction === "up" ? "#059669" : "#DC2626",
              }}
            >
              {stat.trend.direction === "up" ? "↑" : "↓"} {stat.trend.percentage}%
            </div>
          )}
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: stat.bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
            transition: "transform 0.3s ease",
          }}
          className="stat-icon"
          aria-hidden="true"
        >
          {stat.icon}
        </div>
      </div>

      <style>{`
        .stat-card:hover .stat-icon {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
});