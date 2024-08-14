import { store } from "redux/configure-store";
import io from "socket.io-client";

import { addNotification } from "redux/appSlice";
import socketService from "../match-socketService";

jest.mock("socket.io-client");
jest.mock("redux/configure-store", () => ({
    store: {
        dispatch: jest.fn(),
    },
}));
jest.mock("redux/appSlice", () => ({
    addNotification: jest.fn(),
}));

describe('SocketService', () => {
    let mockSocket: any;

    beforeEach(() => {
        mockSocket = {
            on: jest.fn(),
            emit: jest.fn(),
            disconnect: jest.fn(),
            off: jest.fn(),
        };
        (io as jest.Mock).mockReturnValue(mockSocket);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should connect to the server and set up listeners', () => {
        socketService.connect("http://localhost");

        expect(io).toHaveBeenCalledWith("http://localhost/rooms", {
            reconnection: true,
            transports: ['websocket', 'polling'],
            rememberUpgrade: true,
        });

        expect(mockSocket.on).toHaveBeenCalledWith("connect", expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith("disconnect", expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith("connect_error", expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith("connect_timeout", expect.any(Function));
    });

    it('should notify connection status via Redux', () => {
        socketService.connect("http://localhost");

        mockSocket.on.mock.calls[0][1]();

        expect(store.dispatch).toHaveBeenCalledWith(addNotification({
            id: expect.any(Number),
            message: 'Websocket connected successfully',
            type: 'success',
        }));

        mockSocket.on.mock.calls[1][1]();

        expect(store.dispatch).toHaveBeenCalledWith(addNotification({
            id: expect.any(Number),
            message: 'Error occurred',
            type: 'error',
        }));
    });

    it('should join a room', () => {
        socketService.connect("http://localhost");
        socketService.joinRoom('roomKey', 'userId');

        expect(mockSocket.emit).toHaveBeenCalledWith("joinRoom", { roomKey: 'roomKey', userId: 'userId' });
    });

    it('should subscribe to voteEnded', () => {
        const callback = jest.fn();
        socketService.connect("http://localhost");
        socketService.subscribeToVoteEnded(callback);

        expect(mockSocket.emit).toHaveBeenCalledWith('voteEnded', callback);
    });

    it('should subscribe to match updates and dispatch notification', () => {
        const callback = jest.fn();
        const data = { message: "New match data" };

        socketService.connect("http://localhost");
        socketService.subscribeToMatchUpdates(callback);

        mockSocket.on.mock.calls.find((call: string[]) => call[0] === 'matchUpdated')[1](data);

        expect(callback).toHaveBeenCalledWith(data);
        expect(store.dispatch).toHaveBeenCalledWith(addNotification({
            message: data.message || "New movies",
            type: 'success',
            id: expect.any(Number),
        }));
    });

    it('should subscribe to broadcast movies and dispatch notification', () => {
        const callback = jest.fn();
        const data = { message: "New movies" };

        socketService.connect("http://localhost");
        socketService.subscribeToBroadcastMovies(callback);

        mockSocket.on.mock.calls.find((call: string[]) => call[0] === 'broadcastMovies')[1](data);

        expect(callback).toHaveBeenCalledWith(data);
        expect(store.dispatch).toHaveBeenCalledWith(addNotification({
            message: data.message || "New movies",
            type: 'success',
            id: expect.any(Number),
        }));
    });

    it('should disconnect from the server', () => {
        socketService.connect("http://localhost");
        socketService.disconnect();

        expect(mockSocket.disconnect).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith(addNotification({
            id: expect.any(Number),
            message: 'Error occurred',
            type: 'error',
        }));
    });
});
