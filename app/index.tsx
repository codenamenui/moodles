import "react-native-gesture-handler";
import React from "react";
import { useFonts } from "expo-font";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import AddMoodScreen from "./screens/AddMoodScreen";
import CalendarScreen from "./screens/CalendarScreen";
import MoodDetailScreen from "./screens/MoodDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    const [fontsLoaded] = useFonts({
        MilkyMania: require("./assets/fonts/MilkyMania.ttf"),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                animation: "fade",
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="AddMood" component={AddMoodScreen} />
            <Stack.Screen name="Calendar" component={CalendarScreen} />
            <Stack.Screen name="MoodDetail" component={MoodDetailScreen} />
        </Stack.Navigator>
    );
}
