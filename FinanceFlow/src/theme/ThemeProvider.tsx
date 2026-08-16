import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme, ViewStyle } from "react-native";
import { lightTheme, darkTheme, Theme } from "./tokens";
import { storage } from "../services/storage";

type Mode = "system" | "light" | "dark";
const THEME_KEY = "ff.theme.mode";

interface ThemeContextType {
  theme: Theme;
  mode: Mode;
  setMode: (m: Mode) => void;
  toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<Mode>(() => {
    const stored = storage.getString(THEME_KEY);
    return (stored as Mode) ?? "system";
  });

  // Resolve the actual theme based on mode and system preference
  const resolved = mode === "system" ? (systemColorScheme ?? "light") : mode;
  const theme = resolved === "dark" ? darkTheme : lightTheme;

  const setMode = (newMode: Mode) => {
    storage.set(THEME_KEY, newMode);
    setModeState(newMode);
  };

  const toggleDark = () => {
    const newMode: Mode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Helper hook to get themed styles
export const useThemedStyles = () => {
  const { theme } = useTheme();
  
  const commonCardStyles: ViewStyle = {
    backgroundColor: theme.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: theme.shadowOpacity,
    shadowRadius: 12,
    elevation: 4,
  };

  const cardSecondaryStyles: ViewStyle = {
    ...commonCardStyles,
    backgroundColor: theme.cardSecondary,
  };

  const containerStyles: ViewStyle = {
    flex: 1,
    backgroundColor: theme.background,
  };

  return {
    theme,
    card: commonCardStyles,
    cardSecondary: cardSecondaryStyles,
    container: containerStyles,
  };
};
