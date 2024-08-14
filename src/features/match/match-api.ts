import { create } from 'apisauce';
import * as Keychain from 'react-native-keychain';
import { API } from 'shared';

export const createApi = async () => {
    let token: string | null = null;
    try {
        const credentials = await Keychain.getGenericPassword({ service: 'token_guard' });
        token = credentials ? credentials.password : null;
    } catch (error) {
        token = null
    }

    const api = create({
        baseURL: API.BASE_URL,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined,
        },
    });
    return api;
};
