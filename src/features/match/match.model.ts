export type ClientType = 'GOOGLE' | 'NONE'

export type RoomStatus
    = 'WAITING'
    | 'ACTIVE'
    | 'CLOSED';

export type MatchUserRole = 'admin' | 'participant';

export enum MatchUserStatusEnum {
    ACTIVE = 'ACTIVE',
    WAITING = 'WAITING',
    CLOSED = 'CLOSED',
}

export enum Role {
    ADMIN = 'admin',
    PARTICIPANT = 'participant'
}

export interface ApiResponse<T> {
    ok: boolean;
    success: boolean;
    key?: string | undefined;
    match?: Match | undefined;
    data?: T;
    message?: string;
    status?: number;
    statusText?: string;
}

export interface ApiError {
    success: boolean;
    message: string;
    statusCode: number;
}

export interface Room {
    id: string;
    authorId: string;
    key: string;
    createdAt: Date;
    users: User[];
    matches: Match[];
    status: RoomStatus;
    filters: string;
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
    userId: number;
    roomId: number;
    vote?: string;
    userName: string;
    role: MatchUserRole;
    roomKey?: Room;
    userStatus?: string;
}

export interface Favorite {
    id: number;
    movieId: string;
    user: User;
}

export interface UserRoomResponse {
    message?: string;
    match?: Match;
    key?: string;
}

export type MatchLikeFields = Pick<Match, 'userId' | 'roomKey' | 'movieId'>;

export interface MatchUserStatus {
    roomKey: string;
    userId: number;
    userStatus: MatchUserStatusEnum;
}