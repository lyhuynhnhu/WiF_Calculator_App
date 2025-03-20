import { CalculationHistory } from "@/constants/historyType";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import React from "react";
import { StyleSheet } from "react-native";
import {
  View,
  Text,
  Card,
  Colors,
  TouchableOpacity,
} from "react-native-ui-lib";

interface HistoryItemProps {
  item: CalculationHistory;
  onPress: (item: CalculationHistory) => void;
  onDelete: (id: string) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  item,
  onPress,
  onDelete,
}) => {
  const formattedDate = moment(item.savedDate).format("MMM DD YYYY hh:mm A");
  const total = item.finalTotal;

  return (
    <Card style={styles.card} onPress={() => onPress(item)}>
      <View flex row center padding-16>
        <View style={styles.contentContainer}>
          <Text text70BO color={Colors.navyBlue}>
            Total:{" "}
            <Text
              color={total.startsWith("-") ? Colors.flameRed : Colors.navyBlue}
            >
              {total}
            </Text>
          </Text>
          <Text text80 grey40>
            Saved on {formattedDate}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item.id)}
        >
          <MaterialIcons
            name="delete-outline"
            size={20}
            color={Colors.navyBlue}
          />
        </TouchableOpacity>
      </View>
    </Card>
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
