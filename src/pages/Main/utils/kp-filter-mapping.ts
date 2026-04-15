import { KINOPOISK_COUNTRY_BY_ID, KINOPOISK_GENRE_BY_ID } from '../sm-kinopoisk-filter-values';
import { FilterOption, ISMFormData, SelectMovieType } from '../sm.model';

function kpGenreName(option: FilterOption): string | undefined {
    return option.kpName ?? KINOPOISK_GENRE_BY_ID[Number(option.id)];
}

function kpCountryName(option: FilterOption): string | undefined {
    return option.kpName ?? KINOPOISK_COUNTRY_BY_ID[Number(option.id)];
}

function toKpGenre(option: FilterOption) {
    const name = kpGenreName(option);
    return { ...option, label: name ?? option.label, kpName: name ?? option.kpName, type: 'genre' as const };
}

function toKpCountry(option: FilterOption) {
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
    } as unknown as ISMFormData;
}

/**
 * Same idea as above, but for match lobby filters payload shape (not strict-typed there).
 */
export function mapFiltersPayloadToKpNames(payload: SelectMovieType<FilterOption>): SelectMovieType<FilterOption> {
    return {
        ...payload,
        selectedCountries: payload.selectedCountries.map(toKpCountry),
        selectedGenres: payload.selectedGenres.map((g) => ({ ...toKpGenre(g), type: undefined } as any)),
        excludeGenre: payload.excludeGenre.map((g) => ({ ...toKpGenre(g), type: undefined } as any)),
        genres: payload.genres?.map((g) => ({ ...toKpGenre(g), type: undefined } as any)),
    };
}

