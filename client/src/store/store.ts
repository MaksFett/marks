import { configureStore } from '@reduxjs/toolkit';
import { marksApiSlice } from './slices/marksApiSlice';
import { studentApiSlice } from './slices/studentApiSlice';
import { userApiSlice } from './slices/userApiSlice';
import authSlice from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    [marksApiSlice.reducerPath]: marksApiSlice.reducer,
    [studentApiSlice.reducerPath]: studentApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(marksApiSlice.middleware, studentApiSlice.middleware, userApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
