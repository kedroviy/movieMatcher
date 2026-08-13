import { create, ApisauceInstance, ApiResponse } from 'apisauce';
import * as Keychain from 'react-native-keychain';

import { API } from '../config';
import { isAccessTokenExpired, readAccessTokenPayload, removeToken } from '../utils/tokenHandle';
import { isAuthEntryRequestUrl, notifySessionExpired } from './session-expired';

const attachSessionMonitor = (api: ApisauceInstance): void => {
    api.addMonitor((response: ApiResponse<unknown>) => {
        const status = response.status;
        if (status !== 401 && status !== 403) {
            return;
        }
        if (isAuthEntryRequestUrl(response.config?.url)) {
            return;
        }
        notifySessionExpired();
    });
};

export const createAuthenticatedApi = async (): Promise<ApisauceInstance> => {
    let token: string | null = null;

    try {
        const credentials = await Keychain.getGenericPassword({ service: 'token_guard' });
        token = credentials?.password?.trim() || null;
    } catch {
        token = null;
    }

    if (token) {
        const payload = readAccessTokenPayload(token);
        if (!payload || isAccessTokenExpired(payload)) {
            await removeToken();
            notifySessionExpired();
            token = null;
        }
    }

    const api = create({
        baseURL: API.BASE_URL,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
    attachSessionMonitor(api);
    return api;
};
