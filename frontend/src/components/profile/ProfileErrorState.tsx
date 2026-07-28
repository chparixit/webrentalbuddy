import { memo } from "react";
import { colors, borderRadius, spacing, typography } from "../../styles/designTokens";
import { Button } from "../Button";

interface ProfileErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ProfileErrorState = memo(({ message, onRetry }: ProfileErrorStateProps) => (
  <div
    style={{
      maxWidth: 500,
      margin: "80px auto",
      padding: spacing["4xl"],
      textAlign: "center",
      background: colors.bgPrimary,
      borderRadius: borderRadius["3xl"],
      boxShadow: colors.shadowSm,
      border: `1px solid ${colors.border}`,
    }}
    role="alert"
  >
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: colors.errorBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
      }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={colors.error} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <h3
      style={{
        ...typography.h4,
        color: colors.textPrimary,
        margin: "0 0 8px",
      }}
    >
      Something went wrong
    </h3>
    <p
      style={{
        ...typography.body,
        color: colors.textSecondary,
        margin: "0 0 24px",
      }}
    >
      {message}
    </p>
    <Button variant="primary" onClick={onRetry}>
      Try Again
    </Button>
  </div>
));

ProfileErrorState.displayName = "ProfileErrorState";