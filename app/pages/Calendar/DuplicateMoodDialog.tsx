import { usePlaySound } from "@/app/utils/playSound";
import React from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from "react-native";

const DuplicateMoodDialog = ({ visible, onClose }) => {
    const playPopSound = usePlaySound(require("@/app/assets/sounds/pop.mp3"));

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
                    <Image
                        source={require("@/app/assets/images/error_image.png")}
                        style={styles.errorImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.errorText}>
                        Oops! You've already recorded a mood for today!
                    </Text>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPressIn={() => {
                            playPopSound();
                            onClose();
                        }}
                    >
                        <Text style={styles.closeButtonText}>OK</Text>
                    </TouchableOpacity>
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
        alignItems: "center",
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
    errorImage: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    errorText: {
        fontFamily: "MilkyMania",
        fontSize: 20,
        textAlign: "center",
        marginBottom: 20,
        color: "333#",
    },
    closeButton: {
        backgroundColor: "#F3AA60",
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
    closeButtonText: {
        fontFamily: "MilkyMania",
        color: "white",
        fontSize: 18,
    },
});

export default DuplicateMoodDialog;
