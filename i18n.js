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
            },
            acc_settings: {
                user_name: 'Username',
                email: 'Email',
                password: 'Password',
                changeName: {
                    change_name: 'Change name',
                    label: 'User name',
                    textError: 'Fill in the field',
                },
                logout_acc: 'Log out of your account'
            },
            selection_movie: {
                my_movie_list: 'My movie lists',
                create_list_button: 'Create List',
                create_list_component: {
                    crc_header: 'Create list',
                    start_select: 'Start select',
                    list_name: 'List name',
                }
            },
            match_movie: {
                main_match_screen: {
                    create_lobby_btn: 'Create new lobby',
                    join_lobby_btn: 'Join to lobby',
                    main_text: 'Create a lobby to jointly select a movie to watch using the coincidence method!',
                    greetings: 'Hello'
                }
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
            },
            acc_settings: {
                user_name: 'Имя пользователя',
                email: 'Электронная почта',
                password: 'Пароль',
                changeName: {
                    change_name: 'Изменить имя',
                    label: 'Имя пользователя',
                    textError: 'Заполните поле',
                },
                logout_acc: 'Выйти из аккаунта'
            },
            selection_movie: {
                my_movie_list: 'Мои списки фильмов',
                create_list_button: 'Создать список',
                create_list_component: {
                    crc_header: 'Создание списка',
                    start_select: 'Начать подбор',
                    list_name: 'Название списка',
                }
            },
            match_movie: {
                main_match_screen: {
                    create_lobby_btn: 'Создать новое лобби',
                    join_lobby_btn: 'Присоединиться к лобби',
                    main_text: 'Создавайте лобби для совместного выбора фильма к просмотру методом совпадения!',
                    greetings: 'Привет'
                }
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