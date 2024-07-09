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
        console.log(this.socket?.connected);
        return this.socket?.connected || false;
    }

    joinRoom(roomKey: string, userId: string): void {
        console.log(`Attempting to join room: ${roomKey} with user ID: ${userId}`);
        this.socket?.emit("joinRoom", { roomKey, userId });
    }

    startMatch(roomKey: string) {
        console.log('start match websocket svice', roomKey)
        this.socket?.emit('startMatch', { roomKey });
    }

    requestMatchUpdate(roomKey: string) {
        console.log('requestMatchData: ', { roomKey })
        this.socket?.emit('requestMatchData', { roomKey });
    }

    vote(roomKey: number, userId: string, movieId: number, vote: boolean) {
        this.socket?.emit('vote', { key: roomKey, userId, movieId, vote });
    }

    subscribeToVoteEnded(callback: any) {
        this.socket?.emit('voteEnded', callback);
    }

    subscribeToMatchUpdates(callback: (data: any) => void) {
        console.log('match socket updates');
        this.socket?.on('matchUpdated', callback);
    }

    subscribeToBroadcastMessage(callback: (data: any) => void) {
        console.log('broadcastMessage: ')
        this.socket?.on('broadcastMessage', callback);
    }

    subscribeToBroadcastMovies(callback: <T>(data: T) => void) {
        console.log('broadcast movies work...');
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
        console.log('soket filters update')
        this.socket?.on('filtersUpdated', callback);
    }


    unsubscribeBroadcastMovies() {
        this.socket?.off('broadcastMovies');
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