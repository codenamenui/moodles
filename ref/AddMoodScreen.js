import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Audio } from "expo-av";
import Carousel from "react-native-reanimated-carousel";
import { useWindowDimensions } from "react-native";

const moods = [
    {
        id: 1,
        emoji: "😊",
        desc: "hehe (happy)",
        quote: "Choose happiness and let your radiant spirit brighten the world.",
    },
    {
        id: 2,
        emoji: "😢",
        desc: "huhu (sad)",
        quote: "Remember, tough times don't last forever. You're stronger than you think.",
    },
    {
        id: 3,
        emoji: "😰",
        desc: "asdfghjkl (anxious)",
        quote: "Take a deep breath. You're safe, and everything will be okay.",
    },
    {
        id: 4,
        emoji: "😴",
        desc: "hAaa (tired)",
        quote: "Rest and recharge. You deserve the peace that comes with relaxation.",
    },
    {
        id: 5,
        emoji: "😌",
        desc: "gege (calm)",
        quote: "Find calmness in the present moment and let it soothe your soul.",
    },
    {
        id: 6,
        emoji: "😑",
        desc: "haayy (bored)",
        quote: "Embrace the simple joys that bring warmth and contentment to your heart.",
    },
    {
        id: 7,
        emoji: "😠",
        desc: "grr (angry)",
        quote: "Release your anger and choose forgiveness for your own inner peace.",
    },
    {
        id: 8,
        emoji: "🤢",
        desc: "eww (disgusted)",
        quote: "Allow yourself to let go of disgust and cultivate compassion instead.",
    },
    {
        id: 9,
        emoji: "🤗",
        desc: "hihi (excited)",
        quote: "Embrace the excitement of new possibilities and let it inspire your dreams.",
    },
];

export default function AddMoodScreen({ navigation }) {
    const [selectedMood, setSelectedMood] = useState(0);
    const [description, setDescription] = useState("");
    const { width } = useWindowDimensions();
    const [sound, setSound] = useState();

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(
            require("../assets/sounds/click.mp3")
        );
        setSound(sound);
        await sound.playAsync();
    }

    React.useEffect(() => {
        return sound
            ? () => {
                  sound.unloadAsync();
              }
            : undefined;
    }, [sound]);

    const renderMoodItem = ({ item, index }) => (
        <View style={styles.moodItem}>
            <Text style={styles.moodEmoji}>{item.emoji}</Text>
            <Text style={styles.moodDesc}>{item.desc}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <Text style={styles.title}>How are you feeling today?</Text>

            <Carousel
                width={width}
                height={width / 2}
                data={moods}
                renderItem={renderMoodItem}
                onSnapToItem={(index) => {
                    setSelectedMood(index);
                    playSound();
                }}
            />

            <TextInput
                style={styles.input}
                placeholder="Say something about today... (max 70 characters)"
                maxLength={70}
                value={description}
                onChangeText={setDescription}
            />

            <TouchableOpacity
                style={styles.saveButton}
                onPress={async () => {
                    // Save logic here
                    navigation.navigate("Calendar");
                }}
            >
                <Text style={styles.buttonText}>Save Entry</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 50,
    },
    title: {
        fontFamily: "MilkyMania",
        fontSize: 24,
        textAlign: "center",
        marginVertical: 20,
    },
    moodItem: {
        alignItems: "center",
        justifyContent: "center",
    },
    moodEmoji: {
        fontSize: 64,
    },
    moodDesc: {
        fontFamily: "MilkyMania",
        fontSize: 18,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 15,
        borderRadius: 10,
        margin: 20,
        fontFamily: "MilkyMania",
    },
    saveButton: {
        backgroundColor: "#FFD89C",
        padding: 15,
        borderRadius: 10,
        margin: 20,
    },
    buttonText: {
        fontFamily: "MilkyMania",
        fontSize: 18,
        textAlign: "center",
    },
});
