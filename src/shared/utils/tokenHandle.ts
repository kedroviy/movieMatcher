import * as Keychain from 'react-native-keychain';


export const saveToken = async (token: string) => {
    await Keychain.setGenericPassword('token', token, { service: 'token_guard' });
}

export const getToken = async () => {
    try {
        const credentials = await Keychain.getGenericPassword({ service: 'token_guard' });
        if (credentials) {
            return credentials.password;
        }
        return null;
    } catch (error) {
        console.error("Не удалось извлечь токен:", error);
        return null;
    }
}

export const removeToken = async () => {
    await Keychain.resetGenericPassword({ service: 'token_guard' });
}
