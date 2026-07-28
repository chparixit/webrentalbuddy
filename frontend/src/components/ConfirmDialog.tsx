interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const confirmColors: Record<string, { bg: string; hover: string }> = {
    danger: { bg: "#DC2626", hover: "#B91C1C" },
    warning: { bg: "#F59E0B", hover: "#D97706" },
    info: { bg: "#2563EB", hover: "#1D4ED8" },
  };

  const color = confirmColors[variant];

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <div
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(2px)",
          }}
        />
        <div
          style={{
            position: "relative",
            background: "white",
            borderRadius: 20,
            padding: 32,
            maxWidth: 420,
            width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            animation: "fadeInUp 0.25s ease",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background:
                variant === "danger"
                  ? "#FEF2F2"
                  : variant === "warning"
                  ? "#FFFBEB"
                  : "#EFF6FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke={color.bg}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {variant === "danger" ? (
                <>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </>
              ) : (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </>
              )}
            </svg>
          </div>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#111827",
              margin: "0 0 8px",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: 14,
              color: "#6B7280",
              lineHeight: 1.6,
              margin: "0 0 24px",
            }}
          >
            {message}
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px 20px",
                background: "#F3F4F6",
                color: "#374151",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                !loading && (e.currentTarget.style.background = "#E5E7EB")
              }
              onMouseOut={(e) =>
                !loading && (e.currentTarget.style.background = "#F3F4F6")
              }
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              style={{
                flex: 1,
                padding: "12px 20px",
                background: loading ? "#9CA3AF" : color.bg,
                color: "white",
                border: "none",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                !loading && (e.currentTarget.style.background = color.hover)
              }
              onMouseOut={(e) =>
                !loading && (e.currentTarget.style.background = color.bg)
              }
            >
              {loading ? "Processing..." : confirmLabel}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};