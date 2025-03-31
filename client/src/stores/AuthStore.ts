import { makeAutoObservable } from "mobx";
import axios from "axios";

class AuthStore {
  login: string = "";
  password: string = "";
  email: string = "";
  message: string = "";
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Установка данных
  setLogin = (login: string) => {
    this.login = login;
  };

  setPassword = (password: string) => {
    this.password = password;
  };

  setEmail = (email: string) => {
    this.email = email;
  };

  // Сообщения / загрузка
  setMessage = (msg: string) => {
    this.message = msg;
  };

  setLoading = (value: boolean) => {
    this.isLoading = value;
  };

  clearMessage = () => {
    this.message = "";
  };

  // Авторизация
  loginUser = async (): Promise<boolean> => {
    this.isLoading = true;
    try {
      const response = await axios.post("/user_api/users/login", {
        login: this.login,
        password: this.password,
      });

      localStorage.setItem("access-token", response.data.accessToken);
      localStorage.setItem("refresh-token", response.data.refreshToken);

      this.login = "";
      this.password = "";
      this.message = "";
      this.isLoading = false;

      return true;
    } catch (error: any) {
      this.message = error.response?.data?.message || "Ошибка входа";
      this.isLoading = false;
      return false;
    }
  };

  // Регистрация
  registerUser = async (): Promise<boolean> => {
    this.isLoading = true;
    try {
      const response = await axios.post("/user_api/users/register", {
        login: this.login,
        email: this.email,
        password: this.password,
      });

      localStorage.setItem("access-token", response.data.accessToken);
      localStorage.setItem("refresh-token", response.data.refreshToken);

      this.login = "";
      this.email = "";
      this.password = "";
      this.message = "";
      this.isLoading = false;

      return true;
    } catch (error: any) {
      this.message = error.response?.data?.message || "Ошибка регистрации";
      this.isLoading = false;
      return false;
    }
  };
}

export const authStore = new AuthStore();
