import { memo } from "react";
import type { DashboardUser } from "../../types/dashboard";
import { getMediaUrl } from "../../utils/media";

interface WelcomeHeaderProps {
  user: DashboardUser;
  onUploadClick: () => void;
  uploading?: boolean;
}

const formatDate = (): string => {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export const WelcomeHeader = memo(function WelcomeHeader({
  user,
  onUploadClick,
  uploading = false,
}: WelcomeHeaderProps) {
  const initials = user.name
    ?.split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <div
      style={{
        background: "white",
        borderRadius: 20,
        padding: "32px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        border: "1px solid #F3F4F6",
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
      }}
      role="region"
      aria-label="Welcome section"
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #2563EB08, #7C3AED08)",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          right: 80,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #05966908, #2563EB08)",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
        {/* Avatar */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            overflow: "hidden",
            background: "linear-gradient(135deg, #2563EB, #7C3AED)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            border: "3px solid white",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
            cursor: uploading ? "wait" : "pointer",
            position: "relative",
          }}
          onClick={uploading ? undefined : onUploadClick}
          title="Click to upload profile image"
          tabIndex={0}
          role="button"
          aria-label="Upload profile picture"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onUploadClick();
          }}
        >
          {user.profileImage ? (
            <img
              src={getMediaUrl(user.profileImage)}
              alt={`${user.name}'s profile`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <span style={{ fontSize: 28, color: "white", fontWeight: 700 }}>
              {initials}
            </span>
          )}
          {/* Hover overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.2s",
              borderRadius: "50%",
            }}
            className="avatar-overlay"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        </div>

        {/* Welcome text */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 4px",
              lineHeight: 1.3,
            }}
          >
            {getGreeting()}, {user.name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#6B7280",
              margin: "0 0 8px",
              lineHeight: 1.5,
            }}
          >
            {formatDate()}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                background: user.role === "admin" ? "#FEF3C7" : "#DBEAFE",
                color: user.role === "admin" ? "#92400E" : "#1E40AF",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: user.role === "admin" ? "#D97706" : "#2563EB",
                }}
                aria-hidden="true"
              />
              {user.role === "admin" ? "Administrator" : "Member"}
            </span>
            {user.preferredLocation && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500,
                  background: "#F3F4F6",
                  color: "#6B7280",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {user.preferredLocation}
              </span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        div:focus-visible > .avatar-overlay,
        div:hover > .avatar-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
});