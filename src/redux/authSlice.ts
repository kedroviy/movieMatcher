import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { removeToken, saveToken } from '../shared';
import { loginUser, registrationUser, sendGoogleCodeToServer } from 'features';

function googleSignInErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
        return error;
    }
    if (error && typeof error === 'object') {
        const e = error as { code?: string; message?: string };
        if (e.message) {
            return e.message;
        }
        if (e.code) {
            return `Google Sign-In (${e.code})`;
        }
    }
    return 'Не удалось войти через Google';
}

type AuthState = {
    token: string | null;
    isAuthenticated: boolean;
    googleAuthCode: string | null;
    error: null | string;
    loading: boolean;
    loadingApplication: boolean;
    success: boolean;
    onboarded: boolean;
};

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    googleAuthCode: null,
    error: null,
    loading: false,
    loadingApplication: false,
    success: false,
    onboarded: true,
};

GoogleSignin.configure({
    webClientId: '277043180680-h1due06rsb1d1q3ke0ivme7sao6pe6ji.apps.googleusercontent.com',
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
    },
);

export const authenticateWithGoogle = createAsyncThunk('auth/GOOGLE', async (_, { rejectWithValue }) => {
    try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const userInfo = await GoogleSignin.signIn();
        let idToken = userInfo.idToken;
        if (!idToken) {
            const tokens = await GoogleSignin.getTokens();
            idToken = tokens.idToken;
        }
        if (!idToken) {
            return rejectWithValue(
                'Не получен idToken от Google. Проверьте webClientId и настройки OAuth в Google Cloud.',
            );
        }

        const response = await sendGoogleCodeToServer(idToken);

        if (response.success) {
            saveToken(response.token as string);
        }

        return response;
    } catch (error) {
        return rejectWithValue(googleSignInErrorMessage(error));
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
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const checkAuthStatus = createAsyncThunk('auth/CHECK_STATUS', async () => {
    try {
        const credentials = await Keychain.getGenericPassword({ service: 'token_guard' });
        if (credentials) {
            return { isAuthenticated: true };
        }
        return { isAuthenticated: false };
    } catch (error) {
        return { isAuthenticated: false };
    }
});

export const initializeApp = createAsyncThunk('auth/INITIALIZE_APP', async (_, { dispatch, rejectWithValue }) => {
    let timeoutId;
    try {
        dispatch(setLoadingApplication(true));

        const cancellablePromise = new Promise<void>((resolve) => {
            timeoutId = setTimeout(() => {
                resolve();
            }, 3000);
        });
        await cancellablePromise;

        const authStatusResult = await dispatch(checkAuthStatus()).unwrap();
        const isAuthenticated = authStatusResult.isAuthenticated;
        const onboardedValue = await AsyncStorage.getItem('ONBOARDED');
        const onboarded = !!onboardedValue;

        return { isAuthenticated, onboarded };
    } catch (error) {
        return rejectWithValue('Error while initializing the application');
    } finally {
        dispatch(setLoadingApplication(false));
        clearTimeout(timeoutId);
    }
});

const setLoadingApplication = createAction<boolean>('auth/SET_LOADING_APPLICATION');

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
        setOnboardedStatus: (state, action) => {
            state.onboarded = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initializeApp.pending, (state) => {
                state.loadingApplication = true;
            })
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isAuthenticated = action.payload.isAuthenticated;
                state.onboarded = action.payload.onboarded;
                state.loadingApplication = false;
            })
            .addCase(initializeApp.rejected, (state) => {
                state.loadingApplication = false;
                state.error = 'Error while initializing the application';
            })
            .addCase(setLoadingApplication, (state, action) => {
                state.loadingApplication = action.payload;
            })
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
                state.error = 'Error checking authentication status';
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
                state.error = null;
            })
            .addCase(authenticateWithGoogle.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload.success) {
                    state.isAuthenticated = true;
                    state.error = null;
                } else {
                    state.isAuthenticated = false;
                    state.token = null;
                    state.error = action.payload.error ?? 'Не удалось войти через Google';
                }
            })
            .addCase(authenticateWithGoogle.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'Не удалось войти через Google';
            })
            .addCase(authRegistrationUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(authRegistrationUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(authRegistrationUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(saveGoogleAuthCode, (state, action) => {
                state.googleAuthCode = action.payload;
            });
    },
});

export const { logout, setOnboardedStatus } = authSlice.actions;
export default authSlice.reducer;
