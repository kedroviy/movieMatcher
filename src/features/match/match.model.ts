export type ClientType = 'GOOGLE' | 'NONE';

export type RoomStatus = 'WAITING' | 'ACTIVE' | 'CLOSED';

export type MatchUserRole = 'admin' | 'participant';

export enum MatchUserStatusEnum {
    ACTIVE = 'ACTIVE',
    WAITING = 'WAITING',
    CLOSED = 'CLOSED',
}

export enum Role {
    ADMIN = 'admin',
    PARTICIPANT = 'participant',
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
    movieId?: number;
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
    movieId: number;
    user: User;
}

export interface UserRoomResponse {
    message?: string;
    match?: Match;
    key?: string;
}

export type MatchLikeFields = Pick<Match, 'userId' | 'movieId'> & { roomKey: string };

export interface MatchUserStatus {
    roomKey: string;
    userId: number;
    userStatus: MatchUserStatusEnum;
}

/** Shared-interest movie ref (Общих) — matches backend CommonMovieRefDto. */
export type CommonMovieRef = {
    readonly id: number;
    readonly title: string;
};

/** Server → client WS `commonUpdated` payload. */
export type CommonUpdatedPayload = {
    readonly roomKey: string;
    readonly matchPhase: string;
    readonly roomStatus: string;
    readonly count: number;
    readonly movies: readonly CommonMovieRef[];
    readonly targetCount: number | null;
};

/** Commons fields on GET /rooms/:key/state (RoomStateDto). */
export type RoomStateCommons = {
    readonly commonCount?: number;
    readonly commonMovies?: readonly CommonMovieRef[];
    readonly commonTargetCount?: number | null;
};

export type RoomParticipantSnapshot = {
    readonly userId: number;
    readonly userStatus?: string;
};

export type RoomDeckSummary = {
    readonly docCount?: number;
    readonly firstMovieId?: number;
    readonly lastMovieId?: number;
    readonly hasDeck?: boolean;
};

/** Minimal typed room aggregate used by commons hydrate and waiting-round reconcile. */
export type RoomStateSnapshot = RoomStateCommons & {
    readonly roomKey: string;
    readonly aggregateVersion?: number;
    readonly matchPhase?: string;
    readonly roomStatus?: string;
    readonly participants?: readonly RoomParticipantSnapshot[];
    readonly deck?: RoomDeckSummary;
};
