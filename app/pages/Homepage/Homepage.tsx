import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
} from "react-native";
import { usePlaySound } from "@/app/utils/playSound";

const { height } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
    const playClickSound = usePlaySound(
        require("@/app/assets/sounds/click.mp3")
    );

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
                        onPressIn={() => {
                            playClickSound(); // Play the sound
                            navigation.navigate("Calendar"); // Navigate to Calendar
                        }}
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
        marginBottom: height * 0.25, // Position content from bottom
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
