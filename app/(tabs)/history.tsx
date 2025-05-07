import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HistoryItem from "@/components/HistoryItem";
import { HistoryDetailModal } from "@/components/HistoryDetailModal";
import { CalculationHistory } from "@/constants/historyType";
import { clearHistory, deleteHistoryItem, loadHistory } from "@/utils/storage";

export default function HistoryScreen() {
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CalculationHistory | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Load history when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const fetchHistory = async () => {
        setLoading(true);
        const savedHistory = await loadHistory();
        setHistory(savedHistory);
        setLoading(false);
      };

      fetchHistory();

      // No cleanup function needed for this effect
      return () => {};
    }, [])
  );

  const handleItemPress = (item: CalculationHistory) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert("Delete Calculation", "Are you sure you want to delete this calculation?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteHistoryItem(id);
          const updatedHistory = history.filter((item) => item.id !== id);
          setHistory([...updatedHistory]);
        },
      },
    ]);
  };

  const handleClearAll = async () => {
    Alert.alert("Clear History", "Are you sure you want to clear all calculation history?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearHistory();
          setHistory([]);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginHorizontal: 8 }}>History</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* History List */}
      <View style={styles.historyContent}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={"#1d3557"} />
          </View>
        ) : (
          <>
            {history.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={{ fontSize: 16, textAlign: "center", color: "#6E7881" }}>
                  No calculation history yet
                </Text>
              </View>
            ) : (
              <ScrollView style={styles.scrollView}>
                {history.map((item) => (
                  <React.Fragment key={item.id}>
                    <HistoryItem
                      item={item}
                      onPress={handleItemPress}
                      onDelete={handleDeleteItem}
                    />
                  </React.Fragment>
                ))}
              </ScrollView>
            )}
          </>
        )}
      </View>

      <HistoryDetailModal
        visible={modalVisible}
        item={selectedItem}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  historyContent: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  clearButton: {
    color: "#6E7881",
  },
  scrollView: {
    flex: 1,
    marginVertical: 2,
  },
  listContent: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
