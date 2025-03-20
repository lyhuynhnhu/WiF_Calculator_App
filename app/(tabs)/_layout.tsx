import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Colors } from "react-native-ui-lib";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";

// Custom TabBar background with gradient
function CustomTabBarBackground() {
  return (
    <LinearGradient
      colors={[Colors.navyBlue, Colors.darkNavyBlue]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.2)",
      }}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // Override the color scheme with our custom theme
  const themeColors = {
    light: {
      tint: Colors.flameRed,
      tabIconDefault: Colors.grey50,
      background: Colors.navyBlue,
    },
    dark: {
      tint: Colors.flameYellow,
      tabIconDefault: Colors.grey50,
      background: Colors.darkNavyBlue,
    },
  };

  // Use the appropriate theme based on system preference
  const colors = themeColors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: (props) => (
          <PlatformPressable
            {...props}
            onPressIn={(ev) => {
              if (process.env.EXPO_OS === "ios") {
                // Add a soft haptic feedback when pressing down on the tabs.
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              props.onPressIn?.(ev);
            }}
          />
        ),
        tabBarBackground: CustomTabBarBackground,
        tabBarStyle: {
          backgroundColor: "transparent",
          height: Platform.OS === "ios" ? 88 : 60,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          paddingBottom: Platform.OS === "ios" ? 0 : 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Calculator",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="calculate" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="history" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
