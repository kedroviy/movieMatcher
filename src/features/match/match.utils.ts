import { ApiResponse as ApiSauceResponse } from 'apisauce';

export function handleApiResponse<T>(response: ApiSauceResponse<T>): T {
    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status} and problem ${response.problem}`);
    }

    if (!response.data) {
        throw new Error('API returned no data');
    }

    return response.data;
}