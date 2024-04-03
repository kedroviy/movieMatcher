import { create } from 'apisauce'
import { API } from '../../shared';

type IUserFields = {
    email: string;
    password: string;
}

export type IGoogleAuthCodeToServer = {
    idToken: string;
}

type Response<T> = {
    token: any;
    message: any;
    success: boolean;
    data: T;
};

const api = create({
    baseURL: API.BASE_URL,
    headers: { Accept: 'application/vnd.github.v3+json' },
});

// const apiGoogleAuth = create({
//     baseURL: API.BASE_URL,
// });

// export const setAuthToken = (token: string) => {
//     apiGoogleAuth.setHeader('Authorization', `Bearer ${token}`);
// };

export const sendGoogleCodeToServer = async (idToken: string) => {
    try {
        const formData = new URLSearchParams();
        formData.append('idToken', idToken);

        const response = await api.post<Response<{ token: string }>>(`/auth/verify-id-token`, formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        if (response.ok && response.data) {
            return { success: true, token: response.data.token };
        } else {
            return { success: false, error: response.problem || 'Ошибка аутентификации' };
        }
    } catch (error) {
        return { success: false, error: 'Ошибка сети' };
    }
}

export const loginUser = async (body: IUserFields) => {
    try {
        const response = await api.post<Response<{ token: string }>>(API.LOGIN, body);
        if (response.ok && response.data) {
            return { success: true, token: response.data?.token };
        } else {
            return { success: false, error: response.problem || 'Ошибка аутентификации' };
        }
    } catch (error) {
        return { success: false, error: 'Ошибка сети' };
    }
}

export const registrationUser = async (body: IUserFields) => {

    const response = await api.post<Response<{ message: string }>>(API.REGISTRATION, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    try {
        if (response.ok && response.data) {
            console.log('api: ', response)
            return { success: true, message: response.data.message };
        } else {
            console.log('api: ', response)
            return { success: false, error: response.problem || 'Ошибка аутентификации' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Ошибка сети' };
    }
}
