import { create } from 'apisauce'
import { API } from '../../shared';

type RecoveryPasswordType = {
    email: string;
    password?: string;
    code?: string;
}

type Response<T> = {
    code: any;
    message: any;
    success: boolean;
    data: T;
};

const api = create({
    baseURL: API.BASE_URL,
    headers: { Accept: 'application/vnd.github.v3+json' },
});

export const sendEmailForRecoveryAPI = async (email: string) => {
    const formData = new URLSearchParams();
    formData.append('email', email);

    try {
        const response = await api.post<Response<{ success: string }>>(API.EMAIL_TO_CHECK, formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (response.ok) {
            console.log(response);
            return { success: true };
        } else {
            console.log(response);
            return { success: false };
        }
    } catch (error) {
        return { success: false, error: 'Ошибка сети' };
    }
}

export const sendRecoveryCodeAPI = async (body: RecoveryPasswordType) => {

    try {
        const response = await api.post<Response<{ success: string }>>(API.VERIFY_CHANGE_PASSWORD_CODE, body);

        if (response.ok) {
            return { success: true };
        } else {
            return { success: false };
        }
    } catch (error) {
        return { success: false, error: 'Ошибка сети' };
    }
}

export const sendRecoveryNewPasswordAPI = async (body: RecoveryPasswordType) => {

    try {
        const response = await api.post<Response<{ success: string }>>(API.NEW_PASSWORD, body);

        if (response.ok) {
            console.log(response)
            return { success: true };
        } else {
            console.log(response)
            return { success: false };
        }
    } catch (error) {
        return { success: false, error: 'Ошибка сети' };
    }
}