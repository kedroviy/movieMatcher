import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { FILTERS_DATA } from '../constants';
import { FilterOption } from '../sm.model';
import { KINOPOISK_COUNTRY_BY_ID, KINOPOISK_GENRE_BY_ID } from '../sm-kinopoisk-filter-values';

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
                kpName: c.kpName ?? KINOPOISK_COUNTRY_BY_ID[c.id],
            })),
        [t, i18n.language],
    );

    const localizeGenres = useCallback(
        (items: FilterOption[]) =>
            items.map((g) => ({
                ...g,
                label: t(`movie_filters.genres.${g.id}`),
                kpName: g.kpName ?? KINOPOISK_GENRE_BY_ID[g.id],
            })),
        [t, i18n.language],
    );

    return { countryOptions, genreOptions, localizeCountries, localizeGenres };
}
