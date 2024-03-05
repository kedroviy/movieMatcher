import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';

import { IGoogleAuthCodeToServer, loginUser, registrationUser, sendAuthCodeToServer } from '../features/auth/authAPI';
import { removeToken, saveToken } from '../shared';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

type UserState = {
    user: null | object;
    token: string | null;
    isAuthenticated: boolean;
    googleAuthCode: string | null;
    error: null | string;
    loading: boolean;
    loadingApplication: boolean;
    success: boolean;
}

const initialState: UserState = {
    user: null,
    token: null,
    isAuthenticated: false,
    googleAuthCode: null,
    error: null,
    loading: false,
    loadingApplication: false,
    success: false,
};

GoogleSignin.configure({
    webClientId: '277043180680-ugnrupqacuchkhpklb1qhv8kaueh4eks.apps.googleusercontent.com',
    offlineAccess: true,
    forceCodeForRefreshToken: true,
});

export const authUser = createAsyncThunk(
    'auth/LOGIN',
    async (userData: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await loginUser(userData);
            if (response.success) {
                saveToken(response.token as string);
                console.log('token succeess: ', response)
            }
            console.log('token basic: ', response)
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const authenticateWithGoogle = createAsyncThunk('auth/GOOGLE', async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const idToken = userInfo.idToken as unknown as IGoogleAuthCodeToServer;

        try {
            const response = await sendAuthCodeToServer(idToken);
            if (!response?.ok) throw new Error('Ошибка сервера');

            return response?.data?.idToken;
        } catch (error) {
            throw new Error(error);

        }
    } catch (error) {
        throw new Error(error);
    }
});

export const authRegistrationUser = createAsyncThunk(
    'auth/REGISTRATION',
    async (userData: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await registrationUser(userData);
            if (!response.success) {
                console.log(response)
                return rejectWithValue(response?.error);
            } 
                return response
            
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const checkAuthStatus = createAsyncThunk('auth/checkStatus',
    async () => {
        try {
            const credentials = await Keychain.getGenericPassword({ service: 'token_guard' });
            if (credentials) {
                return { isAuthenticated: true };
            }
            return { isAuthenticated: false };
        } catch (error) {
            console.error("Не удалось извлечь токен:", error);
            return { isAuthenticated: false };
        }
    }
);

export const saveGoogleAuthCode = createAction<string>('auth/SAVE_GOOGLE_AUTH_CODE');

export const revertAll = createAction('REVERT_ALL');

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: () => initialState,
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            removeToken();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuthStatus.pending, (state) => {
                state.loading = true;
                state.loadingApplication = true;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = action.payload.isAuthenticated;
                state.loadingApplication = false;
            })
            .addCase(checkAuthStatus.rejected, (state) => {
                state.loading = false;
                state.error = "Ошибка при проверке статуса аутентификации";
                state.loadingApplication = false;
            })
            .addCase(authUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(authUser.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token as string;

                if (action.payload.success) {
                    state.token = action.payload.token as string;
                    state.isAuthenticated = true;
                } else {
                    state.isAuthenticated = false;
                    state.token = null;
                }
            })
            .addCase(authUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(authRegistrationUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(authRegistrationUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(authRegistrationUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(saveGoogleAuthCode, (state, action) => {
                state.googleAuthCode = action.payload;
            })
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;