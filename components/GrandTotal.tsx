import React from "react";
import { Colors, Text, View } from "react-native-ui-lib";

interface GrandTotalProps {
  total: string;
}

export const GrandTotal: React.FC<GrandTotalProps> = ({ total }) => {
  return (
    <View padding-16>
      <Text text50BO color={Colors.navyBlue}>Final Total</Text>
      <Text center text30BO color={Colors.navyBlue} marginT-8>{total}</Text>
    </View>
  );
};
