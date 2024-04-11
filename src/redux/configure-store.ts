import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer from './authSlice';
import recoveryPasswordReducer from './recoveryPasswordSlice';
import appSliceReducer from './appSlice';
import userSliceReducer from './userSlice';
import moviesSliceReducer from './moviesSlice';

export const store = configureStore({
  reducer: {
    authSlice: authSliceReducer,
    recoveryPasswordSlice: recoveryPasswordReducer,
    appSlice: appSliceReducer,
    userSlice: userSliceReducer,
    moviesSlice: moviesSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
