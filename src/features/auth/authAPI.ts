import { create } from 'apisauce'

type IUserFields = {
    email: string;
    password: string;
}

type ILoginUserRespose = {
    token: string;
}

const api = create({
    baseURL: 'https://movie-match-v435.onrender.com',
    headers: { Accept: 'application/vnd.github.v3+json' },
})

export function sendAuthCodeToServer(authCode: string) {
    api
        .post('/auth/google', { code: authCode })
        .then((response) => {
            if (response.ok) {
                console.log('Код успешно отправлен и обработан на сервере');
                console.log(response)
                return response.data;
            } else {
                console.error('Произошла ошибка при отправке кода');
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

export const loginUser = async (body: IUserFields) => {
    try {
        const response = await api.post<ILoginUserRespose>(`/auth/login`, body);
        if (response.ok && response.data) {
            return { success: true, token: response.data.token };
        } else {
            return { success: false, error: response.problem || 'Ошибка аутентификации' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Ошибка сети' };
    }
}

