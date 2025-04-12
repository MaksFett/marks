import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser, IShortUser } from '../../types';

export const userApiSlice = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/user_api/' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    registerUser: builder.mutation<{"accessToken": string, "refreshToken": string}, IUser>({
        query: (userData) => ({
            url: 'users/register',
            method: 'POST',
            body: userData,
        }),
        transformErrorResponse: (
            response: { status: string | number },
          ) => response,
        invalidatesTags: ['User'],
    }),
    loginUser: builder.mutation<{"accessToken": string, "refreshToken": string}, Omit<IUser, "email">>({
        query: (credentials) => ({
            url: 'users/login',
            method: 'POST',
            body: credentials,
        }),
        transformErrorResponse: (
            response: { status: string | number },
          ) => response,
        invalidatesTags: ['User'],
    }),
    getUser: builder.query<IShortUser, void>({
        query: () => ({
            url: 'users/get_user',
            headers: {"authorization": `bearer ${localStorage.getItem("access-token")}`},
        }),
        transformErrorResponse: (
            response: { status: string | number },
          ) => response.status,
        providesTags: ['User'],
    }),
    getLogin: builder.mutation<{"login": string}, void>({
        query: () => ({
            url: 'users/get_login',
            headers: {"authorization": `bearer ${localStorage.getItem("access-token")}`}
        }),
    }),
    refresh: builder.mutation<void, void>({
        query: () => ({
            url: 'users/refresh',
            method: 'POST',
            headers: {"authorization": `bearer ${localStorage.getItem("refresh-token")}`}
        }),
    }),
    logoutUser: builder.mutation<void, void>({
        query: () => ({
            url: 'users/logout',
            method: 'GET',
            headers: {"authorization": `bearer ${localStorage.getItem("access-token")}`}
        }),
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
