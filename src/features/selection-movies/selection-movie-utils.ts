import { ISMFormData } from "pages";

export const constructUrl = (baseURL: string, formData: ISMFormData, page: number) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());

    formData.selectedYears.forEach(year => {
        params.append('year', year.label);
    });

    formData.selectedGenres.forEach(genre => {
        params.append('genres.name', genre.label.toLocaleLowerCase());
    });

    formData.excludeGenre.forEach(genre => {
        params.append('genres.name', `%21${genre.label.toLocaleLowerCase()}`);
    });

    formData.selectedCountries.forEach(country => {
        params.append('countries.name', country.label);
    });
    if (formData.selectedRating && formData.selectedRating.length === 2) {
        const [minRating, maxRating] = formData.selectedRating;
        params.append('rating.kp', `${minRating}-${maxRating}`);
    }

    return `${baseURL}&${params.toString()}`;
};