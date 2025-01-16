import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
} from "react-native";
import { Image } from "expo-image";

const { height } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
    return (
        <ImageBackground
            source={require("@/app/assets/images/homepage.png")}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate("Calendar")}
                    >
                        <Text style={styles.buttonText}>{"Welcome back!"}</Text>
                        <Text style={styles.buttonText}>
                            {"Click me to enter :)"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    contentContainer: {
        alignItems: "center",
        width: 300,
        marginBottom: height * 0.15, // Position content from bottom
    },
    welcomeText: {
        fontSize: 32,
        color: "#000000",
        marginBottom: 30,
        textAlign: "center",
        fontFamily: "MilkyMania",
        textShadowColor: "rgba(0, 0, 0, 0.3)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 40,
    },
    buttonText: {
        fontSize: 24,
        textAlign: "center",
        fontFamily: "MilkyMania",
    },
});
