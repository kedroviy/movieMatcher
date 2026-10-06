import { ISMFormData } from 'pages/Main/sm.model';
import { createApi } from './match-api';
import {
    ApiResponse,
    Match,
    MatchLikeFields,
    MatchUserStatus,
    MatchUserStatusEnum,
    Room,
    RoomStateSnapshot,
} from './match.model';
import { handleApiResponse } from './match.utils';
import type { ApiResponse as ApisauceResponse } from 'apisauce';

export type UserRoomMembership = {
    roomKey: string;
    roomId: string;
    role: string;
    isAuthor: boolean;
    userStatus: string;
    matchPhase: string;
    roomStatus: string;
    roomName: string | null;
};

export const createRoomService = async (userId: number): Promise<any> => {
    try {
        const api = await createApi();
        const response = await api.post<ApiResponse<Room>>('/rooms/create', { userId });

        if (!response.ok) {
            throw new Error(`Network request failed with status ${response.status} and problem ${response.problem}`);
        }

        return handleApiResponse(response);
    } catch (error) {
        throw error;
    }
};

const readApiErrorMessage = (data: unknown): string | null => {
    if (data == null) {
        return null;
    }
    if (typeof data === 'string' && data.trim()) {
        return data;
    }
    if (typeof data === 'object') {
        const body = data as { message?: string | string[]; error?: string };
        if (Array.isArray(body.message)) {
            return body.message.join(', ');
        }
        if (typeof body.message === 'string' && body.message.trim()) {
            return body.message;
        }
        if (typeof body.error === 'string' && body.error.trim()) {
            return body.error;
        }
    }
    return null;
};

export const joinRoomService = async (key: string, userId: number): Promise<any> => {
    const api = await createApi();
    const response = await api.post<ApiResponse<Room>>(`/rooms/join/${key}`, { userId });
    if (!response.ok) {
        const serverMessage = readApiErrorMessage(response.data);
        if (response.status === 401 || response.status === 403) {
            throw new Error(serverMessage || 'Сессия истекла. Войдите в аккаунт снова.');
        }
        if (response.status === 404) {
            throw new Error(serverMessage || 'Комната не найдена. Проверьте код лобби.');
        }
        throw new Error(serverMessage || `Не удалось войти в лобби (${response.status ?? response.problem})`);
    }
    return handleApiResponse(response);
};

export const leaveRoomService = async (key: number, userId: number): Promise<any> => {
    const api = await createApi();
    const response = await api.post<ApiResponse<Room>>(`/rooms/leave/${key}`, { userId });
    return handleApiResponse(response);
};

/** Authenticated user leaves a room (participant) or deletes it as author — `POST /rooms/my/leave`. */
export const leaveMyRoomMembershipService = async (roomKey: string): Promise<{ message: string }> => {
    const api = await createApi();
    const response = await api.post<{ message: string }>('/rooms/my/leave', { roomKey });
    if (!response.ok) {
        throw new Error(response.problem || 'Failed to leave room');
    }
    return response.data ?? { message: 'OK' };
};

export const getMyRoomMembershipsService = async (): Promise<UserRoomMembership[]> => {
    const api = await createApi();
    const response = await api.get<UserRoomMembership[]>('/rooms/my/memberships');
    if (!response.ok) {
        throw new Error(response.problem || 'Failed to load your rooms');
    }
    if (!response.data) {
        return [];
    }
    return Array.isArray(response.data) ? response.data : [];
};

export const updateRoomFilters = async (roomId: string, filters: ISMFormData): Promise<{ message?: string }> => {
    const api = await createApi();
    const response = await api.put<{ message?: string }>(`/rooms/${roomId}/filters`, filters);
    if (response.ok) {
        return response.data ?? { message: 'Filters updated successfully.' };
    }
    throw new Error('Failed to update filters');
};

type RoomFiltersResponse = {
    statusCode?: number;
    filters?: ISMFormData | null;
};

export const getRoomFilters = async (roomKey: string): Promise<ISMFormData | null> => {
    const api = await createApi();
    const response = await api.get<RoomFiltersResponse>(`/rooms/${roomKey}/get-filters`);
    if (!response.ok) {
        throw new Error('Failed to get filters');
    }
    return response.data?.filters ?? null;
};

export const doesUserHaveRoomService = async (userId: number): Promise<Match | null> => {
    try {
        const api = await createApi();
        const response: any = await api.get<ApiResponse<Match>>(`/match/${userId}`);
        if (response.ok) {
            return response.data ?? null;
        } else if (response.status === 404) {
            return null;
        } else {
            throw new Error(`Server Error: ${response.status}`);
        }
    } catch (error) {
        throw new Error('Failed to fetch room');
    }
};

export const startMatchService = async (key: string): Promise<any> => {
    try {
        const api = await createApi();
        const response = await api.post<ApiResponse<any>>(`/rooms/${key}/start-match`);
        if (response.ok && response.data) {
            return response;
        } else {
            throw new Error('Failed to start match');
        }
    } catch (error) {
        throw new Error('Failed to start match');
    }
};

export const getMovieData = async (roomKey: string): Promise<any> => {
    const api = await createApi();
    const response = await api.get<any>(`/rooms/${roomKey}/get-movies`);
    if (response.ok) {
        if (typeof response.data === 'string') {
            try {
                return { ...response, data: JSON.parse(response.data) };
            } catch {
                throw new Error('Invalid movies payload from server');
            }
        }
        return response;
    } else {
        throw new Error('Failed to get movies');
    }
};

export const postLikeMovie = async (like: MatchLikeFields): Promise<any> => {
    const api = await createApi();
    const response = await api.post<any>(`/match/like`, like);
    if (response.ok) {
        return response;
    }
    throw new Error('Failed to like movie');
};

export const updateUserStatus = async (userStatus: MatchUserStatus): Promise<any> => {
    const api = await createApi();
    const response = await api.patch<any>(`/match/user-status`, userStatus);
    if (response.status === 200) {
        return response;
    } else {
        throw new Error('Failed to update user status');
    }
};

export const getUserStatusByUserId = async (
    roomKey: string,
    userId: number,
): Promise<{ userId: number; userStatus: MatchUserStatusEnum } | null> => {
    const api = await createApi();
    const response = await api.get<{ userId: number; userStatus: MatchUserStatusEnum }>(
        `/match/${roomKey}/user-status/${userId}`,
    );
    try {
        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error('Failed to get user status');
        }
    } catch (error) {
        throw new Error('Failed to get user status');
    }
};

export const checkStatus = async (roomKey: string, userId: number, idempotencyKey?: string): Promise<void> => {
    const api = await createApi();
    const body: { userId: number; idempotencyKey?: string } = { userId };
    if (idempotencyKey) {
        body.idempotencyKey = idempotencyKey;
    }
    const response = await api.post<any>(`/match/check-status/${roomKey}`, body);
    if (!response.ok) {
        throw new Error('Failed to check status');
    }
};

/** Room aggregate (phase, version, participants, deck summary, commons) — prefer over ad-hoc joins of several calls. */
export const getRoomState = async (
    roomKey: string,
): Promise<ApisauceResponse<RoomStateSnapshot>> => {
    const api = await createApi();
    const response = await api.get<RoomStateSnapshot>(`/rooms/${roomKey}/state`);
    if (response.ok) {
        return response;
    }
    throw new Error('Failed to get room state');
};

export const getMatchData = async (roomKey: string): Promise<any> => {
    const api = await createApi();
    const response = await api.get<any>(`/match/specific-key-info/${roomKey}`);
    if (response.ok) {
        return response;
    } else {
        throw new Error('Failed to get movies');
    }
};
