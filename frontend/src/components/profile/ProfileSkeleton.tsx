import { memo } from "react";
import { colors, borderRadius, spacing } from "../../styles/designTokens";

export const ProfileSkeleton = memo(() => {
  const shimmer = {
    background: `linear-gradient(90deg, ${colors.bgTertiary} 25%, ${colors.borderLight} 50%, ${colors.bgTertiary} 75%)`,
    backgroundSize: "200% 100%",
    animation: "profileShimmer 1.5s infinite",
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: spacing["3xl"],
      }}
    >
      {/* Header Skeleton */}
      <div
        style={{
          background: colors.bgPrimary,
          borderRadius: borderRadius["3xl"],
          padding: spacing["3xl"],
          boxShadow: colors.shadowSm,
          border: `1px solid ${colors.border}`,
          marginBottom: spacing["2xl"],
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing.xl,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              ...shimmer,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: 28,
                width: 200,
                borderRadius: borderRadius.md,
                marginBottom: spacing.sm,
                ...shimmer,
              }}
            />
            <div
              style={{
                height: 16,
                width: 250,
                borderRadius: borderRadius.md,
                marginBottom: spacing.sm,
                ...shimmer,
              }}
            />
            <div
              style={{
                height: 14,
                width: 150,
                borderRadius: borderRadius.md,
                ...shimmer,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: spacing.sm }}>
            <div
              style={{
                height: 40,
                width: 120,
                borderRadius: borderRadius.xl,
                ...shimmer,
              }}
            />
            <div
              style={{
                height: 40,
                width: 120,
                borderRadius: borderRadius.xl,
                ...shimmer,
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: spacing.lg,
          marginBottom: spacing["2xl"],
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              height: 120,
              borderRadius: borderRadius["2xl"],
              ...shimmer,
            }}
          />
        ))}
      </div>

      {/* Content Grid Skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 400px",
          gap: spacing["2xl"],
        }}
        className="profile-skeleton-grid"
      >
        <div>
          <div
            style={{
              height: 400,
              borderRadius: borderRadius["3xl"],
              marginBottom: spacing["2xl"],
              ...shimmer,
            }}
          />
          <div
            style={{
              height: 200,
              borderRadius: borderRadius["3xl"],
              ...shimmer,
            }}
          />
        </div>
        <div>
          <div
            style={{
              height: 350,
              borderRadius: borderRadius["3xl"],
              ...shimmer,
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes profileShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 768px) {
          .profile-skeleton-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
});

ProfileSkeleton.displayName = "ProfileSkeleton";