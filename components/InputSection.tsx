import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";
import { formatTwoDecimals, formatWithSign } from "@/utils/number";

interface InputSectionProps {
  label: string;
  value: any;
  onValueChange: (value: any) => void;
  total: number;
  error?: string;
  touched: boolean;
  onTouch: () => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  label,
  value,
  onValueChange,
  total,
  error,
  touched,
  onTouch,
}) => {
  const showError = touched && error;

  return (
    <View>
      <View flex gap-8 paddingH-16 paddingV-12>
        <Text text70BL color={Colors.navyBlue}>
          {label}
        </Text>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => {
              if (!touched) onTouch();
              onValueChange(text);
            }}
            // onFocus={() => {
            //   if (!touched) onTouch();
            // }}
            keyboardType="default"
            placeholder={`Enter ${label} calculations...`}
            autoCapitalize="none"
            spellCheck={false}
            textAlignVertical="top"
          />
        </View>
        {showError ? (
          <Text text80 color={Colors.flameRed}>
            {error}
          </Text>
        ) : null}
      </View>
      <Text text80 color={"#637587"} marginH-16 marginB-8>
        Total:{" "}
        {label === "M" ? formatWithSign(total, 1) : formatTwoDecimals(total)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    borderRadius: 8,
    borderColor: "#DBE0E5",
    borderWidth: 1,
    minHeight: 50,
    maxHeight: 70,
    width: "100%",
  },
  input: {
    flex: 1,
    textAlignVertical: "top",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
