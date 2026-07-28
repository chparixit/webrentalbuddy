import { useState, useCallback } from "react";
import { colors, borderRadius, typography } from "../styles/designTokens";

interface FilterAccordionProps {
  title: string;
  icon?: React.ReactNode;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const FilterAccordion = ({
  title,
  icon,
  count,
  defaultOpen = true,
  children,
}: FilterAccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = useCallback(() => setIsOpen((p) => !p), []);

  return (
    <div
      style={{
        borderBottom: `1px solid ${colors.borderLight}`,
        paddingBottom: isOpen ? 16 : 0,
        marginBottom: isOpen ? 4 : 0,
      }}
    >
      <button
        onClick={toggle}
        aria-expanded={isOpen}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "14px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {icon && (
            <span style={{ color: colors.textTertiary, display: "flex" }}>{icon}</span>
          )}
          <span style={{ ...typography.body, fontWeight: 600, color: colors.textPrimary }}>
            {title}
          </span>
          {count !== undefined && count > 0 && (
            <span
              style={{
                background: colors.primary,
                color: "white",
                borderRadius: borderRadius.full,
                minWidth: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 600,
                padding: "0 6px",
              }}
            >
              {count}
            </span>
          )}
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={colors.textMuted}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        style={{
          maxHeight: isOpen ? 500 : 0,
          overflow: "hidden",
          transition: "max-height 0.3s ease, opacity 0.2s ease",
          opacity: isOpen ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
};
