import io, { Socket } from "socket.io-client";

class SocketService {
    private socket: Socket | null = null;

    connect(serverUrl: string): void {
        this.socket = io(serverUrl, {
            transports: ['websocket'],
        });
        this.socket.on("connect", () => console.log("Connected to websocket server"));
        this.socket.on("connect_error", (error) => console.log("Connect error", error));
        this.socket.on("connect_timeout", (timeout) => console.log("Connection timeout", timeout));
    }

    joinRoom(roomKey: string, userId: string): void {
        if (!this.socket) {
            console.log("Socket not initialized");
            return;
        }
        console.log(`Attempting to join room: ${roomKey} with user ID: ${userId}`);
        this.socket.emit("roomUpdate", { key: roomKey, userId });
    }

    subscribeToRoomUpdates(callback: (data: any) => void): void {
        if (!this.socket) return;
        this.socket.emit("join", callback);
    }

    subscribeToMatchUpdates(callback: (data: any) => void): void {
        if (!this.socket) return;
        this.socket.on("matchUpdate", callback);
    }

    unsubscribeFromRoomUpdates(): void {
        if (!this.socket) return;
        this.socket.off("roomUpdate");
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
