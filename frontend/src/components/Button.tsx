import { colors, borderRadius, transitions } from "../styles/designTokens";

interface ButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "dangerOutline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  type?: "button" | "submit";
  ariaLabel?: string;
}

const variantStyles: Record<string, { bg: string; color: string; border: string; hoverBg: string; hoverColor?: string }> = {
  primary: { bg: colors.primary, color: "#fff", border: "none", hoverBg: colors.primaryDark },
  secondary: { bg: colors.bgTertiary, color: colors.textPrimary, border: "none", hoverBg: "#E5E7EB" },
  outline: { bg: "transparent", color: colors.textPrimary, border: `1.5px solid ${colors.border}`, hoverBg: colors.bgSecondary },
  ghost: { bg: "transparent", color: colors.textTertiary, border: "none", hoverBg: colors.bgTertiary },
  danger: { bg: colors.error, color: "#fff", border: "none", hoverBg: "#B91C1C" },
  dangerOutline: { bg: "transparent", color: colors.error, border: `1.5px solid ${colors.error}`, hoverBg: colors.errorBg },
};

const sizeStyles: Record<string, { padding: string; fontSize: number }> = {
  sm: { padding: "8px 16px", fontSize: 13 },
  md: { padding: "10px 20px", fontSize: 14 },
  lg: { padding: "14px 24px", fontSize: 16 },
};

export const Button = ({
  variant = "primary",
  size = "md",
  fullWidth,
  disabled,
  loading,
  onClick,
  children,
  style,
  type = "button",
  ariaLabel,
}: ButtonProps) => {
  const v = variantStyles[variant] || variantStyles.primary;
  const s = sizeStyles[size] || sizeStyles.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 600,
        fontFamily: "inherit",
        lineHeight: 1.3,
        borderRadius: borderRadius.xl,
        cursor: (disabled || loading) ? "not-allowed" : "pointer",
        opacity: (disabled || loading) ? 0.6 : 1,
        transition: transitions.normal,
        width: fullWidth ? "100%" : undefined,
        whiteSpace: "nowrap",
        ...v,
        ...style,
      }}
      onMouseOver={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.background = v.hoverBg;
          if (v.hoverColor) e.currentTarget.style.color = v.hoverColor;
        }
      }}
      onMouseOut={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.background = v.bg;
          if (v.hoverColor) e.currentTarget.style.color = v.color;
        }
      }}
    >
      {loading && (
        <span style={{ display: "inline-flex", animation: "spin 1s linear infinite" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </span>
      )}
      {children}
    </button>
  );
};