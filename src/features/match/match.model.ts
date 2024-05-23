export enum ClientType {
    GOOGLE = 'GOOGLE',
    NONE = 'NONE',
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface Room {
    id: string;
    authorId: string;
    key: string;
    createdAt: Date;
    users: User[];
    matches: Match[];
}

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    client: ClientType;
    favorites: Favorite[];
    matches: Match[];
}

export interface Match {
    id: number;
    movieId?: string;
    userId: string;
    userName: string;
    vote?: string;
    roomId: number;
    room?: Room;
}

export interface Favorite {
    id: number;
    movieId: string;
    user: User;
}

export interface UserRoomResponse {
    message: string;
    match?: Match[];
    key?: string;
}
