import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiResponse, UpdateUsernameArgs, getUserProfile, putUpdateUsername } from "features";
import { UserModelType } from "shared";

type UserState = {
    user: UserModelType | null;
    error: null | string;
    loading: boolean;
    loadingApplication: boolean;
    success: boolean;
    onboarded: boolean;
}

const initialState: UserState = {
    user: null,
    error: null,
    loading: false,
    loadingApplication: false,
    success: false,
    onboarded: false,
};

export const fetchUserProfile = createAsyncThunk(
    'user/GET_USER',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getUserProfile();

            if (!response.success) {
                return rejectWithValue('Failed to fetch user profile');
            }

            return response.data;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const updateUsername = createAsyncThunk<
    UserModelType,
    UpdateUsernameArgs,
    {
        rejectValue: ApiResponse
    }
>(
    'user/updateUsername',
    async (args, { rejectWithValue }) => {
        try {
            const response = await putUpdateUsername(args);
            console.log('Update username response:', response);

            if (response.ok) {
                console.log(response)
                return response.data as UserModelType;
            } else {
                return rejectWithValue(response as ApiResponse);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error in updateUsername:', error.message);
                return rejectWithValue({ success: false, message: error.message } as ApiResponse);
            } else {
                console.error('Unknown error in updateUsername:', error);
                return rejectWithValue({ success: false, message: 'Unknown error' } as ApiResponse);
            }
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateUsername.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUsername.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateUsername.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default userSlice.reducer;