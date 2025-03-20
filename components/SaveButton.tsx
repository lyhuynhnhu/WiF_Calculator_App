import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Colors, Text, TouchableOpacity, View } from "react-native-ui-lib";

interface SaveButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  onPress,
  disabled = false,
  isLoading = false,
}) => {
  return (
    <View padding-20>
      <TouchableOpacity
        style={[styles.saveBtn, disabled && styles.disabledSaveBtn]}
        activeOpacity={0.8}
        disabled={disabled}
        onPress={onPress}
      >
        <LinearGradient
          colors={[Colors.navyBlue, Colors.flameRed]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text white text70 style={styles.saveBtnLabel}>
              Save to history
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  saveBtn: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "white",
    overflow: "hidden",
  },
  disabledSaveBtn: {
    opacity: 0.5,
  },
  gradientButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnLabel: {
    fontWeight: "bold",
  },
});
