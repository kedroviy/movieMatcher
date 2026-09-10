import { FilterOption, ISMFormData, initialState, SelectMovieType } from '../sm.model';

export type RoomFilterOptionSources = {
    readonly genres: readonly FilterOption[];
    readonly countries: readonly FilterOption[];
    readonly years: readonly FilterOption[];
};

function asValueArray(value: unknown): unknown[] {
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === 'string' && value.trim()) {
        return [value];
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
        return [value];
    }
    return [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function optionId(value: unknown): string | null {
    if (!isRecord(value) || value.id == null) {
        return null;
    }
    const text = String(value.id).trim();
    return text || null;
}

function primaryOptionIdentity(value: unknown): string | null {
    if (typeof value === 'string' || typeof value === 'number') {
        const text = String(value).trim();
        return text || null;
    }
    if (!isRecord(value)) {
        return null;
    }
    const identity = value.kpName ?? value.label ?? value.name ?? (value.id != null ? String(value.id) : null);
    const text = identity != null ? String(identity).trim() : '';
    return text || null;
}

function flattenLeafOptions(options: readonly FilterOption[]): FilterOption[] {
    return options.flatMap((option) => (option.children?.length ? flattenLeafOptions(option.children) : [option]));
}

function flattenOptionTree(options: readonly FilterOption[]): FilterOption[] {
    return options.flatMap((option) =>
        option.children?.length ? [option, ...flattenOptionTree(option.children)] : [option],
    );
}

function optionCandidates(option: FilterOption): string[] {
    return [option.kpName, option.label, option.name, option.id != null ? String(option.id) : null]
        .filter((value): value is string => Boolean(value))
        .map((value) => value.toLocaleLowerCase());
}

function matchOptions(options: readonly FilterOption[], values: unknown): FilterOption[] {
    const items = asValueArray(values);
    if (!items.length) {
        return [];
    }
    const tree = flattenOptionTree(options);
    const leaves = flattenLeafOptions(options);
    const matched: FilterOption[] = [];
    for (const item of items) {
        const id = optionId(item);
        if (id != null) {
            const byId = tree.find((option) => String(option.id) === id);
            if (byId) {
                matched.push(byId);
                continue;
            }
        }
        const name = primaryOptionIdentity(item);
        if (!name) {
            continue;
        }
        const normalized = name.toLocaleLowerCase();
        const byName =
            leaves.find((option) => optionCandidates(option).includes(normalized)) ??
            tree.find((option) => optionCandidates(option).includes(normalized));
        if (byName) {
            matched.push(byName);
            continue;
        }
        matched.push({
            id: id ?? name,
            label: name,
            kpName: name,
        });
    }
    return matched;
}

function parseRating(value: unknown): [number, number] {
    const [defaultMin, defaultMax] = initialState.selectedRating;
    if (Array.isArray(value) && value.length === 2) {
        const min = Number(value[0]);
        const max = Number(value[1]);
        if (Number.isFinite(min) && Number.isFinite(max)) {
            return [Math.min(min, max), Math.max(min, max)];
        }
    }
    if (typeof value === 'string' && value.includes('-')) {
        const [rawMin, rawMax] = value.split('-');
        const min = Number(rawMin);
        const max = Number(rawMax);
        if (Number.isFinite(min) && Number.isFinite(max)) {
            return [Math.min(min, max), Math.max(min, max)];
        }
    }
    return [defaultMin, defaultMax];
}

function isContractPayload(payload: Record<string, unknown>): boolean {
    return (
        'selectedGenres' in payload ||
        'excludeGenre' in payload ||
        'selectedCountries' in payload ||
        'selectedYears' in payload ||
        'selectedRating' in payload
    );
}

/**
 * Restores lobby filter form state from stored room JSON (web or mobile payload).
 */
export function fromRoomFiltersPayload(
    payload: ISMFormData | Record<string, unknown> | null | undefined,
    sources: RoomFilterOptionSources,
): SelectMovieType<FilterOption> {
    if (!payload || typeof payload !== 'object') {
        return { ...initialState, selectedRating: [...initialState.selectedRating] };
    }
    const data = payload as Record<string, unknown>;
    if (isContractPayload(data)) {
        return {
            selectedGenres: matchOptions(sources.genres, data.selectedGenres),
            excludeGenre: matchOptions(sources.genres, data.excludeGenre),
            selectedCountries: matchOptions(sources.countries, data.selectedCountries),
            selectedYears: matchOptions(sources.years, data.selectedYears),
            selectedRating: parseRating(data.selectedRating),
            genres: [],
        };
    }
    return {
        selectedGenres: matchOptions(sources.genres, data.genre),
        excludeGenre: matchOptions(sources.genres, data.exclude_genre),
        selectedCountries: matchOptions(sources.countries, data.country),
        selectedYears: matchOptions(sources.years, data.year),
        selectedRating: parseRating(data.rating),
        genres: [],
    };
}
