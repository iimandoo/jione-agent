export const darkTheme = {
  colors: {
    background: "#0F172A",
    foreground: "#E2E8F0",
    primary: "#60A5FA",
    primaryForeground: "#0F172A",
    secondary: "#1E293B",
    secondaryForeground: "#94A3B8",
    muted: "#1E293B",
    mutedForeground: "#64748B",
    border: "#334155",
    card: "#1E293B",
    cardForeground: "#E2E8F0",
    destructive: "#EF4444",
  },

  radius: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
  },

  shadows: {
    sm: "0 1px 4px rgba(0,0,0,0.3)",
    md: "0 4px 16px rgba(0,0,0,0.4)",
    lg: "0 8px 32px rgba(0,0,0,0.5)",
  },

  fonts: {
    primary:
      "'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  typography: {
    h1: { fontSize: "2.25rem", fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontSize: "1.875rem", fontWeight: 700, letterSpacing: "-0.02em" },
    body: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.5 },
    small: { fontSize: "0.875rem", fontWeight: 400 },
  },
} as const;

export type DarkTheme = typeof darkTheme;
