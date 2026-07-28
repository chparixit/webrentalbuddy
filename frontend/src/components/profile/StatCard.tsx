import { memo } from "react";
import { colors, borderRadius, spacing, typography } from "../../styles/designTokens";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export const StatCard = memo(({
  label,
  value,
  icon,
  color = colors.primary,
  trend,
}: StatCardProps) => (
  <div
    style={{
      background: colors.bgPrimary,
      borderRadius: borderRadius["2xl"],
      padding: 0,
      boxShadow: colors.shadowSm,
      border: `1px solid ${colors.border}`,
      transition: "box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease",
      overflow: "hidden",
      position: "relative",
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.boxShadow = `0 8px 30px rgba(37, 99, 235, 0.1)`;
      e.currentTarget.style.transform = "translateY(-4px) scale(1.01)";
      e.currentTarget.style.borderColor = color + "40";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.boxShadow = colors.shadowSm;
      e.currentTarget.style.transform = "translateY(0) scale(1)";
      e.currentTarget.style.borderColor = colors.border;
    }}
    role="article"
    aria-label={`${label}: ${value}`}
  >
    {/* Top accent bar */}
    <div
      style={{
        height: 4,
        width: "100%",
        background: `linear-gradient(90deg, ${color}, ${color}88)`,
      }}
    />

    <div style={{ padding: spacing.xl }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: spacing.md,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: borderRadius.xl,
            background: `linear-gradient(135deg, ${color}15, ${color}08)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            border: `1px solid ${color}20`,
          }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        {trend && (
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.02em",
              background: trend.positive ? colors.successBg : colors.errorBg,
              color: trend.positive ? colors.success : colors.error,
              border: `1px solid ${trend.positive ? colors.successBg : colors.errorBg}`,
            }}
          >
            {trend.value}
          </span>
        )}
      </div>
      <p
        style={{
          ...typography.caption,
          color: colors.textTertiary,
          margin: "0 0 6px",
          fontWeight: 600,
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: colors.textPrimary,
          margin: 0,
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </p>
    </div>
  </div>
));

StatCard.displayName = "StatCard";