import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface AuthState {
  isAuth: boolean;
}

const initialState: AuthState = {
  isAuth: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
      console.log(1)
      state.isAuth = action.payload;
    }
  },
});

export const { setAuthState } = authSlice.actions;

// Селектор для получения isAuth
export const selectIsAuth = (state: RootState) => state.auth.isAuth;

export default authSlice;
