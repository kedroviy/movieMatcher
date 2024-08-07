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

    return `${baseURL}&${params.toString()}`;
};