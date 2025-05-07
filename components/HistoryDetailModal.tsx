import moment from "moment";
import React from "react";
import { StyleSheet, Modal, ScrollView, TouchableOpacity, View, Text } from "react-native";
import { CalculationHistory } from "@/constants/historyType";
import { ThemeColors } from "@/constants/Colors";

interface HistoryDetailModalProps {
  visible: boolean;
  item: CalculationHistory | null;
  onClose: () => void;
}

export const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({
  visible,
  item,
  onClose,
}) => {
  if (!item) return null;

  const formattedDate = moment(item.savedDate).format("YYYY-MM-DD hh:mm A");

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: ThemeColors.WIFColors.darkNavyBlue,
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            Calculation Details
          </Text>
          <Text style={{ fontSize: 14, color: "#637587", textAlign: "center", marginBottom: 8 }}>
            {formattedDate}
          </Text>

          <ScrollView style={styles.scrollView}>
            <View style={styles.section}>
              <Text style={styles.label}>Section A</Text>
              <Text style={[styles.value, { marginBottom: 4 }]}>{item.sectionA.value}</Text>
              <Text style={styles.value}>Total: {item.sectionA.total}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Section D</Text>
              <Text style={[styles.value, { marginBottom: 4 }]}>{item.sectionD.value}</Text>
              <Text style={styles.value}>Total: {item.sectionD.total}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Section M</Text>
              <Text style={[styles.value, { marginBottom: 4 }]}>{item.sectionM.value}</Text>
              <Text style={styles.value}>Total: {item.sectionM.total}</Text>
            </View>

            <View style={styles.finalTotal}>
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: ThemeColors.WIFColors.navyBlue }}
              >
                Final Total:{" "}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: item.finalTotal.startsWith("-")
                    ? ThemeColors.WIFColors.flameRed
                    : ThemeColors.WIFColors.navyBlue,
                }}
              >
                {item.finalTotal}
              </Text>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={{ color: "#fff", fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollView: {
    // maxHeight: 400,
  },
  section: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#F0F2F5",
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: ThemeColors.WIFColors.darkNavyBlue,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: "#121417",
  },
  finalTotal: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  button: {
    minWidth: 90,
    backgroundColor: "#637587",
    borderRadius: 24,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
});
