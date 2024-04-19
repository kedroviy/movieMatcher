import { create } from 'apisauce';
import * as Keychain from 'react-native-keychain';

export const createApi = async () => {
    const credentials = await Keychain.getGenericPassword({ service: 'token_guard' });
    const token = credentials ? credentials.password : null;

    const api = create({
        baseURL: 'http://192.168.100.71:6001/',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : 'Bearer your_fallback_token',
        },
    });

    return api;
};
