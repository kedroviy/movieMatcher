import { createAuthenticatedApi } from '../../shared/api/create-authenticated-api';
import { API, UserModelType } from '../../shared';

export type UpdateUsernameArgs = {
    userId: number;
    newUsername: string;
};

export type ApiResponse<T = unknown> = {
    ok?: boolean;
    success?: boolean;
    data?: T;
    message?: string;
};

export const getUserProfile = async () => {
    const api = await createAuthenticatedApi();
    const response = await api.get<UserModelType>(API.GET_USER_PROFILE_INFO);
    if (response.ok && response.data) {
        return { success: true, data: response.data };
    }
    throw new Error(response.problem || 'Unknown API error');
};

export const putUpdateUsername = async (args: UpdateUsernameArgs): Promise<ApiResponse> => {
    const api = await createAuthenticatedApi();
    const response = await api.patch('/user/update-username', args);
    if (!response.ok || !response.data) {
        throw new Error(response.problem || 'Unknown API error');
    }
    return response;
};

export const deleteUserAccount = async (email: string): Promise<ApiResponse> => {
    const api = await createAuthenticatedApi();
    const response = await api.delete(`/user/${email}`);
    if (!response.ok || !response.data) {
        throw new Error(response.problem || 'Unknown API error');
    }
    return response;
};
