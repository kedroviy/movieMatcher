import * as Keychain from 'react-native-keychain';
import { create } from 'apisauce';
import { createApi } from '../match-api';

jest.mock('react-native-keychain');
jest.mock('apisauce', () => ({
    create: jest.fn(),
}));

describe('createApi', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create an API instance with the token when credentials are available', async () => {
        const mockToken = 'mocked-token';
        const mockCredentials = { username: 'user', password: mockToken };

        (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(mockCredentials);

        await createApi();

        expect(Keychain.getGenericPassword).toHaveBeenCalledWith({ service: 'token_guard' });
        expect(create).toHaveBeenCalledWith({
            baseURL: "https://movie-match-x5ue.onrender.com",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mockToken}`,
            },
        });
    });

    it('should create an API instance without the token when no credentials are available', async () => {
        (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(null);

        await createApi();

        expect(Keychain.getGenericPassword).toHaveBeenCalledWith({ service: 'token_guard' });
        expect(create).toHaveBeenCalledWith({
            baseURL: "https://movie-match-x5ue.onrender.com",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: undefined,
            },
        });
    });

    it('should create an API instance without the token when Keychain.getGenericPassword fails', async () => {
        (Keychain.getGenericPassword as jest.Mock).mockRejectedValue(new Error('Failed to get credentials'));

        await createApi();

        expect(Keychain.getGenericPassword).toHaveBeenCalledWith({ service: 'token_guard' });
        expect(create).toHaveBeenCalledWith({
            baseURL: "https://movie-match-x5ue.onrender.com",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: undefined,
            },
        });
    });
});
