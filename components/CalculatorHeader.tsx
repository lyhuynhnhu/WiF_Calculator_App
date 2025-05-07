import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export const CalculatorHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Image source={require("../assets/images/wif.png")} style={{ width: 38, height: 38 }} />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>WiF Calculator</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
});
