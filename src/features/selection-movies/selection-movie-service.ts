import { create } from 'apisauce';
import { SMApiResponse } from './selection-movies.model';

const BASE_URL = 'https://api.kinopoisk.dev/v1.4/movie?limit=10';
const API_KEY = 'XYNPWWX-0VZ4EF2-HS2W1FV-JNA4H0J';

const api = create({
    baseURL: BASE_URL,
    headers: { 'X-API-KEY': API_KEY },
});

function isSMApiResponse(data: any): data is SMApiResponse {
    return data && 'docs' in data && 'total' in data && 'limit' in data && 'page' in data && 'pages' in data;
}

export const fetchMoviesApi = async (url: string): Promise<SMApiResponse> => {
    const response = await api.get(url);
    if (!response.ok || !response.data) {
        throw new Error(response.problem || 'Unknown API error');
    }

    if (!isSMApiResponse(response.data)) {
        throw new Error("Received data does not conform to SMApiResponse");
    }

    return response.data;
};