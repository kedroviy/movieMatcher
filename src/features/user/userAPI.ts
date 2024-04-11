import { create } from 'apisauce'
import * as Keychain from 'react-native-keychain';

import { API, UserModelType } from '../../shared';

export type UpdateUsernameArgs = {
    userId: number;
    newUsername: string;
}

export type ApiResponse<T = unknown> = {
    success?: boolean;
    data?: T;
    message?: string;
}

const api = create({
    baseURL: API.BASE_URL,
    headers: { Accept: 'application/vnd.github.v3+json' },
});

const setAuthToken = async () => {
    const credentials = await Keychain.getGenericPassword({ service: 'token_guard' });
    if (credentials) {
        api.setHeader('Authorization', `Bearer ${credentials.password}`);
    }
};

export const getUserProfile = async () => {
    await setAuthToken();
    const response = await api.get<UserModelType>(API.GET_USER_PROFILE_INFO);
    if (response.ok && response.data) {
        return { success: true, data: response.data };
    } else {
        throw new Error(response.problem || 'Unknown API error');
    }
};

export const putUpdateUsername = async (args: UpdateUsernameArgs): Promise<ApiResponse> => {
    await setAuthToken();
    const response = await api.put('/user/update-username', args);

    if (!response.ok || !response.data) {
        throw new Error(response.problem || 'Unknown API error');
    }

    return response.data;
};
