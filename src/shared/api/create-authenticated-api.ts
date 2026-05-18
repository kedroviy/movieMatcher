import { create, ApisauceInstance } from 'apisauce';
import * as Keychain from 'react-native-keychain';

import { API } from '../config';

export const createAuthenticatedApi = async (): Promise<ApisauceInstance> => {
    let token: string | null = null;

    try {
        const credentials = await Keychain.getGenericPassword({ service: 'token_guard' });
        token = credentials?.password?.trim() || null;
    } catch {
        token = null;
    }

    return create({
        baseURL: API.BASE_URL,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
};
