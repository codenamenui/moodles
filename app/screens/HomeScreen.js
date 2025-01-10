import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { verifyInstallation } from "nativewind";

export default function HomeScreen({ navigation }) {
    verifyInstallation();
    return (
        <SafeAreaView style={styles.container}>
            <Image source={require("../assets/logo.png")} style={styles.logo} />
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Calendar")}
            >
                <Text className="text-red-50">Welcome! Cldwaick to enter</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5", // Light background color
    },
    logo: {
        marginBottom: 20, // Spacing between logo and button
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        elevation: 3, // Shadow for Android
    },
    buttonText: {
        color: "#000000", // White text color
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});
