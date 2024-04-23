import AsyncStorage from '@react-native-async-storage/async-storage';
import { Color } from 'styles/colors';


const getCurrentLanguage = async () => {
    const language = await AsyncStorage.getItem('currentLanguage');
    return language || 'en';
};

const matchesLanguage = (name: string, isCyrillic: boolean) => {
    const cyrillicRegex = /[а-яА-ЯЁё]/;
    const latinRegex = /[a-zA-Z]/;
    return isCyrillic ? cyrillicRegex.test(name) : latinRegex.test(name);
};

const getMatchingName = (names: any[], currentLanguage: string) => {
    const isCyrillic = currentLanguage === 'ru';
    const exactMatch = names.find((name: { language: string; }) => name.language?.toLowerCase() === currentLanguage);
    if (exactMatch) return exactMatch.name;

    const suitableName = names.find((name: { language: any; name: any; }) => !name.language && matchesLanguage(name.name, isCyrillic));
    if (suitableName) return suitableName.name;

    return names[0]?.name || '';
};

export const loadMovieName = async (movie: any) => {
    const currentLanguage = await getCurrentLanguage();
    return getMatchingName(movie.names, currentLanguage);
};

export const getRatingColor = (rating: number) => {
    if (rating >= 7) return Color.GREEN;
    if (rating >= 5) return Color.INPUT_GREY;
    return Color.BUTTON_RED;
};

export const roundDownToOneTenth = (num: number) => {
    return Math.floor(num * 10) / 10;
};