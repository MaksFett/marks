import { makeAutoObservable } from "mobx";
import axios from "axios";

class AuthStore {
  login: string = "";
  password: string = "";
  message: string = "";
  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Устанавливаем логин и пароль
  setLogin = (login: string) => {
    this.login = login;
  };

  setPassword = (password: string) => {
    this.password = password;
  };

  // Отправляем запрос на авторизацию
  loginUser = async () => {
    this.isLoading = true;
    try {
      await axios.post("/user_api/users/login", {
        login: this.login,
        password: this.password,
      });
      this.isLoading = false;
      return true;
    } catch (error: any) {
      this.message = error.response?.data?.message || "Ошибка входа";
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
