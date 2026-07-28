import { memo } from "react";
import { colors, spacing, typography } from "../../styles/designTokens";

interface InfoRow {
  label: string;
  value: string | React.ReactNode;
  icon?: React.ReactNode;
}

interface InfoCardProps {
  rows: InfoRow[];
  columns?: 1 | 2;
}

export const InfoCard = memo(({ rows, columns = 2 }: InfoCardProps) => {
  if (rows.length === 0) {
    return (
      <div style={{ padding: spacing["3xl"], textAlign: "center" }}>
        <p style={{ ...typography.body, color: colors.textMuted, margin: 0 }}>
          No information available
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: columns === 2 ? "1fr 1fr" : "1fr",
        gap: `${spacing.xl}px ${spacing["3xl"]}px`,
      }}
    >
      {rows.map((row, index) => {
        const hasValue = Boolean(row.value && String(row.value).trim());
        return (
          <div
            key={row.label + index}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              paddingBottom: spacing.lg,
              borderBottom: `1px solid ${colors.borderLight}`,
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {row.icon && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 18,
                    height: 18,
                    flexShrink: 0,
                    opacity: 0.5,
                  }}
                >
                  {row.icon}
                </span>
              )}
              <span
                style={{
                  ...typography.label,
                  color: colors.textTertiary,
                  letterSpacing: "0.08em",
                  fontSize: 10,
                }}
              >
                {row.label.toUpperCase()}
              </span>
            </div>
            <span
              style={{
                ...typography.bodySm,
                color: hasValue ? colors.textPrimary : colors.textMuted,
                fontWeight: hasValue ? 600 : 400,
                fontStyle: hasValue ? "normal" : "italic",
                paddingLeft: row.icon ? 26 : 0,
                lineHeight: 1.4,
              }}
            >
              {hasValue ? row.value : "Not provided"}
            </span>
          </div>
        );
      })}
    </div>
  );
});

InfoCard.displayName = "InfoCard";