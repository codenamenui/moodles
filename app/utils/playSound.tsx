import { Audio } from "expo-av";
import { useCallback } from "react";

export function usePlaySound(source) {
    const playSound = useCallback(async () => {
        console.log("Loading Sound");
        const { sound } = await Audio.Sound.createAsync(source);

        console.log("Playing Sound");
        await sound.playAsync();

        // Cleanup after playing
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
                console.log("Unloading Sound");
                sound.unloadAsync();
            }
        });
    }, [source]);

    return playSound;
}
