import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SMApiResponse, createRoomService, joinRoomService, leaveRoomService } from 'features';
import {
    checkStatus,
    doesUserHaveRoomService,
    getMatchData,
    getMovieData,
    getUserStatusByUserId,
    postLikeMovie,
    startMatchService,
    updateRoomFilters,
    updateUserStatus,
} from 'features/match/match-service';
import { MatchLikeFields, MatchUserStatus, MatchUserStatusEnum, Room } from 'features/match/match.model';
import { ISMFormData } from 'pages';
import { FilterOption } from 'pages/Main/sm.model';
import { RootState } from './configure-store';

interface MatchState {
    data: SMApiResponse | [];
    loading: boolean;
    error: null | string;
    room: Room[];
    movies: any[];
    currentMovie: any;
    currentPage: number;
    currentSessionLabel: string | null;
    currentFormData: ISMFormData | null;
    role: number;
    roomKey: string | null;
    userStatus: string;
    requestStatus: { [key: string]: boolean };
}

const initialState: MatchState = {
    data: [],
    loading: false,
    error: null,
    room: [],
    movies: [],
    currentMovie: null,
    currentPage: 1,
    currentSessionLabel: null,
    currentFormData: null,
    role: 0,
    roomKey: null,
    userStatus: MatchUserStatusEnum.ACTIVE,
    requestStatus: {},
};

export const createRoom = createAsyncThunk<Room, number, { state: RootState, rejectValue: string }>(
    'match/createRoom',
    async (userId, { getState, dispatch, rejectWithValue }) => {
        const state = getState().matchSlice;
        if (state.requestStatus['createRoom']) {
            return rejectWithValue('Room creation already in progress');
        }

        dispatch(setRequestStatus({ request: 'createRoom', status: true }));

        try {
            const room = await createRoomService(userId);
            return room;
        } catch (error) {
            return rejectWithValue((error as any).message);
        } finally {
            dispatch(setRequestStatus({ request: 'createRoom', status: false }));
        }
    }
);

export const joinRoom = createAsyncThunk(
    'match/joinRoom',
    async ({ key, userId }: { key: number; userId: number }, { rejectWithValue }) => {
        try {
            const response = await joinRoomService(key, userId);
            return response;
        } catch (error) {
            return rejectWithValue((error as any).message);
        }
    }
);

export const leaveRoom = createAsyncThunk(
    'match/leaveRoom',
    async ({ key, userId }: { key: number; userId: number }, { rejectWithValue }) => {
        try {
            return await leaveRoomService(key, userId);
        } catch (error) {
            return rejectWithValue((error as any).message);
        }
    }
);

export const leaveFromMatch = createAsyncThunk(
    'match/leaveFromMatch',
    async ({ roomKey, userId }: { roomKey: number, userId: number }, { rejectWithValue }) => {
        try {
            const response = await leaveRoomService(roomKey, userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error || 'An unexpected error occurred');
        }
    }
);

export const handleReduxMatchUpdate = (matchData: any) =>
    (dispatch: (arg0: { payload: any; type: "match/updateRoomUsers"; }) => void, getState: any) => {
        dispatch(updateRoomUsers(matchData));
    };

export const updateRoomFiltersRedux = createAsyncThunk(
    'match/updateRoomFilters',
    async ({ roomId, filters }: { roomId: string, filters: FilterOption }, { rejectWithValue }) => {
        try {
            const response = await updateRoomFilters(roomId, filters);
            console.log('response in redux: ', response)
            if (response.ok) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error || 'An unexpected error occurred');
        }
    }
);

export const doesUserHaveRoomRedux = createAsyncThunk(
    'match/doesUserHaveRoom',
    async (userId: number, { rejectWithValue }) => {
        try {
            return await doesUserHaveRoomService(userId);
        } catch (error) {
            return rejectWithValue('Failed to fetch user room');
        }
    }
);

export const startMatchRedux = createAsyncThunk(
    'match/startMatch',
    async (key: string, { rejectWithValue }) => {
        try {
            const response = await startMatchService(key);
            return response.data;

        } catch (error) {
            return rejectWithValue('Failed to start match');
        }
    }
)

export const getMoviesRedux = createAsyncThunk(
    'match/getMovies',
    async ({ roomKey }: { roomKey: string }, { rejectWithValue }) => {
        try {
            const response = await getMovieData(roomKey);
            return response;
        } catch (error) {
            return rejectWithValue('Failed to fetch movie data');
        }
    }
)

export const postLikeMovieRedux = createAsyncThunk(
    'match/likeMovie',
    async (like: MatchLikeFields, { rejectWithValue }) => {
        try {
            const response = await postLikeMovie(like);
            return response;
        } catch (error) {
            return rejectWithValue('Failed to post movie like');
        }
    }
)

export const updateUserStatusRedux = createAsyncThunk(
    'match/userStatus',
    async (userStatus: MatchUserStatus, { rejectWithValue }) => {
        try {
            const response = await updateUserStatus(userStatus);
            return response;
        } catch (error) {
            return rejectWithValue('Failed to post movie like');
        }
    }
)

export const getUserStatusByUserIdRedux = createAsyncThunk(
    'match/getUserStatusByUserId',
    async ({ roomKey, userId }: { roomKey: string, userId: number }, { rejectWithValue }) => {
        try {
            const response = await getUserStatusByUserId(roomKey, userId);
            console.log(response);
            return response;
        } catch (error) {
            return rejectWithValue('Failed to post movie like');
        }
    }
)

export const checkStatusRedux = createAsyncThunk(
    'match/checkStatus',
    async ({ roomKey, userId }: { roomKey: string, userId: number }, { rejectWithValue }) => {
        try {
            await checkStatus(roomKey, userId);
        } catch (error) {
            return rejectWithValue('Failed to check user status');
        }
    }
);

export const getMatchDataRedux = createAsyncThunk(
    'match/getMatchData',
    async (roomKey: string, { rejectWithValue }) => {
        try {
            await getMatchData(roomKey);
        } catch (error) {
            return rejectWithValue('Failed to check user status');
        }
    }
);

const matchSlice = createSlice({
    name: 'match',
    initialState,
    reducers: {
        updateRoomUsers: (state, action) => {
            state.room = action.payload;
        },
        setMovie(state, action) {
            state.currentMovie = action.payload;
        },
        clearMovies(state) {
            state.movies = [];
        },
        updateCurrentMovieReducer(state, action) {
            state.currentMovie = action.payload;
        },
        setRequestStatus: (state, action) => {
            const { request, status } = action.payload;
            state.requestStatus[request] = status;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createRoom.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createRoom.fulfilled, (state, action) => {
            state.room = [action.payload];
            state.role = 1;
            state.loading = false;
        });
        builder.addCase(createRoom.rejected, (state, action) => {
            state.error = action.payload as string;
            state.loading = false;
        });
        builder.addCase(joinRoom.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(joinRoom.fulfilled, (state, action) => {
            state.loading = false;
            state.role = 0;
            state.room = action.payload;
        });
        builder.addCase(joinRoom.rejected, (state, action) => {
            state.error = action.payload as string;
            state.loading = false;
        });
        builder.addCase(leaveRoom.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(leaveRoom.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(leaveRoom.rejected, (state, action) => {
            state.error = action.payload as string;
            state.loading = false;
        })
        builder.addCase(leaveFromMatch.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(leaveFromMatch.fulfilled, (state, action) => {
            state.loading = false;
            state.room = state.room.filter((room: any) => room.roomKey !== action.meta.arg.roomKey);
        })
        builder.addCase(leaveFromMatch.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message as string;
        })
        builder.addCase(updateRoomFiltersRedux.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateRoomFiltersRedux.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        });
        builder.addCase(updateRoomFiltersRedux.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Unknown error occurred';
        });
        builder.addCase(doesUserHaveRoomRedux.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(doesUserHaveRoomRedux.fulfilled, (state, action) => {
            state.loading = false;
            if (action.payload.key) {
                state.roomKey = action.payload.key;
                state.role = 1;
            } else {
                state.roomKey = null;
            }
            if (action.payload.match) {
                state.room = action.payload.match as any;
            }
        });
        builder.addCase(doesUserHaveRoomRedux.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        builder.addCase(startMatchRedux.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(startMatchRedux.fulfilled, (state, action) => {
            state.loading = false;
            state.currentMovie = action.payload;
        });
        builder.addCase(startMatchRedux.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Unknown error occurred';
        });
        builder.addCase(getMoviesRedux.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getMoviesRedux.fulfilled, (state, action) => {
            state.loading = false;
            state.movies = action.payload;
        });
        builder.addCase(getMoviesRedux.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        builder.addCase(postLikeMovieRedux.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(postLikeMovieRedux.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(postLikeMovieRedux.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        builder.addCase(updateUserStatusRedux.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateUserStatusRedux.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(updateUserStatusRedux.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        builder.addCase(getUserStatusByUserIdRedux.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getUserStatusByUserIdRedux.fulfilled, (state, action) => {
            state.loading = false;
            state.userStatus = action.payload?.userStatus as string;
        });
        builder.addCase(getUserStatusByUserIdRedux.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
        builder
            .addCase(checkStatusRedux.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(checkStatusRedux.rejected, (state, action) => {
                state.error = action.payload as string;
            });
        builder
            .addCase(getMatchDataRedux.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMatchDataRedux.fulfilled, (state, action) => {
                state.loading = false;
                state.room = action.payload as any;
            })
            .addCase(getMatchDataRedux.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    }
});

export const { updateRoomUsers, updateCurrentMovieReducer, setMovie, setRequestStatus } = matchSlice.actions;
export default matchSlice.reducer;
