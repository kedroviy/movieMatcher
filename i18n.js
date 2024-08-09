import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

const resources = {
    en: {
        translation: {
            welcome: "Welcome",
            movieSelection: 'Movie selection',
            tabs: {
                selection: 'Selection',
                match: 'Match',
                profile: 'Profile',
            },
            profile: {
                account_settings: 'Account settings',
                theme: 'Theme',
                language: 'Language',
                about_application: 'About application'
            },
            about_app: {
                version: 'Version',
                feedback: 'Feedback',
                rate_app: 'Rate application',
            }
        }
    },
    ru: {
        translation: {
            welcome: "Добро пожаловать",
            movieSelection: 'Подбор фильма',
            tabs: {
                selection: 'Подбор',
                match: 'Матч',
                profile: 'Профиль',
            },
            profile: {
                account_settings: 'Настройки аккаунта',
                theme: 'Темы',
                language: 'Язык',
                about_application: 'О приложении'
            },
            about_app: {
                version: 'Версия',
                feedback: 'Обратная связь',
                rate_app: 'Оценить приложение',
            }
        }
    },
    it: {
        translation: {
            welcome: 'Benvenuto',
            movieSelection: 'Selezione di film',
            tabs: {
                selection: 'Selezione',
                match: 'Incontro',
                profile: 'Profilo',
            },
            profile: {
                account_settings: 'Настройка аккаунта',
                theme: 'Тема',
                language: 'Язык',
                about_application: 'О приложении'
            }
        }
    },
    pl: {
        translation: {
            welcome: 'Powitanie',
            movieSelection: 'Wybór filmu',
            tabs: {
                selection: 'Wybór',
                match: 'Mecz',
                profile: 'Profil',
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        resources,
        lng: RNLocalize.getLocales()[0].languageCode,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;