import { colors, borderRadius, spacing, typography } from "../../styles/designTokens";

interface ProfileCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  variant?: "default" | "compact";
}

export const ProfileCard = ({
  title,
  subtitle,
  icon,
  action,
  children,
  variant = "default",
}: ProfileCardProps) => {
  const isCompact = variant === "compact";

  return (
    <div
      style={{
        background: colors.bgPrimary,
        borderRadius: borderRadius["3xl"],
        padding: isCompact ? spacing.xl : spacing["3xl"],
        boxShadow: colors.shadowSm,
        border: `1px solid ${colors.border}`,
        transition: "box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease",
        width: "100%",
        position: "relative",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(37, 99, 235, 0.08)`;
        e.currentTarget.style.borderColor = colors.borderLight;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = colors.shadowSm;
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {(title || icon || action) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: spacing.md,
            marginBottom: title || subtitle ? spacing["2xl"] : 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: spacing.md, flex: 1 }}>
            {icon && (
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: borderRadius.lg,
                  background: `linear-gradient(135deg, ${colors.primaryLight}, ${colors.primaryBg})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 18,
                  border: `1px solid ${colors.primaryLight}`,
                }}
              >
                <span style={{ color: colors.primary }}>{icon}</span>
              </div>
            )}
            <div style={{ minWidth: 0, paddingTop: 2 }}>
              {title && (
                <h3
                  style={{
                    ...typography.h4,
                    color: colors.textPrimary,
                    margin: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: 700,
                    fontSize: 17,
                  }}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p
                  style={{
                    ...typography.caption,
                    color: colors.textTertiary,
                    margin: "6px 0 0",
                    fontSize: 12,
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div style={{ flexShrink: 0 }}>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};