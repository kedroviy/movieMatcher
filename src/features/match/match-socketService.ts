import { Alert } from "react-native";
import io, { Socket } from "socket.io-client";

class SocketService {
    constructor() {
        this.socket = null;
    }
    private socket: Socket | null = null;

    connect(serverUrl: string): void {
        this.socket = io(serverUrl + "/rooms", {
            reconnection: true,
            transports: ['websocket', 'polling'],
            rememberUpgrade: true,
        });
        this.socket.on("connect", () => console.log("Connected to websocket server"));
        this.socket.on("connect_error", (error) => console.log("Connect error", error));
        this.socket.on("connect_timeout", (timeout) => console.log("Connection timeout", timeout));
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    joinRoom(roomKey: string, userId: string): void {
        this.socket?.emit("joinRoom", { roomKey, userId });
    }

    startMatch(roomKey: string) {
        this.socket?.emit('startMatch', { roomKey });
    }

    requestMatchUpdate(roomKey: string) {
        this.socket?.emit('requestMatchData', { roomKey });
    }

    vote(roomKey: number, userId: string, movieId: number, vote: boolean) {
        this.socket?.emit('vote', { key: roomKey, userId, movieId, vote });
    }
    
    subscribeToVoteEnded(callback: any) {
        this.socket?.emit('voteEnded', callback);
    }

    requestBroadcatingMovies(message: string) {
        this.socket?.emit('startBroadcastingMovies', message);
    }

    
    subscribeToMatchUpdates(callback: (data: any) => void) {
        this.socket?.on('matchUpdated', callback);
    }
    
    subscribeToJoinNewUser(callback: (data: any) => void) {
        this.socket?.emit('Join new user to match', callback);
    }
    
    subscribeToBroadcastMessage(callback: (data: any) => void) {
        this.socket?.on('broadcastMessage', callback);
    }

    subscribeToBroadcastMatchUpdate(callback: (data: any) => void ) {
        this.socket?.emit('broadcastMatchDataUpdated', callback);
    }

    subscribeToBroadcastMovies(callback: <T>(data: T) => void) {
        this.socket?.on('broadcastMovies', callback);
    }

    subscribeToStartMatchResponse(callback: (data: any) => void) {
        this.socket?.on('startMatchResponse', callback);
    }

    subscribeToGetData() {
        this.socket?.on('matchData', (data) => {
            if (data.type === 'matchEnded') {
                Alert.alert(`Match ended with movie ID: ${data.movieId}`);
            }
        });
    }

    subscribeToRequestMatchUpdate(callback: any) {
        this.socket?.on("sendNextMovieToRoom", callback);
    };

    filtersUpdateBroadcast(callback: (data: any) => void): void {
        this.socket?.on('filtersUpdated', callback);
    }


    unsubscribeToJoinNewUser() {
        this.socket?.off('Join new user to match');
    };

    unsubscribeBroadcastMovies() {
        this.socket?.off('broadcastMovies');
    }

    unsubscribeToBroadcastMatchUpdate() {
        this.socket?.off('broadcastMatchDataUpdated');
    }

    unsubscribeFromMatchUpdates() {
        this.socket?.off('matchUpdated');
    }

    unsubscribeFromMatchEnded() {
        this.socket?.off('voteEnded');
    }

    unsubscribeFromRequestMatchUpdate() {
        this.socket?.off('requestMatchData')
    };

    unsubscribeFromRequestMatchResponse() {
        this.socket?.off('matchUpdated');
        this.socket?.off('broadcastMessage');
        this.socket?.off('filtersUpdated');
        this.socket?.off('startMatchResponse');
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

const socketService = new SocketService();
export default socketService;