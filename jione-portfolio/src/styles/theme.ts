// src/styles/theme.ts
export const theme = {
  colors: {
    background: "#FFFFFF",
    foreground: "#1B1C1F",
    primary: "#3182F6", // Toss Blue
    primaryForeground: "#FFFFFF",
    secondary: "#F2F4F6",
    secondaryForeground: "#4E5968",
    muted: "#F9FAFB",
    mutedForeground: "#8B95A1",
    border: "#E5E8EB",
    card: "#FFFFFF",
    cardForeground: "#1B1C1F",
    destructive: "#FF4D4F",
  },

  radius: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "0.75rem", // 12px — 토스 특유의 둥근 모서리
    lg: "1rem",
    xl: "1.5rem",
  },

  shadows: {
    sm: "0 1px 4px rgba(0,0,0,0.06)",
    md: "0 4px 16px rgba(0,0,0,0.08)",
    lg: "0 8px 32px rgba(0,0,0,0.10)",
  },

  fonts: {
    primary:
      "'Pretendard Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  typography: {
    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "1.875rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    body: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    small: {
      fontSize: "0.875rem",
      fontWeight: 400,
    },
  },
};

export type Theme = typeof theme;
