import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie, SMApiResponse, fetchMovieDetails, fetchMovies } from 'features';
import { ISMFormData } from 'pages';

interface MoviesState {
    data: SMApiResponse | [];
    loading: boolean;
    error: null | string;
    currentPage: number;
    currentSessionLabel: string | null;
    currentFormData: ISMFormData | null;
    movieDetails: any;
}

const initialState: MoviesState = {
    data: [],
    loading: false,
    error: null,
    currentPage: 1,
    currentSessionLabel: null,
    currentFormData: null,
    movieDetails: { persons: [] },
};

export const loadMovies = createAsyncThunk
    <SMApiResponse, { formData: ISMFormData, sessionLabel: string, page: number }, { rejectValue: string }>(
        'movies/loadMovies',
        async ({ formData, sessionLabel, page }, { rejectWithValue, dispatch }) => {
            try {
                const movies: SMApiResponse = await fetchMovies(formData, sessionLabel, page);

                if (movies.total === 0) {
                    return rejectWithValue('No movies found matching your criteria.');
                }
                dispatch(setCurrentSessionLabel(sessionLabel))
                dispatch(setCurrentFormData(formData))
                return movies;
            } catch (error) {
                console.log(error)
                return rejectWithValue('Failed to fetch movies');
            }
        }
    );

export const loadMovieDetails = createAsyncThunk
    <Movie, number, { rejectValue: string }>(
        'movies/loadMovieDetails',
        async (movieId, { rejectWithValue }) => {
            try {
                const movieDetails = await fetchMovieDetails(movieId);
                console.log(movieDetails)
                return movieDetails;
            } catch (error) {
                console.log(error);
                return rejectWithValue('Failed to fetch movie details');
            }
        }
    );

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        },
        setCurrentSessionLabel(state, action: PayloadAction<string>) {
            state.currentSessionLabel = action.payload;
        },
        setPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        setCurrentFormData(state, action: PayloadAction<ISMFormData>) {
            state.currentFormData = action.payload
        },
        clearResponse(state) {
            state = initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(loadMovies.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload ?? 'An error occurred while fetching movies';
                state.data = [];
            })
            .addCase(loadMovieDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadMovieDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.movieDetails = action.payload;
            })
            .addCase(loadMovieDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? 'An error occurred while fetching movie details';
                state.movieDetails = null;
            })
    },
});

export const {
    clearError,
    setCurrentSessionLabel,
    setCurrentFormData,
    clearResponse,
    setPage,
} = moviesSlice.actions;
export default moviesSlice.reducer;
