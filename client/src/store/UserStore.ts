import { makeAutoObservable } from "mobx";
import axios from "axios";

class UserStore {
    isAuth = false;
    user = null; // Данные о пользователе

    constructor() {
        makeAutoObservable(this);
    }

    async checkAuth() {
        try {
            await axios.get("/user_api/users/get_login");
            this.isAuth = true;
        } catch (error) {
            if (error.response?.status === 401) {
                try {
                    await axios.post("/user_api/users/refresh");
                    this.isAuth = true;
                } catch {
                    this.isAuth = false;
                }
            } else {
                this.isAuth = false;
            }
        }
    }

    async fetchUser() {
        try {
            const response = await axios.get("/user_api/users/get_user", { withCredentials: true });
            this.user = response.data.user; // Сохраняем данные пользователя
        } catch (error) {
            this.user = null; // Очистить данные при ошибке
        }
    }

    async logout() {
        await axios.post("/user_api/users/logout");
        this.isAuth = false;
        this.user = null;
    }
}

export default new UserStore();
