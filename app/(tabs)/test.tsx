import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
} from "react-native";
import { useNavigation } from "expo-router";
import { CalculatorHeader } from "@/components/CalculatorHeader";
import { validateSection } from "@/utils/validation";

const TestScreen: React.FC = () => {
  const navigation = useNavigation();

  // Input values
  const [sectionA, setSectionA] = useState("");

  const [sectionAError, setSectionAError] = useState("");

  // Reset all fields to default values
  const resetFields = () => {
    setSectionA("");
  };

  useEffect(() => {
    const unsubscribeBlur = navigation.addListener("blur", () => resetFields());

    return unsubscribeBlur;
  }, [navigation, resetFields]);

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

  return (
    <SafeAreaView style={styles.container}>
      <CalculatorHeader />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          // nestedScrollEnabled={true}
        >
          <View style={styles.fieldSection}>
            <Text style={styles.label}>
              Section A
            </Text>
            <TextInput
              style={styles.textInputContainer}
              placeholder="Enter calculations..."
              value={sectionA}
              onChangeText={(text) => {
                // setSectionA(text);
                // validateA(text);
                console.log('A', text);
              }}
              // onBlur={() => validateA(sectionA)}
              onBlur={() => console.log("blur")}
            />
            {sectionAError !== "" && (
              <Text style={{ color: "red", fontSize: 12 }}>
                {sectionAError}
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  fieldSection: {
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#1d3557",
  },
  textInputContainer: {
    borderRadius: 8,
    borderColor: "#DBE0E5",
    borderWidth: 1,
    minHeight: 50,
    maxHeight: 70,
    width: "100%",
    paddingHorizontal: 12,
  },
});
