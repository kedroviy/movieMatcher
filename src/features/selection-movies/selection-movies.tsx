import { ISMFormData } from 'pages';
import { constructUrl } from './selection-movie-utils';
import { fetchMoviesApi } from './selection-movie-service';
import { updateStorageWithSession } from './selection-movies-storage-service';
import { SMApiResponse } from './selection-movies.model';

export const fetchMovies = async (formData: ISMFormData, sessionLabel: string, page: number): Promise<SMApiResponse> => {
  const url = constructUrl('https://api.kinopoisk.dev/v1.4/movie?limit=10', formData, page);
  try {
    const data = await fetchMoviesApi(url);
    await updateStorageWithSession(sessionLabel, url);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching movies:', error.message);
      throw new Error('Failed to fetch movies with given parameters');
    } else {
      console.error('Unknown error occurred');
      throw new Error('An unknown error occurred');
    }
  }
};