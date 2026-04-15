import { KINOPOISK_COUNTRY_BY_ID, KINOPOISK_GENRE_BY_ID } from '../sm-kinopoisk-filter-values';
import { FilterOption, ISMFormData, SelectMovieType } from '../sm.model';

function kpGenreName(option: FilterOption): string | undefined {
    if (option.kpName) return option.kpName;
    const numericId = typeof option.id === 'number' ? option.id : Number(option.id);
    return Number.isFinite(numericId) ? KINOPOISK_GENRE_BY_ID[numericId] : undefined;
}

function kpCountryName(option: FilterOption): string | undefined {
    if (option.kpName) return option.kpName;
    const numericId = typeof option.id === 'number' ? option.id : Number(option.id);
    return Number.isFinite(numericId) ? KINOPOISK_COUNTRY_BY_ID[numericId] : undefined;
}

function toKpGenre(option: FilterOption): FilterOption {
    const name = kpGenreName(option);
    return { ...option, label: name ?? option.label, kpName: name ?? option.kpName };
}

function toKpCountry(option: FilterOption): FilterOption {
    const name = kpCountryName(option);
    return { ...option, label: name ?? option.label, kpName: name ?? option.kpName };
}

/**
 * Prepare filters for backend / Kinopoisk query building.
 * Keeps ids but forces `label` to be stable Kinopoisk name where possible.
 */
export function mapFiltersStateToKpFormData(state: SelectMovieType<FilterOption>): ISMFormData {
    return {
        excludeGenre: state.excludeGenre.map(toKpGenre),
        genres: state.genres?.map(toKpGenre),
        selectedCountries: state.selectedCountries.map(toKpCountry),
        selectedGenres: state.selectedGenres.map(toKpGenre),
        selectedYears: state.selectedYears,
        selectedRating: state.selectedRating,
    };
}

/**
 * Same idea as above, but for match lobby filters payload shape (not strict-typed there).
 */
export function mapFiltersPayloadToKpNames(payload: SelectMovieType<FilterOption>): SelectMovieType<FilterOption> {
    return {
        ...payload,
        selectedCountries: payload.selectedCountries.map(toKpCountry),
        selectedGenres: payload.selectedGenres.map(toKpGenre),
        excludeGenre: payload.excludeGenre.map(toKpGenre),
        genres: payload.genres?.map(toKpGenre),
    };
}
