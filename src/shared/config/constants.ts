const API = {
    BASE_URL: 'https://movie-match-x5ue.onrender.com',
    // 'https://movie-match-x5ue.onrender.com',
    // 'http://192.168.100.71:6001' ,
    KINOPOISK_URL: 'https://api.kinopoisk.dev/v1.4',
    LOGIN: '/auth/login',
    REGISTRATION: '/auth/register',
    EMAIL_TO_CHECK: '/auth/send-code-to-email',
    VERIFY_CHANGE_PASSWORD_CODE: '/auth/verify-code',
    NEW_PASSWORD: '/auth/change-password',
    GET_USER_PROFILE_INFO: '/user/me',
};

const AppConstants = {
    EMPTY_VALUE: '',
}

const BASE_KP_URL = 'https://www.kinopoisk.ru';

export { API, AppConstants, BASE_KP_URL }
