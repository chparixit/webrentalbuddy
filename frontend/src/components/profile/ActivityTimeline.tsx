import { memo } from "react";
import { colors, spacing, typography } from "../../styles/designTokens";
import type { ActivityItem } from "../../types/user";

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

const activitySvgIcons: Record<string, React.ReactNode> = {
  profile_update: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  booking: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  wishlist: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.warning} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  cancellation: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.error} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  password_change: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.info} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
};

export const ActivityTimeline = memo(({ activities }: ActivityTimelineProps) => {
  if (activities.length === 0) {
    return (
      <div style={{ padding: spacing["3xl"], textAlign: "center" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: colors.bgTertiary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <p style={{ ...typography.body, color: colors.textMuted, margin: 0, fontSize: 13 }}>
          No recent activity yet
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {activities.map((activity, index) => {
        const icon = activitySvgIcons[activity.type] || (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );

        return (
          <div
            key={activity.id}
            style={{
              display: "flex",
              gap: spacing.md,
              padding: `${spacing.lg}px ${spacing.md}px`,
              position: "relative",
              borderLeft: index < activities.length - 1 ? `2px solid ${colors.border}` : "2px solid transparent",
              marginLeft: 19,
            }}
            role="listitem"
            aria-label={activity.description}
          >
            <div
              style={{
                position: "absolute",
                left: -11,
                top: 18,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: colors.bgPrimary,
                border: `2px solid ${colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
                boxShadow: `0 0 0 3px ${colors.bgPrimary}`,
              }}
              aria-hidden="true"
            >
              {icon}
            </div>
            <div style={{ flex: 1, paddingLeft: spacing.sm }}>
              <p
                style={{
                  ...typography.bodySm,
                  color: colors.textPrimary,
                  margin: "0 0 4px",
                  fontWeight: 500,
                  fontSize: 13,
                }}
              >
                {activity.description}
              </p>
              <p
                style={{
                  ...typography.small,
                  color: colors.textMuted,
                  margin: 0,
                  fontSize: 11,
                }}
              >
                {formatTimestamp(activity.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
});

ActivityTimeline.displayName = "ActivityTimeline";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}