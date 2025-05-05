import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  InteractionManager,
  Keyboard,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Colors, Spacings, View, Text, TextField } from "react-native-ui-lib";
import { useNavigation } from "expo-router";
import { CalculatorHeader } from "@/components/CalculatorHeader";
import { GrandTotal } from "@/components/GrandTotal";
import { SaveButton } from "@/components/SaveButton";
import { CalculationHistory } from "@/constants/historyType";
import { evaluateExpression } from "@/utils/expression";
import { validateSection } from "@/utils/validation";
import { formatWithSign, formatTwoDecimals } from "@/utils/number";
import { addToHistory } from "@/utils/storage";

export default function CalculatorScreen() {
  const navigation = useNavigation();

  const appState = useRef(AppState.currentState);

  // Input values
  const [sectionA, setSectionA] = useState("");
  const [sectionD, setSectionD] = useState("");
  const [sectionM, setSectionM] = useState("");

  const [sectionAError, setSectionAError] = useState("");

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

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const currentState = appState.current;
      appState.current = nextAppState;

      if (currentState.match(/inactive|background/) && nextAppState === "active") {
        console.log("App resumed");

        setCanFocusInput(false);

        InteractionManager.runAfterInteractions(() => {
          const rafId = requestAnimationFrame(() => {
            setCanFocusInput(true);
          });

          // Dọn dẹp requestAnimationFrame nếu component unmount
          return () => cancelAnimationFrame(rafId);
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Reset all fields to default values
  const resetFields = () => {
    setSectionA("");
    setSectionD("");
    setSectionM("");
  };

  // Remove the navigation blur listener that was doing the reset
  useEffect(() => {
    const unsubscribeBlur = navigation.addListener("blur", () => {
      // Add a small delay before resetting
      const timer = setTimeout(() => {
        resetFields();
      }, 100);

      return () => clearTimeout(timer);
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

  // Dismiss keyboard when tapping outside inputs
  const dismissKeyboard = () => {
    Keyboard.dismiss();
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

  const renderTotalSection = (section: "A" | "D" | "M", value: any) => {
    const total = evaluateExpression(value);
    const result = section === "M" ? formatWithSign(total, 1) : formatTwoDecimals(total);
    return (
      <Text text80 color={"#637587"} marginH-16 marginB-8>
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
        <View flex>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
            // onScrollBeginDrag={dismissKeyboard}
          >
            <View>
              <View flex gap-6 paddingH-16 paddingT-12>
                <TextField
                  placeholder={"Enter calculations..."}
                  value={sectionA}
                  onChangeText={(text) => setSectionA(text)}
                  fieldStyle={styles.textInputContainer}
                  label="A"
                  labelStyle={{ color: Colors.navyBlue, fontSize: 16, fontWeight: "bold" }}
                  enableErrors
                  validateOnBlur
                  validate={["required", (value: any) => validateSection(value, "A").isValid]}
                  validationMessage={["Field is required", "Value must be greater than 0"]}
                />
                {/* <Text text70BL color={Colors.navyBlue}>
                  A
                </Text>
                <NativeTextInput
                  style={styles.textInputContainer}
                  placeholder="Enter calculations..."
                  value={sectionA}
                  onChangeText={(text) => {
                    setSectionA(text);
                    validateA(text);
                  }}
                  onBlur={() => validateA(sectionA)}
                />
                {sectionAError !== "" && (
                  <Text text80 color={Colors.red10}>
                    {sectionAError}
                  </Text>
                )} */}
              </View>
              {renderTotalSection("A", sectionA)}
            </View>

            <View>
              <View flex gap-6 paddingH-16 paddingT-12>
                <TextField
                  placeholder={"Enter calculations..."}
                  value={sectionD}
                  onChangeText={(text) => setSectionD(text)}
                  fieldStyle={styles.textInputContainer}
                  label="D"
                  labelStyle={{ color: Colors.navyBlue, fontSize: 16, fontWeight: "bold" }}
                  enableErrors
                  validateOnBlur
                  validate={["required", (value: any) => validateSection(value, "D").isValid]}
                  validationMessage={["Field is required", "Value must be greater than 0"]}
                />
              </View>
              {renderTotalSection("D", sectionD)}
            </View>

            <View>
              <View flex gap-6 paddingH-16 paddingT-12 paddingB-16>
                <TextField
                  placeholder={"Enter calculations..."}
                  value={sectionM}
                  onChangeText={(text) => setSectionM(text)}
                  fieldStyle={styles.textInputContainer}
                  label="M"
                  labelStyle={{ color: Colors.navyBlue, fontSize: 16, fontWeight: "bold" }}
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
          <ActivityIndicator size="large" color={Colors.navyBlue} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    // flexGrow: 1,
    paddingHorizontal: Spacings.s1,
    // paddingVertical: Spacings.s2,
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
  input: {
    flex: 1,
    textAlignVertical: "top",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
