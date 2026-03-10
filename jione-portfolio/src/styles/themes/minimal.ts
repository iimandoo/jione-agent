export const minimalTheme = {
  colors: {
    background: "#FAFAFA",
    foreground: "#111111",
    primary: "#111111",
    primaryForeground: "#FFFFFF",
    secondary: "#F5F5F5",
    secondaryForeground: "#555555",
    muted: "#F0F0F0",
    mutedForeground: "#888888",
    border: "#E0E0E0",
    card: "#FFFFFF",
    cardForeground: "#111111",
    destructive: "#DC2626",
  },

  radius: {
    xs: "0.125rem",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
  },

  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.04)",
    md: "0 2px 8px rgba(0,0,0,0.06)",
    lg: "0 4px 16px rgba(0,0,0,0.08)",
  },

  fonts: {
    primary:
      "'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  typography: {
    h1: { fontSize: "2rem", fontWeight: 600, letterSpacing: "-0.01em" },
    h2: { fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.01em" },
    body: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 },
    small: { fontSize: "0.875rem", fontWeight: 400 },
  },
} as const;

export type MinimalTheme = typeof minimalTheme;
