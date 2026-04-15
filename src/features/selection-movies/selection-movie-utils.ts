import { ISMFormData } from 'pages';
import { KINOPOISK_COUNTRY_BY_ID, KINOPOISK_GENRE_BY_ID } from 'pages/Main/sm-kinopoisk-filter-values';

export const constructUrl = (baseURL: string, formData: ISMFormData, page: number) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());

    formData.selectedYears.forEach((year) => {
        params.append('year', year.label);
    });

    formData.selectedGenres.forEach((genre) => {
        const name = KINOPOISK_GENRE_BY_ID[Number(genre.id)] ?? genre.label;
        params.append('genres.name', name.toLocaleLowerCase());
    });

    formData.excludeGenre.forEach((genre) => {
        const name = KINOPOISK_GENRE_BY_ID[Number(genre.id)] ?? genre.label;
        params.append('genres.name', `!${name.toLocaleLowerCase()}`);
    });

    formData.selectedCountries.forEach((country) => {
        const name = KINOPOISK_COUNTRY_BY_ID[Number(country.id)] ?? country.label;
        params.append('countries.name', name);
    });
    if (formData.selectedRating && formData.selectedRating.length === 2) {
        const [minRating, maxRating] = formData.selectedRating;
        params.append('rating.kp', `${minRating}-${maxRating}`);
    }

    return `${baseURL}&${params.toString()}`;
};
