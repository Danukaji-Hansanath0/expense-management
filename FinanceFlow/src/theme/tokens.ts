// Design Tokens for FinanceFlow
export const palette = {
  // Primary colors
  indigo50: "#EEF2FF",
  indigo100: "#E0E7FF",
  indigo200: "#C7D2FE",
  indigo300: "#A5B4FC",
  indigo400: "#818CF8",
  indigo500: "#6366F1",
  indigo600: "#4F46E5",
  indigo700: "#4338CA",
  indigo800: "#3730A3",
  indigo900: "#312E81",
  
  // Semantic colors
  green50: "#ECFDF5",
  green400: "#4ADE80",
  green500: "#22C55E",
  green600: "#16A34A",
  green700: "#15803D",
  
  red50: "#FEF2F2",
  red400: "#F87171",
  red500: "#EF4444",
  red600: "#DC2626",
  red700: "#B91C1C",
  
  amber50: "#FFFBEB",
  amber400: "#FBBF24",
  amber500: "#F59E0B",
  amber600: "#D97706",
  
  // Neutral colors
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  gray900: "#111827",
  
  // Background colors
  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
  slate800: "#1E293B",
  slate900: "#0F172A",
};

export const lightTheme = {
  dark: false,
  // Backgrounds
  background: "#F6F7FB",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  cardSecondary: "#F9FAFB",
  
  // Borders
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  
  // Primary
  primary: palette.indigo600,
  primarySoft: palette.indigo50,
  primaryMuted: palette.indigo400,
  
  // Semantic
  income: palette.green600,
  incomeSoft: palette.green50,
  expense: palette.red600,
  expenseSoft: palette.red50,
  warning: palette.amber500,
  warningSoft: palette.amber50,
  
  // Text
  textPrimary: palette.gray900,
  textSecondary: palette.gray600,
  textMuted: palette.gray400,
  textInverse: "#FFFFFF",
  
  // Status bar
  statusBar: "dark-content" as const,
  
  // Shadows
  shadowColor: "#000000",
  shadowOpacity: 0.1,
  
  // Chart colors
  chartColors: [
    palette.indigo500,
    palette.green500,
    palette.amber500,
    palette.red500,
    palette.indigo400,
    palette.green400,
  ],
};

export const darkTheme = {
  dark: true,
  // Backgrounds
  background: "#0B0E14",
  surface: "#151A23",
  card: "#1A202C",
  cardSecondary: "#1E2532",
  
  // Borders
  border: "#262D3D",
  borderLight: "#2D3548",
  
  // Primary
  primary: palette.indigo400,
  primarySoft: "#1E1B4B",
  primaryMuted: palette.indigo500,
  
  // Semantic
  income: palette.green400,
  incomeSoft: "#064E3B",
  expense: palette.red400,
  expenseSoft: "#7F1D1D",
  warning: palette.amber400,
  warningSoft: "#78350F",
  
  // Text
  textPrimary: "#F3F4F6",
  textSecondary: palette.gray400,
  textMuted: palette.gray500,
  textInverse: palette.gray900,
  
  // Status bar
  statusBar: "light-content" as const,
  
  // Shadows
  shadowColor: "#000000",
  shadowOpacity: 0.3,
  
  // Chart colors (brighter for dark mode)
  chartColors: [
    palette.indigo400,
    palette.green400,
    palette.amber400,
    palette.red400,
    palette.indigo300,
    palette.green300,
  ],
};

export type Theme = typeof lightTheme;

// Spacing tokens
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
  "6xl": 64,
};

// Border radius tokens
export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  "3xl": 24,
  full: 9999,
};

// Typography tokens
export const typography = {
  fontFamily: "System",
  fontWeights: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};
