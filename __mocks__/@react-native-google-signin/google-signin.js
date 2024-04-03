export const GoogleSignin = {

    configure: jest.fn(),
    signIn: jest.fn(() => Promise.resolve({
        user: {
            email: 'test@example.com',
            id: '123',
            name: 'Test User',
        },
    })),
};