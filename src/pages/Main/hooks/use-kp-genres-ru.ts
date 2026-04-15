import { useEffect, useMemo, useState } from 'react';
import { fetchFiltersRu } from 'features/filters/filters-api';
import { FilterOption } from '../sm.model';

export function useKpGenresRu() {
    const [genres, setGenres] = useState<FilterOption[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        fetchFiltersRu()
            .then((data) => {
                if (cancelled) return;
                const options: FilterOption[] = data.genres.map((g) => ({
                    id: g.slug,
                    label: g.name,
                    kpName: g.name,
                }));
                setGenres(options);
            })
            .catch((e: unknown) => {
                if (cancelled) return;
                setError(e instanceof Error ? e.message : 'Failed to fetch genres');
            })
            .finally(() => {
                if (cancelled) return;
                setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return useMemo(() => ({ genreOptions: genres, loading, error }), [genres, loading, error]);
}
