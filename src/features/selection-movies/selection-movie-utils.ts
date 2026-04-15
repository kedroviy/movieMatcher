import { ISMFormData } from 'pages';
import { KINOPOISK_COUNTRY_BY_ID, KINOPOISK_GENRE_BY_ID } from 'pages/Main/sm-kinopoisk-filter-values';

export const constructUrl = (baseURL: string, formData: ISMFormData, page: number) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());

    formData.selectedYears.forEach((year) => {
        params.append('year', year.label);
    });

    formData.selectedGenres.forEach((genre) => {
        const numericId = typeof genre.id === 'number' ? genre.id : Number(genre.id);
        const name =
            genre.kpName ?? (Number.isFinite(numericId) ? KINOPOISK_GENRE_BY_ID[numericId] : undefined) ?? genre.label;
        params.append('genres.name', name.toLocaleLowerCase());
    });

    formData.excludeGenre.forEach((genre) => {
        const numericId = typeof genre.id === 'number' ? genre.id : Number(genre.id);
        const name =
            genre.kpName ?? (Number.isFinite(numericId) ? KINOPOISK_GENRE_BY_ID[numericId] : undefined) ?? genre.label;
        params.append('genres.name', `!${name.toLocaleLowerCase()}`);
    });

    formData.selectedCountries.forEach((country) => {
        const numericId = typeof country.id === 'number' ? country.id : Number(country.id);
        const name =
            country.kpName ??
            (Number.isFinite(numericId) ? KINOPOISK_COUNTRY_BY_ID[numericId] : undefined) ??
            country.label;
        params.append('countries.name', name);
    });
    if (formData.selectedRating && formData.selectedRating.length === 2) {
        const [minRating, maxRating] = formData.selectedRating;
        params.append('rating.kp', `${minRating}-${maxRating}`);
    }

    return `${baseURL}&${params.toString()}`;
};
