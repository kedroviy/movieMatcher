import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer from './authSlice';
import recoveryPasswordReducer from './recoveryPasswordSlice';
import appSliceReducer from './appSlice';
import userSliceReducer from './userSlice';
import moviesSliceReducer from './moviesSlice';
import matchSliceReducer from './matchSlice';
import feedbackSliceReducer from './feedbackSlice';

export const store = configureStore({
    reducer: {
        authSlice: authSliceReducer,
        recoveryPasswordSlice: recoveryPasswordReducer,
        appSlice: appSliceReducer,
        userSlice: userSliceReducer,
        moviesSlice: moviesSliceReducer,
        matchSlice: matchSliceReducer,
        feedbackSlice: feedbackSliceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
