import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser, IShortUser } from '../types';

export const userApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/user_api/' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    registerUser: builder.mutation<void, IUser>({
        query: (userData) => ({
            url: 'users/register',
            method: 'POST',
            body: userData,
        }),
        invalidatesTags: ['User'],
    }),
    loginUser: builder.mutation<void, Omit<IUser, "email">>({
        query: (credentials) => ({
            url: 'users/login',
            method: 'POST',
            body: credentials,
        }),
        transformErrorResponse: (
            response: { status: string | number },
            meta,
            arg,
          ) => response,
        invalidatesTags: ['User'],
    }),
    getUser: builder.query<IShortUser, void>({
        query: () => 'users/get_user',
        transformErrorResponse: (
            response: { status: string | number },
            meta,
            arg,
          ) => response.status,
        providesTags: ['User'],
    }),
    getLogin: builder.mutation<{"login": string}, void>({
        query: () => 'users/get_login',
        invalidatesTags: ['User'],
    }),
    refresh: builder.mutation<void, void>({
        query: () => ({
            url: 'refresh',
            method: 'POST',
        }),
        invalidatesTags: ['User'],
    }),
    logoutUser: builder.mutation<void, void>({
        query: () => ({
            url: 'users/logout',
            method: 'POST',
        }),
        invalidatesTags: ['User'],
    }),
  }),
});

export const { 
  useRegisterUserMutation, 
  useLoginUserMutation, 
  useGetUserQuery, 
  useGetLoginMutation,
  useRefreshMutation,
  useLogoutUserMutation 
} = userApiSlice;
