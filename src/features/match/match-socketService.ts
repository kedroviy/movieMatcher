import { Alert } from 'react-native';
import { addNotification } from 'redux/appSlice';
import { store } from 'redux/configure-store';
import io, { Socket } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
    }
    private socket: Socket | null = null;
    private connectionStatusCallbacks: ((isConnected: boolean) => void)[] = [];
    private lastJoinedRoom: { roomKey: string; userId: string } | null = null;

    /** Fan-out: many subscribers, one `socket.on` each (avoids missed pushes and duplicate listeners). */
    private broadcastMoviesSubscribers = new Set<(data: any) => void>();
    private broadcastMoviesAttached = false;
    private readonly broadcastMoviesPipe = (data: any) => {
        this.broadcastMoviesSubscribers.forEach((cb) => {
            try {
                cb(data);
            } catch (e) {
                console.error('broadcastMovies subscriber error', e);
            }
        });
        store.dispatch(
            addNotification({
                message: (data as any).messageForClient || (data as any).message || 'New movies',
                type: 'success',
                id: Date.now(),
            }),
        );
    };

    private matchUpdatedSubscribers = new Set<(data: any) => void>();
    private matchUpdatedAttached = false;
    private readonly matchUpdatedPipe = (data: any) => {
        this.matchUpdatedSubscribers.forEach((cb) => {
            try {
                cb(data);
            } catch (e) {
                console.error('matchUpdated subscriber error', e);
            }
        });
        store.dispatch(
            addNotification({
                message: (data as any).message || 'New movies',
                type: 'success',
                id: Date.now(),
            }),
        );
    };

    private broadcastMatchSubscribers = new Set<(data: any) => void>();
    private broadcastMatchAttached = false;
    private readonly broadcastMatchPipe = (data: any) => {
        this.broadcastMatchSubscribers.forEach((cb) => {
            try {
                cb(data);
            } catch (e) {
                console.error('broadcastMatchDataUpdated subscriber error', e);
            }
        });
        store.dispatch(
            addNotification({
                message: (data as any).messageForClient,
                type: 'success',
                id: Date.now(),
            }),
        );
    };

    private sendNextMovieSubscribers = new Set<(data: any) => void>();
    private sendNextMovieAttached = false;
    private readonly sendNextMoviePipe = (data: any) => {
        this.sendNextMovieSubscribers.forEach((cb) => {
            try {
                cb(data);
            } catch (e) {
                console.error('sendNextMovieToRoom subscriber error', e);
            }
        });
    };

    private filtersUpdatedSubscribers = new Set<(data: any) => void>();
    private filtersUpdatedAttached = false;
    private readonly filtersUpdatedPipe = (data: any) => {
        this.filtersUpdatedSubscribers.forEach((cb) => {
            try {
                cb(data);
            } catch (e) {
                console.error('filtersUpdated subscriber error', e);
            }
        });
    };

    connect(serverUrl: string): void {
        this.socket = io(serverUrl + '/rooms', {
            reconnection: true,
            transports: ['polling', 'websocket'],
            upgrade: true,
        });

        this.socket.on('connect', () => {
            console.log('Connected to websocket server');
            this.notifyConnectionStatus(true);
            if (this.lastJoinedRoom) {
                this.socket?.emit('joinRoom', this.lastJoinedRoom);
            }
            this.reattachFanOutListeners();
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from websocket server');
            this.notifyConnectionStatus(false);
        });

        this.socket.on('connect_error', (error) => {
            console.log('Connect error', error);
            this.notifyConnectionStatus(false);
        });

        this.socket.on('connect_timeout', (timeout) => {
            console.log('Connection timeout', timeout);
            this.notifyConnectionStatus(false);
        });

        this.reattachFanOutListeners();
    }

    private reattachFanOutListeners(): void {
        this.attachBroadcastMoviesListener();
        this.attachMatchUpdatedListener();
        this.attachBroadcastMatchListener();
        this.attachSendNextMovieListener();
        this.attachFiltersUpdatedListener();
    }

    private notifyConnectionStatus(isConnected: boolean): void {
        store.dispatch(
            addNotification({
                id: Date.now(),
                message: isConnected ? 'Websocket connected successfully' : 'Error occurred',
                type: isConnected ? 'success' : 'error',
            }),
        );
    }

    subscribeToConnectionStatus(callback: (isConnected: boolean) => void): void {
        this.connectionStatusCallbacks.push(callback);
    }

    joinRoom(roomKey: string, userId: string): void {
        this.lastJoinedRoom = { roomKey, userId };
        this.socket?.emit('joinRoom', { roomKey, userId });
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

    /** @returns unsubscribe for this callback only */
    subscribeToMatchUpdates(callback: (data: any) => void): () => void {
        this.matchUpdatedSubscribers.add(callback);
        this.attachMatchUpdatedListener();
        return () => {
            this.matchUpdatedSubscribers.delete(callback);
            if (this.matchUpdatedSubscribers.size === 0) {
                this.detachMatchUpdatedListener();
            }
        };
    }

    subscribeToJoinNewUser(callback: (data: any) => void) {
        this.socket?.emit('Join new user to match', callback);
    }

    subscribeToBroadcastMessage(callback: (data: any) => void) {
        this.socket?.on('broadcastMessage', callback);
    }

    /** @returns unsubscribe for this callback only */
    subscribeToBroadcastMatchUpdate(callback: (data: any) => void): () => void {
        this.broadcastMatchSubscribers.add(callback);
        this.attachBroadcastMatchListener();
        return () => {
            this.broadcastMatchSubscribers.delete(callback);
            if (this.broadcastMatchSubscribers.size === 0) {
                this.detachBroadcastMatchListener();
            }
        };
    }

    private attachBroadcastMatchListener(): void {
        if (!this.socket || this.broadcastMatchSubscribers.size === 0) {
            return;
        }
        this.socket.off('broadcastMatchDataUpdated', this.broadcastMatchPipe);
        this.socket.on('broadcastMatchDataUpdated', this.broadcastMatchPipe);
        this.broadcastMatchAttached = true;
    }

    private detachBroadcastMatchListener(): void {
        if (!this.socket || !this.broadcastMatchAttached) {
            return;
        }
        this.socket.off('broadcastMatchDataUpdated', this.broadcastMatchPipe);
        this.broadcastMatchAttached = false;
    }

    private attachMatchUpdatedListener(): void {
        if (!this.socket || this.matchUpdatedSubscribers.size === 0) {
            return;
        }
        this.socket.off('matchUpdated', this.matchUpdatedPipe);
        this.socket.on('matchUpdated', this.matchUpdatedPipe);
        this.matchUpdatedAttached = true;
    }

    private detachMatchUpdatedListener(): void {
        if (!this.socket || !this.matchUpdatedAttached) {
            return;
        }
        this.socket.off('matchUpdated', this.matchUpdatedPipe);
        this.matchUpdatedAttached = false;
    }

    private attachSendNextMovieListener(): void {
        if (!this.socket || this.sendNextMovieSubscribers.size === 0) {
            return;
        }
        this.socket.off('sendNextMovieToRoom', this.sendNextMoviePipe);
        this.socket.on('sendNextMovieToRoom', this.sendNextMoviePipe);
        this.sendNextMovieAttached = true;
    }

    private detachSendNextMovieListener(): void {
        if (!this.socket || !this.sendNextMovieAttached) {
            return;
        }
        this.socket.off('sendNextMovieToRoom', this.sendNextMoviePipe);
        this.sendNextMovieAttached = false;
    }

    private attachFiltersUpdatedListener(): void {
        if (!this.socket || this.filtersUpdatedSubscribers.size === 0) {
            return;
        }
        this.socket.off('filtersUpdated', this.filtersUpdatedPipe);
        this.socket.on('filtersUpdated', this.filtersUpdatedPipe);
        this.filtersUpdatedAttached = true;
    }

    private detachFiltersUpdatedListener(): void {
        if (!this.socket || !this.filtersUpdatedAttached) {
            return;
        }
        this.socket.off('filtersUpdated', this.filtersUpdatedPipe);
        this.filtersUpdatedAttached = false;
    }

    /** @returns unsubscribe for this callback only */
    subscribeToRequestMatchUpdate(callback: (data: any) => void): () => void {
        this.sendNextMovieSubscribers.add(callback);
        this.attachSendNextMovieListener();
        return () => {
            this.sendNextMovieSubscribers.delete(callback);
            if (this.sendNextMovieSubscribers.size === 0) {
                this.detachSendNextMovieListener();
            }
        };
    }

    /** @returns unsubscribe for this callback only */
    filtersUpdateBroadcast(callback: (data: any) => void): () => void {
        this.filtersUpdatedSubscribers.add(callback);
        this.attachFiltersUpdatedListener();
        return () => {
            this.filtersUpdatedSubscribers.delete(callback);
            if (this.filtersUpdatedSubscribers.size === 0) {
                this.detachFiltersUpdatedListener();
            }
        };
    }

    private attachBroadcastMoviesListener(): void {
        if (!this.socket || this.broadcastMoviesSubscribers.size === 0) {
            return;
        }
        this.socket.off('broadcastMovies', this.broadcastMoviesPipe);
        this.socket.on('broadcastMovies', this.broadcastMoviesPipe);
        this.broadcastMoviesAttached = true;
    }

    private detachBroadcastMoviesListener(): void {
        if (!this.socket || !this.broadcastMoviesAttached) {
            return;
        }
        this.socket.off('broadcastMovies', this.broadcastMoviesPipe);
        this.broadcastMoviesAttached = false;
    }

    /** Returns unsubscribe — call on unmount so other subscribers keep receiving events. */
    subscribeToBroadcastMovies(callback: (data: any) => void): () => void {
        this.broadcastMoviesSubscribers.add(callback);
        this.attachBroadcastMoviesListener();
        return () => {
            this.unsubscribeBroadcastMovies(callback);
        };
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

    unsubscribeToJoinNewUser() {
        this.socket?.off('Join new user to match');
    }

    unsubscribeBroadcastMovies(callback?: (data: any) => void): void {
        if (callback) {
            this.broadcastMoviesSubscribers.delete(callback);
        } else {
            this.broadcastMoviesSubscribers.clear();
        }
        if (this.broadcastMoviesSubscribers.size === 0) {
            this.detachBroadcastMoviesListener();
        }
    }

    /** Clears all broadcastMatchDataUpdated subscribers (prefer per-subscription return from subscribe). */
    unsubscribeToBroadcastMatchUpdate() {
        this.broadcastMatchSubscribers.clear();
        this.detachBroadcastMatchListener();
    }

    /** Clears all matchUpdated subscribers (prefer per-subscription return from subscribe). */
    unsubscribeFromMatchUpdates() {
        this.matchUpdatedSubscribers.clear();
        this.detachMatchUpdatedListener();
    }

    unsubscribeFromMatchEnded() {
        this.socket?.off('voteEnded');
    }

    /** Clears all sendNextMovieToRoom subscribers (prefer per-subscription return from subscribe). */
    unsubscribeFromRequestMatchUpdate() {
        this.sendNextMovieSubscribers.clear();
        this.detachSendNextMovieListener();
    }

    unsubscribeFromRequestMatchResponse() {
        this.socket?.off('broadcastMessage');
        this.socket?.off('startMatchResponse');
    }

    unsubscribeFromConnectionStatus(callback: (isConnected: boolean) => void): void {
        this.connectionStatusCallbacks = this.connectionStatusCallbacks.filter((cb) => cb !== callback);
    }

    disconnect(): void {
        if (this.socket) {
            this.detachBroadcastMoviesListener();
            this.detachMatchUpdatedListener();
            this.detachBroadcastMatchListener();
            this.detachSendNextMovieListener();
            this.detachFiltersUpdatedListener();
            this.socket.disconnect();
            this.socket = null;
            this.lastJoinedRoom = null;
            this.broadcastMoviesSubscribers.clear();
            this.matchUpdatedSubscribers.clear();
            this.broadcastMatchSubscribers.clear();
            this.sendNextMovieSubscribers.clear();
            this.filtersUpdatedSubscribers.clear();
            this.notifyConnectionStatus(false);
        }
    }
}

const socketService = new SocketService();
export default socketService;
