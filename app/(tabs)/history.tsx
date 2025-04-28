import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Colors, Text, View } from "react-native-ui-lib";
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
      <View style={styles.header} bg-white padding-16>
        <View row centerV>
          {/* logo */}
          <Text text60BO marginH-16>
            History
          </Text>
        </View>
        {history.length > 0 && (
          <Button link label="Clear All" labelStyle={styles.clearButton} onPress={handleClearAll} />
        )}
      </View>

      {/* History List */}
      <View style={styles.historyContent}>
        {loading ? (
          <View flex center padding-28>
            <ActivityIndicator size="large" color={Colors.navyBlue} />
          </View>
        ) : (
          <>
            {history.length === 0 ? (
              <View style={styles.emptyContainer} padding-28>
                <Text text70 center color={Colors.secondary}>
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
    backgroundColor: Colors.white,
  },
  header: {
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyContent: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  clearButton: {
    color: Colors.grey30,
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
