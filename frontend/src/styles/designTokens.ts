// === Design System Tokens ===
// Centralized theme constants for consistent UI across all pages

export const colors = {
  // Primary
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primaryLight: "#EFF6FF",
  primaryBg: "#DBEAFE",

  // Semantic
  success: "#059669",
  successBg: "#ECFDF5",
  warning: "#D97706",
  warningBg: "#FFFBEB",
  error: "#DC2626",
  errorBg: "#FEF2F2",
  info: "#2563EB",
  infoBg: "#EFF6FF",

  // Text
  textPrimary: "#111827",
  textSecondary: "#4B5563",
  textTertiary: "#6B7280",
  textMuted: "#9CA3AF",

  // Backgrounds
  bgPrimary: "#FFFFFF",
  bgSecondary: "#F9FAFB",
  bgTertiary: "#F3F4F6",
  bgPage: "#F9FAFB",

  // Borders
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  borderFocus: "#2563EB",

  // Shadows
  shadowSm: "0 1px 2px rgba(0,0,0,0.05)",
  shadowMd: "0 1px 4px rgba(0,0,0,0.06)",
  shadowLg: "0 4px 12px rgba(0,0,0,0.08)",
  shadowXl: "0 8px 32px rgba(0,0,0,0.1)",
  shadowBooking: "0 -4px 20px rgba(0,0,0,0.1)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 60,
  "7xl": 80,
};

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  "2xl": 16,
  "3xl": 20,
  full: "50%",
};

export const typography = {
  h1: { fontSize: 28, fontWeight: 700, lineHeight: 1.3 },
  h2: { fontSize: 24, fontWeight: 700, lineHeight: 1.3 },
  h3: { fontSize: 20, fontWeight: 700, lineHeight: 1.3 },
  h4: { fontSize: 18, fontWeight: 600, lineHeight: 1.4 },
  body: { fontSize: 15, fontWeight: 400, lineHeight: 1.6 },
  bodySm: { fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
  caption: { fontSize: 13, fontWeight: 500, lineHeight: 1.4 },
  small: { fontSize: 12, fontWeight: 500, lineHeight: 1.3 },
  xs: { fontSize: 11, fontWeight: 600, lineHeight: 1.2 },
  label: { fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em" },
};

export const transitions = {
  fast: "all 0.15s ease",
  normal: "all 0.2s ease",
  slow: "all 0.3s ease",
};

export const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1280px",
};

export const zIndex = {
  dropdown: 100,
  sticky: 200,
  modal: 1000,
  toast: 2000,
};