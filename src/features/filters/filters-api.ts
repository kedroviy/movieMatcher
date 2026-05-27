import { create } from 'apisauce';
import { API } from 'shared';
import { FiltersLocale, FiltersResponse, resolveFiltersLocale } from './filters.model';

export { resolveFiltersLocale };

export async function fetchFilters(locale: FiltersLocale): Promise<FiltersResponse> {
    const api = create({
        baseURL: API.BASE_URL,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });

    const response = await api.get<FiltersResponse>('/filters', { locale });
    if (!response.ok || !response.data) {
        throw new Error('Failed to fetch filters');
    }
    return response.data;
}

/** @deprecated Use fetchFilters(locale) */
export async function fetchFiltersRu(): Promise<FiltersResponse> {
    return fetchFilters('ru');
}
