import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  InteractionManager,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
} from "react-native";
import { useNavigation } from "expo-router";
import { CalculatorHeader } from "@/components/CalculatorHeader";
import { GrandTotal } from "@/components/GrandTotal";
import { SaveButton } from "@/components/SaveButton";
import { CalculationHistory } from "@/constants/historyType";
import { evaluateExpression } from "@/utils/expression";
import { validateSection } from "@/utils/validation";
import { formatWithSign, formatTwoDecimals } from "@/utils/number";
import { addToHistory } from "@/utils/storage";
import { ThemeColors } from "@/constants/Colors";

export default function CalculatorScreen() {
  const navigation = useNavigation();

  const appState = useRef(AppState.currentState);

  // Input values
  const [sectionA, setSectionA] = useState("");
  const [sectionD, setSectionD] = useState("");
  const [sectionM, setSectionM] = useState("");

  const [sectionAError, setSectionAError] = useState("");
  const [sectionDError, setSectionDError] = useState("");

  // Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [canFocusInput, setCanFocusInput] = useState(false);

  // Đợi layout ổn định sau khi resume
  useEffect(() => {
    let cancelled = false;
    const task = InteractionManager.runAfterInteractions(() => {
      if (!cancelled) {
        setCanFocusInput(true);
      }
    });

    return () => {
      cancelled = true;
      task.cancel();
    };
  }, []);

  // Reset all fields to default values
  const resetFields = () => {
    setSectionA("");
    setSectionD("");
    setSectionM("");
    setSectionAError("");
    setSectionDError("");
  };

  // Remove the navigation blur listener that was doing the reset
  useEffect(() => {
    const unsubscribeBlur = navigation.addListener("blur", () => {
      resetFields();
    });

    return unsubscribeBlur;
  }, [navigation, resetFields]);

  const grandTotal = useMemo(() => {
    const aTotal = evaluateExpression(sectionA);
    const dTotal = evaluateExpression(sectionD);
    const mTotal = evaluateExpression(sectionM);

    if (aTotal > 0 && dTotal > 0) {
      if (aTotal >= dTotal) {
        return (aTotal * 2) / dTotal + mTotal;
      } else {
        return 4 - (2 * dTotal) / aTotal + mTotal;
      }
    }
    return 0;
  }, [sectionA, sectionD, sectionM]);

  const handleSave = async () => {
    const isFormValid =
      validateSection(sectionD, "D").isValid && validateSection(sectionA, "A").isValid;
    if (!isFormValid) {
      Alert.alert("Invalid Input", "Sections A and D must have values greater than 0.");
      return;
    }

    try {
      setIsSaving(true);

      // Create history entry
      const newEntry: CalculationHistory = {
        id: Date.now().toString(),
        savedDate: new Date(),
        sectionA: {
          value: sectionA,
          total: evaluateExpression(sectionA)?.toString(),
        },
        sectionD: {
          value: sectionD,
          total: evaluateExpression(sectionD)?.toString(),
        },
        sectionM: {
          value: sectionM,
          total: formatWithSign(evaluateExpression(sectionM) || 0, 1),
        },
        finalTotal: formatWithSign(grandTotal, 1),
      };

      // Add to AsyncStorage
      await addToHistory(newEntry);

      // Reset fields after successful save
      resetFields();

      Alert.alert("Success", "Calculation saved to history.");
    } catch (error) {
      console.error("Error saving calculation:", error);
      Alert.alert("Error", "Failed to save calculation to history.");
    } finally {
      setIsSaving(false);
    }
  };

  const validateA = (value: string) => {
    if (!value) {
      setSectionAError("Field is required");
    } else {
      const result = validateSection(value, "A");
      if (!result.isValid) {
        setSectionAError("Giá trị A phải lớn hơn 0");
      } else {
        setSectionAError("");
      }
    }
  };
  const validateD = (value: string) => {
    if (!value) {
      setSectionDError("Field is required");
    } else {
      const result = validateSection(value, "D");
      if (!result.isValid) {
        setSectionDError("Giá trị D phải lớn hơn 0");
      } else {
        setSectionDError("");
      }
    }
  };

  const renderTotalSection = (section: "A" | "D" | "M", value: any) => {
    const total = evaluateExpression(value);
    const result = section === "M" ? formatWithSign(total, 1) : formatTwoDecimals(total);
    return (
      <Text style={{ fontSize: 15, color: "#637587", marginVertical: 8, marginHorizontal: 8 }}>
        Total: {result}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <CalculatorHeader />
      </SafeAreaView>
      {canFocusInput ? (
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            // onScrollBeginDrag={dismissKeyboard}
          >
            <View>
              <View style={styles.fieldWrapper}>
                <Text style={styles.labelForm}>A</Text>
                <TextInput
                  style={styles.textInputContainer}
                  placeholder="Enter calculations..."
                  placeholderTextColor={"#637587"}
                  value={sectionA}
                  onChangeText={(text) => {
                    setSectionA(text);
                    validateA(text);
                  }}
                  onBlur={() => validateA(sectionA)}
                />
                {sectionAError !== "" && (
                  <Text style={{ fontSize: 12, color: "red" }}>{sectionAError}</Text>
                )}
              </View>
              {renderTotalSection("A", sectionA)}
            </View>

            <View>
              <View style={styles.fieldWrapper}>
                <Text style={styles.labelForm}>D</Text>
                <TextInput
                  style={styles.textInputContainer}
                  placeholder="Enter calculations..."
                  placeholderTextColor={"#637587"}
                  value={sectionD}
                  onChangeText={(text) => {
                    setSectionD(text);
                    validateD(text);
                  }}
                  onBlur={() => validateD(sectionD)}
                />
                {sectionDError !== "" && (
                  <Text style={{ fontSize: 12, color: "red" }}>{sectionDError}</Text>
                )}
              </View>
              {renderTotalSection("D", sectionD)}
            </View>

            <View>
              <View style={styles.fieldWrapper}>
                <Text style={styles.labelForm}>M</Text>
                <TextInput
                  style={styles.textInputContainer}
                  placeholder="Enter calculations..."
                  placeholderTextColor={"#637587"}
                  value={sectionM}
                  onChangeText={(text) => {
                    setSectionM(text);
                  }}
                />
              </View>
              {renderTotalSection("M", sectionM)}
            </View>

            <GrandTotal total={formatWithSign(grandTotal, 1)} />
          </ScrollView>
          <SaveButton onPress={handleSave} disabled={isSaving} isLoading={isSaving} />
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={"#637587"} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  fieldWrapper: {
    gap: 4,
    paddingHorizontal: 8,
    paddingTop: 12,
  },
  labelForm: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColors.WIFColors.navyBlue,
  },
  textInputContainer: {
    borderRadius: 8,
    borderColor: "#DBE0E5",
    borderWidth: 1,
    minHeight: 45,
    maxHeight: 70,
    width: "100%",
    paddingHorizontal: 12,
  },
});
