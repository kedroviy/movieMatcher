import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchFilters } from 'features/filters/filters-api';
import { FiltersLocale, resolveFiltersLocale } from 'features/filters/filters.model';
import { FilterOption } from '../sm.model';
import { sortCountriesByFilmPopularity } from '../utils/sort-countries-by-film-popularity';

type CachedFilters = Readonly<{
    genres: FilterOption[];
    countries: FilterOption[];
    error: string | null;
}>;

const cache = new Map<FiltersLocale, CachedFilters>();
const inflight = new Map<FiltersLocale, Promise<CachedFilters>>();

function mapGenresFromResponse(data: Awaited<ReturnType<typeof fetchFilters>>): FilterOption[] {
    return data.genres.map((g) => ({
        id: g.slug,
        label: g.name,
        kpName: g.kpName,
    }));
}

function mapCountriesFromResponse(data: Awaited<ReturnType<typeof fetchFilters>>): FilterOption[] {
    return data.countries.map((c) => ({
        id: c.slug,
        label: c.name,
        kpName: c.kpName,
    }));
}

async function loadFiltersFromApi(locale: FiltersLocale): Promise<CachedFilters> {
    try {
        const data = await fetchFilters(locale);
        const result: CachedFilters = {
            genres: mapGenresFromResponse(data),
            countries: mapCountriesFromResponse(data),
            error: null,
        };
        cache.set(locale, result);
        return result;
    } catch (e: unknown) {
        const result: CachedFilters = {
            genres: [],
            countries: [],
            error: e instanceof Error ? e.message : 'Failed to fetch filters',
        };
        cache.set(locale, result);
        return result;
    }
}

/** Start loading filters early for the given locale; safe to call multiple times. */
export function prefetchKpGenres(locale: FiltersLocale = resolveFiltersLocale()): Promise<CachedFilters> {
    const cached = cache.get(locale);
    if (cached) {
        return Promise.resolve(cached);
    }

    const pending = inflight.get(locale);
    if (pending) {
        return pending;
    }

    const request = loadFiltersFromApi(locale).finally(() => {
        inflight.delete(locale);
    });
    inflight.set(locale, request);
    return request;
}

/** @deprecated Use prefetchKpGenres(locale) */
export function prefetchKpGenresRu(): Promise<CachedFilters> {
    return prefetchKpGenres('ru');
}

export function useKpGenresRu() {
    const { i18n } = useTranslation();
    const locale = resolveFiltersLocale(i18n.language);
    const cached = cache.get(locale);
    const [genres, setGenres] = useState<FilterOption[]>(cached?.genres ?? []);
    const [countries, setCountries] = useState<FilterOption[]>(cached?.countries ?? []);
    const [loading, setLoading] = useState<boolean>(!cached);
    const [error, setError] = useState<string | null>(cached?.error ?? null);

    useEffect(() => {
        let cancelled = false;
        const localeCache = cache.get(locale);

        if (localeCache) {
            setGenres(localeCache.genres);
            setCountries(localeCache.countries);
            setError(localeCache.error);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        prefetchKpGenres(locale)
            .then((result) => {
                if (cancelled) return;
                setGenres(result.genres);
                setCountries(result.countries);
                setError(result.error);
            })
            .finally(() => {
                if (cancelled) return;
                setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [locale]);

    const localizeSelectedOptions = useCallback(
        (items: FilterOption[], options: FilterOption[]) => {
            const byId = new Map(options.map((option) => [String(option.id), option]));
            return items.map((item) => {
                const match = byId.get(String(item.id));
                if (!match) {
                    return item;
                }
                return {
                    ...item,
                    label: match.label,
                    kpName: match.kpName ?? item.kpName,
                };
            });
        },
        [],
    );

    const localizeCountries = useCallback(
        (items: FilterOption[]) => localizeSelectedOptions(items, countries),
        [countries, localizeSelectedOptions],
    );

    const countryOptions = useMemo(
        () => sortCountriesByFilmPopularity(countries, locale),
        [countries, locale],
    );

    return useMemo(
        () => ({
            genreOptions: genres,
            countryOptions,
            loading,
            error,
            locale,
            localizeCountries,
        }),
        [genres, countryOptions, loading, error, locale, localizeCountries],
    );
}
