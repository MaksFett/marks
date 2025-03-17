import { makeAutoObservable } from "mobx";
import axios from "axios";

class AuthStore {
  login: string = "";
  email: string = "";
  password: string = "";
  message: string = "";
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Устанавливаем логин, email и пароль
  setLogin = (login: string) => {
    this.login = login;
  };

  setEmail = (email: string) => {
    this.email = email;
  };

  setPassword = (password: string) => {
    this.password = password;
  };

  // Регистрация пользователя
  registerUser = async () => {
    this.isLoading = true;
    try {
      await axios.post("/user_api/users/register", {
        login: this.login,
        email: this.email,
        password: this.password,
      });
      this.isLoading = false;
      return true;
    } catch (error: any) {
      this.message = error.response?.data?.message || "Ошибка регистрации";
      this.isLoading = false;
      return false;
    }
  };

  // Очистка сообщения об ошибке
  clearMessage = () => {
    this.message = "";
  };
}

export const authStore = new AuthStore();
