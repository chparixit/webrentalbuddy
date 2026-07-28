import { memo } from "react";
import type { QuickAction } from "../../types/dashboard";

interface ActionCardProps {
  action: QuickAction;
}

export const ActionCard = memo(function ActionCard({ action }: ActionCardProps) {
  return (
    <button
      onClick={action.onClick}
      style={{
        padding: "20px 24px",
        background: "white",
        border: "1.5px solid #E5E7EB",
        borderRadius: 14,
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600,
        color: "#374151",
        fontFamily: "inherit",
        textAlign: "left",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        width: "100%",
        outline: "none",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = action.color;
        e.currentTarget.style.background = action.bgColor;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "#E5E7EB";
        e.currentTarget.style.background = "white";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = action.color;
        e.currentTarget.style.boxShadow = `0 0 0 3px ${action.color}20`;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "#E5E7EB";
        e.currentTarget.style.boxShadow = "none";
      }}
      aria-label={`Quick action: ${action.label}`}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: action.bgColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
          transition: "transform 0.2s",
        }}
        aria-hidden="true"
        className="action-icon"
      >
        {action.icon}
      </div>
      <div>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#111827", display: "block", marginBottom: 2 }}>
          {action.label}
        </span>
        <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 400 }}>
          Click to view
        </span>
      </div>

      {/* Arrow indicator */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginLeft: "auto", transition: "transform 0.2s" }}
        className="action-arrow"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>

      <style>{`
        .action-card:focus-visible .action-icon {
          transform: scale(1.1);
        }
      `}</style>
    </button>
  );
});