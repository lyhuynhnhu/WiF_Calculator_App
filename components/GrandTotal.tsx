import React from "react";
import { View, Text } from "react-native";
import { ThemeColors } from "@/constants/Colors";

interface GrandTotalProps {
  total: string;
}

export const GrandTotal: React.FC<GrandTotalProps> = ({ total }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 8,
        paddingVertical: 16,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", color: ThemeColors.WIFColors.navyBlue }}>
        Final Result:
      </Text>
      <Text style={{ fontSize: 22, fontWeight: "bold", color: ThemeColors.WIFColors.navyBlue }}>
        {total}
      </Text>
    </View>
  );
};
