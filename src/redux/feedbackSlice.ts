import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { createFeedbackMessage, FeedbackApiError, getMyFeedbackMessages } from 'features/feedback';
import { FeedbackMessage } from 'shared';

type FeedbackState = {
    myMessages: FeedbackMessage[];
    checkLoading: boolean;
    submitLoading: boolean;
    hasExistingFeedback: boolean;
    submitSuccess: boolean;
    error: string | null;
};

const initialState: FeedbackState = {
    myMessages: [],
    checkLoading: false,
    submitLoading: false,
    hasExistingFeedback: false,
    submitSuccess: false,
    error: null,
};

export const fetchMyFeedback = createAsyncThunk<FeedbackMessage[], void, { rejectValue: string }>(
    'feedback/fetchMy',
    async (_, { signal, rejectWithValue }) => {
        try {
            return await getMyFeedbackMessages(signal);
        } catch (error) {
            if (signal.aborted) {
                return rejectWithValue('ABORTED');
            }
            if (error instanceof FeedbackApiError) {
                return rejectWithValue(error.code ?? error.message);
            }
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    },
);

export const submitFeedback = createAsyncThunk<FeedbackMessage, string, { rejectValue: string }>(
    'feedback/submit',
    async (text, { signal, rejectWithValue }) => {
        try {
            return await createFeedbackMessage(text, signal);
        } catch (error) {
            if (signal.aborted) {
                return rejectWithValue('ABORTED');
            }
            if (error instanceof FeedbackApiError) {
                return rejectWithValue(error.code ?? error.message);
            }
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    },
);

const feedbackSlice = createSlice({
    name: 'feedback',
    initialState,
    reducers: {
        resetFeedbackState() {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyFeedback.pending, (state) => {
                state.checkLoading = true;
                state.error = null;
            })
            .addCase(fetchMyFeedback.fulfilled, (state, action) => {
                state.checkLoading = false;
                state.myMessages = action.payload;
                state.hasExistingFeedback = action.payload.length > 0;
            })
            .addCase(fetchMyFeedback.rejected, (state, action) => {
                if (action.meta.aborted || action.payload === 'ABORTED') {
                    return;
                }
                state.checkLoading = false;
                state.error = action.payload ?? 'Failed to load feedback';
            })
            .addCase(submitFeedback.pending, (state) => {
                state.submitLoading = true;
                state.error = null;
            })
            .addCase(submitFeedback.fulfilled, (state, action) => {
                state.submitLoading = false;
                state.submitSuccess = true;
                state.hasExistingFeedback = true;
                state.myMessages = [action.payload, ...state.myMessages];
            })
            .addCase(submitFeedback.rejected, (state, action) => {
                if (action.meta.aborted || action.payload === 'ABORTED') {
                    state.submitLoading = false;
                    return;
                }
                state.submitLoading = false;
                state.error = action.payload ?? 'Failed to submit feedback';
            });
    },
});

export const { resetFeedbackState } = feedbackSlice.actions;
export default feedbackSlice.reducer;
