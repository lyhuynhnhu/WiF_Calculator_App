import React from "react";
import { StyleSheet } from "react-native";
import { Image, Text, View } from "react-native-ui-lib";

export const CalculatorHeader: React.FC = () => {
  return (
    <View paddingH-16 paddingT-12 paddingB-8 style={styles.header}>
      <View row centerV gap-12>
        <Image
          source={require("../assets/images/wif.png")}
          style={{ width: 38, height: 38 }}
        />
        <Text text60BO>
          WiF Calculator
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
});
