import { FilterOption } from "pages/Main/sm.model";
import { createApi } from "./match-api";
import { ApiResponse, MatchLikeFields, MatchUserStatus, MatchUserStatusEnum, Room, UserRoomResponse } from "./match.model";
import { handleApiResponse } from "./match.utils";

export const createRoomService = async (userId: number): Promise<any> => {
    try {
        const api = await createApi();
        const response = await api.post<ApiResponse<Room>>('/rooms/create', { userId });

        if (!response.ok) {
            console.log('API Error:', response.originalError);
            throw new Error(`Network request failed with status ${response.status} and problem ${response.problem}`);
        }

        return handleApiResponse(response);
    } catch (error) {
        console.error('Error in createRoomService:', error);
        throw error;
    }
};

export const joinRoomService = async (key: number, userId: number): Promise<any> => {
    const api = await createApi();
    const response = await api.post<ApiResponse<Room>>(`/rooms/join/${key}`, { userId });
    console.log('response service: ', response)
    if (!response.ok) throw new Error(`Failed to join room: ${response.problem}`);
    return handleApiResponse(response);
};

export const leaveRoomService = async (key: number, userId: number): Promise<any> => {
    const api = await createApi();
    const response = await api.post<ApiResponse<Room>>(`/rooms/leave/${key}`, { userId });
    return handleApiResponse(response);
};

export const leaveFromMatchService = async (roomKey: number, userId: number): Promise<any> => {
    const api = await createApi();
    const response = await api.post<ApiResponse<any>>(`/rooms/leave-from-match`, { roomKey, userId });
    console.log('response: ', response)
    if (!response.ok) throw new Error(response.problem || 'Unknown API error');
    return response.data;
};

export const updateRoomFilters = async (roomId: string, filters: FilterOption): Promise<any> => {
    const api = await createApi();
    const response = await api.put<ApiResponse<any>>(`/rooms/${roomId}/filters`, filters);
    if (response.ok) {
        console.log('Filters updated successfully:', response.data);
        return response.data;
    } else {
        console.error('Failed to update filters:', response.problem);
        throw new Error('Failed to update filters');
    }
}

export const doesUserHaveRoomService = async (userId: number): Promise<UserRoomResponse> => {
    try {
        const api = await createApi();
        const response = await api.get<ApiResponse<UserRoomResponse>>(`/rooms/user/${userId}/hasRoom`);
        console.log('response has uset: ', response.data)
        if (response.ok && response.data) {
            return { message: 'room exist', match: response.data.match, key: response.data.key };
        } else if (response.ok) {
            return { message: 'room not found' };
        } else {
            console.error('Failed to fetch room:', response.problem);
            throw new Error('Failed to fetch room');
        }
    } catch (error) {
        console.error('Failed to fetch room:', error);
        throw new Error('Failed to fetch room');
    }
};

export const startMatchService = async (key: string): Promise<any> => {
    try {
        const api = await createApi();
        const response = await api.post<ApiResponse<any>>(`/rooms/${key}/start-match`);
        console.log(response)
        if (response.ok && response.data) {
            return response
        } else {
            console.error('Failed to start match:', response.problem);
            throw new Error('Failed to start match');
        }
    } catch (error) {
        throw new Error('Failed to start match');
    }
}

export const getMovieData = async (roomKey: string): Promise<any> => {
    const api = await createApi();
    const response = await api.get<any>(`/rooms/${roomKey}/get-movies`);
    if (response.ok) {
        return response
    } else {
        console.error('Failed to get movies:', response);
        throw new Error('Failed to get movies');
    }
}

export const postLikeMovie = async (like: MatchLikeFields): Promise<any> => {
    const api = await createApi();
    const response = await api.post<any>(`/match/like`, like);
    console.log(response);
    if (response.status === 200) {
        return response;
    } else {
        throw new Error('Failed to like movie');
    }
}

export const updateUserStatus = async (userStatus: MatchUserStatus): Promise<any> => {
    const api = await createApi();
    const response = await api.patch<any>(`/match/user-status`, userStatus);
    if (response.status === 200) {
        return response;
    } else {
        throw new Error('Failed to update user status');
    }
}

export const getUserStatusByUserId = async (roomKey: string, userId: number):
    Promise<{ userId: number; userStatus: MatchUserStatusEnum } | null> => {
    const api = await createApi();
    const response = await api.get<{ userId: number; userStatus: MatchUserStatusEnum }>
        (`/match/${roomKey}/user-status/${userId}`);
    try {
        if (response.status === 200 && response.data) {
            return response.data;
        } else {
            throw new Error('Failed to get user status');
        }
    } catch (error) {
        console.error('Error fetching user status:', error);
        throw new Error('Failed to get user status');
    }
}

export const checkStatus = async (roomKey: string, userId: number): Promise<void> => {
    const api = await createApi();
    const response = await api.post<any>(`/match/check-status/${roomKey}`, { userId });
    if (!response.ok) {
        throw new Error('Failed to check status');
    }
};
