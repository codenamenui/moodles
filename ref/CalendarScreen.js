import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CalendarScreen({ navigation }) {
    const [entries, setEntries] = useState({});
    const [currentMonth, setCurrentMonth] = useState("");

    useEffect(() => {
        loadEntries();
    }, []);

    const loadEntries = async () => {
        try {
            const entriesJson = await AsyncStorage.getItem("moodEntries");
            if (entriesJson) {
                const loadedEntries = JSON.parse(entriesJson);
                setEntries(loadedEntries);

                // Set current month to latest month with entries
                const months = Object.keys(loadedEntries);
                if (months.length > 0) {
                    setCurrentMonth(months[months.length - 1]);
                }
            }
        } catch (error) {
            Alert.alert("Error", "Failed to load entries");
        }
    };

    const deleteAllEntries = async () => {
        try {
            await AsyncStorage.removeItem("moodEntries");
            setEntries({});
            Alert.alert("Success", "All entries have been deleted!");
        } catch (error) {
            Alert.alert("Error", "Failed to delete entries");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.monthTitle}>{currentMonth}</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate("AddMood")}
                >
                    <Text style={styles.buttonText}>Add Mood</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={entries[currentMonth] || []}
                keyExtractor={(item) => item.date}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.entryItem}
                        onPress={() =>
                            navigation.navigate("MoodDetail", { entry: item })
                        }
                    >
                        <Text style={styles.entryDate}>{item.date}</Text>
                        {/* Add mood emoji component */}
                    </TouchableOpacity>
                )}
            />

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={deleteAllEntries}
            >
                <Text style={styles.buttonText}>Delete All Entries</Text>
            </TouchableOpacity>
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
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 20,
    },
    button: {
        backgroundColor: "#FFD89C",
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 18,
        textAlign: "center",
        color: "#000",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 15,
        borderRadius: 10,
        marginVertical: 20,
        width: "90%",
        alignSelf: "center",
    },
    // Add more styles as needed
});
