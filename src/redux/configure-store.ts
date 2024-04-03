import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer from './authSlice';
import recoveryPasswordReducer from './recoveryPasswordSlice';
import appSliceReducer from './appSlice';

export const store = configureStore({
  reducer: {
    authSlice: authSliceReducer,
    recoveryPasswordSlice: recoveryPasswordReducer,
    appSlice: appSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
