import { Redirect } from "expo-router";
import { useAuthStore } from "@/src/store/useAuthStore";
import { ActivityIndicator, View } from "react-native";
import { useTheme } from "@/src/theme/ThemeProvider";

export default function Index() {
  const { user, initialized, loading } = useAuthStore();
  const { theme } = useTheme();

  if (!initialized || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(app)/" />;
  }

  return <Redirect href="/(auth)/login" />;
}
