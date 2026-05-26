export const colors = {
  background: {
    primary: "#090A0F",
    secondary: "#12141D",
    elevated: "#1A1D29",
    inverse: "#FFFFFF",
  },
  border: {
    subtle: "#262A38",
    strong: "#3B4054",
  },
  brand: {
    primary: "#7C3AED",
    secondary: "#06B6D4",
    accent: "#F43F5E",
  },
  text: {
    primary: "#F8FAFC",
    secondary: "#CBD5E1",
    muted: "#94A3B8",
    inverse: "#111827",
  },
  state: {
    danger: "#EF4444",
    success: "#22C55E",
    warning: "#F59E0B",
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
} as const;

export const typography = {
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    "2xl": 32,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    "2xl": 40,
  },
  weight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
} as const;

export const shadows = {
  none: {
    elevation: 0,
    shadowOpacity: 0,
  },
  sm: {
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 3,
  },
  md: {
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
} as const;

export const theme = {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} as const;

export type Theme = typeof theme;
