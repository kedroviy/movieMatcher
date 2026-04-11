import { create } from 'apisauce';
import { ApiResponse } from 'apisauce';
import { API } from '../../shared';

type IUserFields = {
    email: string;
    password: string;
};

export type IGoogleAuthCodeToServer = {
    idToken: string;
};

type Response<T> = {
    token: any;
    message: any;
    success: boolean;
    data: T;
};

type AuthErrorBody = {
    code?: string;
    retryAfterSeconds?: number;
    message?: string | string[];
};

export type AuthFailureParams = { seconds?: number };

export type AuthApiFailure = {
    success: false;
    errorCode: string;
    params?: AuthFailureParams;
};

export type LoginUserResult = { success: true; token: string } | AuthApiFailure;

export type RegistrationUserResult = { success: true; message: string } | AuthApiFailure;

export type GoogleAuthResult = { success: true; token: string } | AuthApiFailure;

function parseAuthErrorFromResponse(response: ApiResponse<unknown>): AuthApiFailure {
    const data = response.data as AuthErrorBody | undefined;
    if (data && typeof data === 'object' && typeof data.code === 'string') {
        const retryAfterSeconds = data.retryAfterSeconds;
        const params =
            typeof retryAfterSeconds === 'number' && Number.isFinite(retryAfterSeconds)
                ? { seconds: retryAfterSeconds }
                : undefined;
        return { success: false, errorCode: data.code, params };
    }
    return { success: false, errorCode: 'AUTH_UNKNOWN' };
}

const api = create({
    baseURL: API.BASE_URL,
    headers: { Accept: 'application/vnd.github.v3+json' },
});

export const sendGoogleCodeToServer = async (idToken: string): Promise<GoogleAuthResult> => {
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
        }
        return parseAuthErrorFromResponse(response);
    } catch (error) {
        return { success: false, errorCode: 'AUTH_NETWORK' };
    }
};

export const loginUser = async (body: IUserFields): Promise<LoginUserResult> => {
    try {
        const response = await api.post<Response<{ token: string }>>(API.LOGIN, body);
        if (response.ok && response.data) {
            return { success: true, token: response.data?.token };
        }
        return parseAuthErrorFromResponse(response);
    } catch (error) {
        return { success: false, errorCode: 'AUTH_NETWORK' };
    }
};

export const registrationUser = async (body: IUserFields): Promise<RegistrationUserResult> => {
    try {
        const response = await api.post<Response<{ message: string }>>(API.REGISTRATION, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok && response.data) {
            return { success: true, message: response.data.message };
        }
        return parseAuthErrorFromResponse(response);
    } catch (error) {
        return { success: false, errorCode: 'AUTH_NETWORK' };
    }
};
