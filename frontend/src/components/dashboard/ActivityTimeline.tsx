import { memo } from "react";
import type { ActivityItem } from "../../types/dashboard";

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

const activityIcons: Record<string, string> = {
  booked: "✅",
  updated: "✏️",
  saved: "❤️",
  cancelled: "❌",
  viewed: "👁️",
  reviewed: "⭐",
};

const activityColors: Record<string, string> = {
  booked: "#059669",
  updated: "#2563EB",
  saved: "#DC2626",
  cancelled: "#D97706",
  viewed: "#7C3AED",
  reviewed: "#F59E0B",
};

export const ActivityTimeline = memo(function ActivityTimeline({
  activities,
}: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div
        style={{
          background: "white",
          borderRadius: 16,
          padding: 32,
          border: "1px solid #F3F4F6",
          textAlign: "center",
        }}
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
            fontSize: 28,
          }}
          aria-hidden="true"
        >
          📋
        </div>
        <h4
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#111827",
            margin: "0 0 4px",
          }}
        >
          No recent activity
        </h4>
        <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>
          Your recent actions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        border: "1px solid #F3F4F6",
        overflow: "hidden",
      }}
      role="region"
      aria-label="Recent activity"
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#111827",
            margin: 0,
          }}
        >
          Recent Activity
        </h3>
      </div>

      {/* Timeline */}
      <div style={{ padding: "16px 24px" }}>
        {activities.map((activity, index) => {
          const isLast = index === activities.length - 1;
          const color = activityColors[activity.type] || "#6B7280";

          return (
            <div
              key={activity.id}
              style={{
                display: "flex",
                gap: 16,
                position: "relative",
                paddingBottom: isLast ? 0 : 24,
              }}
              role="listitem"
            >
              {/* Timeline line */}
              {!isLast && (
                <div
                  style={{
                    position: "absolute",
                    left: 20,
                    top: 40,
                    bottom: 0,
                    width: 2,
                    background: "#E5E7EB",
                  }}
                  aria-hidden="true"
                />
              )}

              {/* Icon circle */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: `${color}12`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 1,
                  border: `2px solid white`,
                  boxShadow: `0 0 0 2px ${color}30`,
                }}
                aria-hidden="true"
              >
                {activity.icon || activityIcons[activity.type] || "📌"}
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingTop: 6 }}>
                <p
                  style={{
                    fontSize: 14,
                    color: "#374151",
                    margin: "0 0 4px",
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  {activity.description}
                </p>
                <span
                  style={{
                    fontSize: 12,
                    color: "#9CA3AF",
                    fontWeight: 400,
                  }}
                >
                  {activity.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});