import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
    Alert,
    ImageBackground,
    ScrollView,
} from "react-native";
import { moods } from "@/app/data/constants";
import DuplicateMoodDialog from "./DuplicateMoodDialog";
import DeleteEntryDialog from "./DeleteEntryDialog";
import { usePlaySound } from "@/app/utils/playSound";
import React from "react";

type Day = {
    mood: number;
    date: string;
    note: string;
};

type Calendar = Day[];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const screenWidth = Dimensions.get("window").width;
const DAY_SIZE = (screenWidth - 32) / 7;

const WEEKDAYS_JSX = WEEKDAYS.map((day) => <Text key={day}>{day}</Text>);

export default function Calendar({ navigation }) {
    const [calendar, setCalendar] = useState<Calendar>([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    const load = async () => {
        try {
            const data = await AsyncStorage.getItem("calendar");
            if (data) {
                setCalendar(JSON.parse(data));
            }
        } catch (e) {
            alert("Failed to load calendar");
        }
    };
    const [showDuplicateError, setShowDuplicateError] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

    const playClickSound = usePlaySound(
        require("@/app/assets/sounds/click.mp3")
    );
    const playPopSound = usePlaySound(require("@/app/assets/sounds/pop.mp3"));
    const playErrorSound = usePlaySound(
        require("@/app/assets/sounds/error_sound.mp3")
    );

    useEffect(() => {
        load();
    }, []);

    const handleDeleteEntry = async (entry) => {
        try {
            const updatedCalendar = calendar.filter(
                (item) => item.date !== entry.date
            );
            await AsyncStorage.setItem(
                "calendar",
                JSON.stringify(updatedCalendar)
            );
            setCalendar(updatedCalendar);
            setShowDeleteDialog(false);
            setSelectedEntry(null);
        } catch (e) {
            alert("Failed to delete entry");
        }
    };

    const getMoodCountsForCurrentMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Filter entries for current month
        const currentMonthEntries = calendar.filter((entry) => {
            const entryDate = new Date(entry.date);
            return (
                entryDate.getFullYear() === year &&
                entryDate.getMonth() === month
            );
        });

        // Initialize counts for each mood
        const moodCounts = moods.reduce((acc, mood, index) => {
            acc[index] = 0;
            return acc;
        }, {});

        // Count occurrences of each mood
        currentMonthEntries.forEach((entry) => {
            if (moodCounts[entry.mood] !== undefined) {
                moodCounts[entry.mood]++;
            }
        });

        return moodCounts;
    };

    const getCurrentMonthEntries = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        return calendar
            .filter((entry) => {
                const entryDate = new Date(entry.date);
                return (
                    entryDate.getFullYear() === year &&
                    entryDate.getMonth() === month
                );
            })
            .sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            ); // Sort by date descending
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        });
    };

    const getCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        let days = [];

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${date
                .getDate()
                .toString()
                .padStart(2, "0")}`;

            const moodEntry = calendar.find((entry) =>
                entry.date.startsWith(formattedDate)
            );
            days.push({
                date: day,
                moodEntry,
            });
        }

        return days;
    };

    const getMoodInfo = (moodIndex: number) => {
        return moods[moodIndex] || moods[0];
    };

    const goToPreviousMonth = () => {
        setCurrentDate(
            new Date(currentDate.setMonth(currentDate.getMonth() - 1))
        );
    };

    const goToNextMonth = () => {
        setCurrentDate(
            new Date(currentDate.setMonth(currentDate.getMonth() + 1))
        );
    };

    const confirmDeleteAll = () => {
        Alert.alert(
            "Delete All Moods",
            "Are you sure you want to delete all mood entries? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete All",
                    onPress: deleteAllMoods,
                    style: "destructive",
                },
            ]
        );
    };

    const deleteAllMoods = async () => {
        try {
            await AsyncStorage.removeItem("calendar");
            setCalendar([]);
        } catch (e) {
            alert("Failed to delete moods");
        }
    };

    const renderDay = (dayInfo: { date: number; moodEntry?: Day } | null) => {
        if (!dayInfo) {
            return <View style={styles.dayCell} />;
        }

        const { date, moodEntry } = dayInfo;

        return (
            <View style={styles.dayCell}>
                <Text style={styles.dateNumber}>{date}</Text>
                {moodEntry?.mood !== undefined && (
                    <Image
                        source={getMoodInfo(moodEntry.mood).url}
                        style={styles.moodIndicator}
                    />
                )}
            </View>
        );
    };

    const handleAddMood = () => {
        const today = new Date();
        const todayFormatted = `${today.getFullYear()}-${(today.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

        const existingEntry = calendar.find(
            (entry) => entry.date === todayFormatted
        );

        if (existingEntry) {
            playErrorSound();
            setShowDuplicateError(true);
        } else {
            playPopSound();
            navigation.navigate("AddMood");
        }
    };

    return (
        <>
            <ScrollView style={styles.scrollContainer}>
                <ImageBackground
                    source={require("@/app/assets/images/bg.png")}
                    style={styles.background}
                    resizeMode="cover"
                >
                    <View style={styles.container}>
                        <View style={styles.headerContainer}>
                            <Image
                                source={require("@/app/assets/images/app_name.png")}
                                style={styles.appNameImage}
                            />
                        </View>

                        <View style={styles.monthNavigation}>
                            <TouchableOpacity
                                onPressIn={() => {
                                    playClickSound();
                                    goToPreviousMonth();
                                }}
                                style={styles.navButton}
                            >
                                <Image
                                    source={require("@/app/assets/images/bk_button.png")}
                                    style={styles.navButtonImage}
                                />
                            </TouchableOpacity>
                            <Text style={styles.monthYearText}>
                                {currentDate.toLocaleString("default", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </Text>
                            <TouchableOpacity
                                onPressIn={() => {
                                    playClickSound();
                                    goToNextMonth();
                                }}
                                style={styles.navButton}
                            >
                                <Image
                                    source={require("@/app/assets/images/fwd_button.png")}
                                    style={styles.navButtonImage}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.calendar}>
                            <View style={styles.weekdayHeader}>
                                {WEEKDAYS.map((day) => (
                                    <Text key={day} style={styles.weekdayText}>
                                        {day}
                                    </Text>
                                ))}
                            </View>

                            <View style={styles.daysGrid}>
                                {getCalendarDays().map((day, index) => (
                                    <View key={index}>{renderDay(day)}</View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.moodSummaryCard}>
                            <Text style={styles.summaryTitle}>
                                Month Mood Summary
                            </Text>
                            <View style={styles.moodGrid}>
                                {moods.map((mood, index) => {
                                    const count =
                                        getMoodCountsForCurrentMonth()[index] ||
                                        0;
                                    return (
                                        <View
                                            key={index}
                                            style={styles.moodSummaryItem}
                                        >
                                            <Image
                                                source={mood.url}
                                                style={styles.summaryMoodIcon}
                                            />
                                            <Text style={styles.moodCount}>
                                                {count}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>

                        <View style={styles.dailyEntriesSection}>
                            <Text style={styles.sectionTitle}>
                                Daily Entries
                            </Text>
                            {getCurrentMonthEntries().map((entry, index) => (
                                <View key={index} style={styles.dailyCard}>
                                    <View style={styles.dailyCardHeader}>
                                        <Image
                                            source={getMoodInfo(entry.mood).url}
                                            style={styles.dailyMoodIcon}
                                        />
                                        <Text style={styles.dailyDate}>
                                            {formatDate(entry.date)}
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.deleteEntryButton}
                                            onPressIn={() => {
                                                playPopSound();
                                                setSelectedEntry(entry);
                                                setShowDeleteDialog(true);
                                            }}
                                        >
                                            <Image
                                                source={require("@/app/assets/images/trash.png")}
                                                style={styles.deleteEntryIcon}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {entry.note && (
                                        <Text style={styles.dailyNote}>
                                            {entry.note}
                                        </Text>
                                    )}
                                </View>
                            ))}
                            {getCurrentMonthEntries().length === 0 && (
                                <Text style={styles.noEntriesText}>
                                    No mood entries for this month
                                </Text>
                            )}
                        </View>
                    </View>
                    <DuplicateMoodDialog
                        visible={showDuplicateError}
                        onClose={() => setShowDuplicateError(false)}
                    />
                    <DeleteEntryDialog
                        visible={showDeleteDialog}
                        onClose={() => {
                            setShowDeleteDialog(false);
                            setSelectedEntry(null);
                        }}
                        onConfirm={() => handleDeleteEntry(selectedEntry)}
                        date={
                            selectedEntry ? formatDate(selectedEntry.date) : ""
                        }
                    />
                </ImageBackground>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPressIn={() => {
                        handleAddMood();
                    }}
                >
                    <Image
                        source={require("@/app/assets/images/add_button.png")}
                        style={styles.addButtonImage}
                    />
                </TouchableOpacity>
            </View>
        </>
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
        height: "100%",
    },
    headerContainer: {
        alignItems: "center",
        width: "100%",
        marginBottom: 10,
        marginTop: 30,
    },
    appNameImage: {
        height: 80,
        width: 200,
    },
    monthNavigation: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingVertical: 15,
    },
    monthYearText: {
        fontFamily: "MilkyMania",
        fontSize: 30,
    },
    navButton: {
        padding: 8,
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    navButtonImage: {
        width: 120,
        height: 120,
    },
    calendar: {
        backgroundColor: "#fff",
        margin: 16,
        borderRadius: 25,
        padding: 12,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    weekdayHeader: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0, 0, 0, 0.1)",
    },
    weekdayText: {
        width: DAY_SIZE - 3,
        textAlign: "center",
        fontWeight: "600",
        fontFamily: "MilkyMania",
    },
    daysGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingVertical: 8,
    },
    dayCell: {
        width: DAY_SIZE - 4,
        height: DAY_SIZE,
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
        position: "relative",
        borderRadius: 15,
    },
    dateNumber: {
        position: "absolute",
        top: 4,
        right: 4,
        fontSize: 10,
        fontFamily: "MilkyMania",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 8,
    },
    moodIndicator: {
        position: "absolute",
        right: 15,
        top: 8,
        width: 25,
        height: 25,
        marginTop: 8,
    },
    buttonContainer: {
        position: "absolute",
        right: 20,
        bottom: 20,
        zIndex: 999,
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContainer: {
        position: "relative",
        flex: 1,
    },
    moodSummaryCard: {
        backgroundColor: "#fff",
        margin: 16,
        borderRadius: 25,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    summaryTitle: {
        fontFamily: "MilkyMania",
        fontSize: 24,
        textAlign: "center",
        marginBottom: 16,
    },
    moodGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        gap: 16,
    },
    moodSummaryItem: {
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        borderRadius: 15,
        minWidth: 60,
    },
    summaryMoodIcon: {
        width: 40,
        height: 40,
        marginBottom: 4,
    },
    moodCount: {
        fontFamily: "MilkyMania",
        fontSize: 18,
    },
    dailyEntriesSection: {
        margin: 16,
        marginBottom: 100,
    },
    sectionTitle: {
        fontFamily: "MilkyMania",
        fontSize: 24,
        textAlign: "center",
        marginBottom: 16,
        color: "#333",
    },
    dailyCard: {
        backgroundColor: "#fff",
        borderRadius: 25,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.1)",
    },
    dailyCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    dailyMoodIcon: {
        width: 40,
        height: 40,
        marginRight: 12,
    },
    dailyDate: {
        fontFamily: "MilkyMania",
        fontSize: 18,
        color: "#333",
        flex: 1,
    },
    dailyNote: {
        fontFamily: "MilkyMania",
        fontSize: 16,
        color: "#666",
        marginTop: 8,
        padding: 8,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        borderRadius: 12,
    },
    noEntriesText: {
        fontFamily: "MilkyMania",
        fontSize: 18,
        textAlign: "center",
        color: "#666",
        fontStyle: "italic",
        padding: 20,
    },
    deleteEntryButton: {
        padding: 8,
        marginLeft: 8,
        borderRadius: 20,
    },
    deleteEntryIcon: {
        width: 70,
        height: 70,
    },
    addButtonImage: {
        width: 140,
        height: 140,
    },
});
