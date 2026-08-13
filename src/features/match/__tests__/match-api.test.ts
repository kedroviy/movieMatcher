import * as Keychain from 'react-native-keychain';
import { create } from 'apisauce';
import { createApi } from '../match-api';

jest.mock('react-native-keychain');
jest.mock('apisauce', () => ({
    create: jest.fn(),
}));

const createValidAccessToken = (expiresInSeconds: number): string => {
    const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(
        JSON.stringify({
            id: 1,
            email: 'test@example.com',
            exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
        }),
    ).toString('base64url');
    return `${header}.${payload}.sig`;
};

describe('createApi', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create an API instance with the token when credentials are available', async () => {
        const mockToken = createValidAccessToken(3600);
        const mockCredentials = { username: 'user', password: mockToken };
        const addMonitor = jest.fn();

        (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(mockCredentials);
        (create as jest.Mock).mockReturnValue({ addMonitor });

        await createApi();

        expect(Keychain.getGenericPassword).toHaveBeenCalledWith({ service: 'token_guard' });
        expect(create).toHaveBeenCalledWith({
            baseURL: 'https://movie-api.moviematch.space',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mockToken}`,
            },
        });
        expect(addMonitor).toHaveBeenCalled();
    });

    it('should create an API instance without the token when no credentials are available', async () => {
        const addMonitor = jest.fn();
        (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(null);
        (create as jest.Mock).mockReturnValue({ addMonitor });

        await createApi();

        expect(Keychain.getGenericPassword).toHaveBeenCalledWith({ service: 'token_guard' });
        expect(create).toHaveBeenCalledWith({
            baseURL: 'https://movie-api.moviematch.space',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
    });

    it('should create an API instance without the token when Keychain.getGenericPassword fails', async () => {
        const addMonitor = jest.fn();
        (Keychain.getGenericPassword as jest.Mock).mockRejectedValue(new Error('Failed to get credentials'));
        (create as jest.Mock).mockReturnValue({ addMonitor });

        await createApi();

        expect(Keychain.getGenericPassword).toHaveBeenCalledWith({ service: 'token_guard' });
        expect(create).toHaveBeenCalledWith({
            baseURL: 'https://movie-api.moviematch.space',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
    });
});
