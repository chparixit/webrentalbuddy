interface NotFoundPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const NotFoundPage = ({ onNavigate }: NotFoundPageProps) => {
  return (
    <div
      style={{
        padding: "80px 40px",
        maxWidth: 600,
        margin: "0 auto",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          background: "#EFF6FF",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 28,
          boxShadow: "0 10px 25px rgba(37, 99, 235, 0.1)",
        }}
      >
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>

      <h1
        style={{
          fontSize: "clamp(48px, 8vw, 72px)",
          fontWeight: 800,
          margin: "0 0 8px",
          color: "#1E3A8A",
          lineHeight: 1,
        }}
      >
        404
      </h1>

      <h2
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#111827",
          margin: "0 0 12px",
        }}
      >
        Page Not Found
      </h2>

      <p
        style={{
          fontSize: 15,
          color: "#6B7280",
          lineHeight: 1.6,
          margin: "0 0 32px",
          maxWidth: 420,
        }}
      >
        Oops! The page you are looking for does not exist in RentalBuddy Kathmandu Valley or has been moved.
      </p>

      <button
        onClick={() => onNavigate("home")}
        style={{
          padding: "14px 32px",
          background: "#2563EB",
          color: "white",
          border: "none",
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "#1D4ED8";
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(37, 99, 235, 0.45)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "#2563EB";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 14px rgba(37, 99, 235, 0.4)";
        }}
      >
        Back to Home
      </button>
    </div>
  );
};
