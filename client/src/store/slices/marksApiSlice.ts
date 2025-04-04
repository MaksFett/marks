import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IStudent, IGrade, ISubject } from '../../types';

export const marksApiSlice = createApi({
  reducerPath: 'marks_api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/main_api/marks',
    prepareHeaders: (headers) => {
      headers.set("authorization", `bearer ${localStorage.getItem("access-token")}`);
      return headers;
    },
   }),
  tagTypes: ['Marks'],
  endpoints: (builder) => ({
    getMarks: builder.query<{"marks": Array<IGrade>, "students": Array<IStudent>, "subjects": Array<ISubject>}, void>({
      query: () => 'get_marks',
      providesTags: ['Marks'],
    }),
    
    updateMark: builder.mutation<{"message": string}, Array<IGrade>>({
      query: (updatedMark) => ({
        url: 'add_marks',
        method: 'POST',
        body: updatedMark,
      }),
      transformErrorResponse: (
        response: { status: string | number },
      ) => response,
      invalidatesTags: ['Marks'],
    }),
  }),
});

export const { useGetMarksQuery, useUpdateMarkMutation } = marksApiSlice;
