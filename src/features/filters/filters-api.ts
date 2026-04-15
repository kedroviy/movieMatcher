import { create } from 'apisauce';
import { API } from 'shared';
import { FiltersResponse } from './filters.model';

export async function fetchFiltersRu(): Promise<FiltersResponse> {
    const api = create({
        baseURL: API.BASE_URL,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    const response = await api.get<FiltersResponse>('/filters', { locale: 'ru' });
    if (!response.ok || !response.data) {
        throw new Error('Failed to fetch filters');
    }
    return response.data;
}
