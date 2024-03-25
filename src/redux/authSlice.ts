import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';

import { removeToken, saveToken } from '../shared';
import {
    loginUser,
    registrationUser,
    sendGoogleCodeToServer,
} from 'features';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

type AuthState = {
    token: string | null;
    isAuthenticated: boolean;
    googleAuthCode: string | null;
    error: null | string;
    loading: boolean;
    loadingApplication: boolean;
    success: boolean;
}

const initialState: AuthState = {
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
            }
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const authenticateWithGoogle = createAsyncThunk(
    'auth/GOOGLE',
    async (_, { rejectWithValue }) => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const idToken = userInfo.idToken;

            const response = await sendGoogleCodeToServer(idToken as string);

            if (response.success) {
                saveToken(response.token as string);
            }

            return response;
        } catch (error) {
            return rejectWithValue(error || 'An error occurred');
        }
    });

export const authRegistrationUser = createAsyncThunk(
    'auth/REGISTRATION',
    async (userData: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await registrationUser(userData);
            if (!response.success) {
                return rejectWithValue(response?.error);
            }
            return response
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const checkAuthStatus = createAsyncThunk(
    'auth/CHECK_STATUS',
    async () => {
        try {
            const credentials = await Keychain.getGenericPassword({ service: 'token_guard' });
            if (credentials) {
                return { isAuthenticated: true };
            }
            return { isAuthenticated: false };
        } catch (error) {
            return { isAuthenticated: false };
        }
    }
);

// export const sendRecoveryCodeEffect = createAsyncThunk(
//     'auth/SEND_RECOVERY_CODE',
//     async (email: string, { rejectWithValue }) => {
//         try {
//             const response = await sendRecoveryCodeAPI(email);

//             if (response.success) {
//                 console.log(response.success);
//             }

//             return response;
//         } catch (error) {
//             return rejectWithValue(error);
//         }
//     }
// );

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
            .addCase(authenticateWithGoogle.pending, (state) => {
                state.loading = true;
            })
            .addCase(authenticateWithGoogle.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.success) {
                    state.isAuthenticated = true;
                } else {
                    state.isAuthenticated = false;
                    state.token = null;
                }
            })
            .addCase(authenticateWithGoogle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(authRegistrationUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(authRegistrationUser.fulfilled, (state, action) => {
                state.loading = false;
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
