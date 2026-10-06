import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';

export const USER_LANGUAGE_STORAGE_KEY = 'language';

export const DEFAULT_USER_LANGUAGE = 'en';

export const SUPPORTED_USER_LANGUAGES = ['ru', 'en', 'es', 'de', 'ja'] as const;

export type UserLanguage = (typeof SUPPORTED_USER_LANGUAGES)[number];

/**
 * Normalizes a locale/language tag to a supported app language (parity with backend).
 */
export function normalizeUserLanguage(value?: string | null): UserLanguage {
    if (typeof value !== 'string') {
        return DEFAULT_USER_LANGUAGE;
    }
    const code = value.trim().toLowerCase().split(/[-_]/)[0];
    if (code === 'ru' || code === 'en' || code === 'es' || code === 'de' || code === 'ja') {
        return code;
    }
    return DEFAULT_USER_LANGUAGE;
}

export async function getStoredUserLanguage(): Promise<UserLanguage> {
    const raw = await AsyncStorage.getItem(USER_LANGUAGE_STORAGE_KEY);
    return normalizeUserLanguage(raw);
}

/**
 * Persist language locally and switch UI i18n (does not call the backend).
 */
export async function applyUserLanguageLocally(language: string): Promise<UserLanguage> {
    const normalized = normalizeUserLanguage(language);
    await AsyncStorage.setItem(USER_LANGUAGE_STORAGE_KEY, normalized);
    await i18n.changeLanguage(normalized);
    return normalized;
}
