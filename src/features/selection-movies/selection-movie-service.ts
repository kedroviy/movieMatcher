import { create } from 'apisauce';
import { SMApiResponse } from './selection-movies.model';

const BASE_URL = 'https://api.kinopoisk.dev/v1.4/movie';
const API_KEY = 'Z6ZNZN2-1A24591-H2Q6R76-KJ9C676';

const api = create({
    baseURL: BASE_URL,
    headers: { 'X-API-KEY': API_KEY },
});

function isSMApiResponse(data: any): data is SMApiResponse {
    return data && 'docs' in data && 'total' in data && 'limit' in data && 'page' in data && 'pages' in data;
}

export const fetchMoviesApi = async (pathSuffix: string): Promise<SMApiResponse> => {
    const response = await api.get(`${pathSuffix}`);
    if (!response.ok || !response.data) {
        throw new Error(response.problem || 'Unknown API error');
    }

    if (!isSMApiResponse(response.data)) {
        throw new Error("Received data does not conform to SMApiResponse");
    }

    return response.data;
};

export const fetchMovieDetails = async (movieId: number): Promise<any> => {
    const response = await api.get(`/${movieId}`);

    if (response.ok && response.data) {
        return response.data;
    } else {
        throw new Error(response.problem || 'Unknown API error');
    }
};
