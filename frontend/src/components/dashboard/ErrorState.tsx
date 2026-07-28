import { memo } from "react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  onContactSupport?: () => void;
}

export const ErrorState = memo(function ErrorState({
  message,
  onRetry,
  onContactSupport,
}: ErrorStateProps) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        padding: "48px 32px",
        border: "1px solid #FCA5A5",
        textAlign: "center",
        maxWidth: 480,
        margin: "40px auto",
      }}
      role="alert"
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "#FEF2F2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}
        aria-hidden="true"
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#DC2626"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "#991B1B",
          margin: "0 0 8px",
        }}
      >
        Something went wrong
      </h3>
      <p
        style={{
          fontSize: 14,
          color: "#B91C1C",
          margin: "0 0 24px",
          lineHeight: 1.6,
        }}
      >
        {message}
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: "10px 24px",
              background: "#DC2626",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "background 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#B91C1C")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#DC2626")}
            aria-label="Retry loading dashboard"
          >
            Try Again
          </button>
        )}
        {onContactSupport && (
          <button
            onClick={onContactSupport}
            style={{
              padding: "10px 24px",
              background: "transparent",
              color: "#374151",
              border: "1px solid #E5E7EB",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#F9FAFB";
              e.currentTarget.style.borderColor = "#9CA3AF";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#E5E7EB";
            }}
          >
            Contact Support
          </button>
        )}
      </div>
    </div>
  );
});