import AsyncStorage from '@react-native-async-storage/async-storage';

export const updateStorageWithSession = async (sessionLabel: string, url: string) => {
    const storageDataJSON = await AsyncStorage.getItem('@mymovies');
    let storageData = storageDataJSON ? JSON.parse(storageDataJSON) : {};

    if (!storageData[sessionLabel]) {
        storageData[sessionLabel] = {
            id: sessionLabel,
            label: sessionLabel,
            link: url,
            movies: []
        };
        await AsyncStorage.setItem('@mymovies', JSON.stringify(storageData));
    }
};
