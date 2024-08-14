import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

const resources = {
    en: {
        translation: {
            welcome: "Welcome",
            movieSelection: 'Movie selection',
            auth: {
                welcome: 'Welcome to MovieMatch',
                sub_welcome: 'Select a movie on your own or with friends!',
                login: {
                    btn_title: 'Login',
                    btn_google: 'Login with Google'
                },
                registration: {
                    btn_title: 'Registration',
                    reg_result: 'Congratulations, you have successfully created an account!'
                },
                password_recovery: {
                    recovery_succ_result: 'Congratulations, your password has been successfully changed!'
                },
            },
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
                    success: 'Your username has been successfully changed',
                    networkError: 'Something went wrong',
                },
                logout_acc: 'Log out of your account'
            },
            selection_movie: {
                my_movie_list: 'My movies',
                movie_selection: 'Movie selection',
                create_list_button: 'Create List',
                create_list_component: {
                    crc_header: 'Create list',
                    start_select: 'Start select',
                    list_name: 'List name',
                },
                selection_list_end: 'The films offered have ended. Skip to selected movies or go to next page!',
                empty_list: `You haven't selected any movies to watch yet. Start selecting a movie right now!`,
                movie_details: {
                    watch: 'Watch on Kinopoisk',
                    header: 'Movie details',
                    actors: 'Actors'
                }
            },
            match_movie: {
                main_match_screen: {
                    create_lobby_btn: 'Create new lobby',
                    reconnect_lobby_btn: 'Reconnect to lobby',
                    join_lobby_btn: 'Join to lobby',
                    main_text: 'Create a lobby to jointly select a movie to watch using the coincidence method!',
                    greetings: 'Hello',
                    loading: 'Connecting to the server, please wait...',
                },
                lobby: {
                    lobby_members: 'Lobby members'
                },
                filters_settings: {
                    settings: 'Settings',
                    leave_room: 'Leave the room and delete',
                    country: 'Country',
                    year: 'Year',
                    genre: 'Genre',
                    exclude_genre: 'Exclude genre',
                    other_options: 'Other options',
                },
                match_result: 'Result of match'
            },
            general: {
                next_page: 'Next page',
                enter_in_account: 'Login to account',
                continue: 'Продолжить',
            }
        }
    },
    ru: {
        translation: {
            welcome: "Добро пожаловать",
            movieSelection: 'Подбор фильма',
            auth: {
                welcome: 'Добро пожаловать в MovieMatch',
                sub_welcome: 'Сделай подбор фильма самостоятельно или в компании друзей!',
                login: {
                    btn_title: 'Войти',
                    btn_google: 'Войти с Google'
                },
                registration: {
                    btn_title: 'Зарегистрироваться',
                    reg_result: 'Поздравляем, вы успешно создали аккаунт!'
                },
                password_recovery: {
                    recovery_succ_result: 'Поздравляем, пароль успешно изменен!'
                },
            },
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
                    success: 'Ваше имя успешно изменено!',
                    networkError: 'Что-то пошло не так!',
                },
                logout_acc: 'Выйти из аккаунта'
            },
            selection_movie: {
                my_movie_list: 'Мои фильмы',
                movie_selection: 'Подбор фильма',
                create_list_button: 'Создать список',
                create_list_component: {
                    crc_header: 'Создание списка',
                    start_select: 'Начать подбор',
                    list_name: 'Название списка',
                },
                selection_list_end: 'Предложенные фильмы закончились. Перейдите к подобранным фильмам или продолжите на следующей странице!',
                empty_list: 'Вы ещё не подбирали ни одного фильма к просмотру. Начните подбор фильма прямо сейчас!',
                movie_details: {
                    watch: 'Смотреть на Кинопоиске',
                    header: 'Детали фильма',
                    actors: 'Актёры'
                }
            },
            match_movie: {
                main_match_screen: {
                    create_lobby_btn: 'Создать новое лобби',
                    reconnect_lobby_btn: 'Переподключиться к лобби',
                    join_lobby_btn: 'Присоединиться к лобби',
                    main_text: 'Создавайте лобби для совместного выбора фильма!',
                    greetings: 'Привет',
                    loading: 'Идёт подключение к серверу, подождите...'
                },
                lobby: {
                    lobby_members: 'Участники лобби'
                },
                filters_settings: {
                    settings: 'Настройки',
                    leave_room: 'Покинуть комнату и удалить',
                    country: 'Страна',
                    year: 'Год',
                    genre: 'Жанр',
                    exclude_genre: 'Исключить жанр',
                    other_options: 'Другие опции',
                },
                match_result: 'Результат'
            },
            general: {
                next_page: 'Следующая страница',
                enter_in_account: 'Войти в аккаунт',
                continue: 'Продолжить'
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