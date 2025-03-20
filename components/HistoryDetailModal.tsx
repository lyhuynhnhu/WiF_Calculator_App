import moment from "moment";
import React from "react";
import { StyleSheet, Modal, ScrollView } from "react-native";
import { View, Text, Button, Colors } from "react-native-ui-lib";
import { CalculationHistory } from "@/constants/historyType";

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
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text text60BO color={Colors.darkNavyBlue} center marginB-8>
            Calculation Details
          </Text>
          <Text text80 color={Colors.secondary} center marginB-16>
            {formattedDate}
          </Text>

          <ScrollView style={styles.scrollView}>
            <View style={styles.section}>
              <Text text80BO color={Colors.darkNavyBlue} marginB-8>
                Section A
              </Text>
              <Text text80 color="#121417" marginB-8>
                {item.sectionA.value}
              </Text>
              <Text text80 color="#121417">
                Total: {item.sectionA.total}
              </Text>
            </View>

            <View style={styles.section}>
              <Text text80BO color={Colors.darkNavyBlue} marginB-8>
                Section D
              </Text>
              <Text text80 color="#121417" marginB-8>
                {item.sectionD.value}
              </Text>
              <Text text80 color="#121417">
                Total: {item.sectionD.total}
              </Text>
            </View>

            <View style={styles.section}>
              <Text text80BO color={Colors.darkNavyBlue} marginB-8>
                Section M
              </Text>
              <Text text80 color="#121417" marginB-8>
                {item.sectionM.value}
              </Text>
              <Text text80 color="#121417">
                Total: {item.sectionM.total}
              </Text>
            </View>

            <View flex row center marginB-8>
              <Text text65BO color={Colors.navyBlue}>
                Final Total:{" "}
              </Text>
              <Text
                text65BO
                color={
                  item.finalTotal.startsWith("-")
                    ? Colors.flameRed
                    : Colors.navyBlue
                }
              >
                {item.finalTotal}
              </Text>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            {/* <Button
              label="Restore"
              backgroundColor="#007AFF"
              style={styles.button}
              onPress={() => {
                onRestore(item);
                onClose();
              }}
            /> */}
            <Button
              label="Close"
              backgroundColor="#637587"
              style={styles.button}
              onPress={onClose}
            />
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
    maxHeight: 400,
  },
  section: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: Colors.grey70,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  button: {
    minWidth: 100,
  },
});
