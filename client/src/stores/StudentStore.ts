import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { IStudent } from "../types";

class StudentStore {
  students: IStudent[] = [];
  message: string = "";
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Загружаем список студентов
  fetchStudents = async () => {
    this.isLoading = true;
    try {
      const response = await axios.get("/main_api/students/get_students");
      runInAction(() => {
        this.students = response.data;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.message = "Неизвестная ошибка";
        this.isLoading = false;
      });
    }
  };

  // Редактирование студента
  editStudent = async (id: number, editedData: Omit<IStudent, "id">) => {
    try {
      await axios.post("/main_api/students/edit_student", { id, ...editedData });
      runInAction(() => {
        const studentIndex = this.students.findIndex((s) => s.id === id);
        if (studentIndex !== -1) {
          this.students[studentIndex] = { ...this.students[studentIndex], ...editedData };
        }
      });
    } catch (error) {
      this.message = "Неизвестная ошибка";
    }
  };

  // Удаление студента
  deleteStudent = async (id: number) => {
    try {
      await axios.post("/main_api/students/delete_student", { id });
      runInAction(() => {
        this.students = this.students.filter((student) => student.id !== id);
      });
    } catch (error) {
      this.message = "Неизвестная ошибка";
    }
  };

  // Добавление нового студента
  addStudent = async (newStudent: Omit<IStudent, "id">) => {
    const newId = this.students.length > 0 ? Math.max(...this.students.map((student) => student.id)) + 1 : 1;
    try {
      await axios.post("/main_api/students/add_student", { id: newId, ...newStudent });
      runInAction(() => {
        this.students.push({ id: newId, ...newStudent });
      });
    } catch (error) {
      this.message = "Неизвестная ошибка";
    }
  };
}

export const studentStore = new StudentStore();
