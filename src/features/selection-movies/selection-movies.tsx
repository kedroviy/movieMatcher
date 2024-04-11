import { create } from 'apisauce';
import { SMApiResponse } from './selection-movies.model';
import { ISMFormData } from 'pages';

const BASE_URL = 'https://api.kinopoisk.dev/v1.4/movie?page=1&limit=10';
const API_KEY = 'XYNPWWX-0VZ4EF2-HS2W1FV-JNA4H0J';

const api = create({
  baseURL: BASE_URL,
  headers: { 'X-API-KEY': API_KEY },
});

export const fetchMovies = async (formData: ISMFormData): Promise<SMApiResponse> => {
  const params = new URLSearchParams();

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

  const url = `${api.getBaseURL()}&${params.toString()}`;
  console.log(url);

  const response = await api.get<SMApiResponse>(url, params);
  console.log(response);

  if (!response.ok || !response.data) {
    console.error(response.problem || 'Unknown API error');
    throw new Error(response.problem || 'Unknown API error');
  }

  return response.data;
};
