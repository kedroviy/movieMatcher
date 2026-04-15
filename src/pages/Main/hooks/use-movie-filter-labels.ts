import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { FILTERS_DATA } from '../constants';
import { FilterOption } from '../sm.model';
import { KINOPOISK_COUNTRY_BY_ID, KINOPOISK_GENRE_BY_ID } from '../sm-kinopoisk-filter-values';

function asNumberId(id: string | number): number | null {
    if (typeof id === 'number' && Number.isFinite(id)) return id;
    const n = Number(id);
    return Number.isFinite(n) ? n : null;
}

export function useMovieFilterLabels() {
    const { t, i18n } = useTranslation();

    const countryOptions = useMemo<FilterOption[]>(
        () =>
            FILTERS_DATA.country.options.map((o) => ({
                id: o.id,
                label: t(`movie_filters.countries.${o.id}`),
                kpName: KINOPOISK_COUNTRY_BY_ID[o.id],
            })),
        [t, i18n.language],
    );

    const genreOptions = useMemo<FilterOption[]>(
        () =>
            FILTERS_DATA.genre.options.map((o) => ({
                id: o.id,
                label: t(`movie_filters.genres.${o.id}`),
                kpName: KINOPOISK_GENRE_BY_ID[o.id],
            })),
        [t, i18n.language],
    );

    const localizeCountries = useCallback(
        (items: FilterOption[]) =>
            items.map((c) => ({
                ...c,
                label: t(`movie_filters.countries.${c.id}`),
                kpName: (() => {
                    if (c.kpName) return c.kpName;
                    const id = asNumberId(c.id);
                    return id != null ? KINOPOISK_COUNTRY_BY_ID[id] : undefined;
                })(),
            })),
        [t, i18n.language],
    );

    const localizeGenres = useCallback(
        (items: FilterOption[]) =>
            items.map((g) => ({
                ...g,
                label: t(`movie_filters.genres.${g.id}`),
                kpName: (() => {
                    if (g.kpName) return g.kpName;
                    const id = asNumberId(g.id);
                    return id != null ? KINOPOISK_GENRE_BY_ID[id] : undefined;
                })(),
            })),
        [t, i18n.language],
    );

    return { countryOptions, genreOptions, localizeCountries, localizeGenres };
}
