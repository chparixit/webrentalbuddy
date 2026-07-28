import { colors, borderRadius, typography } from "../styles/designTokens";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info" | "primary";
  size?: "sm" | "md";
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const variantStyles: Record<string, { bg: string; color: string }> = {
  default: { bg: colors.bgTertiary, color: colors.textTertiary },
  success: { bg: colors.successBg, color: colors.success },
  warning: { bg: colors.warningBg, color: colors.warning },
  error: { bg: colors.errorBg, color: colors.error },
  info: { bg: colors.infoBg, color: colors.info },
  primary: { bg: colors.primaryLight, color: colors.primary },
};

export const Badge = ({
  variant = "default",
  size = "sm",
  children,
  style,
}: BadgeProps) => {
  const v = variantStyles[variant] || variantStyles.default;
  const sizeStyles = size === "sm"
    ? { padding: "3px 10px", fontSize: 11 }
    : { padding: "6px 14px", fontSize: 13 };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        borderRadius: borderRadius.md,
        fontWeight: typography.xs.fontWeight,
        lineHeight: 1.3,
        whiteSpace: "nowrap",
        background: v.bg,
        color: v.color,
        ...sizeStyles,
        ...style,
      }}
    >
      {children}
    </span>
  );
};