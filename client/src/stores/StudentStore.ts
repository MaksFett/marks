import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { IStudent } from "../types";

class StudentStore {
  students: IStudent[] = [];
  message: string = "";
  isLoading: boolean = false;
  cacheTimestamp = null;
  cacheDuration = 60000;

  constructor() {
    makeAutoObservable(this);
  }

  isCacheValid = () => {
    return (
        this.cacheTimestamp &&
        Date.now() - this.cacheTimestamp < this.cacheTimestamp
    );
  }

  // Загружаем список студентов
  fetchStudents = async () => {
    if (this.students.length > 0 && this.isCacheValid()){
      return;
    }
    this.isLoading = true;
    try {
      const response = await axios.get("/main_api/students/get_students", this.authHeader);
      runInAction(() => {
        this.students = response.data;
        this.cacheTimestamp = Date.now();
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
      await axios.post("/main_api/students/edit_student", { id, ...editedData }, this.authHeader);
      runInAction(() => {
        const index = this.students.findIndex((s) => s.id === id);
        if (index !== -1) {
          this.students[index] = { ...this.students[index], ...editedData };
        }
      });
    } catch (error) {
      this.message = "Неизвестная ошибка";
    }
  };

  // Удаление студента
  deleteStudent = async (id: number) => {
    try {
      await axios.post("/main_api/students/delete_student", { id }, this.authHeader);
      runInAction(() => {
        this.students = this.students.filter((s) => s.id !== id);
      });
    } catch (error) {
      this.message = "Неизвестная ошибка";
    }
  };

  // Добавление нового студента
  addStudent = async (newStudent: Omit<IStudent, "id">) => {
    const newId =
      this.students.length > 0
        ? Math.max(...this.students.map((s) => s.id)) + 1
        : 1;
    try {
      await axios.post("/main_api/students/add_student", { id: newId, ...newStudent }, this.authHeader);
      runInAction(() => {
        this.students.push({ id: newId, ...newStudent });
      });
    } catch (error) {
      this.message = "Неизвестная ошибка";
    }
  };
}

export const studentStore = new StudentStore();
