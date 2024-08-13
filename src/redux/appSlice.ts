import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationType, SnackBarNotification } from "shared";

type AppState = {
    appVersion: string;
    error: null | string;
    loading: boolean;
    loadingApplication: boolean;
    success: boolean;
    onboarded: boolean;
    isWSConnected: boolean;
    notifications: SnackBarNotification[];
}

const initialState: AppState = {
    appVersion: '1.0',
    error: null,
    loading: false,
    loadingApplication: false,
    success: false,
    onboarded: false,
    isWSConnected: false,
    notifications: [],
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setConnectionStatus(state, action: PayloadAction<boolean>) {
            state.isWSConnected = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        addNotification(state, action: PayloadAction<SnackBarNotification>) {
            state.notifications.push(action.payload);
        },
        removeNotification(state, action: PayloadAction<number>) {
            state.notifications = state.notifications.filter(
                notification => notification.id !== action.payload
            );
        },
    },
});

export const { setConnectionStatus, setError, addNotification, removeNotification } = appSlice.actions;
export default appSlice.reducer;