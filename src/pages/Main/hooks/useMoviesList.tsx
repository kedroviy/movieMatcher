import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MoviesSavedType } from 'features/selection-movies/selection-movies.model';

type MovieListType = MoviesSavedType[];

export const useMoviesList = (): {
    moviesList: MovieListType,
    isLoading: boolean,
    isRefreshing: boolean,
    fetchMoviesList: () => Promise<void>,
    setIsRefreshing: (isRefreshing: boolean) => void
} => {
    const [moviesList, setMoviesList] = useState<MovieListType>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const fetchMoviesList = useCallback(async () => {
        setIsLoading(true);
        const listString = await AsyncStorage.getItem('@mymovies');
        if (listString) {
            const listObj: Record<string, MoviesSavedType> = JSON.parse(listString);
            let isModified = false;
            const updatedListObj = Object.entries(listObj).reduce<Record<string, MoviesSavedType>>((acc, [key, session]) => {
                if (session.movies.length > 0) {
                    acc[key] = session;
                } else {
                    isModified = true;
                }
                return acc;
            }, {});

            if (isModified) {
                await AsyncStorage.setItem('@mymovies', JSON.stringify(updatedListObj));
            }

            setMoviesList(Object.values(updatedListObj));
        }
        setIsLoading(false);
        setIsRefreshing(false);
    }, []);

    useEffect(() => {
        fetchMoviesList();
    }, [fetchMoviesList]);

    return {
        moviesList,
        isLoading,
        isRefreshing,
        fetchMoviesList,
        setIsRefreshing,
    };
};
