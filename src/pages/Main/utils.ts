import AsyncStorage from '@react-native-async-storage/async-storage';


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
    // Попытка найти точное совпадение по языку
    const exactMatch = names.find((name: { language: string; }) => name.language?.toLowerCase() === currentLanguage);
    if (exactMatch) return exactMatch.name;

    // Ищем совпадение среди названий без указания языка
    const suitableName = names.find((name: { language: any; name: any; }) => !name.language && matchesLanguage(name.name, isCyrillic));
    if (suitableName) return suitableName.name;

    // Если не найдено подходящего, возвращаем первое доступное имя
    return names[0]?.name || '';
};

export const loadMovieName = async (movie: any) => {
    const currentLanguage = await getCurrentLanguage();
    return getMatchingName(movie.names, currentLanguage);
};