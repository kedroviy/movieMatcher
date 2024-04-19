import { createApi } from "./match-api";
import { ApiResponse, Room } from "./match.model";
import { handleApiResponse } from "./match.utils";


export const createRoomService = async (userId: number): Promise<any> => {
    const api = await createApi();
    const response = await api.post<ApiResponse<Room>>('/rooms/create', { userId });
    console.log('API Response:', response);
    if (!response.ok) {
        console.log('API Error:', response.originalError);
        throw new Error(`Network request failed with status ${response.status} and problem ${response.problem}`);
    }
    return handleApiResponse(response);
};

export const joinRoomService = async (key: number, userId: number): Promise<any> => {
    const api = await createApi();
    const response = await api.post<ApiResponse<Room>>(`/rooms/join/${key}`, { userId });
    return handleApiResponse(response);
};

export const leaveRoomService = async (key: number, userId: number): Promise<any> => {
    const api = await createApi();
    const response = await api.post<ApiResponse<Room>>(`/rooms/leave/${key}`, { userId });
    return handleApiResponse(response);
};


