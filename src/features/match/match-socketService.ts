import io, { Socket } from "socket.io-client";

class SocketService {
    constructor() {
        this.socket = null;
    }
    private socket: Socket | null = null;

    connect(serverUrl: string): void {
        this.socket = io(serverUrl + "/rooms", {
            transports: ['websocket', 'pooling'],
        });
        this.socket.on("connect", () => console.log("Connected to websocket server"));
        this.socket.on("connect_error", (error) => console.log("Connect error", error));
        this.socket.on("connect_timeout", (timeout) => console.log("Connection timeout", timeout));
    }

    joinRoom(roomKey: string, userId: string): void {
        console.log(`Attempting to join room: ${roomKey} with user ID: ${userId}`);
        this.socket?.emit("joinRoom", { roomKey, userId });
    }

    subscribeToMatchUpdates(callback: (data: any) => void) {
        console.log('match socket updates');
        this.socket?.on('matchUpdated', callback);
    }

    subscribeToBroadcastMessage(callback: (data: any) => void) {
        this.socket?.on('broadcastMessage', callback);
    }
    // subscribeToMatchUpdates(eventName: any, callback: any) {
    //     if (!this.socket) return;
    //     this.socket.on(eventName, callback);
    // }

    filtersUpdateBroadcast(callback: (data: any) => void): void {
        console.log('soket filters update')
        this.socket?.on('filtersUpdated', callback);
    }

    requestMatchUpdate(roomKey: string) {
        console.log('requestMatchData: ', { roomKey })
        this.socket?.emit('requestMatchData', { roomKey });
    }

    unsubscribeFromMatchUpdates() {
        this.socket?.off('matchUpdated');
    }

    unsubscribeFromRequestMatchUpdate() {
        this.socket?.off('requestMatchData')
    };

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

const socketService = new SocketService();
export default socketService;