import { Stack } from "expo-router";
import "./assets/global.css";
import { useFonts } from "expo-font";

export default function RootLayout() {
    const [loaded, error] = useFonts({
        MilkyMania: require("./assets/fonts/MilkyMania.otf"),
    });

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
