import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer from './authSlice';
import recoveryPasswordReducer from './recoveryPasswordSlice';

export const store = configureStore({
  reducer: {
    authSlice: authSliceReducer,
    recoveryPasswordSlice: recoveryPasswordReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
