import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SMApiResponse, createRoomService, joinRoomService, leaveRoomService } from 'features';
import { Room } from 'features/match/match.model';
import { ISMFormData } from 'pages';

interface MatchState {
    data: SMApiResponse | [];
    loading: boolean;
    error: null | string;
    room: Room[];
    currentPage: number;
    currentSessionLabel: string | null;
    currentFormData: ISMFormData | null;
}

const initialState: MatchState = {
    data: [],
    loading: false,
    error: null,
    room: [],
    currentPage: 1,
    currentSessionLabel: null,
    currentFormData: null,
};

export const createRoom = createAsyncThunk<Room, number, { rejectValue: string }>(
    'match/createRoom',
    async (userId, { rejectWithValue }) => {
        try {
            const room = await createRoomService(userId);
            return room;
        } catch (error) {
            return rejectWithValue((error as any).message);
        }
    }
);

export const joinRoom = createAsyncThunk(
    'match/joinRoom',
    async ({ key, userId }: { key: number; userId: number }, { rejectWithValue }) => {
        try {
            return await joinRoomService(key, userId);
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

const matchSlice = createSlice({
    name: 'match',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(createRoom.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createRoom.fulfilled, (state, action) => {
            state.room.push(action.payload);
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
        });
    }
});

export default matchSlice.reducer;
