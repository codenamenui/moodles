import "react-native-gesture-handler";
import React from "react";
import { useFonts } from "expo-font";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Homepage from "./pages/Homepage/Homepage";
import Calendar from "./pages/Calendar/Calendar";
import AddMood from "./pages/AddMood/AddMood";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <Stack.Navigator
            initialRouteName="Homepage"
            screenOptions={{
                headerShown: false,
                animation: "fade",
            }}
        >
            <Stack.Screen name="Homepage" component={Homepage} />
            <Stack.Screen name="Calendar" component={Calendar} />
            <Stack.Screen name="AddMood" component={AddMood} />
        </Stack.Navigator>
    );
}
