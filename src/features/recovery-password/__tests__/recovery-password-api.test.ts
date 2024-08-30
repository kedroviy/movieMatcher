
import { create } from 'apisauce';
import { sendEmailForRecoveryAPI, sendRecoveryCodeAPI, sendRecoveryNewPasswordAPI } from 'features';

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

describe('API Functions', () => {
    describe('sendEmailForRecoveryAPI', () => {
        it('should return success when the response is successful', async () => {
            const mockResponse = {
                ok: true,
                data: { success: 'Email sent' },
            };
            mockPost.mockResolvedValueOnce(mockResponse);

            const result = await sendEmailForRecoveryAPI('test@example.com');
            expect(result).toEqual({ success: true });
        });

        it('should return failure when the response is unsuccessful', async () => {
            const mockResponse = {
                ok: false,
            };
            mockPost.mockResolvedValueOnce(mockResponse);

            const result = await sendEmailForRecoveryAPI('test@example.com');
            expect(result).toEqual({ success: false });
        });

        it('should return network error when an exception is thrown', async () => {
            mockPost.mockRejectedValueOnce(new Error('Network Error'));

            const result = await sendEmailForRecoveryAPI('test@example.com');
            expect(result).toEqual({ success: false, error: 'Ошибка сети' });
        });
    });

    describe('sendRecoveryCodeAPI', () => {
        it('should return success when the response is successful', async () => {
            const mockResponse = {
                ok: true,
                data: { success: 'Code verified' },
            };
            mockPost.mockResolvedValueOnce(mockResponse);

            const result = await sendRecoveryCodeAPI({ email: 'test@example.com', code: '123456' });
            expect(result).toEqual({ success: true });
        });

        it('should return failure when the response is unsuccessful', async () => {
            const mockResponse = {
                ok: false,
            };
            mockPost.mockResolvedValueOnce(mockResponse);

            const result = await sendRecoveryCodeAPI({ email: 'test@example.com', code: '123456' });
            expect(result).toEqual({ success: false });
        });

        it('should return network error when an exception is thrown', async () => {
            mockPost.mockRejectedValueOnce(new Error('Network Error'));

            const result = await sendRecoveryCodeAPI({ email: 'test@example.com', code: '123456' });
            expect(result).toEqual({ success: false, error: 'Ошибка сети' });
        });
    });

    describe('sendRecoveryNewPasswordAPI', () => {
        it('should return success when the response is successful', async () => {
            const mockResponse = {
                ok: true,
                data: { success: 'Password updated' },
            };
            mockPost.mockResolvedValueOnce(mockResponse);

            const result = await sendRecoveryNewPasswordAPI({ email: 'test@example.com', password: 'newpassword' });
            expect(result).toEqual({ success: true });
        });

        it('should return failure when the response is unsuccessful', async () => {
            const mockResponse = {
                ok: false,
            };
            mockPost.mockResolvedValueOnce(mockResponse);

            const result = await sendRecoveryNewPasswordAPI({ email: 'test@example.com', password: 'newpassword' });
            expect(result).toEqual({ success: false });
        });

        it('should return network error when an exception is thrown', async () => {
            mockPost.mockRejectedValueOnce(new Error('Network Error'));

            const result = await sendRecoveryNewPasswordAPI({ email: 'test@example.com', password: 'newpassword' });
            expect(result).toEqual({ success: false, error: 'Ошибка сети' });
        });
    });
});