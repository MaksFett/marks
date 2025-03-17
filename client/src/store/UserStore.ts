import { makeAutoObservable } from "mobx";
import { IStudent } from "../types";
import axios, { AxiosError } from "axios";

class UserStore {
  user: { id: string; name: string; email: string } | null = null;
  isAuth: boolean = false;  // Добавляем isAuth
  students: IStudent[] = [];  // Массив студентов
  isLoading = false;
  message: string = "";
  login: string = "";
  password: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: { id: string; name: string; email: string } | null) {
    this.user = user;
  }

  setStudents(students: IStudent[]) {
    this.students = students;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setIsAuth(auth: boolean) {
    this.isAuth = auth;
  }

  setLogin(login: string) {
    this.login = login;
}

setPassword(password: string) {
    this.password = password;
}

clearUser() {
    this.user = null;
    this.isAuth = false;
}


// Проверяем, есть ли уже данные о пользователе в store
getUser = async () => {
    if (this.user) {
        return this.user; // Используем данные из хранилища, если они уже есть
    }
    this.setLoading(true);
    try {
        const response = await axios.get("/user_api/users/me"); // Получаем данные о текущем пользователе
        this.setUser(response.data.user);
        return response.data.user;
    } catch (error: any) {
        this.setMessage(error.response.data.message);
    } finally {
        this.setLoading(false);
    }
};

  async fetchStudents() {
    this.setLoading(true);
    try {
      const response = await fetch("/main_api/students");
      const data = await response.json();
      this.setStudents(data); // Устанавливаем студентов
    } catch (error) {
      console.error("Ошибка загрузки студентов:", error);
    } finally {
      this.setLoading(false);
    }
  }

  async fetchUser() {
    this.setLoading(true);
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      this.setUser(data);  // Устанавливаем пользователя
      this.setIsAuth(true); // Полагаем, что если пользователь есть, то авторизован
    } catch (error) {
      console.error("Ошибка загрузки пользователя:", error);
      this.setIsAuth(false); // Если ошибка, считаем, что не авторизован
    } finally {
      this.setLoading(false);
    }
  }

  setMessage(message: string) {
    this.message = message;
    }

  async registerUser(values: { login: string, email: string, password: string }) {
    this.setLoading(true);
    try {
        const response = await axios.post("/user_api/users/register", values);
        this.setUser(response.data.user);
        this.setMessage("");  // очистка сообщения об ошибке после успешной регистрации
        return response;
    } catch (error: any) {
        this.setMessage(error.response.data.message);
    } finally {
        this.setLoading(false);
    }
}


async loginUser(values: { email: string, password: string }) {
    this.setLoading(true);
    try {
        const response = await axios.post("/user_api/users/login", values);
        this.setUser(response.data.user);  // Сохраняем данные пользователя
        this.setMessage("");
        return response;
    } catch (error: any) {
        this.setMessage(error.response.data.message);
    } finally {
        this.setLoading(false);
    }
    }

    checkAuthStatus = async () => {
        try {
            const response = await axios.get("/user_api/users/get_login");
            this.setUser(response.data);  // предполагается, что API возвращает имя пользователя
        } catch (error: any) {
            if (error.response?.status === 401) {
                try {
                    await axios.post("/user_api/users/refresh");
                } catch {
                    this.clearUser();
                }
            } else {
                this.clearUser();
            }
        }
    };

    logout = async () => {
        try {
            await axios.post("/user_api/users/logout");
            this.clearUser();
        } catch (error) {
            this.clearUser();
        }
    };

}

export const userStore = new UserStore();
