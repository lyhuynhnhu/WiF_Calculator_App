import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, AppState, Keyboard, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Spacings } from "react-native-ui-lib";
import { useNavigation } from "expo-router";
import { CalculatorHeader } from "@/components/CalculatorHeader";
import { InputSection } from "@/components/InputSection";
import { GrandTotal } from "@/components/GrandTotal";
import { SaveButton } from "@/components/SaveButton";
import { CalculationHistory } from "@/constants/historyType";
import { evaluateExpression } from "@/utils/expression";
import { validateSection } from "@/utils/validation";
import { formatWithSign } from "@/utils/number";
import { addToHistory } from "@/utils/storage";

const CalculatorScreen: React.FC = () => {
  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();

  // Input values
  const [sectionA, setSectionA] = useState("");
  const [sectionD, setSectionD] = useState("");
  const [sectionM, setSectionM] = useState("");

  // Touched state for each section
  const [touchedA, setTouchedA] = useState(false);
  const [touchedD, setTouchedD] = useState(false);
  const [touchedM, setTouchedM] = useState(false);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  // Reset all fields to default values
  const resetFields = useCallback(() => {
    setSectionA("");
    setSectionD("");
    setSectionM("");
    setTouchedA(false);
    setTouchedD(false);
    setTouchedM(false);
  }, []);

  // Effect to listen to AppState changes
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // console.log(`AppState changed from ${appState.current} to ${nextAppState}`);
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribeBlur = navigation.addListener('blur', () => {
      // This runs when the screen goes out of focus *due to navigation*
      // console.log(`Navigation BLUR event. Current AppState: ${appState.current}`);
      if (appState.current === "active") {
         resetFields();
      } else {
      }
    });

    return () => {
       unsubscribeBlur();
    };
  }, [navigation, resetFields]);

  const calculateSection = useCallback((value: string, section: "A" | "D" | "M") => {
    const result = evaluateExpression(value);
    const validation = validateSection(value, section);
    return { total: result, ...validation };
  }, []);

  const sectionResults = useMemo(
    () => ({
      A: calculateSection(sectionA, "A"),
      D: calculateSection(sectionD, "D"),
      M: calculateSection(sectionM, "M"),
    }),
    [sectionA, sectionD, sectionM, calculateSection]
  );

  const grandTotal = useMemo(() => {
    const aTotal = sectionResults.A.total;
    const dTotal = sectionResults.D.total;
    const mTotal = sectionResults.M.total;

    if (aTotal > 0 && dTotal > 0) {
      if (aTotal >= dTotal) {
        return (aTotal * 2) / dTotal + mTotal;
      } else {
        return 4 - (2 * dTotal) / aTotal + mTotal;
      }
    }
    return 0;
  }, [sectionResults]);

  // Check if form is valid for saving
  const isFormValid = useMemo(() => {
    return sectionResults.A.isValid && sectionResults.D.isValid;
  }, [sectionResults.A.isValid, sectionResults.D.isValid]);

  const handleSave = useCallback(async () => {
    // Mark all fields as touched when trying to save
    setTouchedA(true);
    setTouchedD(true);
    setTouchedM(true);

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
          total: sectionResults.A.total?.toString(),
        },
        sectionD: {
          value: sectionD,
          total: sectionResults.D.total?.toString(),
        },
        sectionM: {
          value: sectionM,
          total: formatWithSign(sectionResults.M?.total || 0, 1),
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
  }, [isFormValid, sectionA, sectionD, sectionM, sectionResults, grandTotal]);

  // Dismiss keyboard when tapping outside inputs
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <CalculatorHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={dismissKeyboard}
      >
        <InputSection
          label="A"
          value={sectionA}
          onValueChange={setSectionA}
          total={sectionResults.A.total}
          error={sectionResults.A.error}
          touched={touchedA}
          onTouch={() => setTouchedA(true)}
        />

        <InputSection
          label="D"
          value={sectionD}
          onValueChange={setSectionD}
          total={sectionResults.D.total}
          error={sectionResults.D.error}
          touched={touchedD}
          onTouch={() => setTouchedD(true)}
        />

        <InputSection
          label="M"
          value={sectionM}
          onValueChange={setSectionM}
          total={sectionResults.M.total}
          error={sectionResults.M.error}
          touched={touchedM}
          onTouch={() => setTouchedM(true)}
        />

        <GrandTotal total={formatWithSign(grandTotal, 1)} />
      </ScrollView>

      <SaveButton
        onPress={handleSave}
        disabled={(!isFormValid && (touchedA || touchedD)) || isSaving}
        isLoading={isSaving}
      />
    </SafeAreaView>
  );
};

export default CalculatorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacings.s1,
    // paddingVertical: Spacings.s2,
  },
});
