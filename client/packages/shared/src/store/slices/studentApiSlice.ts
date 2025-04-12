import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IStudent } from '../../types';

export const studentApiSlice = createApi({
  reducerPath: 'students_api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/main_api/students',
    prepareHeaders: (headers) => {
      headers.set("authorization", `bearer ${localStorage.getItem("access-token")}`);
      return headers;
    },
   }),
  tagTypes: ['Students'],
  keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    getStudents: builder.query<Array<IStudent>,void>({
      query: () => 'get_students',
      providesTags: ['Students'],
    }),

    addStudent: builder.mutation<{"message": string}, Omit<IStudent,"id">>({
      query: (newStudent) => ({
        url: 'add_student',
        method: 'POST',
        body: newStudent,
      }),
      transformErrorResponse: (
        response: { status: string | number },
      ) => response,
      invalidatesTags: ['Students'],
    }),

    editStudent: builder.mutation<{"message": string}, IStudent>({
        query: (editingStudent) => ({
          url: 'edit_student',
          method: 'POST',
          body: editingStudent,
        }),
        transformErrorResponse: (
          response: { status: string | number },
        ) => response,
        invalidatesTags: ['Students'],
      }),

    deleteStudent: builder.mutation<{"message": string}, {"id": number}>({
      query: (id) => ({
        url: 'delete_student',
        method: 'POST',
        body: id,
      }),
      transformErrorResponse: (
        response: { status: string | number },
      ) => response,
      invalidatesTags: ['Students'],
    })
  }),
});

export const { useGetStudentsQuery, useAddStudentMutation, useEditStudentMutation, useDeleteStudentMutation } = studentApiSlice;
