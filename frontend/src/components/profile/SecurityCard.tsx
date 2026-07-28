import { memo } from "react";
import { colors, borderRadius, spacing, typography, transitions } from "../../styles/designTokens";

interface SecurityAction {
  label: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  status?: "enabled" | "disabled" | "pending";
  disabled?: boolean;
  comingSoon?: boolean;
}

interface SecurityCardProps {
  onOpenChangePassword: () => void;
}

export const SecurityCard = memo(({ onOpenChangePassword }: SecurityCardProps) => {
  const actions: SecurityAction[] = [
    {
      label: "Change Password",
      description: "Update your account password",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      onClick: onOpenChangePassword,
    },
    {
      label: "Two-Factor Authentication",
      description: "Add an extra layer of security",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.warning} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      status: "disabled",
      comingSoon: true,
    },
    {
      label: "Active Sessions",
      description: "Manage your active login sessions",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.info} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      comingSoon: true,
    },
    {
      label: "Login History",
      description: "View recent login activity",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.textTertiary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      comingSoon: true,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing.sm,
      }}
    >
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          disabled={action.disabled || action.comingSoon}
          style={{
            display: "flex",
            alignItems: "center",
            gap: spacing.md,
            padding: `${spacing.md}px ${spacing.lg}px`,
            background: "transparent",
            border: `1px solid ${colors.border}`,
            borderRadius: borderRadius.xl,
            cursor: action.disabled || action.comingSoon ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            textAlign: "left",
            width: "100%",
            transition: transitions.fast,
            opacity: action.comingSoon ? 0.6 : 1,
          }}
          onMouseOver={(e) => {
            if (!action.disabled && !action.comingSoon) {
              e.currentTarget.style.background = colors.bgSecondary;
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.transform = "translateX(4px)";
            }
          }}
          onMouseOut={(e) => {
            if (!action.disabled && !action.comingSoon) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.transform = "translateX(0)";
            }
          }}
          aria-label={action.label}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: borderRadius.lg,
              background: `linear-gradient(135deg, ${colors.bgTertiary}, ${colors.bgSecondary})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              border: `1px solid ${colors.borderLight}`,
            }}
          >
            {action.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                ...typography.bodySm,
                color: colors.textPrimary,
                margin: "0 0 2px",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {action.label}
            </p>
            <p
              style={{
                ...typography.small,
                color: colors.textMuted,
                margin: 0,
                fontSize: 11,
              }}
            >
              {action.comingSoon ? `${action.description} — Coming soon` : action.description}
            </p>
          </div>
          {action.status && (
            <span
              style={{
                padding: "4px 10px",
                borderRadius: borderRadius.md,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.03em",
                background: action.status === "enabled" ? colors.successBg : colors.bgTertiary,
                color: action.status === "enabled" ? colors.success : colors.textTertiary,
                textTransform: "uppercase",
              }}
            >
              {action.status}
            </span>
          )}
          {!action.status && !action.comingSoon && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          )}
          {action.comingSoon && (
            <span
              style={{
                ...typography.xs,
                color: colors.textMuted,
                background: colors.bgTertiary,
                padding: "3px 8px",
                borderRadius: borderRadius.md,
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              Soon
            </span>
          )}
        </button>
      ))}
    </div>
  );
});

SecurityCard.displayName = "SecurityCard";