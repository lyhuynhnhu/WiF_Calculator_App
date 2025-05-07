import { ThemeColors } from "@/constants/Colors";
import { CalculationHistory } from "@/constants/historyType";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HistoryItemProps {
  item: CalculationHistory;
  onPress: (item: CalculationHistory) => void;
  onDelete: (id: string) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, onPress, onDelete }) => {
  const formattedDate = moment(item.savedDate).format("MMM DD YYYY hh:mm A");
  const total = item.finalTotal;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
      <View style={styles.historyItem}>
        <View style={styles.contentContainer}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: ThemeColors.WIFColors.navyBlue,
              marginBottom: 2,
            }}
          >
            Total:{" "}
            <Text
              style={{
                color: total.startsWith("-")
                  ? ThemeColors.WIFColors.flameRed
                  : ThemeColors.WIFColors.navyBlue,
              }}
            >
              {total}
            </Text>
          </Text>
          <Text style={{ fontSize: 14, color: "#A6ACB1" }}>Saved on {formattedDate}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
          <MaterialIcons name="delete-outline" size={20} color={ThemeColors.WIFColors.navyBlue} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default HistoryItem;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  historyItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
  },
  deleteButton: {
    width: 28,
    height: 28,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
