import { CalculationHistory } from "@/constants/historyType";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_STORAGE_KEY = "wifi_calculator_history";

/**
 * Save calculation history to AsyncStorage
 */
export const saveHistory = async (
  history: CalculationHistory[],
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(history);
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error("Error saving history:", error);
  }
};

/**
 * Load calculation history from AsyncStorage
 */
export const loadHistory = async (): Promise<CalculationHistory[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error loading history:", error);
    return [];
  }
};

/**
 * Add a new calculation to history
 */
export const addToHistory = async (
  calculation: CalculationHistory,
): Promise<void> => {
  try {
    const history = await loadHistory();
    const updatedHistory = [calculation, ...history];
    await saveHistory(updatedHistory);
  } catch (error) {
    console.error("Error adding to history:", error);
  }
};

/**
 * Delete a specific history item by ID
 */
export const deleteHistoryItem = async (id: string): Promise<void> => {
  try {
    const history = await loadHistory();
    const updatedHistory = history.filter((item) => item.id !== id);
    await saveHistory(updatedHistory);
  } catch (error) {
    console.error("Error deleting history item:", error);
  }
};

/**
 * Clear all history
 */
export const clearHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing history:", error);
  }
};
