import { memo } from "react";

export const DashboardSkeleton = memo(function DashboardSkeleton() {
  return (
    <div style={{ padding: "24px 32px", maxWidth: 1400, margin: "0 auto" }}>
      {/* Welcome skeleton */}
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 32,
          border: "1px solid #F3F4F6",
          marginBottom: 24,
        }}
        aria-hidden="true"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
              backgroundSize: "200% 100%",
              animation: "dash-shimmer 1.5s infinite",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: 24,
                width: "40%",
                borderRadius: 8,
                marginBottom: 12,
                background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
                backgroundSize: "200% 100%",
                animation: "dash-shimmer 1.5s infinite",
              }}
            />
            <div
              style={{
                height: 14,
                width: "30%",
                borderRadius: 6,
                marginBottom: 8,
                background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
                backgroundSize: "200% 100%",
                animation: "dash-shimmer 1.5s infinite",
              }}
            />
            <div
              style={{
                height: 28,
                width: "20%",
                borderRadius: 14,
                background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
                backgroundSize: "200% 100%",
                animation: "dash-shimmer 1.5s infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              background: "white",
              borderRadius: 16,
              padding: 24,
              border: "1px solid #F3F4F6",
            }}
          >
            <div
              style={{
                height: 13,
                width: "60%",
                borderRadius: 6,
                marginBottom: 12,
                background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
                backgroundSize: "200% 100%",
                animation: "dash-shimmer 1.5s infinite",
              }}
            />
            <div
              style={{
                height: 32,
                width: "40%",
                borderRadius: 8,
                marginBottom: 8,
                background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
                backgroundSize: "200% 100%",
                animation: "dash-shimmer 1.5s infinite",
              }}
            />
            <div
              style={{
                height: 12,
                width: "80%",
                borderRadius: 6,
                background: "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
                backgroundSize: "200% 100%",
                animation: "dash-shimmer 1.5s infinite",
              }}
            />
          </div>
        ))}
      </div>

      {/* Quick actions skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: 80,
              background: "white",
              borderRadius: 14,
              border: "1.5px solid #E5E7EB",
              backgroundImage: "linear-gradient(90deg, #F9FAFB 25%, #F3F4F6 50%, #F9FAFB 75%)",
              backgroundSize: "200% 100%",
              animation: "dash-shimmer 1.5s infinite",
            }}
          />
        ))}
      </div>

      {/* Content grid skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div
          style={{
            background: "white",
            borderRadius: 16,
            height: 300,
            border: "1px solid #F3F4F6",
            backgroundImage: "linear-gradient(90deg, #F9FAFB 25%, #F3F4F6 50%, #F9FAFB 75%)",
            backgroundSize: "200% 100%",
            animation: "dash-shimmer 1.5s infinite",
          }}
        />
        <div
          style={{
            background: "white",
            borderRadius: 16,
            height: 300,
            border: "1px solid #F3F4F6",
            backgroundImage: "linear-gradient(90deg, #F9FAFB 25%, #F3F4F6 50%, #F9FAFB 75%)",
            backgroundSize: "200% 100%",
            animation: "dash-shimmer 1.5s infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes dash-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
});