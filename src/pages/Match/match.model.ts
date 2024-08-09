export interface Room {
    id: string;
    authorId: string;
    key: string;
    name?: string;
    filters?: any;
    createdAt: Date;
    users: User[];
    matches: Match[];
}

export interface User {
    id: string;
    username: string;
}

export interface Match {
    id: string;
    movieId?: string;
    userId: string;
    userName: string;
    vote?: string;
    roomId: string;
}