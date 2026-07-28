interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <div
    style={{
      padding: 60,
      textAlign: "center",
      background: "white",
      borderRadius: 16,
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    }}
  >
    {icon ? (
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
        }}
      >
        {icon}
      </div>
    ) : (
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
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9CA3AF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
    )}
    <h3
      style={{
        fontSize: 16,
        fontWeight: 600,
        color: "#111827",
        margin: "0 0 4px",
      }}
    >
      {title}
    </h3>
    {description && (
      <p
        style={{
          fontSize: 14,
          color: "#6B7280",
          margin: "0 0 20px",
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>
    )}
    {action && (
      <button
        onClick={action.onClick}
        style={{
          padding: "10px 24px",
          background: "#2563EB",
          color: "white",
          border: "none",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "background 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#1D4ED8")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#2563EB")}
      >
        {action.label}
      </button>
    )}
  </div>
);