// screens/MoodDetailScreen.js
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const moods = {
    1: {
        emoji: "😊",
        desc: "hehe (happy)",
        quote: "Choose happiness and let your radiant spirit brighten the world.",
    },
    2: {
        emoji: "😢",
        desc: "huhu (sad)",
        quote: "Remember, tough times don't last forever. You're stronger than you think.",
    },
    3: {
        emoji: "😰",
        desc: "asdfghjkl (anxious)",
        quote: "Take a deep breath. You're safe, and everything will be okay.",
    },
    4: {
        emoji: "😴",
        desc: "hAaa (tired)",
        quote: "Rest and recharge. You deserve the peace that comes with relaxation.",
    },
    5: {
        emoji: "😌",
        desc: "gege (calm)",
        quote: "Find calmness in the present moment and let it soothe your soul.",
    },
    6: {
        emoji: "😑",
        desc: "haayy (bored)",
        quote: "Embrace the simple joys that bring warmth and contentment to your heart.",
    },
    7: {
        emoji: "😠",
        desc: "grr (angry)",
        quote: "Release your anger and choose forgiveness for your own inner peace.",
    },
    8: {
        emoji: "🤢",
        desc: "eww (disgusted)",
        quote: "Allow yourself to let go of disgust and cultivate compassion instead.",
    },
    9: {
        emoji: "🤗",
        desc: "hihi (excited)",
        quote: "Embrace the excitement of new possibilities and let it inspire your dreams.",
    },
};

export default function MoodDetailScreen({ route, navigation }) {
    const { entry } = route.params;
    const mood = moods[entry.mood];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.date}>{entry.date}</Text>
            </View>

            {/* Mood Content */}
            <View style={styles.content}>
                <Text style={styles.title}>On this day, you felt...</Text>

                <View style={styles.moodContainer}>
                    <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                    <Text style={styles.moodDesc}>{mood.desc}</Text>
                </View>

                {/* User's Description */}
                <View style={styles.descriptionBox}>
                    {entry.moodDesc ? (
                        <Text style={styles.descriptionText}>
                            {entry.moodDesc}
                        </Text>
                    ) : (
                        <Text style={styles.noDescriptionText}>
                            You didn't say much on this day :
                        </Text>
                    )}
                </View>

                {/* Mood Quote */}
                <View style={styles.quoteContainer}>
                    <Text style={styles.quoteText}>{mood.quote}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    backButton: {
        padding: 8,
    },
    date: {
        flex: 1,
        textAlign: "center",
        fontFamily: "MilkyMania",
        fontSize: 20,
        marginRight: 40, // Compensate for back button to center the date
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: "center",
    },
    title: {
        fontFamily: "MilkyMania",
        fontSize: 24,
        marginBottom: 30,
        textAlign: "center",
    },
    moodContainer: {
        alignItems: "center",
        marginBottom: 30,
    },
    moodEmoji: {
        fontSize: 80,
        marginBottom: 10,
    },
    moodDesc: {
        fontFamily: "MilkyMania",
        fontSize: 20,
        color: "#666",
    },
    descriptionBox: {
        width: "100%",
        backgroundColor: "#f8f8f8",
        borderRadius: 10,
        padding: 20,
        marginBottom: 30,
        minHeight: 100,
        justifyContent: "center",
    },
    descriptionText: {
        fontFamily: "MilkyMania",
        fontSize: 18,
        color: "#F3AA60",
        textAlign: "center",
    },
    noDescriptionText: {
        fontFamily: "MilkyMania",
        fontSize: 16,
        color: "gray",
        textAlign: "center",
        fontStyle: "italic",
    },
    quoteContainer: {
        padding: 20,
        alignItems: "center",
    },
    quoteText: {
        fontFamily: "MilkyMania",
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        fontStyle: "italic",
    },
});
