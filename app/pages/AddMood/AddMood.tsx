import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Image,
    StyleSheet,
    ScrollView,
} from "react-native";
import { moods } from "@/app/data/constants";
import { usePlaySound } from "@/app/utils/playSound";

const AddMoodPage = ({ navigation }) => {
    const [currentMoodIndex, setCurrentMoodIndex] = useState(0);
    const [selectedMood, setSelectedMood] = useState(null);
    const [note, setNote] = useState("");
    const [isNoteSaved, setIsNoteSaved] = useState(false);
    const playClickSound = usePlaySound(
        require("@/app/assets/sounds/click.mp3")
    );
    const playSwooshSound = usePlaySound(
        require("@/app/assets/sounds/swoosh.mp3")
    );
    const playPopSound = usePlaySound(require("@/app/assets/sounds/pop.mp3"));
    const playSuccessSound = usePlaySound(
        require("@/app/assets/sounds/success.mp3")
    );
    const playTypingSound = usePlaySound(
        require("@/app/assets/sounds/typing_sound.mp3")
    );

    const handlePrevMood = () => {
        setCurrentMoodIndex((prev) =>
            prev === 0 ? moods.length - 1 : prev - 1
        );
    };

    const handleNextMood = () => {
        setCurrentMoodIndex((prev) =>
            prev === moods.length - 1 ? 0 : prev + 1
        );
    };

    const handleSelectMood = () => {
        setSelectedMood(moods[currentMoodIndex]);
    };

    const handleSave = async () => {
        try {
            const date = new Date();
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${date
                .getDate()
                .toString()
                .padStart(2, "0")}`;

            const moodData = {
                mood: currentMoodIndex,
                note: note,
                date: formattedDate,
            };

            const existingData = await AsyncStorage.getItem("calendar");
            let calendarArray = existingData ? JSON.parse(existingData) : [];
            calendarArray.push(moodData);

            await AsyncStorage.setItem(
                "calendar",
                JSON.stringify(calendarArray)
            );

            setIsNoteSaved(true);
        } catch (error) {
            console.error("Error saving mood:", error);
        }
    };

    return (
        <ImageBackground
            source={require("@/app/assets/images/bg.png")}
            style={styles.background}
            resizeMode="cover"
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity
                    style={styles.homeButton}
                    onPressIn={() => {
                        playSwooshSound();
                        navigation.navigate("Calendar");
                    }}
                >
                    <Image
                        source={require("@/app/assets/images/home_button.png")}
                        style={styles.buttonImage}
                    />
                </TouchableOpacity>

                {!selectedMood ? (
                    // Mood Selection View
                    <View style={styles.moodSelectionContainer}>
                        <Text style={styles.header}>
                            How are you feeling today?
                        </Text>

                        <Text style={styles.header}>
                            {new Date().toDateString()}
                        </Text>

                        <View style={styles.moodNavigator}>
                            <TouchableOpacity
                                onPressn={() => {
                                    playClickSound();
                                    handlePrevMood();
                                }}
                            >
                                <Image
                                    source={require("@/app/assets/images/bk_button.png")}
                                    style={styles.arrowButton}
                                />
                            </TouchableOpacity>

                            <View style={styles.currentMoodContainer}>
                                <Image
                                    source={moods[currentMoodIndex].url}
                                    style={styles.moodImage}
                                />
                                <View style={{ width: 200 }}>
                                    <Text style={styles.moodName}>
                                        {moods[currentMoodIndex].name}
                                    </Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                onPressIn={() => {
                                    playClickSound();
                                    handleNextMood();
                                }}
                            >
                                <Image
                                    source={require("@/app/assets/images/fwd_button.png")}
                                    style={styles.arrowButton}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.addButtonContainer}>
                            <TouchableOpacity
                                style={styles.selectButton}
                                onPressIn={() => {
                                    playPopSound();
                                    handleSelectMood();
                                }}
                            >
                                <Image
                                    source={require("@/app/assets/images/add_button.png")}
                                    style={styles.selectButtonImage}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    // Mood Details View
                    <View style={styles.moodDetailsContainer}>
                        <View style={styles.selectedMoodContainer}>
                            <Image
                                source={selectedMood.url}
                                style={styles.selectedMoodImage}
                            />
                            <Text style={styles.selectedMoodName}>
                                {selectedMood.name}
                            </Text>
                            {isNoteSaved && (
                                <Text style={styles.quoteText}>
                                    {selectedMood.quote}
                                </Text>
                            )}
                        </View>

                        {!isNoteSaved ? (
                            <View style={styles.noteContainer}>
                                <Text style={styles.noteLabel}>
                                    Add a note about your day:
                                </Text>
                                <TextInput
                                    style={styles.noteInput}
                                    multiline
                                    value={note}
                                    onChangeText={(e) => {
                                        playTypingSound();
                                        setNote(e);
                                    }}
                                    placeholder="Type your thoughts here..."
                                />
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPressIn={() => {
                                        if (isNoteSaved) {
                                            playSuccessSound();
                                        } else {
                                            playPopSound();
                                        }
                                        handleSave();
                                    }}
                                >
                                    <Image
                                        source={require("@/app/assets/images/save.png")}
                                        style={styles.saveButtonImage}
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.confirmationContainer}>
                                <Text style={styles.confirmationText}>
                                    Your mood has been saved!
                                </Text>
                                <TouchableOpacity
                                    style={styles.saveButton}
                                    onPressIn={() => {
                                        playSuccessSound();
                                        navigation.navigate("Calendar");
                                    }}
                                >
                                    <Image
                                        source={require("@/app/assets/images/save.png")}
                                        style={styles.saveButtonImage}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    homeButton: {
        position: "absolute",
        top: 20,
        left: 20,
        width: 100,
        height: 100,
        zIndex: 1,
    },
    buttonImage: {
        width: "100%",
        height: "100%",
    },
    moodSelectionContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 100,
        paddingBottom: 100,
    },
    header: {
        fontFamily: "MilkyMania",
        fontSize: 26,
        marginBottom: 20,
        textAlign: "center",
    },
    moodNavigator: {
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "center",
        marginVertical: 40,
        gap: -20,
    },
    arrowButton: {
        width: 120,
        height: 120,
    },
    currentMoodContainer: {
        alignItems: "center",
        borderRadius: 20,
        padding: 20,
        width: 150,
    },
    moodImage: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    moodName: {
        fontFamily: "MilkyMania",
        fontSize: 24,
        textAlign: "center",
    },
    addButtonContainer: {
        position: "absolute",
        bottom: 40,
        width: "100%",
        alignItems: "center",
    },
    selectButton: {
        width: 120,
        height: 120,
    },
    selectButtonImage: {
        width: "100%",
        height: "100%",
    },
    moodDetailsContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 100,
        paddingHorizontal: 20,
    },
    selectedMoodContainer: {
        alignItems: "center",
        marginBottom: 40,
        borderRadius: 20,
        padding: 20,
        width: "100%",
    },
    selectedMoodImage: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    selectedMoodName: {
        fontFamily: "MilkyMania",
        fontSize: 28,
        marginBottom: 12,
    },
    noteContainer: {
        width: "100%",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
    },
    noteLabel: {
        fontFamily: "MilkyMania",
        fontSize: 20,
        marginBottom: 12,
    },
    noteInput: {
        fontFamily: "MilkyMania",
        fontSize: 16,
        minHeight: 120,
        width: "100%",
        textAlignVertical: "top",
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
    },
    saveButton: {
        width: 100,
        height: 100,
    },
    saveButtonImage: {
        width: "100%",
        height: "100%",
    },
    confirmationContainer: {
        width: "100%",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        marginBottom: 40,
        flexDirection: "column",
    },
    confirmationText: {
        fontFamily: "MilkyMania",
        fontSize: 24,
        marginTop: 20,
        textAlign: "center",
        color: "#F3AA60",
        marginBottom: 40,
    },
    quoteText: {
        fontFamily: "MilkyMania",
        fontSize: 18,
        textAlign: "center",
        color: "#666",
        paddingHorizontal: 10,
    },
});

export default AddMoodPage;
