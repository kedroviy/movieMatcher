import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
    sendEmailForRecoveryAPI, sendRecoveryCodeAPI, sendRecoveryNewPasswordAPI,
} from 'features';

type RecoveryPasswordState = {
    email: string | null;
    code: string | null;
    error: null | string;
    loading: boolean;
    success: boolean;
}

const initialState: RecoveryPasswordState = {
    email: null,
    code: null,
    error: null,
    loading: false,
    success: false,
};

export const sendEmailForRecoveryEffect = createAsyncThunk(
    'recovery-password/SEND_EMAIL_FOR_RECOVERY',
    async (email: string, { rejectWithValue }) => {
        try {
            const response = await sendEmailForRecoveryAPI(email);

            return { email, ...response };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const sendRecoveryCodeEffect = createAsyncThunk(
    'recovery-password/SEND_RECOVERY_CODE',
    async (recoveryData: { email: string, code: string }, { rejectWithValue }) => {
        try {
            const response = await sendRecoveryCodeAPI(recoveryData);

            return { recoveryData, ...response };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const sendRecoveryNewPasswordEffect = createAsyncThunk(
    'recovery-password/SEND_RECOVERY_NEW_PASSWORD',
    async (recoveryData: { email: string, code: string, password: string }, { rejectWithValue }) => {
        try {
            const response = await sendRecoveryNewPasswordAPI(recoveryData);

            return { recoveryData, ...response };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const revertAll = createAction('REVERT_ALL');

const recoveryPasswordSlice = createSlice({
    name: 'recovery-password',
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendEmailForRecoveryEffect.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendEmailForRecoveryEffect.fulfilled, (state, action) => {
                state.loading = false;
                state.email = action.payload.email;
                state.success = true;
            })
            .addCase(sendEmailForRecoveryEffect.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            })
            .addCase(sendRecoveryCodeEffect.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendRecoveryCodeEffect.fulfilled, (state, action) => {
                state.loading = false;
                state.code = action.payload.recoveryData.code;
                state.success = true;
            })
            .addCase(sendRecoveryCodeEffect.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            })
            .addCase(sendRecoveryNewPasswordEffect.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendRecoveryNewPasswordEffect.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
                state.email = null;
                state.code = null;
            })
            .addCase(sendRecoveryNewPasswordEffect.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload as string;
            })
    },
});

export default recoveryPasswordSlice.reducer;
