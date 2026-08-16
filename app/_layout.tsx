import { ThemeProvider, useTheme } from "@/src/theme/ThemeProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useAuthStore } from "@/src/store/useAuthStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Import Firebase to initialize it
import "@/src/services/firebase";

function RootLayout() {
  const { theme } = useTheme();
  const { initialize, initialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (!initialized) {
    return null; // Or show a loading screen
  }

  return (
    <>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RootLayout />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
