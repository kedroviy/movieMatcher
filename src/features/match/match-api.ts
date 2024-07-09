import { create } from 'apisauce';
import * as Keychain from 'react-native-keychain';
import io from 'socket.io-client';

export const createApi = async () => {
    const credentials = await Keychain.getGenericPassword({ service: 'token_guard' });
    const token = credentials ? credentials.password : null;

    const api = create({
        baseURL: 'https://movie-match-x5ue.onrender.com',
        // 'https://movie-match-x5ue.onrender.com',
        // 'http://192.168.100.71:6001/',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined,
        },
    });
    return api;
};
