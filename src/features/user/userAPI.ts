import { create } from 'apisauce'
import { API } from '../../shared';

import * as Keychain from 'react-native-keychain';

const api = create({
    baseURL: API.BASE_URL,
    headers: { Accept: 'application/vnd.github.v3+json' },
});

const setAuthToken = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
        api.setHeader('Authorization', `Bearer ${credentials.password}`);
    }
};

export const getUserProfile = async () => async () => {
    await setAuthToken();
    return api.get(API.GET_USER_PROFILE_INFO);
};
