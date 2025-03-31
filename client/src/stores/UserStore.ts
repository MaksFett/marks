import { makeAutoObservable, runInAction } from "mobx";
import axios, { AxiosError } from "axios"; // Импортируем AxiosError для типизации ошибки
import { IUser } from "../types";

class UserStore {
    isAuth: boolean = false;
    user: IUser = null;
    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    checkAuth = async () => {
        await axios.get("/user_api/users/get_login")
        .then(() => this.isAuth = true )
        .catch((error) => {
            if ((error as AxiosError).response !== undefined) { // Проверяем, является ли ошибка экземпляром AxiosError
                if (error.response?.status === 401) {
                    try {
                        axios.post("/user_api/users/refresh");
                        this.isAuth = true;
                        console.log(this.isAuth)
                    } catch {
                        this.isAuth = false;
                    });
                }
            } else {
                console.error("Неизвестная ошибка:", error);
                runInAction(() => {
                    this.isAuth = false;
                });
            }
        })
    }

    fetchUser = async () => {
        this.isLoading = true;
        try {
        const response = await axios.get("/user_api/users/get_user");
        runInAction(() => {
            this.user = response.data.user;
            console.log(this.user)
            this.isLoading = false;
        });
        } catch (error) {
        runInAction(() => {
            this.isLoading = false;
        });
        }
    };

    logout = async () => {
        await axios.post("/user_api/users/logout");
        this.isAuth = false;
        this.user = null;
    }
}

export default new UserStore();
