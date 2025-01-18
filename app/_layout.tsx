import { Stack } from "expo-router";
import "./assets/global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { usePlaySound } from "./utils/playSound";

export default function RootLayout() {
    const [loaded, error] = useFonts({
        MilkyMania: require("./assets/fonts/MilkyMania.otf"),
    });

    const playSound = usePlaySound(require("@/app/assets/sounds/BGM.mp3"));

    useEffect(() => {
        playSound();
    }, []);

    if (!loaded && !error) {
        return null;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "fade",
            }}
        />
    );
}
