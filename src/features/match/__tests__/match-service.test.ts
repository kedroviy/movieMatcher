import { createApi } from '../match-api';
import {
    createRoomService,
    joinRoomService,
    leaveRoomService,
    doesUserHaveRoomService,
    startMatchService,
    getMovieData,
    postLikeMovie,
    updateUserStatus,
    getUserStatusByUserId,
    checkStatus,
    getMatchData,
} from '../match-service';
import { MatchUserStatusEnum } from '../match.model';


jest.mock('../match-api', () => ({
    createApi: jest.fn(),
}));

describe('Match Service', () => {
    const mockApi = {
        post: jest.fn(),
        get: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
    };

    beforeEach(() => {
        (createApi as jest.Mock).mockResolvedValue(mockApi);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('createRoomService should create a room', async () => {
        const mockResponse = {
            ok: true,
            data: { id: 1 },
        };
        mockApi.post.mockResolvedValueOnce(mockResponse);

        const result = await createRoomService(1);
        expect(mockApi.post).toHaveBeenCalledWith('/rooms/create', { userId: 1 });
        expect(result).toEqual(mockResponse.data);
    });

    it('joinRoomService should join a room', async () => {
        const mockResponse = { ok: true, data: {} };
        mockApi.post.mockResolvedValueOnce(mockResponse);

        const result = await joinRoomService('roomKey', 1);
        expect(mockApi.post).toHaveBeenCalledWith('/rooms/join/roomKey', { userId: 1 });
        expect(result).toEqual(mockResponse.data);
    });

    it('leaveRoomService should leave a room', async () => {
        const mockResponse = { ok: true, data: {} };
        mockApi.post.mockResolvedValueOnce(mockResponse);

        const result = await leaveRoomService(1, 1);
        expect(mockApi.post).toHaveBeenCalledWith('/rooms/leave/1', { userId: 1 });
        expect(result).toEqual(mockResponse.data);
    });

    it('doesUserHaveRoomService should check if user has a room', async () => {
        const mockResponse = { ok: true, data: { room: {} } };
        mockApi.get.mockResolvedValueOnce(mockResponse);

        const result = await doesUserHaveRoomService(1);
        expect(mockApi.get).toHaveBeenCalledWith('/match/1');
        expect(result).toEqual(mockResponse.data);
    });

    it('startMatchService should start a match', async () => {
        const mockResponse = { ok: true, data: {} };
        mockApi.post.mockResolvedValueOnce(mockResponse);

        const result = await startMatchService('roomKey');
        expect(mockApi.post).toHaveBeenCalledWith('/rooms/roomKey/start-match');
        expect(result).toEqual(mockResponse);
    });

    it('getMovieData should fetch movie data', async () => {
        const mockResponse = { ok: true, data: {} };
        mockApi.get.mockResolvedValueOnce(mockResponse);

        const result = await getMovieData('roomKey');
        expect(mockApi.get).toHaveBeenCalledWith('/rooms/roomKey/get-movies');
        expect(result).toEqual(mockResponse);
    });

    it('postLikeMovie should post a movie like', async () => {
        const mockResponse = { status: 201, data: {} };
        mockApi.post.mockResolvedValueOnce(mockResponse);

        const result = await postLikeMovie({ movieId: 1, roomKey: 'roomKey', userId: 1 });
        expect(mockApi.post).toHaveBeenCalledWith('/match/like', { movieId: 1, roomKey: 'roomKey', userId: 1 });
        expect(result).toEqual(mockResponse);
    });

    it('updateUserStatus should update user status', async () => {
        const mockResponse = { status: 200, data: {} };
        mockApi.patch.mockResolvedValueOnce(mockResponse);

        const result = await updateUserStatus(
            { userId: 1, roomKey: 'roomKey', userStatus: MatchUserStatusEnum.ACTIVE }
        );
        expect(mockApi.patch).toHaveBeenCalledWith(
            '/match/user-status',
            { userId: 1, roomKey: 'roomKey', userStatus: MatchUserStatusEnum.ACTIVE }
        );
        expect(result).toEqual(mockResponse);
    });

    it('getUserStatusByUserId should fetch user status by userId', async () => {
        const mockResponse = { status: 200, data: { userId: 1, userStatus: MatchUserStatusEnum.ACTIVE } };
        mockApi.get.mockResolvedValueOnce(mockResponse);

        const result = await getUserStatusByUserId('roomKey', 1);
        expect(mockApi.get).toHaveBeenCalledWith('/match/roomKey/user-status/1');
        expect(result).toEqual(mockResponse.data);
    });

    it('checkStatus should check user status', async () => {
        const mockResponse = { ok: true };
        mockApi.post.mockResolvedValueOnce(mockResponse);

        await checkStatus('roomKey', 1);
        expect(mockApi.post).toHaveBeenCalledWith('/match/check-status/roomKey', { userId: 1 });
    });

    it('getMatchData should fetch match data', async () => {
        const mockResponse = { ok: true, data: {} };
        mockApi.get.mockResolvedValueOnce(mockResponse);

        const result = await getMatchData('roomKey');
        expect(mockApi.get).toHaveBeenCalledWith('/match/specific-key-info/roomKey');
        expect(result).toEqual(mockResponse);
    });
});
