import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IStudent, IGrade, ISubject } from '../types';

export const mainApiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/main_api/' }),
  tagTypes: ['Students', 'Marks'],
  endpoints: (builder) => ({
    getStudents: builder.query<Array<IStudent>,void>({
      query: () => 'students/get_students',
      providesTags: ['Students'],
    }),
    getMarks: builder.query<{"marks": Array<IGrade>, "students": Array<IStudent>, "subjects": Array<ISubject>}, void>({
      query: () => 'marks/get_marks',
      providesTags: ['Marks'],
    }),
    addStudent: builder.mutation<{"message": string}, Omit<IStudent,"id">>({
      query: (newStudent) => ({
        url: 'students/add_student',
        method: 'POST',
        body: newStudent,
      }),
      invalidatesTags: ['Students'],
    }),
    editStudent: builder.mutation<{"message": string}, IStudent>({
        query: (editingStudent) => ({
          url: 'students/edit_student',
          method: 'POST',
          body: editingStudent,
        }),
        invalidatesTags: ['Students'],
      }),
    deleteStudent: builder.mutation<{"message": string}, {"id": number}>({
      query: (id) => ({
        url: 'students/delete_student',
        method: 'POST',
        body: id,
      }),
      invalidatesTags: ['Students'],
    }),
    updateMark: builder.mutation<{"message": string}, Array<IGrade>>({
      query: (updatedMark) => ({
        url: 'marks/add_marks',
        method: 'POST',
        body: updatedMark,
      }),
      invalidatesTags: ['Marks'],
    }),
  }),
});

export const { useGetStudentsQuery, useGetMarksQuery, useAddStudentMutation, useEditStudentMutation, useDeleteStudentMutation, useUpdateMarkMutation } = mainApiSlice;
