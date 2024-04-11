import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SMApiResponse, fetchMovies } from 'features';
import { ISMFormData } from 'pages';

interface MoviesState {
    data: SMApiResponse | [];
    loading: boolean;
    error: null | string;
}

const initialState: MoviesState = {
    data: [],
    loading: false,
    error: null,
};

export const loadMovies = createAsyncThunk<SMApiResponse, ISMFormData, { rejectValue: string }>(
    'movies/loadMovies',
    async (params, { rejectWithValue }) => {
        try {
            const movies = await fetchMovies(params);
            console.log(movies)
            return movies;
        } catch (error) {
            return rejectWithValue('Failed to fetch movies');
        }
    }
);

const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(loadMovies.rejected, (state, action: PayloadAction<string | undefined>) => {
                state.loading = false;
                state.error = action.payload ?? 'An error occurred while fetching movies';
            })
    },
});

export default moviesSlice.reducer;
