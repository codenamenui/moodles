import { usePlaySound } from "@/app/utils/playSound";
import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from "react-native";

const DeleteEntryDialog = ({ visible, onClose, onConfirm, date }) => {
    const playPopSound = usePlaySound(require("@/app/assets/sounds/pop.mp3"));
    const playSuccessSound = usePlaySound(
        require("@/app/assets/sounds/success.mp3")
    );

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={() => {
                playPopSound();
                onClose();
            }}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.titleText}>Delete Entry</Text>
                    <Text style={styles.messageText}>
                        Are you sure you want to delete your mood entry for{" "}
                        {date}?
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPressIn={() => {
                                playPopSound();
                                onClose();
                            }}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.deleteButton]}
                            onPressIn={() => {
                                playSuccessSound();
                                onConfirm();
                            }}
                        >
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        width: Dimensions.get("window").width * 0.8,
        maxWidth: 400,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    titleText: {
        fontFamily: "MilkyMania",
        fontSize: 24,
        textAlign: "center",
        marginBottom: 16,
        color: "#333",
    },
    messageText: {
        fontFamily: "MilkyMania",
        fontSize: 18,
        textAlign: "center",
        marginBottom: 24,
        color: "#666",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 12,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        flex: 1,
    },
    cancelButton: {
        backgroundColor: "#f1f1f1",
    },
    deleteButton: {
        backgroundColor: "#ff4757",
    },
    cancelButtonText: {
        fontFamily: "MilkyMania",
        color: "#666",
        fontSize: 16,
        textAlign: "center",
    },
    deleteButtonText: {
        fontFamily: "MilkyMania",
        color: "white",
        fontSize: 16,
        textAlign: "center",
    },
});

export default DeleteEntryDialog;
