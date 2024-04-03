import { createSlice } from "@reduxjs/toolkit";

type AppState = {
    appVersion: string;
    error: null | string;
    loading: boolean;
    loadingApplication: boolean;
    success: boolean;
    onboarded: boolean;
}

const initialState: AppState = {
    appVersion: '1.0',
    error: null,
    loading: false,
    loadingApplication: false,
    success: false,
    onboarded: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        
    },
});

export default appSlice.reducer;