
import { create } from 'apisauce';
import { loginUser, registrationUser, sendGoogleCodeToServer } from '../authAPI';
import { API } from 'shared';

jest.mock('apisauce', () => {
    const mockPost = jest.fn();
    return {
        create: jest.fn(() => ({
            post: mockPost,
        })),
    };
});

const mockPost = create({ baseURL: 'https://movie-match-x5ue.onrender.com' })
    .post as jest.MockedFunction<typeof create>['prototype']['post'];

describe('sendGoogleCodeToServer', () => {
    it('should return success and token when the response is successful', async () => {
        const mockResponse = {
            ok: true,
            data: { token: 'mockToken' },
        };
        mockPost.mockResolvedValueOnce(mockResponse);

        const result = await sendGoogleCodeToServer('mockIdToken');
        expect(mockPost).toHaveBeenCalledWith('/auth/verify-id-token', expect.any(String), expect.any(Object));
        console.log('Result:', result);
        expect(result).toEqual({ success: true, token: 'mockToken' });
    });


    it('should return error when the response is unsuccessful', async () => {
        const mockResponse = {
            ok: false,
            problem: 'Ошибка сети',
        };
        mockPost.mockResolvedValueOnce(mockResponse);

        const result = await sendGoogleCodeToServer('mockIdToken');
        expect(result).toEqual({ success: false, error: 'Ошибка сети' });
    });

    it('should return network error when an exception is thrown', async () => {
        mockPost.mockRejectedValueOnce(new Error('Network Error'));

        const result = await sendGoogleCodeToServer('mockIdToken');
        expect(result).toEqual({ success: false, error: 'Ошибка сети' });
    });
});

describe('loginUser', () => {
    it('should return success and token when login is successful', async () => {
        const mockResponse = {
            ok: true,
            data: { token: 'mockToken' },
        };
        mockPost.mockResolvedValueOnce(mockResponse);

        const result = await loginUser({ email: 'test@example.com', password: 'password123' });
        expect(mockPost).toHaveBeenCalledWith(API.LOGIN, expect.any(Object));
        expect(result).toEqual({ success: true, token: 'mockToken' });
    });

    it('should return error when login fails', async () => {
        const mockResponse = {
            ok: false,
            problem: 'Ошибка сети',
        };
        mockPost.mockResolvedValueOnce(mockResponse);

        const result = await loginUser({ email: 'test@example.com', password: 'password123' });
        expect(result).toEqual({ success: false, error: 'Ошибка сети' });
    });

    it('should return network error when an exception is thrown', async () => {
        mockPost.mockRejectedValueOnce(new Error('Network Error'));

        const result = await loginUser({ email: 'test@example.com', password: 'password123' });
        expect(result).toEqual({ success: false, error: 'Ошибка сети' });
    });
});

describe('registrationUser', () => {
    it('should return success and message when registration is successful', async () => {
        const mockResponse = {
            ok: true,
            data: { message: 'Registration successful' },
        };
        mockPost.mockResolvedValueOnce(mockResponse);

        const result = await registrationUser({ email: 'test@example.com', password: 'password123' });
        expect(result).toEqual({ success: true, message: 'Registration successful' });
    });

    it('should return error when registration fails', async () => {
        const mockResponse = {
            ok: false,
            problem: 'Ошибка сети',
        };
        mockPost.mockResolvedValueOnce(mockResponse);

        const result = await registrationUser({ email: 'test@example.com', password: 'password123' });
        expect(result).toEqual({ success: false, error: 'Ошибка сети' });
    });

    it('should return network error when an exception is thrown', async () => {
        mockPost.mockRejectedValueOnce(new Error('Network Error'));

        const result = await registrationUser({ email: 'test@example.com', password: 'password123' });
        expect(result).toEqual({ success: false, error: 'Ошибка сети' });
    });
});

