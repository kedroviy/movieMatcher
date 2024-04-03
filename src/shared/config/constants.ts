const API = {
    BASE_URL: 'https://movie-match-x5ue.onrender.com',
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

export { API, AppConstants }
