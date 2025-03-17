import { makeAutoObservable } from "mobx";
import axios, { AxiosError } from "axios"; // Импортируем AxiosError для типизации ошибки

class UserStore {
    isAuth = false;
    user = null;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    async checkAuth() {
        if (this.user) {
            // Данные уже загружены, нет нужды запрашивать их повторно
            return;
        }
        try {
            await axios.get("/user_api/users/get_login");
            this.isAuth = true;
        } catch (error) {
            if (this.isAxiosError(error)) { // Проверяем, является ли ошибка экземпляром AxiosError
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
            } else {
                console.error("Неизвестная ошибка:", error);
            }
        }
    }

    async fetchUser() {
        if (this.user) return;
        this.isLoading = true;
        try {
            const response = await axios.get("/user_api/users/get_user", { withCredentials: true });
            this.user = response.data.user;
        } catch (error) {
            if (this.isAxiosError(error)) {
                console.error("Ошибка при загрузке пользователя", error);
            }
            this.user = null;
        } finally {
            this.isLoading = false;
        }
    }

    async logout() {
        await axios.post("/user_api/users/logout");
        this.isAuth = false;
        this.user = null;
    }

    // Утилита для проверки, является ли ошибка экземпляром AxiosError
    private isAxiosError(error: unknown): error is AxiosError {
        return (error as AxiosError).response !== undefined;
    }
}

export default new UserStore();
