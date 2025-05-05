import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { Colors, Spacings, Typography } from "react-native-ui-lib";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { enableScreens } from "react-native-screens";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemeColors } from "@/constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

enableScreens(false);

Colors.loadColors({
  ...ThemeColors.WIFColors,
  primary: "#2089DC",
  background: "#F5F7FA",
  card: "#FFFFFF",
  error: "#FF3B30",
  secondary: "#637587",
  border: "#E1E9EE",
});

Typography.loadTypographies({
  h1: { fontSize: 28, fontWeight: "bold" },
  h2: { fontSize: 20, fontWeight: "bold" },
  p: { fontSize: 16 },
  label: { fontSize: 16, fontWeight: "500" },
  result: { fontSize: 18, fontWeight: "600" },
  total: { fontSize: 24, fontWeight: "bold" },
});

Spacings.loadSpacings({
  page: 20,
  s1: 8,
  s2: 16,
  s3: 24,
  s4: 32,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    WorkSans: require("../assets/fonts/WorkSans-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "fade" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
