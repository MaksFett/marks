import { configureStore } from '@reduxjs/toolkit';
import { mainApiSlice } from './mainApiSlice';
import { userApiSlice } from './userApiSlice';

export const store = configureStore({
  reducer: {
    [mainApiSlice.reducerPath]: mainApiSlice.reducer,
    [userApiSlice.reducerPath]: userApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mainApiSlice.middleware, userApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
